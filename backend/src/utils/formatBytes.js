const KB = 1024
const MB = 1024 * KB
const GB = 1024 * MB

// Formats a byte count as a human-readable size, e.g. 524288000 -> "500MB".
export function formatBytes(bytes) {
  if (bytes < MB) return `${Math.round(bytes / KB)}KB`
  if (bytes < GB) return `${Math.round(bytes / MB)}MB`
  return `${Math.round(bytes / GB)}GB`
}
