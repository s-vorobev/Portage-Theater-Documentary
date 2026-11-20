// Expands configured hosts into every origin the browser might send for them:
// http/https × www/non-www. A bare "example.com" therefore accepts both
// https://example.com and https://www.example.com (and their http forms).
export function expandOrigins(values) {
  const origins = new Set()
  for (const value of values) {
    if (!value) continue
    const host = value.replace(/^https?:\/\//i, '').split('/')[0]
    const bare = host.replace(/^www\./i, '')
    const isLocal =
      bare === 'localhost' ||
      bare.startsWith('localhost:') ||
      bare.startsWith('127.')
    const hosts = isLocal ? [bare] : [bare, `www.${bare}`]
    for (const h of hosts) {
      origins.add(`https://${h}`)
      origins.add(`http://${h}`)
    }
  }
  return [...origins]
}
