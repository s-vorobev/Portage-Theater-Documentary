import 'express-async-errors'

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { env } from './config/env.js'
import { FALLBACK_EMAIL } from './config/constants.js'
import { expandOrigins } from './config/origins.js'
import submissionRoutes from './routes/submissionRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js'
import contentRoutes from './routes/contentRoutes.js'

export const app = express()

const API_PREFIX = '/api/v1'

app.set('trust proxy', true)

const LOCAL_ORIGIN = /^http:\/\/localhost:\d+$/

// Origins allowed to call the API from the browser. FRONTEND_URL is the
// public site; ADMIN_URL is the admin dashboard (optional). Each is expanded
// into its http/https + www/non-www variants.
const ALLOWED_ORIGINS = expandOrigins(
  [env.FRONTEND_URL, env.ADMIN_URL].filter(Boolean),
)

app.use(
  cors({
    origin(origin, callback) {
      const allowed =
        !origin ||
        ALLOWED_ORIGINS.includes(origin) ||
        (env.NODE_ENV === 'development' && LOCAL_ORIGIN.test(origin))
      callback(null, allowed)
    },
  }),
)
app.use(express.json())
app.use(API_PREFIX, submissionRoutes)
app.use(API_PREFIX, mediaRoutes)
app.use(API_PREFIX, contentRoutes)

const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: `One of your files is too large. You can email your submission to ${FALLBACK_EMAIL} instead.`,
  LIMIT_FILE_COUNT: `Too many files. You can email your submission to ${FALLBACK_EMAIL} instead.`,
  LIMIT_UNEXPECTED_FILE: `Unexpected file submitted. You can email your submission to ${FALLBACK_EMAIL} instead.`,
}

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, _next) => {
  console.error(err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error:
        MULTER_ERROR_MESSAGES[err.code] ||
        'There was a problem with your file upload.',
    })
  }

  const status = err.status || 500
  res.status(status).json({
    error:
      status === 500 ? 'Something went wrong. Please try again.' : err.message,
  })
})
