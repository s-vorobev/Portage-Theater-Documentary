export function mapSubmissionView(submissionRow, fileRows) {
  return {
    firstName: submissionRow.first_name,
    lastName: submissionRow.last_name,
    email: submissionRow.email,
    phone: submissionRow.phone,
    message: submissionRow.message,
    createdAt: submissionRow.created_at,
    files: fileRows.map((row) => ({
      originalFilename: row.original_filename,
      generatedFilename: row.generated_filename,
    })),
  }
}
