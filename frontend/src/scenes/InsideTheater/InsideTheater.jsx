import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './InsideTheater.css'
import Footage from '../../components/Footage'

const FRAME_WIDTH = 4209
const FRAME_HEIGHT = 2367
const CUTOUT = { centerX: 2069, centerY: 1142, width: 1365, height: 1155 }

function cutoutRect(viewportWidth, viewportHeight) {
  const scale = Math.max(
    viewportWidth / FRAME_WIDTH,
    viewportHeight / FRAME_HEIGHT,
  )
  const displayedWidth = FRAME_WIDTH * scale
  const displayedHeight = FRAME_HEIGHT * scale
  const offsetX = (displayedWidth - viewportWidth) / 2
  const offsetY = (displayedHeight - viewportHeight) / 2

  return {
    left: CUTOUT.centerX * scale - (CUTOUT.width * scale) / 2 - offsetX,
    top: CUTOUT.centerY * scale - (CUTOUT.height * scale) / 2 - offsetY,
    width: CUTOUT.width * scale,
    height: CUTOUT.height * scale,
  }
}

function InsideTheater() {
  const navigate = useNavigate()
  const [rect, setRect] = useState(() =>
    cutoutRect(window.innerWidth, window.innerHeight),
  )

  useEffect(() => {
    const onResize = () =>
      setRect(cutoutRect(window.innerWidth, window.innerHeight))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section className="page inside-theater">
      <Footage className="inside-theater-video" style={rect} />
      <img className="inside-theater-frame" src="/inside_theater.png" alt="" />
      <button
        type="button"
        className="inside-theater-back"
        onClick={() => navigate('/')}
        aria-label="Back"
      >
        ←
      </button>
    </section>
  )
}

export default InsideTheater
