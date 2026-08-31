import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWindowWidth } from './useWindowWidth'

function setWindowWidth(width) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

describe('useWindowWidth', () => {
  const originalInnerWidth = window.innerWidth

  beforeEach(() => {
    setWindowWidth(1024)
  })

  afterEach(() => {
    setWindowWidth(originalInnerWidth)
  })

  it('returns the current window.innerWidth on initial render', () => {
    setWindowWidth(500)

    const { result } = renderHook(() => useWindowWidth())

    expect(result.current).toBe(500)
  })

  it('updates when the window is resized', () => {
    setWindowWidth(400)

    const { result } = renderHook(() => useWindowWidth())

    expect(result.current).toBe(400)

    act(() => {
      setWindowWidth(900)
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toBe(900)
  })

  it('reflects multiple consecutive resize events', () => {
    setWindowWidth(320)

    const { result } = renderHook(() => useWindowWidth())

    act(() => {
      setWindowWidth(600)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(600)

    act(() => {
      setWindowWidth(1200)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(1200)
  })

  it('removes the resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useWindowWidth())
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    removeSpy.mockRestore()
  })

  it('does not update state after unmount when resize fires', () => {
    setWindowWidth(320)

    const { result, unmount } = renderHook(() => useWindowWidth())
    unmount()

    act(() => {
      setWindowWidth(1400)
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toBe(320)
  })
})
