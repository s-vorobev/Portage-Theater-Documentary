import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/contentService.js', () => ({
  getContent: vi.fn(),
  updateContent: vi.fn(),
}))

import { getContent, putContent } from './contentController.js'
import {
  getContent as fetchContent,
  updateContent as saveContent,
} from '../services/contentService.js'

function makeRes() {
  const res = {}
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('contentController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getContent', () => {
    it('responds with the content for the slug', async () => {
      const content = { contentId: 'id-1', slug: 'about', body: 'Hello' }
      fetchContent.mockResolvedValueOnce(content)

      const req = { params: { slug: 'about' } }
      const res = makeRes()

      await getContent(req, res)

      expect(fetchContent).toHaveBeenCalledWith('about')
      expect(res.json).toHaveBeenCalledWith(content)
    })

    it('propagates a service error', async () => {
      fetchContent.mockRejectedValueOnce(new Error('boom'))

      await expect(
        getContent({ params: { slug: 'about' } }, makeRes()),
      ).rejects.toThrow('boom')
    })
  })

  describe('putContent', () => {
    it('updates the content and responds with the result', async () => {
      const content = { contentId: 'id-1', slug: 'about', body: 'New' }
      saveContent.mockResolvedValueOnce(content)

      const req = { params: { slug: 'about' }, body: { body: 'New' } }
      const res = makeRes()

      await putContent(req, res)

      expect(saveContent).toHaveBeenCalledWith('about', 'New')
      expect(res.json).toHaveBeenCalledWith(content)
    })

    it('passes undefined body when none is provided', async () => {
      saveContent.mockResolvedValueOnce({})

      const req = { params: { slug: 'about' }, body: {} }
      await putContent(req, makeRes())

      expect(saveContent).toHaveBeenCalledWith('about', undefined)
    })
  })
})
