import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../clients/bucketClient.js', () => ({
  getPresignedUrl: vi.fn(),
}))

const { getFootage, getFootageMobile } = await import('./mediaController.js')
const { getPresignedUrl } = await import('../clients/bucketClient.js')

function createMockRes() {
  return { redirect: vi.fn() }
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
    })

    it('propagates the error when presigning fails', async () => {
      getPresignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

      const res = createMockRes()

      await expect(getFootage({}, res)).rejects.toThrow('bucket unreachable')
      expect(res.redirect).not.toHaveBeenCalled()
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

    it('propagates the error when presigning fails', async () => {
      getPresignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

      const res = createMockRes()

      await expect(getFootageMobile({}, res)).rejects.toThrow(
        'bucket unreachable',
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
