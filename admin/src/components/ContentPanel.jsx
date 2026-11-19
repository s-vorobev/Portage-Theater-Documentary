import { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetch, endpoints } from '../lib/api'
import './ContentPanel.css'

const CONTENT_SLUG = 'main_info'

const FONT_SIZES = [
  { label: 'Small', value: '0.85rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Large', value: '1.25rem' },
  { label: 'X-Large', value: '1.6rem' },
  { label: 'XX-Large', value: '2rem' },
]

function ContentPanel({ token, onUnauthorized }) {
  const [body, setBody] = useState('')
  const [savedBody, setSavedBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [showSizes, setShowSizes] = useState(false)

  const editorRef = useRef(null)
  const pendingHydrateRef = useRef(false)

  const loadContent = useCallback(async () => {
    try {
      const response = await apiFetch(endpoints.content(CONTENT_SLUG), token)
      const data = await response.json()
      const nextBody = data.body ?? ''
      setBody(nextBody)
      setSavedBody(nextBody)
      pendingHydrateRef.current = true
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

  // Put the loaded content into the editor DOM once, without clobbering the
  // user's typing on subsequent renders.
  useEffect(() => {
    if (isLoading || !pendingHydrateRef.current || !editorRef.current) return
    editorRef.current.innerHTML = body
    pendingHydrateRef.current = false
  }, [isLoading, body])

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

  function handleInput() {
    setBody(editorRef.current.innerHTML)
  }

  function runCommand(command) {
    document.execCommand(command, false, null)
    handleInput()
  }

  function applyFontSize(size) {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    if (range.collapsed) return

    const span = document.createElement('span')
    span.style.fontSize = size

    try {
      range.surroundContents(span)
    } catch {
      const fragment = range.extractContents()
      span.appendChild(fragment)
      range.insertNode(span)
    }

    selection.removeAllRanges()
    handleInput()
  }

  function handlePaste(event) {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
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

      <div className="content-toolbar">
        <button
          type="button"
          className="content-toolbar-button content-toolbar-bold"
          onMouseDown={(e) => {
            e.preventDefault()
            runCommand('bold')
          }}
          aria-label="Bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className="content-toolbar-button content-toolbar-italic"
          onMouseDown={(e) => {
            e.preventDefault()
            runCommand('italic')
          }}
          aria-label="Italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className="content-toolbar-button content-toolbar-underline"
          onMouseDown={(e) => {
            e.preventDefault()
            runCommand('underline')
          }}
          aria-label="Underline"
          title="Underline"
        >
          U
        </button>

        <div className="content-size-control">
          <button
            type="button"
            className="content-toolbar-button"
            onMouseDown={(e) => {
              e.preventDefault()
              setShowSizes((s) => !s)
            }}
            aria-label="Font size"
            title="Font size"
          >
            Size
          </button>
          {showSizes && (
            <div className="content-size-menu" role="menu">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  role="menuitem"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    applyFontSize(size.value)
                    setShowSizes(false)
                  }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        className="content-editor"
        contentEditable={!isBusy}
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
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
