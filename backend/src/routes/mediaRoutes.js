import { Router } from 'express'
import { getFootage, getFootageMobile } from '../controllers/mediaController.js'

const router = Router()

router.get('/media/footage', getFootage)
router.get('/media/footage-mobile', getFootageMobile)

export default router
