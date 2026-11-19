import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockSend, mockGetObjectCommand, mockHeadObjectCommand, s3State } =
  vi.hoisted(() => ({
    mockSend: vi.fn(),
    mockGetObjectCommand: vi.fn(),
    mockHeadObjectCommand: vi.fn(),
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
  HeadObjectCommand: mockHeadObjectCommand.mockImplementation(function (input) {
    return { input }
  }),
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

const { getObjectHead, getObjectBody } = await import('./bucketClient.js')

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

  it('heads an object for the given key and bucket', async () => {
    mockSend.mockResolvedValueOnce({ ContentLength: 123, ContentType: 'video/mp4' })

    const result = await getObjectHead('footage.mp4')

    expect(mockHeadObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'footage.mp4',
    })
    expect(result).toEqual({ ContentLength: 123, ContentType: 'video/mp4' })
  })

  it('gets an object without a range by default', async () => {
    mockSend.mockResolvedValueOnce({ Body: 'stream' })

    const result = await getObjectBody('footage.mp4')

    expect(mockGetObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'footage.mp4',
    })
    expect(result).toEqual({ Body: 'stream' })
  })

  it('gets an object with a range', async () => {
    mockSend.mockResolvedValueOnce({ Body: 'stream' })

    await getObjectBody('footage.mp4', 'bytes=0-99')

    expect(mockGetObjectCommand).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'footage.mp4',
      Range: 'bytes=0-99',
    })
  })

  it('propagates a get failure', async () => {
    mockSend.mockRejectedValueOnce(new Error('bucket unreachable'))

    await expect(getObjectBody('footage.mp4')).rejects.toThrow(
      'bucket unreachable',
    )
  })
})
