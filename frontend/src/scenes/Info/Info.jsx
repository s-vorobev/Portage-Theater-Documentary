import { useEffect, useState } from 'react'
import './Info.css'
import { apiUrl, endpoints } from '../../lib/api'

const INFO_SLUG = 'main_info'

function Info() {
  const [body, setBody] = useState('')

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
      <div className="info-content">
        <p className="info-text">{body}</p>
      </div>

      <footer className="info-footer">
        <div className="info-footer-brand" />

        <div className="info-footer-links">
          <div className="info-footer-column" />
          <div className="info-footer-column" />
          <div className="info-footer-column" />
        </div>
      </footer>
    </section>
  )
}

export default Info
