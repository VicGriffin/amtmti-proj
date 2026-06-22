const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export interface NewsletterTemplateData {
  email: string
  firstName?: string
  lastName?: string
}

export function newsletterNotificationTemplate(data: NewsletterTemplateData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Newsletter Subscriber</h2>
      <p>A new newsletter subscriber signed up on your site.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.firstName ? `<li><strong>First name:</strong> ${data.firstName}</li>` : ''}
        ${data.lastName ? `<li><strong>Last name:</strong> ${data.lastName}</li>` : ''}
        <li><strong>Subscription Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated notification from AMTMTI.</p>
    </div>
  `
}

export function newsletterConfirmationTemplate(data: NewsletterTemplateData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Newsletter Subscription Confirmed</h2>
      <p>Hi ${data.firstName ?? 'there'},</p>
      <p>Thank you for subscribing to the AMTMTI newsletter. You will now receive our latest updates, research news, and event announcements.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Email:</strong> ${data.email}</li>
      </ul>
      <p>Visit our website anytime at <a href="${SITE_URL}" style="color: #0F4C81;">${SITE_URL}</a></p>
      <p>Kind regards,<br/><strong>AMTMTI Team</strong></p>
    </div>
  `
}
