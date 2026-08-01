import { pool } from '../db/pool.js'
import { queries } from '../db/sql/loader.js'

export async function countRecentSubmissionsByIp(ipAddress, since) {
  const result = await pool.query(queries.countRecentSubmissionsByIp, [
    ipAddress,
    since,
  ])

  return parseInt(result.rows[0].submission_count, 10)
}
