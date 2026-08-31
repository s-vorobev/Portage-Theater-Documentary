import { useNavigate } from 'react-router-dom'
import './Interior.css'
import TheaterScene from '../../components/TheaterScene'
import Footage from '../../components/Footage'
import { useIsMobile } from '../../hooks/useIsMobile'

const FRAME_WIDTH = 4209
const FRAME_HEIGHT = 2367
const CUTOUT = { x: 1387, y: 565, width: 1365, height: 1155 }

function Interior() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

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
      overlay={backButton}
    >
      <foreignObject
        x={CUTOUT.x}
        y={CUTOUT.y}
        width={CUTOUT.width}
        height={CUTOUT.height}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="interior-video-wrap"
        >
          <Footage className="interior-video" />
        </div>
      </foreignObject>
    </TheaterScene>
  )
}

export default Interior
