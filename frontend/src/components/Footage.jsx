import './Footage.css'

function Footage() {
  return (
    <section id="footage" className="page footage">
      <div className="video-frame">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube-nocookie.com/embed/_38eWYEJHD4?autoplay=1&mute=1&loop=1&playlist=_38eWYEJHD4&controls=0&rel=0&modestbranding=1&iv_load_policy=3"
          title="Documentary footage"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="video-overlay" />
      </div>
    </section>
  )
}

export default Footage
