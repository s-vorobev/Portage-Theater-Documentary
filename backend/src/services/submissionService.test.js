import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../clients/dropboxClient.js', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
}))

vi.mock('../repositories/submissionRepository.js', () => ({
  insertSubmissionWithFiles: vi.fn(),
}))

import { createSubmission } from './submissionService.js'
import { uploadFile, deleteFile } from '../clients/dropboxClient.js'
import { insertSubmissionWithFiles } from '../repositories/submissionRepository.js'

const validData = {
  firstName: 'Sergei',
  lastName: 'Vorobev',
  email: 'sergei@example.com',
  phone: '9272060061',
  message: 'Test message',
}

function makeFile(overrides = {}) {
  return {
    originalname: 'photo.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('fake'),
    ...overrides,
  }
}

describe('createSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects an unsupported file type before touching Dropbox', async () => {
    const badFile = makeFile({ mimetype: 'application/zip' })

    await expect(
      createSubmission(validData, [badFile], '127.0.0.1'),
    ).rejects.toMatchObject({ status: 400 })

    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('rejects when total file size exceeds 3GB', async () => {
    const hugeFile = makeFile({ size: 3.5 * 1024 * 1024 * 1024 })

    await expect(
      createSubmission(validData, [hugeFile], '127.0.0.1'),
    ).rejects.toMatchObject({ status: 400 })

    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('uploads files then inserts the submission on the happy path', async () => {
    uploadFile.mockResolvedValue('/submissions/generated-name.jpg')
    insertSubmissionWithFiles.mockResolvedValue('new-submission-id')

    const file = makeFile()
    const result = await createSubmission(validData, [file], '127.0.0.1')

    expect(uploadFile).toHaveBeenCalledTimes(1)
    expect(insertSubmissionWithFiles).toHaveBeenCalledTimes(1)
    expect(result).toBe('new-submission-id')
  })

  it('passes submission fields through to the repository correctly', async () => {
    uploadFile.mockResolvedValue('/submissions/x.jpg')
    insertSubmissionWithFiles.mockResolvedValue('id-123')

    await createSubmission(validData, [makeFile()], '10.0.0.1')

    const [submissionArg] = insertSubmissionWithFiles.mock.calls[0]
    expect(submissionArg.firstName).toBe('Sergei')
    expect(submissionArg.lastName).toBe('Vorobev')
    expect(submissionArg.email).toBe('sergei@example.com')
    expect(submissionArg.ipAddress).toBe('10.0.0.1')
  })

  it('defaults phone to null when not provided', async () => {
    uploadFile.mockResolvedValue('/submissions/x.jpg')
    insertSubmissionWithFiles.mockResolvedValue('id-123')

    const { phone, ...dataWithoutPhone } = validData
    await createSubmission(dataWithoutPhone, [makeFile()], '10.0.0.1')

    const [submissionArg] = insertSubmissionWithFiles.mock.calls[0]
    expect(submissionArg.phone).toBeNull()
  })

  it('rolls back already-uploaded files if a later upload fails', async () => {
    uploadFile
      .mockResolvedValueOnce('/submissions/first.jpg')
      .mockRejectedValueOnce(new Error('network error'))

    const files = [makeFile({ originalname: 'first.jpg' }), makeFile({ originalname: 'second.jpg' })]

    await expect(
      createSubmission(validData, files, '127.0.0.1'),
    ).rejects.toMatchObject({ status: 502 })

    expect(deleteFile).toHaveBeenCalledTimes(1)
    expect(deleteFile).toHaveBeenCalledWith('/submissions/first.jpg')
    expect(insertSubmissionWithFiles).not.toHaveBeenCalled()
  })

  it('rolls back uploaded files if the DB insert fails', async () => {
    uploadFile.mockResolvedValue('/submissions/uploaded.jpg')
    insertSubmissionWithFiles.mockRejectedValue(new Error('db error'))

    await expect(
      createSubmission(validData, [makeFile()], '127.0.0.1'),
    ).rejects.toMatchObject({ status: 500 })

    expect(deleteFile).toHaveBeenCalledWith('/submissions/uploaded.jpg')
  })

  it('handles a submission with no files at all', async () => {
    insertSubmissionWithFiles.mockResolvedValue('id-no-files')

    const result = await createSubmission(validData, [], '127.0.0.1')

    expect(uploadFile).not.toHaveBeenCalled()
    expect(insertSubmissionWithFiles).toHaveBeenCalledTimes(1)
    expect(result).toBe('id-no-files')
  })
})
