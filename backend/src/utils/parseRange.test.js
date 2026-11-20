import { describe, it, expect } from 'vitest'
import { parseRange } from './parseRange.js'

describe('parseRange', () => {
  it('returns none when there is no header', () => {
    expect(parseRange(undefined, 1000)).toEqual({ type: 'none' })
  })

  it('returns none for a malformed header', () => {
    expect(parseRange('items=0-9', 1000)).toEqual({ type: 'none' })
    expect(parseRange('bytes=abc', 1000)).toEqual({ type: 'none' })
    expect(parseRange('bytes=abc-', 1000)).toEqual({ type: 'none' })
    expect(parseRange('bytes=-', 1000)).toEqual({ type: 'none' })
  })

  it('parses an explicit range', () => {
    expect(parseRange('bytes=0-499', 1000)).toEqual({
      type: 'satisfiable',
      start: 0,
      end: 499,
    })
  })

  it('parses an open-ended range', () => {
    expect(parseRange('bytes=0-', 1000)).toEqual({
      type: 'satisfiable',
      start: 0,
      end: 999,
    })
  })

  it('clamps the end to the object size', () => {
    expect(parseRange('bytes=500-99999', 1000)).toEqual({
      type: 'satisfiable',
      start: 500,
      end: 999,
    })
  })

  it('parses a suffix range', () => {
    expect(parseRange('bytes=-100', 1000)).toEqual({
      type: 'satisfiable',
      start: 900,
      end: 999,
    })
  })

  it('returns the whole object for an oversized suffix range', () => {
    expect(parseRange('bytes=-5000', 1000)).toEqual({
      type: 'satisfiable',
      start: 0,
      end: 999,
    })
  })

  it('returns unsatisfiable when start is past the end', () => {
    expect(parseRange('bytes=1000-', 1000)).toEqual({ type: 'unsatisfiable' })
  })

  it('returns unsatisfiable when start is after end', () => {
    expect(parseRange('bytes=500-100', 1000)).toEqual({ type: 'unsatisfiable' })
  })
})
