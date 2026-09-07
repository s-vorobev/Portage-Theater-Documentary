import { Router } from 'express'
import { getContent, putContent } from '../controllers/contentController.js'

const router = Router()

router.get('/content/:slug', getContent)
router.put('/content/:slug', putContent)

export default router
