import { describe, it, expect } from 'vitest'
import { placeAsset, ASSETS, BACKGROUNDS } from './sceneAssets'

describe('placeAsset', () => {
  it('centers the asset around the given point at scale 1', () => {
    const result = placeAsset(ASSETS.donateNow, {
      centerX: 1000,
      centerY: 500,
      scale: 1,
    })

    expect(result.x).toBe(1000 - 800 / 2)
    expect(result.y).toBe(500 - 300 / 2)
    expect(result.width).toBe(800)
    expect(result.height).toBe(300)
  })

  it('scales width and height proportionally', () => {
    const result = placeAsset(ASSETS.donateNow, {
      centerX: 0,
      centerY: 0,
      scale: 2.5,
    })

    expect(result.width).toBe(800 * 2.5)
    expect(result.height).toBe(300 * 2.5)
  })

  it('defaults to scale 1 and rotateDeg 0 when not provided', () => {
    const result = placeAsset(ASSETS.donateNow, {
      centerX: 100,
      centerY: 100,
    })

    expect(result.width).toBe(800)
    expect(result.transform).toBeUndefined()
  })

  it('includes a rotate transform centered on the asset when rotateDeg is set', () => {
    const result = placeAsset(ASSETS.donateNow, {
      centerX: 300,
      centerY: 200,
      scale: 1,
      rotateDeg: 6,
    })

    expect(result.transform).toBe('rotate(6 300 200)')
  })

  it('carries through default, hover, and click sources', () => {
    const result = placeAsset(ASSETS.donateNow, {
      centerX: 0,
      centerY: 0,
    })

    expect(result.href).toBe(ASSETS.donateNow.src)
    expect(result.hoverHref).toBe(ASSETS.donateNow.hoverSrc)
    expect(result.clickHref).toBe(ASSETS.donateNow.clickSrc)
  })
})

describe('BACKGROUNDS registry', () => {
  it('has the expected dimensions for theatre', () => {
    expect(BACKGROUNDS.theatre.width).toBe(6010)
    expect(BACKGROUNDS.theatre.height).toBe(2580)
  })
})
