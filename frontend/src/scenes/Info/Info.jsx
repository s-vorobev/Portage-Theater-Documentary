import { useEffect, useState } from 'react'
import { motion, useTransform } from 'motion/react'
import './Info.css'
import { apiUrl, endpoints } from '../../lib/api'
import { contentToHtml } from '../../lib/richText'
import { RISE } from '../../lib/animation'
import Footer from '../../components/Footer'

const INFO_SLUG = 'main_info'

function Info({ reveal }) {
  const [body, setBody] = useState('')

  const contentY = useTransform(reveal, [0, 1], [RISE.infoText, 0])

  useEffect(() => {
    let isActive = true

    async function loadContent() {
      try {
        const response = await fetch(apiUrl(endpoints.content(INFO_SLUG)))
        if (!response.ok) return

        const data = await response.json()
        if (isActive) setBody(data.body ?? '')
      } catch (err) {
        console.log(err)
      }
    }

    loadContent()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <section id="info" className="page info">
      <motion.div
        className="info-content"
        style={{ y: contentY, opacity: reveal }}
      >
        <div
          className="info-text"
          // Content is sanitized in contentToHtml; it's admin-authored rich text.
          dangerouslySetInnerHTML={{ __html: contentToHtml(body) }}
        />
      </motion.div>

      <Footer reveal={reveal} />
    </section>
  )
}

export default Info
