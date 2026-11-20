const API_BASE = import.meta.env.VITE_API_URL
const API_PREFIX = '/api/v1'

export function apiUrl(path) {
  return `${API_BASE}${API_PREFIX}${path}`
}

export const endpoints = {
  submit: '/submit',
  submissions: '/submissions',
  submission: (id) => `/submissions/${id}`,
  footage: '/media/footage',
  footageMobile: '/media/footage-mobile',
  content: (slug) => `/content/${slug}`,
}
