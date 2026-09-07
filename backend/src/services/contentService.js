import { HttpError } from '../utils/httpError.js'
import {
  getContent as findContent,
  updateContent as persistContent,
} from '../repositories/contentRepository.js'

export async function getContent(slug) {
  const content = await findContent(slug)

  if (!content) {
    throw new HttpError(404, 'Content not found')
  }

  return content
}

export async function updateContent(slug, body) {
  if (typeof body !== 'string' || body.trim().length === 0) {
    throw new HttpError(400, 'Body is required')
  }

  const content = await persistContent(slug, body)

  if (!content) {
    throw new HttpError(404, 'Content not found')
  }

  return content
}
