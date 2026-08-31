import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../clients/bucketClient.js', () => ({
  getPresignedUrl: vi.fn(),
}))

const { getFootage, getFootageMobile } = await import('./mediaController.js')
const { getPresignedUrl } = await import('../clients/bucketClient.js')

function createMockRes() {
  return {
    redirect: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }
}

describe('mediaController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFootage', () => {
    it('redirects to the presigned URL for footage.mp4', async () => {
      const fakeUrl =
        'https://storage.railway.app/test-bucket/footage.mp4?signature=abc'
      getPresignedUrl.mockResolvedValueOnce(fakeUrl)

      const res = createMockRes()

      await getFootage({}, res)

      expect(getPresignedUrl).toHaveBeenCalledWith('footage.mp4')
      expect(res.redirect).toHaveBeenCalledWith(fakeUrl)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('returns a 500 if presigning fails', async () => {
      getPresignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

      const res = createMockRes()

      await getFootage({}, res)

      expect(res.redirect).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Could not load media')
    })
  })

  describe('getFootageMobile', () => {
    it('redirects to the presigned URL for footage_mobile.mov', async () => {
      const fakeUrl =
        'https://storage.railway.app/test-bucket/footage_mobile.mov?signature=xyz'
      getPresignedUrl.mockResolvedValueOnce(fakeUrl)

      const res = createMockRes()

      await getFootageMobile({}, res)

      expect(getPresignedUrl).toHaveBeenCalledWith('footage_mobile.mov')
      expect(res.redirect).toHaveBeenCalledWith(fakeUrl)
    })

    it('returns a 500 if presigning fails', async () => {
      getPresignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

      const res = createMockRes()

      await getFootageMobile({}, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Could not load media')
    })
  })
})
