import { useState } from 'react'
import './Form.css'

const MAX_MESSAGE_WORDS = 100
const MAX_FILES = 10
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024 // 500MB per file
const MAX_TOTAL_SIZE_BYTES = 3 * 1024 * 1024 * 1024 // 3GB total per submission
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]

function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))}MB`
  return `${Math.round(bytes / (1024 * 1024 * 1024))}GB`
}

function Form({ isOpen, onClose }) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [formError, setFormError] = useState('')

  if (!isOpen) return null

  const wordCount = countWords(message)

  function handleMessageChange(e) {
    const value = e.target.value
    const words = countWords(value)
    if (words <= MAX_MESSAGE_WORDS) {
      setMessage(value)
    } else {
      const trimmedWords = value.trim().split(/\s+/).slice(0, MAX_MESSAGE_WORDS)
      setMessage(trimmedWords.join(' '))
    }
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files)
    let combined = [...files, ...selected]
    let error = ''

    const rejected = combined.filter((f) => !ACCEPTED_TYPES.includes(f.type))
    if (rejected.length > 0) {
      error = `${rejected.length} file(s) skipped — only images (JPG, PNG, WEBP, GIF) and videos (MP4, MOV, WEBM) are supported.`
      combined = combined.filter((f) => ACCEPTED_TYPES.includes(f.type))
    }

    const tooLarge = combined.filter((f) => f.size > MAX_FILE_SIZE_BYTES)
    if (tooLarge.length > 0) {
      error = `${tooLarge.length} file(s) skipped — each file must be under ${formatBytes(MAX_FILE_SIZE_BYTES)}.`
      combined = combined.filter((f) => f.size <= MAX_FILE_SIZE_BYTES)
    }

    if (combined.length > MAX_FILES) {
      error = `You can only attach up to ${MAX_FILES} files.`
      combined = combined.slice(0, MAX_FILES)
    }

    const totalBytes = combined.reduce((sum, f) => sum + f.size, 0)
    if (totalBytes > MAX_TOTAL_SIZE_BYTES) {
      error = `Total attachments must be under ${formatBytes(MAX_TOTAL_SIZE_BYTES)}. Please remove some files.`
    }

    setFileError(error)
    setFiles(combined)
    e.target.value = ''
  }

  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index))
    setFileError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    const formData = new FormData(e.target)
    const firstName = formData.get('fname')?.trim()
    const lastName = formData.get('lname')?.trim()
    const email = formData.get('email')?.trim()

    if (!firstName || !lastName || !email || !message.trim()) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (fileError) {
      setFormError('Please resolve the file issue above before submitting.')
      return
    }

    // TODO: send to backend here
    // try/catch around fetch('/api/submit', ...) — on failure:
    // setFormError('Something went wrong submitting your form. Please try again.')
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="form-close" onClick={onClose} aria-label="Close form">
          ×
        </button>

        <h2 className="form-title">Contact Us</h2>

        {formError && <div className="form-error-banner">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="fname">First name</label>
              <input type="text" id="fname" name="fname" maxLength={50} required />
            </div>
            <div className="form-field">
              <label htmlFor="lname">Last name</label>
              <input type="text" id="lname" name="lname" maxLength={50} required />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" maxLength={100} required />
          </div>

          <div className="form-field">
            <label htmlFor="phone">
              Phone number <span className="optional-tag">(optional)</span>
            </label>
            <input type="tel" id="phone" name="phone" maxLength={20} />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={message}
              onChange={handleMessageChange}
              required
            />
            <span className="field-hint">
              {wordCount} / {MAX_MESSAGE_WORDS} words
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="media">
              Photos / videos <span className="optional-tag">(optional)</span>
            </label>
            <input
              type="file"
              id="media"
              name="media"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
            <span className="field-hint">
              {files.length} / {MAX_FILES} files · max {formatBytes(MAX_FILE_SIZE_BYTES)} each
            </span>
            {fileError && <span className="field-error">{fileError}</span>}

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((file, i) => (
                  <li key={`${file.name}-${i}`}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="file-remove"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="form-submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Form