import './TheatreScene.css'

function TheatreScene({ bgSrc, bgWidth, bgHeight, className, children, overlay }) {
  return (
    <section className={`page ${className ?? ''}`}>
      <svg className="page-bg" viewBox={`0 0 ${bgWidth} ${bgHeight}`}>
        <image href={bgSrc} x="0" y="0" width={bgWidth} height={bgHeight} />
        {children}
      </svg>
      {overlay}
    </section>
  )
}

export default TheatreScene