import { describe, it, expect } from 'vitest'
import { expandOrigins } from './origins.js'

describe('expandOrigins', () => {
  it('expands a bare domain into http/https + www/non-www variants', () => {
    expect(expandOrigins(['example.com']).sort()).toEqual(
      [
        'https://example.com',
        'https://www.example.com',
        'http://example.com',
        'http://www.example.com',
      ].sort(),
    )
  })

  it('reduces a full URL to its host variants', () => {
    const origins = expandOrigins(['https://example.com/some/path'])
    expect(origins).toContain('https://example.com')
    expect(origins).toContain('https://www.example.com')
    expect(origins).not.toContain('https://example.com/some/path')
  })

  it('treats a www host and its bare form identically', () => {
    expect(expandOrigins(['www.example.com']).sort()).toEqual(
      expandOrigins(['example.com']).sort(),
    )
  })

  it('does not add a www variant for localhost', () => {
    const origins = expandOrigins(['localhost:5173'])
    expect(origins).toContain('http://localhost:5173')
    expect(origins).not.toContain('https://www.localhost:5173')
  })

  it('ignores empty values', () => {
    expect(expandOrigins(['example.com', '', undefined])).toEqual(
      expandOrigins(['example.com']),
    )
  })
})
