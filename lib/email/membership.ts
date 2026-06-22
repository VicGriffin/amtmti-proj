import { sendNotificationEmail } from './send-notification'
import { sendConfirmationEmail } from './send-confirmation'
import { membershipNotificationTemplate, membershipConfirmationTemplate } from './templates/membership'
import { getSupportEmail } from './service'
import type { MembershipApplication } from '@/lib/validations/membership'

export async function sendMembershipEmails(data: MembershipApplication) {
  const adminHtml = membershipNotificationTemplate(data)
  const memberHtml = membershipConfirmationTemplate(data)

  const [adminSent, memberSent] = await Promise.all([
    sendNotificationEmail(
      'New Membership Application',
      adminHtml,
      {
        fromName: 'AMTMTI',
        fromEmail: getSupportEmail(),
        replyTo: data.email,
      },
    ),
    sendConfirmationEmail(
      data.email,
      'Your AMTMTI Membership Application Has Been Received',
      memberHtml,
      {
        fromName: 'AMTMTI Membership',
        fromEmail: getSupportEmail(),
        replyTo: getSupportEmail(),
      },
    ),
  ])

  return { adminSent, memberSent }
}
