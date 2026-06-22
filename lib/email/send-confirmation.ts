import { sendEmail } from './service'

export async function sendConfirmationEmail(
  to: string,
  subject: string,
  html: string,
  options: { fromName?: string; replyTo?: string; fromEmail?: string } = {},
) {
  return sendEmail({
    to,
    subject,
    html,
    fromName: options.fromName || 'AMTMTI',
    fromEmail: options.fromEmail,
    replyTo: options.replyTo,
  })
}
