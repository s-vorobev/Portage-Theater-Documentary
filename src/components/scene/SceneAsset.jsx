import { placeAsset } from '../../lib/sceneAssets'

function SceneAsset({
  asset,
  centerX,
  centerY,
  scale = 1,
  rotateDeg = 0,
  className,
}) {
  const { href, x, y, width, height, transform } = placeAsset(asset, {
    centerX,
    centerY,
    scale,
    rotateDeg,
  })
  return (
    <image
      href={href}
      className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      transform={transform}
    />
  )
}

export default SceneAsset
