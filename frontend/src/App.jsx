import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import './App.css'
import Home from './scenes/Home'
import Interior from './scenes/Interior/Interior'
import { LENIS_OPTIONS, SNAP } from './lib/animation'

function App() {
  const location = useLocation()
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis(LENIS_OPTIONS)
    lenisRef.current = lenis

    // Snap as soon as the user stops providing scroll input (wheel/touch),
    // instead of waiting for the scroll to fully settle.
    let inputTimer = null

    const snapToNearest = () => {
      const pageHeight = window.innerHeight
      const current = window.scrollY
      const nearest = Math.round(current / pageHeight) * pageHeight
      if (Math.abs(nearest - current) > 1) {
        lenis.scrollTo(nearest, {
          lerp: 0,
          duration: SNAP.duration,
          easing: SNAP.easing,
        })
      }
    }

    const onInput = () => {
      clearTimeout(inputTimer)
      inputTimer = setTimeout(snapToNearest, SNAP.inputIdleMs)
    }

    lenis.on('virtual-scroll', onInput)

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      clearTimeout(inputTimer)
      lenis.off('virtual-scroll', onInput)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interior" element={<Interior />} />
    </Routes>
  )
}

export default App
