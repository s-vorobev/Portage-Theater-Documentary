import { generateFilename } from '../utils/generateFilename.js'
import { HttpError } from '../utils/HttpError.js'
import { Submission } from '../models/Submission.js'
import { SubmissionFile } from '../models/SubmissionFile.js'
import { insertSubmissionWithFiles } from '../repositories/submissionRepository.js'
import { uploadFile, deleteFile } from '../clients/dropboxClient.js'

const MAX_TOTAL_SIZE_BYTES = 3 * 1024 * 1024 * 1024 // 3GB
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/tiff',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'application/pdf',
]

export async function createSubmission(data, uploadedFiles = [], ipAddress) {

  const invalidType = uploadedFiles.filter((f) => !ACCEPTED_TYPES.includes(f.mimetype))
  if (invalidType.length > 0) {
    throw new HttpError(
      400,
      `Unsupported file type: ${invalidType.map((f) => f.originalname).join(', ')}`,
    )
  }

  const totalBytes = uploadedFiles.reduce((sum, f) => sum + f.size, 0)
  if (totalBytes > MAX_TOTAL_SIZE_BYTES) {
    throw new HttpError(400, 'Total attachments must be under 3GB. Please remove some files.')
  }

  const uploadedPaths = []
  const fileRecords = []

  try {
    for (const file of uploadedFiles) {
      const generatedFilename = generateFilename(file.originalname)
      const dropboxPath = await uploadFile(file.buffer, generatedFilename)

      uploadedPaths.push(dropboxPath)
      fileRecords.push(
        new SubmissionFile({
          originalFilename: file.originalname,
          generatedFilename,
          dropboxPath,
          mimeType: file.mimetype,
          fileSizeBytes: file.size,
        }),
      )
    }
  } catch (err) {
    console.error('Dropbox upload failed, rolling back already-uploaded files:', err)
    await Promise.allSettled(uploadedPaths.map((path) => deleteFile(path)))
    throw new HttpError(502, 'Failed to upload one or more files. Please try again.')
  }

  const submission = new Submission({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    ipAddress,
  })

  try {
    const submissionId = await insertSubmissionWithFiles(submission, fileRecords)
    return submissionId
  } catch (err) {
    console.error('DB insert failed after successful upload, rolling back Dropbox files:', err)
    await Promise.allSettled(uploadedPaths.map((path) => deleteFile(path)))
    throw new HttpError(500, 'Failed to save your submission. Please try again.')
  }
}