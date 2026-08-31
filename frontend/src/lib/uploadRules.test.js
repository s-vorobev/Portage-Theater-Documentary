import { describe, it, expect } from 'vitest'
import { selectFiles, MAX_FILES, MAX_FILE_SIZE_BYTES } from './uploadRules'

function makeFile(overrides = {}) {
  return {
    name: 'photo.jpg',
    type: 'image/jpeg',
    size: 1024,
    ...overrides,
  }
}

describe('selectFiles', () => {
  it('accepts files with supported types', () => {
    const result = selectFiles(
      [],
      [makeFile(), makeFile({ type: 'video/mp4' })],
    )

    expect(result.files).toHaveLength(2)
    expect(result.error).toBe('')
  })

  it('skips unsupported types and reports how many were skipped', () => {
    const result = selectFiles(
      [],
      [makeFile({ name: 'archive.zip', type: 'application/zip' }), makeFile()],
    )

    expect(result.files).toHaveLength(1)
    expect(result.error).toContain('1 file(s) skipped')
  })

  it('skips files over the per-file size limit', () => {
    const result = selectFiles(
      [],
      [
        makeFile({ name: 'huge.mp4', size: MAX_FILE_SIZE_BYTES + 1 }),
        makeFile(),
      ],
    )

    expect(result.files).toHaveLength(1)
    expect(result.error).toContain('each file must be under')
  })

  it('caps the list at MAX_FILES', () => {
    const many = Array.from({ length: MAX_FILES + 1 }, (_, i) =>
      makeFile({ name: `file-${i}.jpg` }),
    )

    const result = selectFiles([], many)

    expect(result.files).toHaveLength(MAX_FILES)
    expect(result.error).toContain(`up to ${MAX_FILES} files`)
  })

  it('reports when the total size exceeds the limit', () => {
    const seven = Array.from({ length: 7 }, (_, i) =>
      makeFile({ name: `big-${i}.jpg`, size: MAX_FILE_SIZE_BYTES }),
    )

    const result = selectFiles([], seven)

    expect(result.error).toContain('Total attachments must be under 3GB')
  })

  it('keeps existing files and appends newly selected ones', () => {
    const existing = makeFile({ name: 'a.jpg' })
    const selected = makeFile({ name: 'b.jpg' })

    const result = selectFiles([existing], [selected])

    expect(result.files).toEqual([existing, selected])
    expect(result.error).toBe('')
  })
})
