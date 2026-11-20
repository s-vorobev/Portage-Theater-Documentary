import { describe, it, expect } from 'vitest'
import { formatBytes } from './formatBytes.js'

describe('formatBytes', () => {
  it('formats kilobytes', () => {
    expect(formatBytes(512)).toBe('1KB')
    expect(formatBytes(1024)).toBe('1KB')
  })

  it('formats megabytes', () => {
    expect(formatBytes(500 * 1024 * 1024)).toBe('500MB')
  })

  it('formats gigabytes', () => {
    expect(formatBytes(3 * 1024 * 1024 * 1024)).toBe('3GB')
  })
})
