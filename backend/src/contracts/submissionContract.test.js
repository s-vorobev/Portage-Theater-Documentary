import { describe, it, expect } from 'vitest'
import { submissionContract } from './submissionContract.js'

const validData = {
  firstName: 'Sergei',
  lastName: 'Vorobev',
  email: 'sergei@example.com',
  phone: '9272060061',
  message: 'This is a test message.',
}

describe('submissionContract', () => {
  it('accepts valid data', () => {
    const result = submissionContract.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('trims whitespace from string fields', () => {
    const result = submissionContract.safeParse({
      ...validData,
      firstName: '  Sergei  ',
    })
    expect(result.success).toBe(true)
    expect(result.data.firstName).toBe('Sergei')
  })

  it('rejects a missing firstName', () => {
    const { firstName, ...rest } = validData
    const result = submissionContract.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects an empty firstName', () => {
    const result = submissionContract.safeParse({ ...validData, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a firstName over 50 characters', () => {
    const result = submissionContract.safeParse({
      ...validData,
      firstName: 'a'.repeat(51),
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email format', () => {
    const result = submissionContract.safeParse({
      ...validData,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('allows phone to be omitted entirely (optional)', () => {
    const { phone, ...rest } = validData
    const result = submissionContract.safeParse(rest)
    expect(result.success).toBe(true)
  })

  it('allows phone to be explicitly null', () => {
    const result = submissionContract.safeParse({ ...validData, phone: null })
    expect(result.success).toBe(true)
  })

  it('rejects a missing message', () => {
    const { message, ...rest } = validData
    const result = submissionContract.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('accepts a message at exactly the 100 word limit', () => {
    const message = Array(100).fill('word').join(' ')
    const result = submissionContract.safeParse({ ...validData, message })
    expect(result.success).toBe(true)
  })

  it('rejects a message over the 100 word limit', () => {
    const message = Array(101).fill('word').join(' ')
    const result = submissionContract.safeParse({ ...validData, message })
    expect(result.success).toBe(false)
  })
})
