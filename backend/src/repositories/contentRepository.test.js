import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockQuery = vi.fn()

vi.mock('../db/pool.js', () => ({
  pool: { query: mockQuery },
}))

vi.mock('../db/sql/loader.js', () => ({
  queries: {
    selectContent: 'SELECT ... FROM content WHERE slug = $1;',
    updateContent: 'UPDATE content ... RETURNING ...;',
  },
}))

const { getContent, updateContent } = await import('./contentRepository.js')

const row = {
  content_id: 'id-1',
  slug: 'about',
  body: 'Hello world',
  updated_at: new Date('2026-01-01T00:00:00Z'),
}

describe('contentRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getContent', () => {
    it('queries by slug and returns the mapped content', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [row] })

      const result = await getContent('about')

      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['about'])
      expect(result).toEqual({
        contentId: 'id-1',
        slug: 'about',
        body: 'Hello world',
        updatedAt: row.updated_at,
      })
    })

    it('returns null when the slug does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const result = await getContent('missing')

      expect(result).toBeNull()
    })
  })

  describe('updateContent', () => {
    it('passes body then slug as params and returns the mapped row', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [row] })

      const result = await updateContent('about', 'Hello world')

      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
        'Hello world',
        'about',
      ])
      expect(result).toEqual({
        contentId: 'id-1',
        slug: 'about',
        body: 'Hello world',
        updatedAt: row.updated_at,
      })
    })
  })
})
