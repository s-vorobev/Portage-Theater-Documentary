import './TheatreTop.css'
import TheatreScene from './scene/TheatreScene'

function TheatreTop() {
  return (
    <TheatreScene
      className="theatre-top"
      bgSrc="/theatre_top.png"
      bgWidth={6010}
      bgHeight={2580}
    />
  )
}

export default TheatreTop