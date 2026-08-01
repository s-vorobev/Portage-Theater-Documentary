import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/submissionService.js', () => ({
  createSubmission: vi.fn(),
}))

import { submitForm } from './submissionController.js'
import { createSubmission } from '../services/submissionService.js'

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

    expect(createSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Sergei',
        email: 'sergei@example.com',
      }),
      files,
      '203.0.113.5',
      'valid-recaptcha-token',
    )
  })

  it('does not leak recaptchaToken into the data passed for contract validation', async () => {
    createSubmission.mockResolvedValue('new-id-123')
    const req = { body: validBody, files: [], ip: '127.0.0.1' }
    const res = makeRes()

    await submitForm(req, res)

    const [dataArg] = createSubmission.mock.calls[0]
    expect(dataArg.recaptchaToken).toBeUndefined()
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
