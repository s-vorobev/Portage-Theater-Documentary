import 'dotenv/config'
import { z } from 'zod'

// Treats a blank value as "unset", so optional fields can be left empty in
// .env without failing validation.
const emptyToUndefined = (value) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),

  DATABASE_URL: z.string().url(),

  RECAPTCHA_SECRET_KEY: z.string().min(1),
  ADMIN_TOKEN: z.string().min(16),
  DROPBOX_APP_KEY: z.string().min(1),
  DROPBOX_APP_SECRET: z.string().min(1),
  DROPBOX_REFRESH_TOKEN: z.string().min(1),
  DROPBOX_UPLOAD_FOLDER: z.string().min(1).default('/dev'),
  // FRONTEND_URL / ADMIN_URL accept a bare domain ("example.com"), a scheme
  // ("https://example.com"), or a full URL. The CORS layer expands each into
  // its http/https + www/non-www variants, so the exact form doesn't matter.
  FRONTEND_URL: z.preprocess(
    emptyToUndefined,
    z.string().default('http://localhost:5173'),
  ),
  ADMIN_URL: z.preprocess(emptyToUndefined, z.string().optional()),

  BUCKET_ENDPOINT: z.string().min(1),
  BUCKET_REGION: z.string().default('auto'),
  BUCKET_ACCESS_KEY: z.string().min(1),
  BUCKET_SECRET_KEY: z.string().min(1),
  BUCKET_NAME: z.string().min(1),
  BUCKET_FOOTAGE_KEY: z.string().min(1).default('footage.mp4'),
  BUCKET_FOOTAGE_MOBILE_KEY: z.string().min(1).default('footage_mobile.mov'),

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
