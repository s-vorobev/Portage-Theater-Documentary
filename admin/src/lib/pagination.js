export const PAGE_SIZE = 6
export const PAGE_WINDOW = 5

// Builds the list of page numbers (plus ellipsis markers) to show in a
// windowed pagination control. Always shows up to PAGE_WINDOW pages, with the
// active page kept near the middle once the list is long enough to scroll.
export function pageWindow(current, total) {
  if (total <= PAGE_WINDOW) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const end = Math.min(total, Math.max(current + 2, PAGE_WINDOW))
  const start = Math.max(1, end - PAGE_WINDOW + 1)

  const items = []
  if (start > 1) items.push('start-ellipsis')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < total) items.push('end-ellipsis')
  return items
}
