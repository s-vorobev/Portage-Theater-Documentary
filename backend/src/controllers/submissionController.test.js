import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/submissionService.js', () => ({
  createSubmission: vi.fn(),
  listSubmissionIds: vi.fn(),
  getSubmissionById: vi.fn(),
}))

import { submitForm, listSubmissions, getSubmission } from './submissionController.js'
import {
  createSubmission,
  listSubmissionIds,
  getSubmissionById,
} from '../services/submissionService.js'

const validBody = {
  firstName: 'Sergei',
  lastName: 'Vorobev',
  email: 'sergei@example.com',
  message: 'Test message',
  recaptchaToken: 'valid-recaptcha-token',
}

function makeRes() {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('submitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 with field errors when the body fails validation, without calling the service', async () => {
    const req = {
      body: { ...validBody, email: 'not-an-email' },
      files: [],
      ip: '127.0.0.1',
    }
    const res = makeRes()

    await submitForm(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.anything() }),
    )
    expect(createSubmission).not.toHaveBeenCalled()
  })

  it('calls createSubmission with the validated data, files, ip, and recaptcha token on success', async () => {
    createSubmission.mockResolvedValue('new-id-123')
    const files = [{ originalname: 'a.jpg' }]
    const req = { body: validBody, files, ip: '203.0.113.5' }
    const res = makeRes()

    await submitForm(req, res)

    expect(createSubmission).toHaveBeenCalledWith({
      form: expect.objectContaining({
        firstName: 'Sergei',
        email: 'sergei@example.com',
      }),
      files,
      ipAddress: '203.0.113.5',
      recaptchaToken: 'valid-recaptcha-token',
    })
  })

  it('does not leak recaptchaToken into the data passed for contract validation', async () => {
    createSubmission.mockResolvedValue('new-id-123')
    const req = { body: validBody, files: [], ip: '127.0.0.1' }
    const res = makeRes()

    await submitForm(req, res)

    const [input] = createSubmission.mock.calls[0]
    expect(input.form.recaptchaToken).toBeUndefined()
    expect(input.recaptchaToken).toBe('valid-recaptcha-token')
  })

  it('returns 201 with the new submission id on success', async () => {
    createSubmission.mockResolvedValue('new-id-123')
    const req = { body: validBody, files: [], ip: '127.0.0.1' }
    const res = makeRes()

    await submitForm(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ id: 'new-id-123' })
  })

  it('propagates a thrown error from the service instead of handling it locally', async () => {
    const serviceError = new Error('upload failed')
    createSubmission.mockRejectedValue(serviceError)
    const req = { body: validBody, files: [], ip: '127.0.0.1' }
    const res = makeRes()

    await expect(submitForm(req, res)).rejects.toThrow('upload failed')
  })
})

describe('listSubmissions', () => {
  it('returns ids using default pagination when no query params are provided', async () => {
    listSubmissionIds.mockResolvedValueOnce(['a', 'b'])

    const req = { query: {} }
    const res = makeRes()

    await listSubmissions(req, res)

    expect(listSubmissionIds).toHaveBeenCalledWith(10, 0)
    expect(res.json).toHaveBeenCalledWith({ ids: ['a', 'b'] })
  })

  it('passes size and offset from the query string', async () => {
    listSubmissionIds.mockResolvedValueOnce(['a'])

    const req = { query: { size: '5', offset: '15' } }
    await listSubmissions(req, makeRes())

    expect(listSubmissionIds).toHaveBeenCalledWith(5, 15)
  })

  it('clamps size to the max and negative offset to zero', async () => {
    listSubmissionIds.mockResolvedValueOnce([])

    const req = { query: { size: '9999', offset: '-5' } }
    await listSubmissions(req, makeRes())

    expect(listSubmissionIds).toHaveBeenCalledWith(100, 0)
  })

  it('falls back to defaults for non-numeric query params', async () => {
    listSubmissionIds.mockResolvedValueOnce([])

    const req = { query: { size: 'abc', offset: 'xyz' } }
    await listSubmissions(req, makeRes())

    expect(listSubmissionIds).toHaveBeenCalledWith(10, 0)
  })
})

describe('getSubmission', () => {
  it('responds with the submission for the id', async () => {
    const submission = { firstName: 'Sergei', files: [] }
    getSubmissionById.mockResolvedValueOnce(submission)

    const req = { params: { id: 'id-1' } }
    const res = makeRes()

    await getSubmission(req, res)

    expect(getSubmissionById).toHaveBeenCalledWith('id-1')
    expect(res.json).toHaveBeenCalledWith(submission)
  })

  it('propagates a thrown error from the service', async () => {
    getSubmissionById.mockRejectedValueOnce(new Error('boom'))

    await expect(
      getSubmission({ params: { id: 'id-1' } }, makeRes()),
    ).rejects.toThrow('boom')
  })
})
