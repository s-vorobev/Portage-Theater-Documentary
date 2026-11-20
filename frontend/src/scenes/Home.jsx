import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Exterior from './Exterior/Exterior'
import Info from './Info/Info'
import { HOME_TRANSITION } from '../lib/animation'
import './Home.css'

function Home() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const t = HOME_TRANSITION

  // Cinematic focus-pull: the photo zooms in, blurs, and darkens…
  const exteriorScale = useTransform(scrollYProgress, t.exteriorScale.input, t.exteriorScale.output)
  const exteriorBlur = useTransform(scrollYProgress, t.exteriorBlur.input, t.exteriorBlur.output)
  const exteriorDim = useTransform(scrollYProgress, t.exteriorDim.input, t.exteriorDim.output)

  // …while the black screen fades in over it and settles.
  const infoOpacity = useTransform(scrollYProgress, t.infoOpacity.input, t.infoOpacity.output)
  const infoScale = useTransform(scrollYProgress, t.infoScale.input, t.infoScale.output)

  // Only let the info layer capture clicks once it's actually covering the
  // page — otherwise it invisibly blocks the exterior's buttons.
  const infoPointerEvents = useTransform(infoOpacity, (latest) =>
    latest >= 0.99 ? 'auto' : 'none',
  )

  // Text and logos rise in a touch later than the screen itself.
  const textProgress = useTransform(scrollYProgress, t.textReveal.input, t.textReveal.output)

  return (
    <div ref={containerRef} className="home">
      <div className="home-viewport">
        <motion.div
          className="home-layer home-layer-exterior"
          style={{ scale: exteriorScale, filter: exteriorBlur }}
        >
          <Exterior />
          <motion.div className="home-dim" style={{ opacity: exteriorDim }} />
        </motion.div>

        <motion.div
          className="home-layer home-layer-info"
          style={{
            opacity: infoOpacity,
            scale: infoScale,
            pointerEvents: infoPointerEvents,
          }}
        >
          <Info reveal={textProgress} />
        </motion.div>
      </div>
    </div>
  )
}

export default Home
