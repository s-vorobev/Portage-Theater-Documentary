import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),

  DATABASE_URL: z.string().url(),

  DROPBOX_APP_KEY: z.string().min(1),
  DROPBOX_APP_SECRET: z.string().min(1),
  DROPBOX_REFRESH_TOKEN: z.string().min(1),
  DROPBOX_UPLOAD_FOLDER: z.string().min(1).default('/submissions-dev'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const env = parsed.data
