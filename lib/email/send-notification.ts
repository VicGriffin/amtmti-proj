import { getSupportEmail, sendEmail } from './service'

export async function sendNotificationEmail(
  subject: string,
  html: string,
  options: { fromName?: string; replyTo?: string; fromEmail?: string } = {},
) {
  return sendEmail({
    to: getSupportEmail(),
    subject,
    html,
    fromName: options.fromName || 'AMTMTI',
    fromEmail: options.fromEmail,
    replyTo: options.replyTo,
  })
}
