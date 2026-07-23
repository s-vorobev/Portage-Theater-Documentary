import { describe, it, expect } from 'vitest'
import { generateFilename } from './generateFilename.js'

describe('generateFilename', () => {
  it('preserves the original file extension', () => {
    const result = generateFilename('beach_video.mov')
    expect(result.endsWith('.mov')).toBe(true)
  })

  it('handles extensions of different lengths', () => {
    expect(generateFilename('photo.jpeg').endsWith('.jpeg')).toBe(true)
    expect(generateFilename('doc.pdf').endsWith('.pdf')).toBe(true)
  })

  it('produces a different name for a file with no extension', () => {
    const result = generateFilename('noextension')
    // extname() returns '' for a file with no dot, so the result should
    // just be the UUID with nothing appended after it.
    expect(result.includes('.')).toBe(false)
  })

  it('generates a unique name on every call', () => {
    const first = generateFilename('same.png')
    const second = generateFilename('same.png')
    expect(first).not.toBe(second)
  })

  it('the generated name (minus extension) looks like a UUID', () => {
    const result = generateFilename('file.png')
    const uuidPart = result.replace('.png', '')
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(uuidPart).toMatch(uuidPattern)
  })
})
