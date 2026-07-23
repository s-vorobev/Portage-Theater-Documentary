import './Footage.css'
import { useIsMobile } from '../lib/useIsMobile'

function Footage() {
  const isMobile = useIsMobile()
  const videoSrc = isMobile ? '/footage_mobile.mov' : '/footage.mp4'

  return (
    <section id="footage" className="page footage">
      <video
        key={videoSrc}
        className="footage-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />
    </section>
  )
}

export default Footage
