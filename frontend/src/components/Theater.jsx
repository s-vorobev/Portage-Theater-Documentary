import { useState } from 'react'
import TheaterScene from './scene/TheaterScene'
import SceneAsset from './scene/SceneAsset'
import Form from './Form'
import { BACKGROUNDS, ASSETS } from '../lib/sceneAssets'

function Theater() {
  const bg = BACKGROUNDS.theater
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <TheaterScene
      className="theater"
      bgSrc={bg.src}
      bgWidth={bg.width}
      bgHeight={bg.height}
      overlay={
        <Form isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      }
    >
      {/* TEMPORARY TEXT */}
      <text
        x={bg.width / 2}
        y={180}
        textAnchor="middle"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '150px',
          fill: 'white',
          letterSpacing: '10px',
        }}
      >
        The Documentary.
      </text>

      <SceneAsset
        asset={ASSETS.donateNow}
        centerX={1379}
        centerY={1516}
        scale={1.84}
        onClick={() =>
          window.open(
            'https://gofund.me/a7746a6de',
            '_blank',
            'noopener,noreferrer',
          )
        }
        className="scene-button"
      />
      <SceneAsset
        asset={ASSETS.contactUs}
        centerX={2508}
        centerY={1519}
        scale={1.86}
        onClick={() => setIsFormOpen(true)}
        className="scene-button"
      />
      <SceneAsset
        asset={ASSETS.viewOurProgress}
        centerX={1957}
        centerY={1720}
        scale={3.45}
        onClick={() =>
          document
            .getElementById('footage')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
        className="scene-button"
      />
    </TheaterScene>
  )
}

export default Theater