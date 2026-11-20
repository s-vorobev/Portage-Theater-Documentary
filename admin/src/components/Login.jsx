import { useState } from 'react'
import { apiFetch, endpoints } from '../lib/api'
import './Login.css'

const LOGIN_CHECK_SIZE = 60

function Login({ onAuthenticated }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const value = token.trim()
    if (!value) return

    setError('')
    setIsSubmitting(true)

    try {
      await apiFetch(`${endpoints.submissions}?size=${LOGIN_CHECK_SIZE}`, value)
      onAuthenticated(value)
    } catch (err) {
      if (err.status === 401) {
        setError('Incorrect token. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Admin</h1>
        <p className="login-subtitle">Enter your access token to continue.</p>

        <input
          className="login-input"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Access token"
          autoComplete="current-password"
          autoFocus
        />

        {error && <p className="login-error">{error}</p>}

        <button
          className="login-submit"
          type="submit"
          disabled={isSubmitting || !token.trim()}
        >
          {isSubmitting ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}

export default Login
