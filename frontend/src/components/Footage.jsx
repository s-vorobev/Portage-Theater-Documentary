import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { apiUrl, endpoints } from '../lib/api'
import './Footage.css'

function SpeakerIcon({ muted }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      {muted ? (
        <>
          <line x1="22" x2="16" y1="9" y2="15" />
          <line x1="16" x2="22" y1="9" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  )
}

function Footage({ className, style }) {
  const isMobile = useIsMobile()
  const videoSrc = isMobile
    ? apiUrl(endpoints.footageMobile)
    : apiUrl(endpoints.footage)

  const videoRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [muted, setMuted] = useState(false)

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
    const video = videoRef.current
    if (!shouldLoad || !video) return

    video.muted = muted
    const start = () => video.play().catch(() => {})

    if (muted) {
      // Muted autoplay is always allowed.
      start()
      return
    }

    // Unmuted: browsers block autoplay-with-sound until the user has
    // interacted with the page, so fall back to the first interaction.
    const events = ['click', 'keydown', 'touchstart', 'pointerdown']
    const onInteract = () => start()

    video.play().catch(() => {
      events.forEach((event) =>
        window.addEventListener(event, onInteract, {
          once: true,
          passive: true,
        }),
      )
    })

    return () =>
      events.forEach((event) => window.removeEventListener(event, onInteract))
  }, [shouldLoad, muted])

  // Stop playback and release the stream when the component unmounts, so the
  // video doesn't keep playing (and downloading) after leaving the page.
  useEffect(() => {
    const video = videoRef.current
    return () => {
      if (!video) return
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [])

  const toggleMute = () => setMuted((m) => !m)

  return (
    <div className={className} style={style}>
      <video
        ref={videoRef}
        key={videoSrc}
        className="footage-video"
        src={shouldLoad ? videoSrc : undefined}
        preload="none"
        fetchPriority="low"
        loop
        playsInline
        controls={false}
      />
      <button
        type="button"
        className="footage-mute"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        aria-pressed={!muted}
      >
        <SpeakerIcon muted={muted} />
      </button>
    </div>
  )
}

export default Footage
