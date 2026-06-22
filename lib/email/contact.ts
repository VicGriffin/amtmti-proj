import { getSupportEmail, sendEmail } from './service'
import { contactNotificationTemplate, contactConfirmationTemplate } from './templates/contact'
import type { ContactForm } from '@/lib/validations/contact'

export async function sendContactEmails(data: ContactForm) {
  const adminHtml = contactNotificationTemplate(data)
  const senderHtml = contactConfirmationTemplate(data)

  const [adminSent, senderSent] = await Promise.all([
    sendEmail({
      to: getSupportEmail(),
      subject: 'New Website Contact Message',
      html: adminHtml,
      fromName: 'AMTMTI',
      fromEmail: getSupportEmail(),
      replyTo: data.email,
    }),
    sendEmail({
      to: data.email,
      subject: 'We Have Received Your Message',
      html: senderHtml,
      fromName: 'AMTMTI Support',
      fromEmail: getSupportEmail(),
      replyTo: getSupportEmail(),
    }),
  ])

  return { adminSent, senderSent }
}