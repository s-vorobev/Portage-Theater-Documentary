const KB = 1024
const MB = 1024 * KB
const GB = 1024 * MB

export function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function formatBytes(bytes) {
  if (bytes < MB) return `${Math.round(bytes / KB)}KB`
  if (bytes < GB) return `${Math.round(bytes / MB)}MB`
  return `${Math.round(bytes / GB)}GB`
}
