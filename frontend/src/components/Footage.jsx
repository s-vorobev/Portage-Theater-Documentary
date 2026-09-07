import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { apiUrl, endpoints } from '../lib/api'

function Footage({ className, style }) {
  const isMobile = useIsMobile()
  const videoSrc = isMobile
    ? apiUrl(endpoints.footageMobile)
    : apiUrl(endpoints.footage)

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
    <video
      ref={videoRef}
      key={videoSrc}
      className={className}
      style={style}
      src={shouldLoad ? videoSrc : undefined}
      preload="none"
      fetchPriority="low"
      autoPlay
      muted
      loop
      playsInline
      controls={false}
    />
  )
}

export default Footage
