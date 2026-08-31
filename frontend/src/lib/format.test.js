import { describe, it, expect } from 'vitest'
import { countWords, formatBytes } from './format'

describe('countWords', () => {
  it('returns 0 for an empty string', () => {
    expect(countWords('')).toBe(0)
  })

  it('returns 0 for whitespace-only input', () => {
    expect(countWords('   ')).toBe(0)
  })

  it('counts a single word', () => {
    expect(countWords('hello')).toBe(1)
  })

  it('counts words separated by whitespace', () => {
    expect(countWords('hello world')).toBe(2)
  })

  it('ignores leading, trailing, and repeated whitespace', () => {
    expect(countWords('  hello   world  ')).toBe(2)
  })
})

describe('formatBytes', () => {
  it('formats sub-megabyte sizes in KB', () => {
    expect(formatBytes(1024)).toBe('1KB')
  })

  it('formats megabyte sizes', () => {
    expect(formatBytes(1024 * 1024)).toBe('1MB')
  })

  it('formats gigabyte sizes', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1GB')
  })
})
