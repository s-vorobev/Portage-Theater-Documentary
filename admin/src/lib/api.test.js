import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  apiUrl,
  endpoints,
  apiFetch,
  ApiError,
  fetchAllSubmissionIds,
} from './api'

let fetchMock

function jsonResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  }
}

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiUrl', () => {
  it('appends the API prefix and path to the base url', () => {
    expect(apiUrl('/submissions')).toMatch(/\/api\/v1\/submissions$/)
  })
})

describe('endpoints', () => {
  it('builds submission and content paths', () => {
    expect(endpoints.submission('abc')).toBe('/submissions/abc')
    expect(endpoints.content('main_info')).toBe('/content/main_info')
  })
})

describe('apiFetch', () => {
  it('sends the token as a bearer header', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await apiFetch('/submissions', 'secret')

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer secret')
  })

  it('omits the authorization header without a token', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await apiFetch('/submissions')

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBeUndefined()
  })

  it('merges extra headers with the authorization header', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await apiFetch('/content/main_info', 'secret', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.method).toBe('PUT')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.headers.Authorization).toBe('Bearer secret')
  })

  it('throws an ApiError carrying the response status', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { ok: false, status: 401 }))

    await expect(apiFetch('/submissions', 'bad')).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
    })
  })

  it('returns the response when the request succeeds', async () => {
    const response = jsonResponse({ ids: [] })
    fetchMock.mockResolvedValue(response)

    const result = await apiFetch('/submissions', 'secret')

    expect(result).toBe(response)
  })
})

describe('fetchAllSubmissionIds', () => {
  it('fetches a single short batch', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ids: ['a', 'b'] }))

    const ids = await fetchAllSubmissionIds('secret')

    expect(ids).toEqual(['a', 'b'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keeps fetching until a batch is shorter than the page size', async () => {
    const firstBatch = Array.from({ length: 100 }, (_, i) => `id-${i}`)
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ ids: firstBatch }))
      .mockResolvedValueOnce(jsonResponse({ ids: ['last'] }))

    const ids = await fetchAllSubmissionIds('secret')

    expect(ids).toHaveLength(101)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toMatch(/offset=0/)
    expect(fetchMock.mock.calls[1][0]).toMatch(/offset=100/)
  })

  it('propagates an ApiError when a batch request is unauthorized', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { ok: false, status: 401 }))

    await expect(fetchAllSubmissionIds('bad')).rejects.toBeInstanceOf(ApiError)
  })
})
