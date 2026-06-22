export interface EmailPayload {
  to: string
  subject: string
  html: string
  fromName?: string
  fromEmail?: string
  replyTo?: string
}

export interface EmailResult {
  success: boolean
  error?: string
}

export interface FormEmailResult {
  adminSent: boolean
  userSent: boolean
}
