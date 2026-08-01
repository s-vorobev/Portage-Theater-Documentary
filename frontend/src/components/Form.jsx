import { useState, useEffect } from 'react'
import './Form.css'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const MAX_MESSAGE_WORDS = 100
const MAX_FILES = 10
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024 // 500MB per file
const MAX_TOTAL_SIZE_BYTES = 3 * 1024 * 1024 * 1024 // 3GB total per submission

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/tiff',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'application/pdf',
]

const API_URL = import.meta.env.VITE_API_URL

function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${Math.round(bytes / (1024 * 1024))}MB`
  return `${Math.round(bytes / (1024 * 1024 * 1024))}GB`
}

function Form({ isOpen, onClose }) {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('form-open')
    return () => document.body.classList.remove('form-open')
  }, [isOpen])

  if (!isOpen) return null

  const wordCount = countWords(message)

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    message.trim() &&
    !fileError

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
      error = `${rejected.length} file(s) skipped — only images, videos, MP3 audio, and PDFs are supported.`
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

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!isFormValid) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (!executeRecaptcha) {
      setFormError('Something went wrong. Please refresh and try again.')
      return
    }

    setIsSubmitting(true)

    try {
      const recaptchaToken = await executeRecaptcha('submit_form')

      const formData = new FormData()
      formData.set('firstName', firstName.trim())
      formData.set('lastName', lastName.trim())
      formData.set('email', email.trim())
      formData.set('phone', e.target.phone.value.trim())
      formData.set('message', message.trim())
      formData.set('recaptchaToken', recaptchaToken)
      files.forEach((file) => formData.append('media', file))

      const response = await fetch(`${API_URL}/api/submit`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setFormError(
          data.error ||
            'Something went wrong submitting your form. Please try again.',
        )
        return
      }

      setIsSuccess(true)
    } catch (err) {
      setFormError(
        'Something went wrong submitting your form. Please try again.',
      )
      console.log(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="form-close"
          onClick={onClose}
          aria-label="Close form"
        >
          ×
        </button>

        {isSuccess ? (
          <div className="form-success">
            <span className="form-success-check" aria-hidden="true">
              ✓
            </span>
            <h2 className="form-title">Thank you!</h2>
            <p>Your submission has been received.</p>
          </div>
        ) : (
          <>
            <h2 className="form-title">Contact Us</h2>

            {formError && <div className="form-error-banner">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    maxLength={50}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    maxLength={50}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  Photos / videos / audio / PDF{' '}
                  <span className="optional-tag">(optional)</span>
                </label>
                <input
                  type="file"
                  id="media"
                  name="media"
                  accept="image/*,video/*,audio/mpeg,application/pdf"
                  multiple
                  onChange={handleFileChange}
                />
                <span className="field-hint">
                  {files.length} / {MAX_FILES} files · max{' '}
                  {formatBytes(MAX_FILE_SIZE_BYTES)} each
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

              <p className="recaptcha-disclosure">
                This site is protected by reCAPTCHA and the Google{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                apply.
              </p>

              <button
                type="submit"
                className="form-submit"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Form
