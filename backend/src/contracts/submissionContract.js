import { z } from 'zod'

export const submissionContract = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.string().trim().email('Must be a valid email address').max(100),
  phone: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value

      const digits = value.replace(/\D/g, '')
      return digits === '' ? null : digits
    },
    z
      .string()
      .regex(/^\d{10}$/, 'Must be a 10-digit phone number')
      .nullable()
      .optional(),
  ),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .refine((val) => val.split(/\s+/).length <= 100, {
      message: 'Message must be 100 words or fewer',
    }),
})
