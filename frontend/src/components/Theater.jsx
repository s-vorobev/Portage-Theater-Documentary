import { useState } from 'react'
import TheaterScene from './scene/TheaterScene'
import SceneAsset from './scene/SceneAsset'
import Form from './Form'
import { BACKGROUNDS, ASSETS } from '../lib/sceneAssets'
import { useIsMobile } from '../lib/useIsMobile'
import { useWindowWidth } from '../lib/useWindowWidth'
import './Theater.css'

const POSITIONS = {
  desktop: {
    donateNow: { centerX: 1379, centerY: 1516, scale: 1.84 },
    contactUs: { centerX: 2508, centerY: 1519, scale: 1.86 },
    viewOurProgress: { centerX: 1957, centerY: 1720, scale: 3.22 },
  },
  mobile: {
    donateNow: { centerX: 433, centerY: 2384, scale: 2.32 },
    contactUs: { centerX: 1859, centerY: 2392, scale: 2.35 },
    viewOurProgress: { centerX: 1138, centerY: 2640, scale: 3.82 },
  },
}

function getMobileTitleTop(width) {
  if (width >= 800) return 8
  if (width >= 550) return 11
  if (width >= 380) return 12
  return 8
}

function Theater() {
  const isMobile = useIsMobile()
  const width = useWindowWidth()
  const bg = isMobile ? BACKGROUNDS.theaterMobile : BACKGROUNDS.theater
  const pos = isMobile ? POSITIONS.mobile : POSITIONS.desktop
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <TheaterScene
      className="theater"
      bgSrc={bg.src}
      bgWidth={bg.width}
      bgHeight={bg.height}
      overlay={
        <>
          {isMobile && (
            <div
              className="mobile-title-wrapper"
              style={{ top: `${getMobileTitleTop(width)}%` }}
            >
              <h1 className="mobile-title">The Documentary.</h1>
            </div>
          )}
          <Form isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </>
      }
    >
      {/* Desktop-only — SVG text locked to the background's coordinate
          space, which works well at desktop's fixed-ish aspect ratio but
          scales awkwardly across mobile's much wider range of viewport
          widths. Mobile gets its own plain HTML title instead, see
          .mobile-title-wrapper in the overlay above. */}
      {!isMobile && (
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
      )}

      <SceneAsset
        asset={ASSETS.donateNow}
        centerX={pos.donateNow.centerX}
        centerY={pos.donateNow.centerY}
        scale={pos.donateNow.scale}
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
        centerX={pos.contactUs.centerX}
        centerY={pos.contactUs.centerY}
        scale={pos.contactUs.scale}
        onClick={() => setIsFormOpen(true)}
        className="scene-button"
      />
      <SceneAsset
        asset={ASSETS.viewOurProgress}
        centerX={pos.viewOurProgress.centerX}
        centerY={pos.viewOurProgress.centerY}
        scale={pos.viewOurProgress.scale}
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
