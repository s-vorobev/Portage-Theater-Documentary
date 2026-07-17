import { useState } from 'react'
import { placeAsset } from '../../lib/sceneAssets'

function SceneAsset({
  asset,
  centerX,
  centerY,
  scale = 1,
  rotateDeg = 0,
  className,
  onClick,
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const { href, hoverHref, clickHref, x, y, width, height, transform } =
    placeAsset(asset, {
      centerX,
      centerY,
      scale,
      rotateDeg,
    })

  let currentHref = href
  if (pressed && clickHref) currentHref = clickHref
  else if (hovered && hoverHref) currentHref = hoverHref

  return (
    <image
      href={currentHref}
      className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      transform={transform}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    />
  )
}

export default SceneAsset
