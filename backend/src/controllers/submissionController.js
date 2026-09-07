import { submissionContract } from '../contracts/submissionContract.js'
import {
  createSubmission,
  listSubmissionIds,
  getSubmissionById,
} from '../services/submissionService.js'

const DEFAULT_SIZE = 10
const MAX_SIZE = 100

function parsePagination(query = {}) {
  return {
    size: clampInt(query.size, DEFAULT_SIZE, 1, MAX_SIZE),
    offset: clampInt(query.offset, 0, 0),
  }
}

function clampInt(value, fallback, min, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

export async function submitForm(req, res) {
  const { recaptchaToken, ...formFields } = req.body
  const result = submissionContract.safeParse(formFields)

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    })
  }

  const submissionId = await createSubmission({
    form: result.data,
    files: req.files,
    ipAddress: req.ip,
    recaptchaToken,
  })

  res.status(201).json({ id: submissionId })
}

export async function listSubmissions(req, res) {
  const { size, offset } = parsePagination(req.query)
  const ids = await listSubmissionIds(size, offset)
  res.json({ ids })
}

export async function getSubmission(req, res) {
  const submission = await getSubmissionById(req.params.id)
  res.json(submission)
}
