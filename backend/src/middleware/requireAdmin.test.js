import { describe, it, expect, vi } from 'vitest'

vi.mock('../config/env.js', () => ({
  env: { ADMIN_TOKEN: 'test-admin-token-123456' },
}))

const { requireAdmin } = await import('./requireAdmin.js')

function makeReq(authHeader) {
  return { headers: { authorization: authHeader } }
}

describe('requireAdmin', () => {
  it('calls next() with no error when the token matches', () => {
    const next = vi.fn()

    requireAdmin(makeReq('Bearer test-admin-token-123456'), {}, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('passes a 401 HttpError to next() when the header is missing', () => {
    const next = vi.fn()

    requireAdmin(makeReq(undefined), {}, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next.mock.calls[0][0]).toMatchObject({ status: 401 })
  })

  it('passes a 401 HttpError to next() when the token is wrong', () => {
    const next = vi.fn()

    requireAdmin(makeReq('Bearer wrong-token'), {}, next)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 401 })
  })

  it('passes a 401 HttpError to next() for a non-Bearer scheme', () => {
    const next = vi.fn()

    requireAdmin(makeReq('Basic abc123'), {}, next)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 401 })
  })

  it('rejects a token of the same length but different content', () => {
    const next = vi.fn()

    requireAdmin(makeReq('Bearer test-admin-token-654321'), {}, next)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 401 })
  })
})
