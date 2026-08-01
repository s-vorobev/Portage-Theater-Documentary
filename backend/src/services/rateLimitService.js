import { countRecentSubmissionsByIp } from '../repositories/rateLimitRepository.js'

const MAX_SUBMISSION_COUNT = 2
const TIME_FRAME = 168 // in hours

export async function isWithinRateLimit(ipAddress) {
  const since = new Date(Date.now() - TIME_FRAME * 60 * 60 * 1000)

  const recentCount = await countRecentSubmissionsByIp(ipAddress, since)

  return recentCount < MAX_SUBMISSION_COUNT
}
