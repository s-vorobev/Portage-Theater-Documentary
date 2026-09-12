const API_BASE = import.meta.env.VITE_API_URL
const API_PREFIX = '/api/v1'

export function apiUrl(path) {
  return `${API_BASE}${API_PREFIX}${path}`
}

export const endpoints = {
  submissions: '/submissions',
  submission: (id) => `/submissions/${id}`,
  content: (slug) => `/content/${slug}`,
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch(path, token, options = {}) {
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(apiUrl(path), { ...options, headers })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed (${response.status})`)
  }

  return response
}

export async function fetchAllSubmissionIds(token) {
  const BATCH_SIZE = 100
  const ids = []
  let offset = 0

  for (;;) {
    const response = await apiFetch(
      `${endpoints.submissions}?size=${BATCH_SIZE}&offset=${offset}`,
      token,
    )
    const data = await response.json()
    const batch = data.ids ?? []

    ids.push(...batch)

    if (batch.length < BATCH_SIZE) break
    offset += BATCH_SIZE
  }

  return ids
}
