const BG_WIDTH = 6010
const BG_HEIGHT = 2580

const TAPE_NATIVE_WIDTH = 1280
const TAPE_NATIVE_HEIGHT = 720
const TAPE_ASPECT = TAPE_NATIVE_WIDTH / TAPE_NATIVE_HEIGHT

function tapeRect(centerX, centerY, scale, rotateDeg) {
  const width = TAPE_NATIVE_WIDTH * scale
  const height = width / TAPE_ASPECT
  const x = centerX - width / 2
  const y = centerY - height / 2
  return { x, y, width, height, transform: `rotate(${rotateDeg} ${centerX} ${centerY})` }
}

function TheatreBottom() {
  const left  = tapeRect(3005, 1985, 4.8, 6)
  const right = tapeRect(3005, 1985, 4.8, -6)

  return (
    <section className="page theatre-bottom">
      <svg
        className="page-bg"
        viewBox={`0 0 ${BG_WIDTH} ${BG_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <image href="/theatre_bottom.png" x="0" y="0" width={BG_WIDTH} height={BG_HEIGHT} />

        <image
          href="/caution_tape.png"
          className="tape-img"
          x={left.x} y={left.y}
          width={left.width} height={left.height}
          transform={left.transform}
        />
        <image
          href="/caution_tape.png"
          className="tape-img"
          x={right.x} y={right.y}
          width={right.width} height={right.height}
          transform={right.transform}
        />
      </svg>

      <div className="content-overlay">
        <div className="sign-zone"/>
        <div className="button-zone"/>
      </div>
    </section>
  )
}

export default TheatreBottom