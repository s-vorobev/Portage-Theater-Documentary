import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Interior.css'
import TheaterScene from '../../components/TheaterScene'
import Footage from '../../components/Footage'
import { useIsMobile } from '../../hooks/useIsMobile'

const FRAME_WIDTH = 4209
const FRAME_HEIGHT = 2367
const CUTOUT = { x: 1387, y: 565, width: 1365, height: 1155 }

function cutoutRect(viewportWidth, viewportHeight) {
  const scale = viewportHeight / FRAME_HEIGHT
  const renderedWidth = FRAME_WIDTH * scale
  const offsetX = (viewportWidth - renderedWidth) / 2

  return {
    left: offsetX + CUTOUT.x * scale,
    top: CUTOUT.y * scale,
    width: CUTOUT.width * scale,
    height: CUTOUT.height * scale,
  }
}

function Interior() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [rect, setRect] = useState(() =>
    cutoutRect(window.innerWidth, window.innerHeight),
  )

  useEffect(() => {
    const onResize = () =>
      setRect(cutoutRect(window.innerWidth, window.innerHeight))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const backButton = (
    <button
      type="button"
      className="interior-back"
      onClick={() => navigate('/')}
      aria-label="Back"
    >
      ←
    </button>
  )

  if (isMobile) {
    return (
      <section className="page interior">
        <Footage className="interior-video-mobile" />
        {backButton}
      </section>
    )
  }

  return (
    <TheaterScene
      className="interior"
      bgSrc="/inside_theater.png"
      bgWidth={FRAME_WIDTH}
      bgHeight={FRAME_HEIGHT}
      overlay={
        <>
          <Footage className="interior-video" style={rect} />
          {backButton}
        </>
      }
    />
  )
}

export default Interior
