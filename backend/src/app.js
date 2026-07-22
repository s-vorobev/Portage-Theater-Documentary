import 'express-async-errors'

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { env } from './config/env.js'
import submissionRoutes from './routes/submissionRoutes.js'

export const app = express()

app.set('trust proxy', true)

app.use(cors({ origin: env.FRONTEND_URL }))
app.use('/api', submissionRoutes)
app.use(express.json())

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err)

  if (err instanceof multer.MulterError) {
    const messages = {
       LIMIT_FILE_SIZE:
        'One of your files is too large. You can email your submission to footage@portagetheaterdocumentary.com instead.',
      LIMIT_FILE_COUNT:
        'Too many files. You can email your submission to footage@portagetheaterdocumentary.com instead.',
      LIMIT_UNEXPECTED_FILE:
        'Unexpected file submitted. You can email your submission to footage@portagetheaterdocumentary.com instead.',
    }
    return res.status(400).json({
      error: messages[err.code] || 'There was a problem with your file upload.',
    })
  }

  const status = err.status || 500
  res.status(status).json({
    error: status === 500 ? 'Something went wrong. Please try again.' : err.message,
  })
})