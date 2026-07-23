import './Footage.css'

function Footage() {
  return (
    <section id="footage" className="page footage">
      <video
        className="footage-video"
        src="/footage.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </section>
  )
}

export default Footage