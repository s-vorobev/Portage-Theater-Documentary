import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  TextStyle,
  Color,
  FontFamily,
  FontSize,
} from '@tiptap/extension-text-style'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { apiFetch, endpoints } from '../lib/api'
import './ContentPanel.css'

const CONTENT_SLUG = 'main_info'

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72]

const FONT_FAMILIES = [
  { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
  { label: 'Courier New', value: "'Courier New', monospace" },
]

const PRESET_COLORS = [
  '#ffffff',
  '#000000',
  '#a61b36',
  '#b23a3a',
  '#ffe08a',
  '#d9d9d9',
  '#999999',
]

const HEX_RE = /^#([0-9a-f]{6})$/i

function ContentPanel({ token, onUnauthorized }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [showSizes, setShowSizes] = useState(false)
  const [showFonts, setShowFonts] = useState(false)
  const [showColor, setShowColor] = useState(false)
  const [color, setColor] = useState('#ffffff')

  const colorControlRef = useRef(null)

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, FontFamily, FontSize],
    content: '',
    onUpdate: () => setIsDirty(true),
  })

  // Fetch the stored content. Pure async — returns a result object so callers
  // can handle the outcome (and setState) from their own async callbacks.
  const loadContent = useCallback(async () => {
    try {
      const response = await apiFetch(endpoints.content(CONTENT_SLUG), token)
      const data = await response.json()
      return { body: data.body ?? '' }
    } catch (err) {
      if (err.status === 401) return { unauthorized: true }
      return { error: true }
    }
  }, [token])

  const handleLoadResult = useCallback(
    (result) => {
      if (result.unauthorized) {
        onUnauthorized()
        return
      }
      if (result.error) {
        setError('Could not load content.')
        setIsLoading(false)
        return
      }
      // emitUpdate: false so loading doesn't mark the document as dirty.
      editor?.commands.setContent(result.body, { emitUpdate: false })
      setIsDirty(false)
      setError('')
      setStatus('')
      setIsLoading(false)
    },
    [editor, onUnauthorized],
  )

  useEffect(() => {
    if (!editor) return
    let isActive = true
    loadContent().then((result) => {
      if (isActive) handleLoadResult(result)
    })
    return () => {
      isActive = false
    }
  }, [editor, loadContent, handleLoadResult])

  // Close the color popover when the user clicks anywhere outside it.
  useEffect(() => {
    if (!showColor) return
    const onDown = (e) => {
      if (
        colorControlRef.current &&
        !colorControlRef.current.contains(e.target)
      ) {
        setShowColor(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [showColor])

  async function handleSave() {
    if (!editor) return
    setIsSaving(true)
    setError('')
    setStatus('')

    try {
      const html = editor.getHTML()
      await apiFetch(endpoints.content(CONTENT_SLUG), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: html }),
      })
      setIsDirty(false)
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
    setError('')
    setStatus('')
    setIsLoading(true)
    loadContent().then(handleLoadResult)
  }

  // Apply a style command to the current selection, or to the whole document
  // when nothing is selected.
  function applyStyle(build) {
    if (!editor) return
    const chain = editor.chain().focus()
    if (editor.state.selection.empty) {
      chain.selectAll()
    }
    build(chain).run()
  }

  function handleColorChange(nextColor) {
    if (!HEX_RE.test(nextColor)) return
    setColor(nextColor)
    if (!editor) return
    // No .focus() here: the picker owns focus while dragging/typing, so we
    // apply directly to the editor's current selection state.
    const chain = editor.chain()
    if (editor.state.selection.empty) {
      chain.selectAll()
    }
    chain.setColor(nextColor).run()
  }

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
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
          aria-label="Bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className="content-toolbar-button content-toolbar-italic"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
          aria-label="Italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className="content-toolbar-button content-toolbar-underline"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={!editor}
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
              setShowFonts(false)
            }}
            disabled={!editor}
            aria-label="Font size"
            title="Font size"
          >
            Size
          </button>
          {showSizes && (
            <div className="content-size-menu" role="menu">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  role="menuitem"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyStyle((chain) => chain.setFontSize(`${size}pt`))
                    setShowSizes(false)
                  }}
                >
                  {size} pt
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="content-font-control">
          <button
            type="button"
            className="content-toolbar-button"
            onMouseDown={(e) => {
              e.preventDefault()
              setShowFonts((s) => !s)
              setShowSizes(false)
            }}
            disabled={!editor}
            aria-label="Font"
            title="Font"
          >
            Font
          </button>
          {showFonts && (
            <div className="content-font-menu" role="menu">
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  role="menuitem"
                  style={{ fontFamily: font.value }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyStyle((chain) => chain.setFontFamily(font.value))
                    setShowFonts(false)
                  }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="content-color-control" ref={colorControlRef}>
          <button
            type="button"
            className="content-toolbar-button"
            onMouseDown={(e) => {
              e.preventDefault()
              setShowColor((s) => !s)
            }}
            disabled={!editor}
            aria-label="Text color"
            title="Text color"
          >
            <span
              className="content-color-swatch"
              style={{ backgroundColor: color }}
            />
          </button>

          {showColor && (
            <div className="content-color-popover">
              <HexColorPicker color={color} onChange={handleColorChange} />
              <HexColorInput
                color={color}
                onChange={handleColorChange}
                prefixed
              />
              <div className="content-color-presets">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="content-color-preset"
                    style={{ backgroundColor: preset }}
                    aria-label={`Color ${preset}`}
                    title={preset}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleColorChange(preset)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditorContent editor={editor} className="content-editor" />

      <div className="content-actions">
        <button
          type="button"
          className="content-button content-button-primary"
          onClick={handleSave}
          disabled={isBusy || !isDirty || !editor}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="content-button"
          onClick={handleReset}
          disabled={isBusy || !editor}
        >
          Reset
        </button>
        {status && <span className="content-status">{status}</span>}
      </div>
    </section>
  )
}

export default ContentPanel
