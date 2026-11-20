// Single source of truth for non-secret configuration values.
//
// Values that are duplicated in the frontend are noted inline; keep them in
// sync (see `frontend/src/lib/uploadRules.js`).

export const FALLBACK_EMAIL = 'footage@portagetheaterdocumentary.com'

// File upload limits for public submissions.
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

// Character/word limits for the submission form fields.
// Mirrored in the frontend form (`frontend/src/lib/uploadRules.js`).
export const VALIDATION = {
  nameMaxLength: 50,
  emailMaxLength: 100,
  phoneDigits: 10,
  messageMaxWords: 100,
}

// Per-IP rate limit for public submissions.
export const RATE_LIMIT = {
  maxSubmissions: 2,
  windowHours: 7 * 24, // 7 days
}

// reCAPTCHA v3 verification.
export const RECAPTCHA = {
  scoreThreshold: 0.5,
  expectedAction: 'submit_form',
}

// Admin list pagination defaults.
export const PAGINATION = {
  defaultSize: 10,
  maxSize: 100,
}
