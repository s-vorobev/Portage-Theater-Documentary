import { describe, it, expect } from 'vitest'
import { HttpError } from './HttpError.js'

describe('HttpError', () => {
  it('sets the status code', () => {
    const err = new HttpError(404, 'Not found')
    expect(err.status).toBe(404)
  })

  it('sets the message', () => {
    const err = new HttpError(400, 'Bad request')
    expect(err.message).toBe('Bad request')
  })

  it('sets the name to HttpError', () => {
    const err = new HttpError(500, 'Server error')
    expect(err.name).toBe('HttpError')
  })

  it('is a real Error instance', () => {
    const err = new HttpError(400, 'Bad request')
    expect(err).toBeInstanceOf(Error)
  })
})
