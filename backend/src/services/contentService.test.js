import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../repositories/contentRepository.js', () => ({
  getContent: vi.fn(),
  updateContent: vi.fn(),
}))

import { getContent, updateContent } from './contentService.js'
import {
  getContent as findContent,
  updateContent as persistContent,
} from '../repositories/contentRepository.js'

const content = {
  contentId: 'id-1',
  slug: 'about',
  body: 'Hello world',
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}

describe('contentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getContent', () => {
    it('returns the content for the given slug', async () => {
      findContent.mockResolvedValueOnce(content)

      const result = await getContent('about')

      expect(findContent).toHaveBeenCalledWith('about')
      expect(result).toBe(content)
    })

    it('throws a 404 when the slug does not exist', async () => {
      findContent.mockResolvedValueOnce(null)

      await expect(getContent('missing')).rejects.toMatchObject({ status: 404 })
    })
  })

  describe('updateContent', () => {
    it('updates and returns the content', async () => {
      persistContent.mockResolvedValueOnce(content)

      const result = await updateContent('about', 'New body')

      expect(persistContent).toHaveBeenCalledWith('about', 'New body')
      expect(result).toBe(content)
    })

    it('rejects a missing body with a 400', async () => {
      await expect(updateContent('about', undefined)).rejects.toMatchObject({
        status: 400,
      })
      expect(persistContent).not.toHaveBeenCalled()
    })

    it('rejects a blank body with a 400', async () => {
      await expect(updateContent('about', '   ')).rejects.toMatchObject({
        status: 400,
      })
      expect(persistContent).not.toHaveBeenCalled()
    })

    it('throws a 404 when the slug does not exist', async () => {
      persistContent.mockResolvedValueOnce(null)

      await expect(updateContent('missing', 'New body')).rejects.toMatchObject({
        status: 404,
      })
    })
  })
})
