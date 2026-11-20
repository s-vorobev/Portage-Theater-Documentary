import { Router } from 'express'
import { getContent, updateContent } from '../controllers/contentController.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()

router.get('/content/:slug', getContent)
router.put('/content/:slug', requireAdmin, updateContent)

export default router
