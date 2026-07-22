export class Submission {
  constructor({ submissionId = null, firstName, lastName, email, phone = null, message, ipAddress }) {
    this.submissionId = submissionId
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.message = message
    this.ipAddress = ipAddress
  }
}