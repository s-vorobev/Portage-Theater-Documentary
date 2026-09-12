import { useEffect, useState } from 'react'
import { apiFetch, endpoints, fetchAllSubmissionIds } from '../lib/api'
import './SubmissionsPanel.css'

const PAGE_SIZE = 6
const PAGE_WINDOW = 5

function pageWindow(current, total) {
  if (total <= PAGE_WINDOW) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const end = Math.min(total, Math.max(current + 2, PAGE_WINDOW))
  const start = Math.max(1, end - PAGE_WINDOW + 1)

  const items = []
  if (start > 1) items.push('start-ellipsis')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < total) items.push('end-ellipsis')
  return items
}

function SubmissionCard({ submission }) {
  const { firstName, lastName, email, phone, message, files = [] } = submission

  return (
    <article className="submission-card">
      <h2 className="submission-name">
        {firstName} {lastName}
      </h2>

      <p className="submission-contact">
        <a href={`mailto:${email}`}>{email}</a>
        {phone && <span className="submission-phone">{phone}</span>}
      </p>

      <p className="submission-message">{message}</p>

      {files.length > 0 && (
        <ul className="submission-files">
          {files.map((file) => (
            <li key={file.generatedFilename ?? file.originalFilename}>
              {file.originalFilename}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function SubmissionsPanel({ token, onUnauthorized }) {
  const [ids, setIds] = useState([])
  const [isLoadingIds, setIsLoadingIds] = useState(true)
  const [idsError, setIdsError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSubmissions, setPageSubmissions] = useState([])
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const [pageError, setPageError] = useState('')

  useEffect(() => {
    let isActive = true

    fetchAllSubmissionIds(token)
      .then((allIds) => {
        if (!isActive) return
        setIds(allIds)
        setPage(1)
      })
      .catch((err) => {
        if (!isActive) return
        if (err.status === 401) {
          onUnauthorized()
          return
        }
        setIdsError('Could not load submissions.')
      })
      .finally(() => {
        if (isActive) setIsLoadingIds(false)
      })

    return () => {
      isActive = false
    }
  }, [token, onUnauthorized])

  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE
    const pageIds = ids.slice(start, start + PAGE_SIZE)
    let isActive = true

    Promise.all(
      pageIds.map((id) =>
        apiFetch(endpoints.submission(id), token).then((res) => res.json()),
      ),
    )
      .then((submissions) => {
        if (!isActive) return
        setPageSubmissions(submissions)
        setPageError('')
      })
      .catch((err) => {
        if (!isActive) return
        if (err.status === 401) {
          onUnauthorized()
          return
        }
        setPageError('Could not load submissions for this page.')
      })
      .finally(() => {
        if (isActive) setIsLoadingPage(false)
      })

    return () => {
      isActive = false
    }
  }, [ids, page, token, onUnauthorized])

  const totalPages = Math.max(1, Math.ceil(ids.length / PAGE_SIZE))
  const pages = pageWindow(page, totalPages)

  function goToPage(nextPage) {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) return
    setIsLoadingPage(true)
    setPage(nextPage)
  }

  return (
    <section className="submissions-panel">
      <header className="panel-header">
        <h1 className="panel-title">Submissions</h1>
        <span className="panel-count">{ids.length} total</span>
      </header>

      {isLoadingIds && <p className="panel-message">Loading submissions…</p>}

      {idsError && (
        <p className="panel-message panel-message-error">{idsError}</p>
      )}

      {!isLoadingIds && !idsError && (
        <>
          <div className="submission-grid">
            {isLoadingPage && <p className="panel-message">Loading page…</p>}

            {!isLoadingPage && pageError && (
              <p className="panel-message panel-message-error">{pageError}</p>
            )}

            {!isLoadingPage &&
              !pageError &&
              pageSubmissions.map((submission) => (
                <SubmissionCard
                  key={`${submission.email}-${submission.createdAt}`}
                  submission={submission}
                />
              ))}

            {!isLoadingPage && !pageError && pageSubmissions.length === 0 && (
              <p className="panel-message">No submissions yet.</p>
            )}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Submission pages">
              <button
                type="button"
                className="page-button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                ‹
              </button>

              {pages.map((item) =>
                typeof item === 'number' ? (
                  <button
                    key={item}
                    type="button"
                    className={
                      item === page
                        ? 'page-button page-button-active'
                        : 'page-button'
                    }
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="page-ellipsis">
                    …
                  </span>
                ),
              )}

              <button
                type="button"
                className="page-button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  )
}

export default SubmissionsPanel
