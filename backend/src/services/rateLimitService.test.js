import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCountRecentSubmissionsByIp = vi.fn()

vi.mock('../repositories/rateLimitRepository.js', () => ({
  countRecentSubmissionsByIp: mockCountRecentSubmissionsByIp,
}))

const { isWithinRateLimit } = await import('./rateLimitService.js')

describe('isWithinRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-08T00:00:00Z'))
  })

  it('returns true when the count is below the max', async () => {
    mockCountRecentSubmissionsByIp.mockResolvedValueOnce(1)

    const result = await isWithinRateLimit('1.2.3.4')

    expect(result).toBe(true)
  })

  it('returns false when the count equals the max', async () => {
    mockCountRecentSubmissionsByIp.mockResolvedValueOnce(2)

    const result = await isWithinRateLimit('1.2.3.4')

    expect(result).toBe(false)
  })

  it('returns false when the count exceeds the max', async () => {
    mockCountRecentSubmissionsByIp.mockResolvedValueOnce(5)

    const result = await isWithinRateLimit('1.2.3.4')

    expect(result).toBe(false)
  })

  it('passes the ip address and a since date 168 hours in the past', async () => {
    mockCountRecentSubmissionsByIp.mockResolvedValueOnce(0)

    await isWithinRateLimit('9.9.9.9')

    const [ipArg, sinceArg] = mockCountRecentSubmissionsByIp.mock.calls[0]
    expect(ipArg).toBe('9.9.9.9')
    expect(sinceArg).toBeInstanceOf(Date)
    expect(sinceArg.toISOString()).toBe('2026-01-01T00:00:00.000Z')
  })
})
