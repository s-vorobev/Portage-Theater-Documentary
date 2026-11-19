// Parses an HTTP Range header against a known object size.
// Returns one of:
//   { type: 'none' }                            — no (or malformed) Range header
//   { type: 'satisfiable', start, end }         — inclusive byte range
//   { type: 'unsatisfiable' }                   — Range that can't be satisfied
export function parseRange(header, size) {
  if (!header) return { type: 'none' }

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!match) return { type: 'none' }

  const [, startRaw, endRaw] = match
  const hasStart = startRaw !== ''
  const hasEnd = endRaw !== ''

  if (!hasStart && !hasEnd) return { type: 'none' }

  if (!hasStart) {
    // Suffix range: last N bytes.
    const suffixLength = Number(endRaw)
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
      return { type: 'unsatisfiable' }
    }
    if (suffixLength >= size) {
      return { type: 'satisfiable', start: 0, end: size - 1 }
    }
    return { type: 'satisfiable', start: size - suffixLength, end: size - 1 }
  }

  const start = Number(startRaw)
  if (!Number.isFinite(start) || start < 0 || start >= size) {
    return { type: 'unsatisfiable' }
  }

  const end = hasEnd ? Math.min(Number(endRaw), size - 1) : size - 1
  if (!Number.isFinite(end) || end < start) {
    return { type: 'unsatisfiable' }
  }

  return { type: 'satisfiable', start, end }
}
