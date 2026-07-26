import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'

const mockSend = vi.fn()
const mockGetSignedUrl = vi.fn()

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(function () {
    return { send: mockSend }
  }),
  GetObjectCommand: vi.fn().mockImplementation(function (input) {
    return { input }
  }),
}))

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}))

const { getFootage, getFootageMobile } = await import('./mediaController.js')

function createMockRes() {
  return {
    redirect: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }
}

describe('mediaController', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...OLD_ENV,
      BUCKET_ENDPOINT: 'storage.railway.app',
      BUCKET_REGION: 'auto',
      BUCKET_ACCESS_KEY: 'test-access-key',
      BUCKET_SECRET_KEY: 'test-secret-key',
      BUCKET_NAME: 'test-bucket',
    }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  describe('getFootage', () => {
    it('redirects to the presigned URL for footage.mp4', async () => {
      const fakeUrl = 'https://storage.railway.app/test-bucket/footage.mp4?signature=abc'
      mockGetSignedUrl.mockResolvedValueOnce(fakeUrl)

      const req = {}
      const res = createMockRes()

      await getFootage(req, res)

      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1)
      const [, command] = mockGetSignedUrl.mock.calls[0]
      expect(command.input).toMatchObject({
        Bucket: 'test-bucket',
        Key: 'footage.mp4',
      })
      expect(res.redirect).toHaveBeenCalledWith(fakeUrl)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('returns a 500 if presigning fails', async () => {
      mockGetSignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

      const req = {}
      const res = createMockRes()

      await getFootage(req, res)

      expect(res.redirect).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Could not load media')
    })
  })

  describe('getFootageMobile', () => {
    it('redirects to the presigned URL for footage_mobile.mov', async () => {
      const fakeUrl = 'https://storage.railway.app/test-bucket/footage_mobile.mov?signature=xyz'
      mockGetSignedUrl.mockResolvedValueOnce(fakeUrl)

      const req = {}
      const res = createMockRes()

      await getFootageMobile(req, res)

      const [, command] = mockGetSignedUrl.mock.calls[0]
      expect(command.input).toMatchObject({
        Bucket: 'test-bucket',
        Key: 'footage_mobile.mov',
      })
      expect(res.redirect).toHaveBeenCalledWith(fakeUrl)
    })

    it('returns a 500 if presigning fails', async () => {
      mockGetSignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

      const req = {}
      const res = createMockRes()

      await getFootageMobile(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalledWith('Could not load media')
    })
  })
})
