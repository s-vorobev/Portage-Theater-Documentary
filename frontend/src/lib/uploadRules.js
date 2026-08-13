import { formatBytes } from './format'

export const MAX_MESSAGE_WORDS = 100
export const MAX_FILES = 10
export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024 // 500MB per file
export const MAX_TOTAL_SIZE_BYTES = 3 * 1024 * 1024 * 1024 // 3GB total

export const ACCEPTED_TYPES = [
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

export function selectFiles(current, selected) {
  let combined = [...current, ...selected]
  let error = ''

  const rejected = combined.filter((f) => !ACCEPTED_TYPES.includes(f.type))
  if (rejected.length > 0) {
    error = `${rejected.length} file(s) skipped — only images, videos, MP3 audio, and PDFs are supported.`
    combined = combined.filter((f) => ACCEPTED_TYPES.includes(f.type))
  }

  const tooLarge = combined.filter((f) => f.size > MAX_FILE_SIZE_BYTES)
  if (tooLarge.length > 0) {
    error = `${tooLarge.length} file(s) skipped — each file must be under ${formatBytes(MAX_FILE_SIZE_BYTES)}.`
    combined = combined.filter((f) => f.size <= MAX_FILE_SIZE_BYTES)
  }

  if (combined.length > MAX_FILES) {
    error = `You can only attach up to ${MAX_FILES} files.`
    combined = combined.slice(0, MAX_FILES)
  }

  const totalBytes = combined.reduce((sum, f) => sum + f.size, 0)
  if (totalBytes > MAX_TOTAL_SIZE_BYTES) {
    error = `Total attachments must be under ${formatBytes(MAX_TOTAL_SIZE_BYTES)}. Please remove some files.`
  }

  return { files: combined, error }
}
