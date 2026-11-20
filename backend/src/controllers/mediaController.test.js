import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/mediaService.js', () => ({
  streamFootage: vi.fn(),
  streamFootageMobile: vi.fn(),
}))

const { getFootage, getFootageMobile } = await import('./mediaController.js')
const { streamFootage, streamFootageMobile } =
  await import('../services/mediaService.js')

function createMockBody() {
  return { on: vi.fn(), pipe: vi.fn() }
}

function createMockRes() {
  return {
    setHeader: vi.fn(),
    status: vi.fn(),
    end: vi.fn(),
    destroy: vi.fn(),
  }
}

describe('mediaController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('streams the full object when no range is requested', async () => {
    const body = createMockBody()
    streamFootage.mockResolvedValueOnce({
      size: 1000,
      contentType: 'video/mp4',
      range: { type: 'none' },
      body,
    })

    const res = createMockRes()
    await getFootage({ headers: {} }, res)

    expect(streamFootage).toHaveBeenCalledWith(undefined)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.setHeader).toHaveBeenCalledWith('Accept-Ranges', 'bytes')
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'video/mp4')
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', 1000)
    expect(body.pipe).toHaveBeenCalledWith(res)
  })

  it('streams a partial object for a satisfiable range', async () => {
    const body = createMockBody()
    streamFootage.mockResolvedValueOnce({
      size: 1000,
      contentType: 'video/mp4',
      range: { type: 'satisfiable', start: 0, end: 499 },
      body,
    })

    const res = createMockRes()
    await getFootage({ headers: { range: 'bytes=0-499' } }, res)

    expect(streamFootage).toHaveBeenCalledWith('bytes=0-499')
    expect(res.status).toHaveBeenCalledWith(206)
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Range',
      'bytes 0-499/1000',
    )
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', 500)
    expect(body.pipe).toHaveBeenCalledWith(res)
  })

  it('responds 416 for an unsatisfiable range', async () => {
    streamFootage.mockResolvedValueOnce({
      size: 1000,
      contentType: 'video/mp4',
      range: { type: 'unsatisfiable' },
      body: null,
    })

    const res = createMockRes()
    await getFootage({ headers: { range: 'bytes=5000-' } }, res)

    expect(res.status).toHaveBeenCalledWith(416)
    expect(res.setHeader).toHaveBeenCalledWith('Content-Range', 'bytes */1000')
    expect(res.end).toHaveBeenCalled()
  })

  it('streams the mobile footage', async () => {
    const body = createMockBody()
    streamFootageMobile.mockResolvedValueOnce({
      size: 200,
      contentType: 'video/quicktime',
      range: { type: 'none' },
      body,
    })

    const res = createMockRes()
    await getFootageMobile({ headers: {} }, res)

    expect(streamFootageMobile).toHaveBeenCalledWith(undefined)
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'video/quicktime',
    )
  })

  it('propagates errors from the service', async () => {
    streamFootage.mockRejectedValueOnce(new Error('bucket unreachable'))

    const res = createMockRes()
    await expect(getFootage({ headers: {} }, res)).rejects.toThrow(
      'bucket unreachable',
    )
  })
})
