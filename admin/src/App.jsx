import { useCallback, useState } from 'react'
import Login from './components/Login'
import SubmissionsPanel from './components/SubmissionsPanel'
import ContentPanel from './components/ContentPanel'
import './App.css'

const TOKEN_KEY = 'portage-admin-token'

function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY) ?? '',
  )

  const handleAuthenticated = useCallback((nextToken) => {
    sessionStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
  }, [])

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
  }, [])

  if (!token) {
    return <Login onAuthenticated={handleAuthenticated} />
  }

  return (
    <main className="admin-layout">
      <SubmissionsPanel token={token} onUnauthorized={handleUnauthorized} />
      <ContentPanel token={token} onUnauthorized={handleUnauthorized} />
    </main>
  )
}

export default App
