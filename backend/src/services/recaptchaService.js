import { env } from '../config/env.js'
import { RECAPTCHA } from '../config/constants.js'

export async function verifyRecaptcha(token) {
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    },
  )

  const data = await response.json()
  if (!data.success) {
    return { passed: false, reason: 'verification_failed' }
  }

  if (data.action !== RECAPTCHA.expectedAction) {
    return { passed: false, reason: 'action_mismatch' }
  }

  if (data.score < RECAPTCHA.scoreThreshold) {
    return { passed: false, reason: 'low_score', score: data.score }
  }

  return { passed: true, score: data.score }
}
