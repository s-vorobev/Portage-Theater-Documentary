import { useEffect, useRef, useState } from 'react'
import './Footage.css'
import { useIsMobile } from '../lib/useIsMobile'

function Footage() {
  const isMobile = useIsMobile()
  const API_BASE = import.meta.env.VITE_API_URL
  const videoSrc = isMobile
    ? `${API_BASE}/media/footage-mobile`
    : `${API_BASE}/media/footage`
  const videoRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      const id = setTimeout(() => setShouldLoad(true), 0)
      return () => clearTimeout(id)
    }

    const onLoad = () => setShouldLoad(true)
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [shouldLoad])

  return (
    <section id="footage" className="page footage">
      <video
        ref={videoRef}
        key={videoSrc}
        className="footage-video"
        src={shouldLoad ? videoSrc : undefined}
        preload="none"
        fetchPriority="low"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
    </section>
  )
}

export default Footage
