import TheatreScene from './scene/TheatreScene'
import SceneAsset from './scene/SceneAsset'
import Form from './Form'
import { BACKGROUNDS, ASSETS } from '../lib/sceneAssets'

function Theatre() {
  const bg = BACKGROUNDS.theatre

  return (
    <TheatreScene
      className="theatre"
      bgSrc={bg.src}
      bgWidth={bg.width}
      bgHeight={bg.height}
      overlay={<Form />}
    >
      <SceneAsset
        asset={ASSETS.donateNow}
        centerX={1227}
        centerY={1895}
        scale={2.33}
        onClick={() => console.log('donate now clicked')}
        className="scene-button"
      />
      <SceneAsset
        asset={ASSETS.contactUs}
        centerX={2655}
        centerY={1898}
        scale={2.36}
        onClick={() => console.log('contact us clicked')}
        className="scene-button"
      />
      <SceneAsset
        asset={ASSETS.viewOurProgress}
        centerX={1957}
        centerY={2150}
        scale={3.85}
        onClick={() => console.log('view our progress clicked')}
        className="scene-button"
      />
    </TheatreScene>
  )
}

export default Theatre