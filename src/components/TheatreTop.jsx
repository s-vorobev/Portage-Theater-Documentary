import TheatreScene from './scene/TheatreScene'
import { BACKGROUNDS } from '../lib/sceneAssets'

function TheatreTop() {
  const bg = BACKGROUNDS.theatreTop
  return (
    <TheatreScene
      className="theatre-top"
      bgSrc={bg.src}
      bgWidth={bg.width}
      bgHeight={bg.height}
    />
  )
}

export default TheatreTop
