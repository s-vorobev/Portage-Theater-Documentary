import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockQuery = vi.fn()

vi.mock('../db/pool.js', () => ({
  pool: { query: mockQuery },
}))

vi.mock('../db/sql/loader.js', () => ({
  queries: {
    countRecentSubmissionsByIp: 'SELECT COUNT(*) AS submission_count FROM submissions WHERE ip_address = $1 AND created_at > $2',
  },
}))

const { countRecentSubmissionsByIp } = await import('./rateLimitRepository.js')

describe('countRecentSubmissionsByIp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('queries with the ip address and since timestamp, and returns the count as a number', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ submission_count: '3' }] })

    const since = new Date('2026-01-01T00:00:00Z')
    const result = await countRecentSubmissionsByIp('1.2.3.4', since)

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      ['1.2.3.4', since],
    )
    expect(result).toBe(3)
    expect(typeof result).toBe('number')
  })

  it('returns 0 when there are no recent submissions', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ submission_count: '0' }] })

    const result = await countRecentSubmissionsByIp('5.6.7.8', new Date())

    expect(result).toBe(0)
  })

  it('propagates errors from the database', async () => {
    mockQuery.mockRejectedValueOnce(new Error('connection lost'))

    await expect(
      countRecentSubmissionsByIp('1.2.3.4', new Date()),
    ).rejects.toThrow('connection lost')
  })
})
