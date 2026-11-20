import { countRecentSubmissionsByIp } from '../repositories/rateLimitRepository.js'
import { RATE_LIMIT } from '../config/constants.js'

const MS_PER_HOUR = 60 * 60 * 1000

export async function isWithinRateLimit(ipAddress) {
  const since = new Date(Date.now() - RATE_LIMIT.windowHours * MS_PER_HOUR)

  const recentCount = await countRecentSubmissionsByIp(ipAddress, since)

  return recentCount < RATE_LIMIT.maxSubmissions
}
