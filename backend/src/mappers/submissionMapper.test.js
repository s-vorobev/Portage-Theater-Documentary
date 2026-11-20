import { describe, it, expect } from 'vitest'
import { toSubmission, toSubmissionFile } from './submissionMapper.js'

const form = {
  firstName: 'Sergei',
  lastName: 'Vorobev',
  email: 'sergei@example.com',
  phone: '9272060061',
  message: 'Test message',
}

describe('toSubmission', () => {
  it('maps form fields into a submission object', () => {
    expect(toSubmission(form, '127.0.0.1')).toEqual({
      firstName: 'Sergei',
      lastName: 'Vorobev',
      email: 'sergei@example.com',
      phone: '9272060061',
      message: 'Test message',
      ipAddress: '127.0.0.1',
    })
  })

  it('defaults phone to null when missing', () => {
    const { phone, ...withoutPhone } = form

    expect(toSubmission(withoutPhone, '127.0.0.1').phone).toBeNull()
  })
})

describe('toSubmissionFile', () => {
  it('maps a multer file into a file record', () => {
    const file = {
      originalname: 'photo.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
    }

    expect(
      toSubmissionFile(file, 'uuid-1.jpg', '/submissions/uuid-1.jpg'),
    ).toEqual({
      originalFilename: 'photo.jpg',
      generatedFilename: 'uuid-1.jpg',
      dropboxPath: '/submissions/uuid-1.jpg',
      mimeType: 'image/jpeg',
      fileSizeBytes: 1024,
    })
  })
})
