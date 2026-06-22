import { sendNotificationEmail } from './send-notification'
import { sendConfirmationEmail } from './send-confirmation'
import { newsletterNotificationTemplate, newsletterConfirmationTemplate } from './templates/newsletter'
import { getSupportEmail } from './service'

export async function sendNewsletterEmails(email: string) {
  const subscriberData = { email }
  const adminHtml = newsletterNotificationTemplate(subscriberData)
  const subscriberHtml = newsletterConfirmationTemplate(subscriberData)

  const [adminSent, subscriberSent] = await Promise.all([
    sendNotificationEmail(
      'New Newsletter Subscriber',
      adminHtml,
      {
        fromName: 'AMTMTI',
        fromEmail: getSupportEmail(),
        replyTo: email,
      },
    ),
    sendConfirmationEmail(
      email,
      'Welcome to the AMTMTI Newsletter',
      subscriberHtml,
      {
        fromName: 'AMTMTI Communications',
        fromEmail: getSupportEmail(),
        replyTo: getSupportEmail(),
      },
    ),
  ])

  return { adminSent, subscriberSent }
}
