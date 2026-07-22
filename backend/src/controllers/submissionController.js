import { submissionContract } from '../contracts/submissionContract.js'
import { createSubmission } from '../services/submissionService.js'

export async function submitForm(req, res) {
  const result = submissionContract.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    })
  }

  const submissionId = await createSubmission(result.data, req.files, req.ip)

  res.status(201).json({ id: submissionId })
}
