import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './useIsMobile'

function mockMatchMedia(initialMatches) {
  let changeHandler = null

  const mql = {
    matches: initialMatches,
    media: '',
    addEventListener: vi.fn((event, handler) => {
      if (event === 'change') changeHandler = handler
    }),
    removeEventListener: vi.fn(),
  }

  window.matchMedia = vi.fn().mockImplementation((query) => {
    mql.media = query
    return mql
  })

  return {
    mql,
    triggerChange(matches) {
      mql.matches = matches
      act(() => {
        changeHandler?.({ matches })
      })
    },
  }
}

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when the media query initially matches', () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('returns false when the media query initially does not match', () => {
    mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('updates when the media query change event fires', () => {
    const { triggerChange } = mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    triggerChange(true)

    expect(result.current).toBe(true)
  })

  it('builds the media query string using the given breakpoint', () => {
    const { mql } = mockMatchMedia(false)

    renderHook(() => useIsMobile(768))

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)')
    expect(mql.media).toBe('(max-width: 768px)')
  })

  it('defaults to a 1024px breakpoint when none is provided', () => {
    mockMatchMedia(false)

    renderHook(() => useIsMobile())

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1024px)')
  })

  it('removes the change listener on unmount', () => {
    const { mql } = mockMatchMedia(false)

    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('re-subscribes when the breakpoint changes', () => {
    mockMatchMedia(false)

    const { rerender } = renderHook(({ breakpoint }) => useIsMobile(breakpoint), {
      initialProps: { breakpoint: 768 },
    })

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)')

    rerender({ breakpoint: 480 })

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 480px)')
  })
})
