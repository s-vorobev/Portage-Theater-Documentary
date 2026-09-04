export function toSubmission(form, ipAddress) {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone ?? null,
    message: form.message,
    ipAddress,
  }
}

export function toSubmissionFile(file, generatedFilename, dropboxPath) {
  return {
    originalFilename: file.originalname,
    generatedFilename,
    dropboxPath,
    mimeType: file.mimetype,
    fileSizeBytes: file.size,
  }
}
