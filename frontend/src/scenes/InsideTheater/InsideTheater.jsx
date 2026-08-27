import { useNavigate } from 'react-router-dom'
import './InsideTheater.css'
import Footage from '../../components/Footage'

// TODO(mobile): This page is desktop-only for now. To support mobile later:
//   - Serve a mobile-specific frame image (like theater_mobile.png) so the
//     frame fills a portrait viewport instead of a 16:9 desktop one.
//   - Re-position/re-size the footage so it lines up with the mobile frame's
//     center cutout, and keep the back button above the frame.
function InsideTheater() {
  const navigate = useNavigate()

  return (
    <section className="page inside-theater">
      <Footage className="inside-theater-video" />
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
