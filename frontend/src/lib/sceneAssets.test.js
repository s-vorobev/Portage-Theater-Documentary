import { describe, it, expect } from 'vitest'
import { placeAsset, ASSETS } from './sceneAssets.js'

describe('placeAsset', () => {
  it('centers the asset on the given point', () => {
    const result = placeAsset(ASSETS.donateNow, { centerX: 200, centerY: 100 })

    expect(result.width).toBe(ASSETS.donateNow.nativeWidth)
    expect(result.height).toBe(ASSETS.donateNow.nativeHeight)
    expect(result.x).toBe(200 - ASSETS.donateNow.nativeWidth / 2)
    expect(result.y).toBe(100 - ASSETS.donateNow.nativeHeight / 2)
  })

  it('applies a scale factor to the dimensions', () => {
    const result = placeAsset(ASSETS.donateNow, {
      centerX: 0,
      centerY: 0,
      scale: 2,
    })

    expect(result.width).toBe(ASSETS.donateNow.nativeWidth * 2)
    expect(result.height).toBe(ASSETS.donateNow.nativeHeight * 2)
  })

  it('returns a rotate transform only when rotation is requested', () => {
    const noRotation = placeAsset(ASSETS.donateNow, { centerX: 1, centerY: 2 })
    expect(noRotation.transform).toBeUndefined()

    const rotated = placeAsset(ASSETS.donateNow, {
      centerX: 1,
      centerY: 2,
      rotateDeg: 90,
    })
    expect(rotated.transform).toBe('rotate(90 1 2)')
  })

  it('maps the default, hover and click image sources', () => {
    const result = placeAsset(ASSETS.donateNow, { centerX: 0, centerY: 0 })
    expect(result.href).toBe(ASSETS.donateNow.src)
    expect(result.hoverHref).toBe(ASSETS.donateNow.hoverSrc)
    expect(result.clickHref).toBe(ASSETS.donateNow.clickSrc)
  })
})
