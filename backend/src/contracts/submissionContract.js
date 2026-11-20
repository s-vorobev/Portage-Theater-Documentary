import { z } from 'zod'
import { VALIDATION } from '../config/constants.js'

export const submissionContract = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(VALIDATION.nameMaxLength),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(VALIDATION.nameMaxLength),
  email: z.string().trim().email('Must be a valid email address').max(VALIDATION.emailMaxLength),
  phone: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value

      const digits = value.replace(/\D/g, '')
      return digits === '' ? null : digits
    },
    z
      .string()
      .regex(
        new RegExp(`^\\d{${VALIDATION.phoneDigits}}$`),
        `Must be a ${VALIDATION.phoneDigits}-digit phone number`,
      )
      .nullable()
      .optional(),
  ),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .refine((val) => val.split(/\s+/).length <= VALIDATION.messageMaxWords, {
      message: `Message must be ${VALIDATION.messageMaxWords} words or fewer`,
    }),
})
