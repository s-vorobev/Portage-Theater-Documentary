import { useCallback, useEffect, useState } from 'react'
import { apiFetch, endpoints } from '../lib/api'
import './ContentPanel.css'

const CONTENT_SLUG = 'main_info'

function ContentPanel({ token, onUnauthorized }) {
  const [body, setBody] = useState('')
  const [savedBody, setSavedBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const loadContent = useCallback(async () => {
    try {
      const response = await apiFetch(endpoints.content(CONTENT_SLUG), token)
      const data = await response.json()
      const nextBody = data.body ?? ''
      setBody(nextBody)
      setSavedBody(nextBody)
      setError('')
      setStatus('')
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      setError('Could not load content.')
    } finally {
      setIsLoading(false)
    }
  }, [token, onUnauthorized])

  useEffect(() => {
    const id = setTimeout(loadContent, 0)
    return () => clearTimeout(id)
  }, [loadContent])

  async function handleSave() {
    setIsSaving(true)
    setError('')
    setStatus('')

    try {
      await apiFetch(endpoints.content(CONTENT_SLUG), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      setSavedBody(body)
      setStatus('Saved.')
    } catch (err) {
      if (err.status === 401) {
        onUnauthorized()
        return
      }
      setError('Could not save content.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    setIsLoading(true)
    setError('')
    setStatus('')
    loadContent()
  }

  const isDirty = body !== savedBody
  const isBusy = isLoading || isSaving

  return (
    <section className="content-panel">
      <header className="panel-header">
        <h1 className="panel-title">Edit Content</h1>
        <span className="panel-count">{CONTENT_SLUG}</span>
      </header>

      {error && <p className="panel-message panel-message-error">{error}</p>}

      <label className="content-label" htmlFor="content-body">
        Body
      </label>
      <textarea
        id="content-body"
        className="content-textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={isBusy}
      />

      <div className="content-actions">
        <button
          type="button"
          className="content-button content-button-primary"
          onClick={handleSave}
          disabled={isBusy || !isDirty}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="content-button"
          onClick={handleReset}
          disabled={isBusy}
        >
          Reset
        </button>
        {status && <span className="content-status">{status}</span>}
      </div>
    </section>
  )
}

export default ContentPanel
