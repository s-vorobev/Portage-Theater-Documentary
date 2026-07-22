import { Router } from 'express'
import multer from 'multer'
import { submitForm } from '../controllers/submissionController.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB per file
    files: 10,
  },
})

router.post('/submit', upload.array('media', 10), submitForm)

export default router