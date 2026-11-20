import { describe, it, expect } from 'vitest'
import { mapContentRow } from './contentMapper.js'

describe('mapContentRow', () => {
  it('maps a snake_case row to a camelCase object', () => {
    const updatedAt = new Date('2026-01-01T00:00:00Z')
    const row = {
      content_id: 'id-1',
      slug: 'about',
      body: 'Hello world',
      updated_at: updatedAt,
    }

    expect(mapContentRow(row)).toEqual({
      contentId: 'id-1',
      slug: 'about',
      body: 'Hello world',
      updatedAt,
    })
  })

  it('returns null when there is no row', () => {
    expect(mapContentRow(null)).toBeNull()
  })
})
