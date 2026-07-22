import { pool } from '../db/pool.js'
import { queries } from '../db/sql/loader.js'

export async function insertSubmissionWithFiles(submission, files) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const submissionResult = await client.query(queries.insertSubmission, [
      submission.firstName,
      submission.lastName,
      submission.email,
      submission.phone,
      submission.message,
      submission.ipAddress,
    ])

    const submissionId = submissionResult.rows[0].submission_id

    for (const file of files) {
      await client.query(queries.insertSubmissionFile, [
        submissionId,
        file.originalFilename,
        file.generatedFilename,
        file.dropboxPath,
        file.mimeType,
        file.fileSizeBytes,
      ])
    }

    await client.query('COMMIT')
    return submissionId
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
