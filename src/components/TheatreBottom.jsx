import './TheatreBottom.css'
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
      overlay={
        <div className="content-overlay">
          <div className="sign-zone" />
          <div className="button-zone" />
        </div>
      }
    >
      <SceneAsset asset={ASSETS.cautionTape} centerX={2605} centerY={1985} scale={2.5} rotateDeg={6} className="tape-img" />
      <SceneAsset asset={ASSETS.cautionTape} centerX={4405} centerY={1985} scale={2.5} rotateDeg={-6} className="tape-img" />
    </TheatreScene>
  )
}

export default TheatreBottom