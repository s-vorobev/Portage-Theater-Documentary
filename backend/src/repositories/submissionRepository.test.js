import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
}

vi.mock('../db/pool.js', () => ({
  pool: {
    connect: vi.fn(() => Promise.resolve(mockClient)),
  },
}))

vi.mock('../db/sql/loader.js', () => ({
  queries: {
    insertSubmission: 'INSERT INTO submissions (...) RETURNING submission_id;',
    insertSubmissionFile: 'INSERT INTO submission_files (...) RETURNING file_id;',
  },
}))

import { insertSubmissionWithFiles } from './submissionRepository.js'
import { pool } from '../db/pool.js'

const submission = {
  firstName: 'Sergei',
  lastName: 'Vorobev',
  email: 'sergei@example.com',
  phone: '9272060061',
  message: 'Test message',
  ipAddress: '127.0.0.1',
}

const files = [
  {
    originalFilename: 'photo.jpg',
    generatedFilename: 'uuid-1.jpg',
    dropboxPath: '/submissions/uuid-1.jpg',
    mimeType: 'image/jpeg',
    fileSizeBytes: 1024,
  },
]

describe('insertSubmissionWithFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockClient.query.mockImplementation((sql) => {
      if (sql.includes('RETURNING submission_id')) {
        return Promise.resolve({ rows: [{ submission_id: 'sub-id-1' }] })
      }
      return Promise.resolve({ rows: [] })
    })
  })

  it('checks out a client from the pool', async () => {
    await insertSubmissionWithFiles(submission, files)
    expect(pool.connect).toHaveBeenCalledTimes(1)
  })

  it('runs BEGIN before any insert, and COMMIT after', async () => {
    await insertSubmissionWithFiles(submission, files)

    const calledSql = mockClient.query.mock.calls.map((call) => call[0])
    expect(calledSql[0]).toBe('BEGIN')
    expect(calledSql[calledSql.length - 1]).toBe('COMMIT')
  })

  it('inserts one submission row and one row per file', async () => {
    await insertSubmissionWithFiles(submission, files)

    const insertCalls = mockClient.query.mock.calls.filter(
      ([sql]) => sql !== 'BEGIN' && sql !== 'COMMIT' && sql !== 'ROLLBACK',
    )
    // 1 submission insert + 1 file insert for this test's single file
    expect(insertCalls).toHaveLength(2)
  })

  it('passes the submission fields as params in the correct order', async () => {
    await insertSubmissionWithFiles(submission, files)

    const submissionInsertCall = mockClient.query.mock.calls.find(([sql]) =>
      sql.includes('RETURNING submission_id'),
    )
    expect(submissionInsertCall[1]).toEqual([
      'Sergei',
      'Vorobev',
      'sergei@example.com',
      '9272060061',
      'Test message',
      '127.0.0.1',
    ])
  })

  it('returns the new submission id', async () => {
    const result = await insertSubmissionWithFiles(submission, files)
    expect(result).toBe('sub-id-1')
  })

  it('always releases the client back to the pool, even on success', async () => {
    await insertSubmissionWithFiles(submission, files)
    expect(mockClient.release).toHaveBeenCalledTimes(1)
  })

  it('rolls back and rethrows if a file insert fails', async () => {
    mockClient.query.mockImplementation((sql) => {
      if (sql.includes('RETURNING submission_id')) {
        return Promise.resolve({ rows: [{ submission_id: 'sub-id-1' }] })
      }
      if (sql.includes('RETURNING file_id')) {
        return Promise.reject(new Error('constraint violation'))
      }
      return Promise.resolve({ rows: [] })
    })

    await expect(
      insertSubmissionWithFiles(submission, files),
    ).rejects.toThrow('constraint violation')

    const calledSql = mockClient.query.mock.calls.map((call) => call[0])
    expect(calledSql).toContain('ROLLBACK')
    expect(calledSql).not.toContain('COMMIT')
  })

  it('releases the client even when the transaction fails', async () => {
    mockClient.query.mockImplementation((sql) => {
      if (sql === 'BEGIN') return Promise.resolve()
      if (sql.includes('RETURNING submission_id')) {
        return Promise.reject(new Error('db down'))
      }
      return Promise.resolve()
    })

    await expect(insertSubmissionWithFiles(submission, files)).rejects.toThrow()
    expect(mockClient.release).toHaveBeenCalledTimes(1)
  })

  it('handles a submission with zero files', async () => {
    const result = await insertSubmissionWithFiles(submission, [])
    expect(result).toBe('sub-id-1')

    const insertCalls = mockClient.query.mock.calls.filter(
      ([sql]) => sql !== 'BEGIN' && sql !== 'COMMIT' && sql !== 'ROLLBACK',
    )
    expect(insertCalls).toHaveLength(1) // just the submission insert
  })
})
