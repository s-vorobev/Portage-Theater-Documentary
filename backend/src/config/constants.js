export const FALLBACK_EMAIL = 'footage@portagetheaterdocumentary.com'

export const UPLOAD_LIMITS = {
  maxFileSizeBytes: 500 * 1024 * 1024, // 500MB per file
  maxFiles: 10,
  maxTotalSizeBytes: 3 * 1024 * 1024 * 1024, // 3GB per submission
}

export const ACCEPTED_FILE_TYPES = [
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
