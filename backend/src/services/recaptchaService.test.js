import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../config/env.js', () => ({
  env: { RECAPTCHA_SECRET_KEY: 'test-secret-key' },
}))

const { verifyRecaptcha } = await import('./recaptchaService.js')

function mockFetchResponse(data) {
  return vi.fn().mockResolvedValue({
    json: () => Promise.resolve(data),
  })
}

describe('verifyRecaptcha', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('passes when success is true, action matches, and score is above threshold', async () => {
    global.fetch = mockFetchResponse({
      success: true,
      score: 0.9,
      action: 'submit_form',
    })

    const result = await verifyRecaptcha('valid-token')

    expect(result).toEqual({ passed: true, score: 0.9 })
  })

  it('sends the secret key and token to the siteverify endpoint', async () => {
    global.fetch = mockFetchResponse({
      success: true,
      score: 0.9,
      action: 'submit_form',
    })

    await verifyRecaptcha('some-token')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    )

    const [, options] = global.fetch.mock.calls[0]
    const sentBody = options.body.toString()
    expect(sentBody).toContain('secret=test-secret-key')
    expect(sentBody).toContain('response=some-token')
  })

  it('fails when Google reports success: false', async () => {
    global.fetch = mockFetchResponse({ success: false })

    const result = await verifyRecaptcha('bad-token')

    expect(result).toEqual({ passed: false, reason: 'verification_failed' })
  })

  it('fails when the action does not match the expected action', async () => {
    global.fetch = mockFetchResponse({
      success: true,
      score: 0.9,
      action: 'some_other_action',
    })

    const result = await verifyRecaptcha('token')

    expect(result).toEqual({ passed: false, reason: 'action_mismatch' })
  })

  it('fails when the score is below the threshold', async () => {
    global.fetch = mockFetchResponse({
      success: true,
      score: 0.2,
      action: 'submit_form',
    })

    const result = await verifyRecaptcha('token')

    expect(result).toEqual({
      passed: false,
      reason: 'low_score',
      score: 0.2,
    })
  })

  it('treats a score exactly at the threshold as passing', async () => {
    global.fetch = mockFetchResponse({
      success: true,
      score: 0.5,
      action: 'submit_form',
    })

    const result = await verifyRecaptcha('token')

    expect(result).toEqual({ passed: true, score: 0.5 })
  })
})
