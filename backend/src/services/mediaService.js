import { getObjectHead, getObjectBody } from '../clients/bucketClient.js'
import { parseRange } from '../utils/parseRange.js'
import { env } from '../config/env.js'

const FALLBACK_CONTENT_TYPE = 'application/octet-stream'

const MEDIA_KEYS = {
  footage: env.BUCKET_FOOTAGE_KEY,
  footageMobile: env.BUCKET_FOOTAGE_MOBILE_KEY,
}

async function loadMedia(key, rangeHeader) {
  const head = await getObjectHead(key)
  const size = head.ContentLength ?? 0
  const contentType = head.ContentType || FALLBACK_CONTENT_TYPE

  const range = parseRange(rangeHeader, size)

  if (range.type === 'unsatisfiable') {
    return { size, contentType, range, body: null }
  }

  const object = await getObjectBody(
    key,
    range.type === 'satisfiable'
      ? `bytes=${range.start}-${range.end}`
      : undefined,
  )

  return { size, contentType, range, body: object.Body }
}

export function streamFootage(rangeHeader) {
  return loadMedia(MEDIA_KEYS.footage, rangeHeader)
}

export function streamFootageMobile(rangeHeader) {
  return loadMedia(MEDIA_KEYS.footageMobile, rangeHeader)
}
