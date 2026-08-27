import { Routes, Route } from 'react-router-dom'
import './App.css'
import Exterior from './scenes/Exterior/Exterior'
import InsideTheater from './scenes/InsideTheater/InsideTheater'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Exterior />} />
      <Route path="/inside-theater" element={<InsideTheater />} />
    </Routes>
  )
}

export default App
