import { describe, it, expect } from 'vitest'
import { pageWindow, PAGE_WINDOW } from './pagination.js'

describe('pageWindow', () => {
  it('returns every page when there are fewer than the window', () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3])
  })

  it('shows the first window with a trailing ellipsis for long lists', () => {
    expect(pageWindow(1, 10)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis'])
  })

  it('shows both ellipses around a middle page', () => {
    expect(pageWindow(5, 10)).toEqual([
      'start-ellipsis',
      3,
      4,
      5,
      6,
      7,
      'end-ellipsis',
    ])
  })

  it('shows a leading ellipsis and the last window at the end', () => {
    expect(pageWindow(10, 10)).toEqual(['start-ellipsis', 6, 7, 8, 9, 10])
  })

  it('always shows exactly PAGE_WINDOW page numbers when scrolling', () => {
    const pages = pageWindow(4, 9).filter((item) => typeof item === 'number')
    expect(pages).toHaveLength(PAGE_WINDOW)
  })
})
