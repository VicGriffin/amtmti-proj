import type { EmailPayload } from './email-types'

const MAX_RETRIES = 2

export async function sendEmailResend(
  payload: EmailPayload,
  retries = MAX_RETRIES,
): Promise<boolean> {
  // Read lazily so the value is available after env is fully loaded
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const EMAIL_FROM =
    process.env.EMAIL_FROM ||
    process.env.COMPANY_EMAIL ||
    process.env.NEXT_PUBLIC_AMTMTI_EMAIL ||
    'info@amtmti.africa'

  if (!RESEND_API_KEY) {
    console.error('Resend API key is not configured.')
    return false
  }

  if (!EMAIL_FROM) {
    console.error('EMAIL_FROM is not configured.')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.fromEmail
          ? payload.fromName
            ? `${payload.fromName} <${payload.fromEmail}>`
            : payload.fromEmail
          : payload.fromName
            ? `${payload.fromName} <${EMAIL_FROM}>`
            : EMAIL_FROM,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo || undefined,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('Resend error:', body)
      if (retries > 0) {
        return sendEmailResend(payload, retries - 1)
      }
      return false
    }

    return true
  } catch (error) {
    console.error('Resend request failed:', error)
    if (retries > 0) {
      return sendEmailResend(payload, retries - 1)
    }
    return false
  }
}