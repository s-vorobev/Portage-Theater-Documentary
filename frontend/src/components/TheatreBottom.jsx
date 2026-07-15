import TheatreScene from './scene/TheatreScene'
import SceneAsset from './scene/SceneAsset'
import { BACKGROUNDS, ASSETS } from '../lib/sceneAssets'

function TheatreBottom() {
  const bg = BACKGROUNDS.theatreBottom
  return (
    <TheatreScene
      className="theatre-bottom"
      bgSrc={bg.src}
      bgWidth={bg.width}
      bgHeight={bg.height}
    >
      <SceneAsset
        asset={ASSETS.cautionTape}
        centerX={3005}
        centerY={1985}
        scale={4.8}
        rotateDeg={6}
        className="tape-img"
      />
      <SceneAsset
        asset={ASSETS.cautionTape}
        centerX={3005}
        centerY={1985}
        scale={4.8}
        rotateDeg={-6}
        className="tape-img"
      />
    </TheatreScene>
  )
}

export default TheatreBottom
