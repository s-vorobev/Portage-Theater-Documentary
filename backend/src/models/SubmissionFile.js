export class SubmissionFile {
  constructor({
    fileId = null,
    submissionId = null,
    originalFilename,
    generatedFilename,
    dropboxPath,
    mimeType,
    fileSizeBytes,
  }) {
    this.fileId = fileId
    this.submissionId = submissionId
    this.originalFilename = originalFilename
    this.generatedFilename = generatedFilename
    this.dropboxPath = dropboxPath
    this.mimeType = mimeType
    this.fileSizeBytes = fileSizeBytes
  }
}