import React from 'react';

export default function App() {
  const styles = {
    container: {
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    bgLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1,
      backgroundImage: 'url("https://i.ibb.co/7dyJQHp6/portage-front-png-trasn-back.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    videoLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1.5,
      objectFit: 'cover',
    },
    theaterLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 2,
      backgroundImage: 'url("https://images.unsplash.com/photo-1514306193469-f380741d167f?q=80&w=2000")',
      backgroundSize: 'cover',
      backgroundPosition: '50% 0%',
    },
    uiLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 3,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    cautionTape: {
      width: '100%',
      height: '150px',
      backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/039/665/264/small/warning-tape-and-police-line-black-and-yellow-line-striped-warning-danger-tape-restriction-tapes-3d-rendering-png.png")',
      backgroundSize: '100% 100%',
      opacity: 0.8,
    },
    buttonContainer: {
      position: 'absolute',
      top: '77%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgLayer}></div>
      
      <video 
        style={styles.videoLayer}
        src="https://cdn.pixabay.com/video/2022/11/13/138891-770540401_large.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      <div style={styles.theaterLayer}></div>

      <div style={styles.uiLayer}>
        <div style={styles.buttonContainer}>
          <a 
            href="https://www.gofundme.com/f/a-documentary-on-the-portage-theaters-revival" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block',
              padding: '20px 40px', 
              fontSize: '1.2rem', 
              textDecoration: 'none',
              color: 'white',
              background: '#dc2626', // Solid red
              border: 'none', 
              borderRadius: '0px', // No rounded edges
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease-out' 
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            DONATE
          </a>
        </div>
        <div style={styles.cautionTape}></div>
      </div>
    </div>
  );
}
