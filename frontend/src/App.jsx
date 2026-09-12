import { Routes, Route } from 'react-router-dom'
import './App.css'
import Exterior from './scenes/Exterior/Exterior'
import Interior from './scenes/Interior/Interior'
import Info from './scenes/Info/Info'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="scroll-container">
            <Exterior />
            <Info />
          </div>
        }
      />
      <Route path="/interior" element={<Interior />} />
    </Routes>
  )
}

export default App
