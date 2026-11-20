import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../clients/bucketClient.js', () => ({
  getObjectHead: vi.fn(),
  getObjectBody: vi.fn(),
}))

vi.mock('../config/env.js', () => ({
  env: {
    BUCKET_FOOTAGE_KEY: 'footage.mp4',
    BUCKET_FOOTAGE_MOBILE_KEY: 'footage_mobile.mov',
  },
}))

const { streamFootage, streamFootageMobile } = await import('./mediaService.js')
const { getObjectHead, getObjectBody } = await import('../clients/bucketClient.js')

describe('mediaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads footage metadata and a full body when no range is given', async () => {
    getObjectHead.mockResolvedValueOnce({
      ContentLength: 1000,
      ContentType: 'video/mp4',
    })
    getObjectBody.mockResolvedValueOnce({ Body: 'stream' })

    const result = await streamFootage(undefined)

    expect(getObjectHead).toHaveBeenCalledWith('footage.mp4')
    expect(getObjectBody).toHaveBeenCalledWith('footage.mp4', undefined)
    expect(result).toEqual({
      size: 1000,
      contentType: 'video/mp4',
      range: { type: 'none' },
      body: 'stream',
    })
  })

  it('loads a ranged body for a satisfiable range', async () => {
    getObjectHead.mockResolvedValueOnce({
      ContentLength: 1000,
      ContentType: 'video/mp4',
    })
    getObjectBody.mockResolvedValueOnce({ Body: 'stream' })

    const result = await streamFootage('bytes=0-99')

    expect(getObjectBody).toHaveBeenCalledWith('footage.mp4', 'bytes=0-99')
    expect(result.range).toEqual({ type: 'satisfiable', start: 0, end: 99 })
  })

  it('does not fetch a body for an unsatisfiable range', async () => {
    getObjectHead.mockResolvedValueOnce({
      ContentLength: 1000,
      ContentType: 'video/mp4',
    })

    const result = await streamFootage('bytes=5000-')

    expect(getObjectBody).not.toHaveBeenCalled()
    expect(result.range).toEqual({ type: 'unsatisfiable' })
    expect(result.body).toBeNull()
  })

  it('falls back to a generic content type when the object has none', async () => {
    getObjectHead.mockResolvedValueOnce({ ContentLength: 1000 })
    getObjectBody.mockResolvedValueOnce({ Body: 'stream' })

    const result = await streamFootage(undefined)

    expect(result.contentType).toBe('application/octet-stream')
  })

  it('loads the mobile footage key', async () => {
    getObjectHead.mockResolvedValueOnce({
      ContentLength: 200,
      ContentType: 'video/quicktime',
    })
    getObjectBody.mockResolvedValueOnce({ Body: 'stream' })

    await streamFootageMobile(undefined)

    expect(getObjectHead).toHaveBeenCalledWith('footage_mobile.mov')
    expect(getObjectBody).toHaveBeenCalledWith('footage_mobile.mov', undefined)
  })
})
