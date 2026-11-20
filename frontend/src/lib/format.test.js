import { describe, it, expect } from 'vitest'
import { countWords, formatBytes } from './format.js'

describe('countWords', () => {
  it('returns 0 for empty or whitespace-only text', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
  })

  it('counts words split by whitespace', () => {
    expect(countWords('hello')).toBe(1)
    expect(countWords('hello world')).toBe(2)
    expect(countWords('a  b\tc\nd')).toBe(4)
  })
})

describe('formatBytes', () => {
  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1KB')
    expect(formatBytes(2 * 1024)).toBe('2KB')
  })

  it('formats megabytes', () => {
    expect(formatBytes(500 * 1024 * 1024)).toBe('500MB')
  })

  it('formats gigabytes', () => {
    expect(formatBytes(3 * 1024 * 1024 * 1024)).toBe('3GB')
  })
})
