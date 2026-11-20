import { describe, it, expect } from 'vitest'
import {
  selectFiles,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  MAX_TOTAL_SIZE_BYTES,
} from './uploadRules.js'

function file(name, type, size) {
  return { name, type, size }
}

const image = () => file('a.jpg', 'image/jpeg', 1000)

describe('selectFiles', () => {
  it('keeps accepted files with no error', () => {
    const result = selectFiles([], [image()])
    expect(result.files).toHaveLength(1)
    expect(result.error).toBe('')
  })

  it('filters out unsupported types and reports a skip', () => {
    const result = selectFiles(
      [],
      [image(), file('x.exe', 'application/x-msdownload', 1000)],
    )
    expect(result.files).toHaveLength(1)
    expect(result.error).toContain('1 file(s) skipped')
  })

  it('filters out files over the size limit', () => {
    const big = file('big.mp4', 'video/mp4', MAX_FILE_SIZE_BYTES + 1)
    const result = selectFiles([], [big, image()])
    expect(result.files).toHaveLength(1)
    expect(result.error).toContain('each file must be under')
  })

  it('caps the number of files at the maximum', () => {
    const many = Array.from({ length: MAX_FILES + 2 }, (_, i) =>
      file(`f${i}.png`, 'image/png', 1000),
    )
    const result = selectFiles([], many)
    expect(result.files).toHaveLength(MAX_FILES)
    expect(result.error).toContain(`up to ${MAX_FILES} files`)
  })

  it('flags a total size over the limit without dropping files', () => {
    const sizeEach = Math.ceil(MAX_TOTAL_SIZE_BYTES / MAX_FILES) + 1
    const many = Array.from({ length: MAX_FILES }, (_, i) =>
      file(`f${i}.mp4`, 'video/mp4', sizeEach),
    )
    const result = selectFiles([], many)
    expect(result.error).toContain('Total attachments must be under')
  })

  it('preserves previously selected files', () => {
    const existing = image()
    const result = selectFiles([existing], [file('b.webp', 'image/webp', 2000)])
    expect(result.files).toHaveLength(2)
  })
})
