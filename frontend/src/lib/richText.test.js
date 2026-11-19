import { describe, it, expect } from 'vitest'
import { contentToHtml } from './richText.js'

describe('contentToHtml', () => {
  it('returns an empty string for empty content', () => {
    expect(contentToHtml('')).toBe('')
    expect(contentToHtml(undefined)).toBe('')
  })

  it('escapes legacy plain text and preserves line breaks', () => {
    expect(contentToHtml('Line one\nLine two')).toBe('Line one<br>Line two')
  })

  it('escapes HTML characters in legacy plain text', () => {
    expect(contentToHtml('a < b & c')).toBe('a &lt; b &amp; c')
  })

  it('keeps allowed rich-text tags', () => {
    expect(contentToHtml('<strong>bold</strong> text')).toBe(
      '<strong>bold</strong> text',
    )
  })

  it('keeps an allowed inline font-size style', () => {
    const html = '<span style="font-size: 1.5rem">big</span>'
    expect(contentToHtml(html)).toBe(html)
  })

  it('strips disallowed tags', () => {
    expect(contentToHtml('<script>alert(1)</script><strong>x</strong>')).toBe(
      '<strong>x</strong>',
    )
  })

  it('strips dangerous attributes from allowed tags', () => {
    expect(contentToHtml('<span onclick="alert(1)">x</span>')).toBe(
      '<span>x</span>',
    )
  })
})
