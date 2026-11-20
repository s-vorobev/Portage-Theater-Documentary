import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
}

const mockQuery = vi.fn()

vi.mock('../db/pool.js', () => ({
  pool: {
    connect: vi.fn(() => Promise.resolve(mockClient)),
    query: mockQuery,
  },
}))

vi.mock('../db/sql/loader.js', () => ({
  queries: {
    insertSubmission: 'INSERT INTO submissions (...) RETURNING submission_id;',
    insertSubmissionFile:
      'INSERT INTO submission_files (...) RETURNING file_id;',
    selectSubmissionIds: 'SELECT submission_id FROM submissions ...;',
    selectSubmission: 'SELECT ... FROM submissions WHERE submission_id = $1;',
    selectSubmissionFiles:
      'SELECT ... FROM submission_files WHERE submission_id = $1;',
  },
}))

const {
  insertSubmissionWithFiles,
  getSubmissionIds,
  getSubmissionWithFiles,
} = await import('./submissionRepository.js')
const { pool } = await import('../db/pool.js')

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

    await expect(insertSubmissionWithFiles(submission, files)).rejects.toThrow(
      'constraint violation',
    )

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

describe('getSubmissionIds', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the list of submission ids for the page', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ submission_id: 'a' }, { submission_id: 'b' }],
    })

    const result = await getSubmissionIds(10, 20)

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [10, 20])
    expect(result).toEqual(['a', 'b'])
  })

  it('returns an empty array when there are no submissions', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const result = await getSubmissionIds(10, 0)

    expect(result).toEqual([])
  })
})

describe('getSubmissionWithFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null without querying files when the submission does not exist', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const result = await getSubmissionWithFiles('missing-id')

    expect(result).toBeNull()
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

  it('returns the submission view with its files', async () => {
    const createdAt = new Date('2026-01-01T00:00:00Z')
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          {
            first_name: 'Sergei',
            last_name: 'Vorobev',
            email: 'sergei@example.com',
            phone: '9272060061',
            message: 'Test message',
            created_at: createdAt,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          { original_filename: 'a.jpg', generated_filename: 'uuid-a.jpg' },
        ],
      })

    const result = await getSubmissionWithFiles('sub-id-1')

    expect(mockQuery).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      firstName: 'Sergei',
      lastName: 'Vorobev',
      email: 'sergei@example.com',
      phone: '9272060061',
      message: 'Test message',
      createdAt,
      files: [{ originalFilename: 'a.jpg', generatedFilename: 'uuid-a.jpg' }],
    })
  })

  it('returns an empty files list when the submission has no files', async () => {
    mockQuery
      .mockResolvedValueOnce({
        rows: [
          {
            first_name: 'Sergei',
            last_name: 'Vorobev',
            email: 'sergei@example.com',
            phone: null,
            message: 'Test message',
            created_at: new Date('2026-01-01T00:00:00Z'),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })

    const result = await getSubmissionWithFiles('sub-id-1')

    expect(result.files).toEqual([])
  })
})
