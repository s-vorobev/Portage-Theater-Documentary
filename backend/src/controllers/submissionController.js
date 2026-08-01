import { submissionContract } from '../contracts/submissionContract.js'
import { createSubmission } from '../services/submissionService.js'

export async function submitForm(req, res) {
  const { recaptchaToken, ...formFields } = req.body
  const result = submissionContract.safeParse(formFields)

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    })
  }

  const submissionId = await createSubmission(
    result.data,
    req.files,
    req.ip,
    recaptchaToken,
  )

  res.status(201).json({ id: submissionId })
}
