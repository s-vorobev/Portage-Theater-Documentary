import { submissionContract } from '../contracts/submissionContract.js'
import * as submissionService from '../services/submissionService.js'

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

  await submissionService.createSubmission({
    form: result.data,
    files: req.files,
    ipAddress: req.ip,
    recaptchaToken,
  })

  res.status(201).end()
}

export async function listSubmissions(req, res) {
  const { size, offset } = parsePagination(req.query)
  const ids = await submissionService.listSubmissionIds(size, offset)
  res.json({ ids })
}

export async function getSubmission(req, res) {
  const submission = await submissionService.getSubmissionById(req.params.id)
  res.json(submission)
}
