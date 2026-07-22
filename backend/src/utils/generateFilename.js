import { v4 as uuidv4 } from 'uuid'
import { extname } from 'path'

export function generateFilename(originalFilename) {
  const ext = extname(originalFilename)
  return `${uuidv4()}${ext}`
}
