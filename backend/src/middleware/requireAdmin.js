import { timingSafeEqual } from 'crypto'
import { env } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

const BEARER_PREFIX = 'Bearer '

function extractBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    return null
  }
  return authHeader.slice(BEARER_PREFIX.length)
}

function isValidToken(token) {
  if (!token) return false

  const expected = Buffer.from(env.ADMIN_TOKEN)
  const provided = Buffer.from(token)

  if (provided.length !== expected.length) return false

  return timingSafeEqual(provided, expected)
}

export function requireAdmin(req, _res, next) {
  const token = extractBearerToken(req.headers.authorization)

  if (!isValidToken(token)) {
    return next(new HttpError(401, 'Unauthorized'))
  }

  next()
}
