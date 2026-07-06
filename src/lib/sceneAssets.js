export const ASSETS = {
  cautionTape: { src: '/caution_tape.png', nativeWidth: 1280, nativeHeight: 720 },
}

export function placeAsset(asset, { centerX, centerY, scale = 1, rotateDeg = 0 }) {
  const width = asset.nativeWidth * scale
  const height = asset.nativeHeight * scale
  const x = centerX - width / 2
  const y = centerY - height / 2
  return {
    href: asset.src,
    x, y, width, height,
    transform: rotateDeg ? `rotate(${rotateDeg} ${centerX} ${centerY})` : undefined,
  }
}