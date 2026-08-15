import { Router } from 'express'
import multer from 'multer'
import { submitForm } from '../controllers/submissionController.js'
import { UPLOAD_LIMITS } from '../config/constants.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_LIMITS.maxFileSizeBytes,
    files: UPLOAD_LIMITS.maxFiles,
  },
})

router.post('/submit', upload.array('media', UPLOAD_LIMITS.maxFiles), submitForm)

export default router
