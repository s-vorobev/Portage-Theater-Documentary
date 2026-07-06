import { describe, it, expect } from 'vitest'
import { placeAsset, ASSETS, BACKGROUNDS } from './sceneAssets'

describe('placeAsset', () => {
  it('centers the asset around the given point at scale 1', () => {
    const result = placeAsset(ASSETS.cautionTape, {
      centerX: 1000,
      centerY: 500,
      scale: 1,
    })

    expect(result.x).toBe(1000 - 1280 / 2)
    expect(result.y).toBe(500 - 720 / 2)
    expect(result.width).toBe(1280)
    expect(result.height).toBe(720)
  })

  it('scales width and height proportionally', () => {
    const result = placeAsset(ASSETS.cautionTape, {
      centerX: 0,
      centerY: 0,
      scale: 2.5,
    })

    expect(result.width).toBe(1280 * 2.5)
    expect(result.height).toBe(720 * 2.5)
  })

  it('defaults to scale 1 and rotateDeg 0 when not provided', () => {
    const result = placeAsset(ASSETS.cautionTape, {
      centerX: 100,
      centerY: 100,
    })

    expect(result.width).toBe(1280)
    expect(result.transform).toBeUndefined()
  })

  it('includes a rotate transform centered on the asset when rotateDeg is set', () => {
    const result = placeAsset(ASSETS.cautionTape, {
      centerX: 300,
      centerY: 200,
      scale: 1,
      rotateDeg: 6,
    })

    expect(result.transform).toBe('rotate(6 300 200)')
  })

  it('carries through the asset source as href', () => {
    const result = placeAsset(ASSETS.cautionTape, {
      centerX: 0,
      centerY: 0,
    })

    expect(result.href).toBe(ASSETS.cautionTape.src)
  })
})

describe('BACKGROUNDS registry', () => {
  it('has the expected dimensions for theatreBottom', () => {
    expect(BACKGROUNDS.theatreBottom.width).toBe(6010)
    expect(BACKGROUNDS.theatreBottom.height).toBe(2580)
  })

  it('has the expected dimensions for theatreTop', () => {
    expect(BACKGROUNDS.theatreTop.width).toBe(6010)
    expect(BACKGROUNDS.theatreTop.height).toBe(2580)
  })
})
