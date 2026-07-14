import './App.css'
import TheatreTop from './components/TheatreTop'
import TheatreBottom from './components/TheatreBottom'
import Form from './components/Form'

function App() {
  return (
    <div className="scroll-container">
      <TheatreTop />
      <Form />
      <TheatreBottom />
    </div>
  )
}

export default App
