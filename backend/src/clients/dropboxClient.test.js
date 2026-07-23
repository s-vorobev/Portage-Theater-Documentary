import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFilesUpload, mockFilesDeleteV2 } = vi.hoisted(() => ({
  mockFilesUpload: vi.fn(),
  mockFilesDeleteV2: vi.fn(),
}))

vi.mock('dropbox', () => ({
  Dropbox: vi.fn().mockImplementation(function () {
    return {
      filesUpload: mockFilesUpload,
      filesDeleteV2: mockFilesDeleteV2,
    }
  }),
}))

vi.mock('../config/env.js', () => ({
  env: {
    DROPBOX_APP_KEY: 'test-key',
    DROPBOX_APP_SECRET: 'test-secret',
    DROPBOX_REFRESH_TOKEN: 'test-refresh-token',
    DROPBOX_UPLOAD_FOLDER: '/submissions',
  },
}))

import { uploadFile, deleteFile } from './dropboxClient.js'

describe('dropboxClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('uploadFile', () => {
    it('uploads to the configured folder plus the given filename', async () => {
      mockFilesUpload.mockResolvedValue({
        result: { path_display: '/submissions/abc-123.jpg' },
      })

      await uploadFile(Buffer.from('fake'), 'abc-123.jpg')

      expect(mockFilesUpload).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/submissions/abc-123.jpg' }),
      )
    })

    it('returns the path Dropbox reports back', async () => {
      mockFilesUpload.mockResolvedValue({
        result: { path_display: '/submissions/abc-123.jpg' },
      })

      const result = await uploadFile(Buffer.from('fake'), 'abc-123.jpg')

      expect(result).toBe('/submissions/abc-123.jpg')
    })

    it('does not autorename on a path collision', async () => {
      mockFilesUpload.mockResolvedValue({
        result: { path_display: '/submissions/abc-123.jpg' },
      })

      await uploadFile(Buffer.from('fake'), 'abc-123.jpg')

      expect(mockFilesUpload).toHaveBeenCalledWith(
        expect.objectContaining({ autorename: false }),
      )
    })

    it('propagates an upload failure from the SDK', async () => {
      mockFilesUpload.mockRejectedValue(new Error('network error'))

      await expect(
        uploadFile(Buffer.from('fake'), 'abc-123.jpg'),
      ).rejects.toThrow('network error')
    })
  })

  describe('deleteFile', () => {
    it('calls filesDeleteV2 with the given path', async () => {
      mockFilesDeleteV2.mockResolvedValue({})

      await deleteFile('/submissions/abc-123.jpg')

      expect(mockFilesDeleteV2).toHaveBeenCalledWith({
        path: '/submissions/abc-123.jpg',
      })
    })

    it('propagates a delete failure from the SDK', async () => {
      mockFilesDeleteV2.mockRejectedValue(new Error('not found'))

      await expect(deleteFile('/submissions/missing.jpg')).rejects.toThrow(
        'not found',
      )
    })
  })
})