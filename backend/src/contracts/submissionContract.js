import { z } from 'zod'

export const submissionContract = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.string().trim().email('Must be a valid email address').max(100),
  phone: z.string().trim().max(20).nullable().optional(),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .refine((val) => val.split(/\s+/).length <= 100, {
      message: 'Message must be 100 words or fewer',
    }),
})