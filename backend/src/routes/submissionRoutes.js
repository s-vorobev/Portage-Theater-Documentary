import { Router } from 'express'
import multer from 'multer'
import {
  submitForm,
  listSubmissions,
  getSubmission,
} from '../controllers/submissionController.js'
import { UPLOAD_LIMITS } from '../config/constants.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_LIMITS.maxFileSizeBytes,
    files: UPLOAD_LIMITS.maxFiles,
  },
})

router.post(
  '/submit',
  upload.array('media', UPLOAD_LIMITS.maxFiles),
  submitForm,
)

router.get('/submissions', listSubmissions)
router.get('/submissions/:id', getSubmission)

export default router
