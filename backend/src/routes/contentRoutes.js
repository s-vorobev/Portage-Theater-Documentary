import { Router } from 'express'
import { getContent, updateContent } from '../controllers/contentController.js'

const router = Router()

router.get('/content/:slug', getContent)
router.put('/content/:slug', updateContent)

export default router
