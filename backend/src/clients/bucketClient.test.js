import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockSend,
  mockGetSignedUrl,
  mockGetObjectCommand,
  s3State,
} = vi.hoisted(() => ({
  mockSend: vi.fn(),
  mockGetSignedUrl: vi.fn(),
  mockGetObjectCommand: vi.fn(),
  s3State: { config: null },
}))

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(function (config) {
    s3State.config = config
    return { send: mockSend }
  }),
  GetObjectCommand: mockGetObjectCommand.mockImplementation(function (input) {
    return { input }
  }),
}))

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}))

vi.mock('../config/env.js', () => ({
  env: {
    BUCKET_ENDPOINT: 'https://storage.railway.app',
    BUCKET_REGION: 'auto',
    BUCKET_ACCESS_KEY: 'test-access-key',
    BUCKET_SECRET_KEY: 'test-secret-key',
    BUCKET_NAME: 'test-bucket',
  },
}))

const { getPresignedUrl } = await import('./bucketClient.js')

describe('bucketClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds the S3 client from the environment config', () => {
    expect(s3State.config).toEqual({
      endpoint: 'https://storage.railway.app',
      region: 'auto',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    })
  })

  it('presigns a GetObject command for the given key and bucket', async () => {
    mockGetSignedUrl.mockResolvedValueOnce('https://signed.url/video')

    const url = await getPresignedUrl('footage.mp4')

    expect(mockGetObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'footage.mp4',
    })
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: { Bucket: 'test-bucket', Key: 'footage.mp4' },
      }),
      { expiresIn: 3600 },
    )
    expect(url).toBe('https://signed.url/video')
  })

  it('propagates a presign failure', async () => {
    mockGetSignedUrl.mockRejectedValueOnce(new Error('bucket unreachable'))

    await expect(getPresignedUrl('footage.mp4')).rejects.toThrow(
      'bucket unreachable',
    )
  })
})
