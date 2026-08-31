import { Routes, Route } from 'react-router-dom'
import './App.css'
import Exterior from './scenes/Exterior/Exterior'
import Interior from './scenes/Interior/Interior'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Exterior />} />
      <Route path="/interior" element={<Interior />} />
    </Routes>
  )
}

export default App
