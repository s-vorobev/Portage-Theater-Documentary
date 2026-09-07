import { getPresignedUrl } from '../clients/bucketClient.js'

const MEDIA_KEYS = {
  footage: 'footage.mp4',
  footageMobile: 'footage_mobile.mov',
}

export async function getFootage(_req, res) {
  const url = await getPresignedUrl(MEDIA_KEYS.footage)
  res.redirect(url)
}

export async function getFootageMobile(_req, res) {
  const url = await getPresignedUrl(MEDIA_KEYS.footageMobile)
  res.redirect(url)
}
