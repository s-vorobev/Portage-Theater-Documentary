import DOMPurify from 'dompurify'

// The rich-text editor emits a small set of tags. Everything else is stripped
// on render, and DOMPurify removes any script/dangerous content.
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'span', 'br', 'div', 'p']

// Matches anything that looks like an HTML tag.
const HTML_TAG_RE = /<[a-z][\s\S]*?>/i

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Converts stored content into safe HTML. Legacy rows were plain text, so when
// there are no tags we escape the text and turn newlines into <br> tags.
export function contentToHtml(raw) {
  if (!raw) return ''

  const source = HTML_TAG_RE.test(raw)
    ? raw
    : escapeHtml(raw).replace(/\n/g, '<br>')

  return DOMPurify.sanitize(source, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['style'],
  })
}
