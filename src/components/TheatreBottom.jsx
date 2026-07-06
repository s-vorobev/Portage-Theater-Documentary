import TheatreScene from './scene/TheatreScene'
import SceneAsset from './scene/SceneAsset'
import { ASSETS } from '../lib/sceneAssets'

function TheatreBottom() {
  return (
    <TheatreScene
      className="theatre-bottom"
      bgSrc="/theatre_bottom.png"
      bgWidth={6010}
      bgHeight={2580}
    >
      <SceneAsset asset={ASSETS.cautionTape} centerX={3005} centerY={1985} scale={4.8} rotateDeg={6} />
      <SceneAsset asset={ASSETS.cautionTape} centerX={3005} centerY={1985} scale={4.8} rotateDeg={-6} />
    </TheatreScene>
  )
}

export default TheatreBottom