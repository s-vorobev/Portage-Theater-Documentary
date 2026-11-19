import { getObjectHead, getObjectBody } from '../clients/bucketClient.js'
import { parseRange } from '../utils/parseRange.js'

const MEDIA_KEYS = {
  footage: 'footage.mp4',
  footageMobile: 'footage_mobile.mov',
}

const CONTENT_TYPES = {
  'footage.mp4': 'video/mp4',
  'footage_mobile.mov': 'video/quicktime',
}

async function loadMedia(key, rangeHeader) {
  const head = await getObjectHead(key)
  const size = head.ContentLength ?? 0
  const contentType =
    head.ContentType || CONTENT_TYPES[key] || 'application/octet-stream'

  const range = parseRange(rangeHeader, size)

  if (range.type === 'unsatisfiable') {
    return { size, contentType, range, body: null }
  }

  const object = await getObjectBody(
    key,
    range.type === 'satisfiable' ? `bytes=${range.start}-${range.end}` : undefined,
  )

  return { size, contentType, range, body: object.Body }
}

export function streamFootage(rangeHeader) {
  return loadMedia(MEDIA_KEYS.footage, rangeHeader)
}

export function streamFootageMobile(rangeHeader) {
  return loadMedia(MEDIA_KEYS.footageMobile, rangeHeader)
}
