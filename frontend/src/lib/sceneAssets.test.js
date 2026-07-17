import { describe, it, expect } from 'vitest'
import { placeAsset, ASSETS, BACKGROUNDS } from './sceneAssets'

describe('placeAsset', () => {
  it('centers the asset around the given point at scale 1', () => {
    const asset = ASSETS.donateNow
    const result = placeAsset(asset, {
      centerX: 1000,
      centerY: 500,
      scale: 1,
    })

    expect(result.x).toBe(1000 - asset.nativeWidth / 2)
    expect(result.y).toBe(500 - asset.nativeHeight / 2)
    expect(result.width).toBe(asset.nativeWidth)
    expect(result.height).toBe(asset.nativeHeight)
  })

  it('scales width and height proportionally', () => {
    const asset = ASSETS.donateNow
    const result = placeAsset(asset, {
      centerX: 0,
      centerY: 0,
      scale: 2.5,
    })

    expect(result.width).toBe(asset.nativeWidth * 2.5)
    expect(result.height).toBe(asset.nativeHeight * 2.5)
  })

  it('defaults to scale 1 and rotateDeg 0 when not provided', () => {
    const asset = ASSETS.donateNow
    const result = placeAsset(asset, {
      centerX: 100,
      centerY: 100,
    })

    expect(result.width).toBe(asset.nativeWidth)
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
    const asset = ASSETS.donateNow
    const result = placeAsset(asset, {
      centerX: 0,
      centerY: 0,
    })

    expect(result.href).toBe(asset.src)
    expect(result.hoverHref).toBe(asset.hoverSrc)
    expect(result.clickHref).toBe(asset.clickSrc)
  })

  it('works correctly for each registered button asset', () => {
    for (const [name, asset] of Object.entries(ASSETS)) {
      const result = placeAsset(asset, { centerX: 500, centerY: 500 })
      expect(result.width, `${name} width`).toBe(asset.nativeWidth)
      expect(result.height, `${name} height`).toBe(asset.nativeHeight)
      expect(result.href, `${name} href`).toBe(asset.src)
    }
  })
})

describe('BACKGROUNDS registry', () => {
  it('has positive dimensions for theatre', () => {
    expect(BACKGROUNDS.theatre.width).toBeGreaterThan(0)
    expect(BACKGROUNDS.theatre.height).toBeGreaterThan(0)
  })
})