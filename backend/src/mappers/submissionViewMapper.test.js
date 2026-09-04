import { describe, it, expect } from 'vitest'
import { mapSubmissionView } from './submissionViewMapper.js'

describe('mapSubmissionView', () => {
  it('maps a submission row and file rows into a client view', () => {
    const createdAt = new Date('2026-01-01T00:00:00Z')
    const submissionRow = {
      first_name: 'Sergei',
      last_name: 'Vorobev',
      email: 'sergei@example.com',
      phone: '9272060061',
      message: 'Test message',
      created_at: createdAt,
    }
    const fileRows = [
      { original_filename: 'a.jpg', generated_filename: 'uuid-a.jpg' },
      { original_filename: 'b.jpg', generated_filename: 'uuid-b.jpg' },
    ]

    expect(mapSubmissionView(submissionRow, fileRows)).toEqual({
      firstName: 'Sergei',
      lastName: 'Vorobev',
      email: 'sergei@example.com',
      phone: '9272060061',
      message: 'Test message',
      createdAt,
      files: [
        { originalFilename: 'a.jpg', generatedFilename: 'uuid-a.jpg' },
        { originalFilename: 'b.jpg', generatedFilename: 'uuid-b.jpg' },
      ],
    })
  })

  it('returns an empty files array when there are no files', () => {
    const submissionRow = {
      first_name: 'Sergei',
      last_name: 'Vorobev',
      email: 'sergei@example.com',
      phone: null,
      message: 'Test message',
      created_at: new Date('2026-01-01T00:00:00Z'),
    }

    expect(mapSubmissionView(submissionRow, []).files).toEqual([])
  })
})
