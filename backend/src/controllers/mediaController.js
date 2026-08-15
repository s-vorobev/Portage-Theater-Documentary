import { getPresignedUrl } from '../clients/bucketClient.js'

const MEDIA_KEYS = {
  footage: 'footage.mp4',
  footageMobile: 'footage_mobile.mov',
}

async function redirectToMedia(res, key) {
  try {
    const url = await getPresignedUrl(key)
    res.redirect(url)
  } catch (err) {
    console.error(`Bucket presign error for key "${key}":`, err)
    res.status(500).send('Could not load media')
  }
}

export const getFootage = (_req, res) => redirectToMedia(res, MEDIA_KEYS.footage)

export const getFootageMobile = (_req, res) =>
  redirectToMedia(res, MEDIA_KEYS.footageMobile)
