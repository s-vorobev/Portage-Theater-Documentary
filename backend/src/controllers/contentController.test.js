import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/contentService.js', () => ({
  getContent: vi.fn(),
  updateContent: vi.fn(),
}))

import { getContent, updateContent } from './contentController.js'
import * as contentService from '../services/contentService.js'

function makeRes() {
  const res = {}
  res.json = vi.fn().mockReturnValue(res)
  res.status = vi.fn().mockReturnValue(res)
  res.end = vi.fn().mockReturnValue(res)
  return res
}

describe('contentController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getContent', () => {
    it('responds with the content for the slug', async () => {
      const content = { contentId: 'id-1', slug: 'about', body: 'Hello' }
      contentService.getContent.mockResolvedValueOnce(content)

      const req = { params: { slug: 'about' } }
      const res = makeRes()

      await getContent(req, res)

      expect(contentService.getContent).toHaveBeenCalledWith('about')
      expect(res.json).toHaveBeenCalledWith(content)
    })

    it('propagates a service error', async () => {
      contentService.getContent.mockRejectedValueOnce(new Error('boom'))

      await expect(
        getContent({ params: { slug: 'about' } }, makeRes()),
      ).rejects.toThrow('boom')
    })
  })

  describe('updateContent', () => {
    it('updates the content and responds with 204 without a body', async () => {
      contentService.updateContent.mockResolvedValueOnce({
        contentId: 'id-1',
        slug: 'about',
        body: 'New',
      })

      const req = { params: { slug: 'about' }, body: { body: 'New' } }
      const res = makeRes()

      await updateContent(req, res)

      expect(contentService.updateContent).toHaveBeenCalledWith('about', 'New')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.end).toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('passes undefined body when none is provided', async () => {
      contentService.updateContent.mockResolvedValueOnce({})

      const req = { params: { slug: 'about' }, body: {} }
      await updateContent(req, makeRes())

      expect(contentService.updateContent).toHaveBeenCalledWith('about', undefined)
    })
  })
})
