const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export interface ContactTemplateData {
  name: string
  email: string
  phone?: string
  inquiryType: string
  message: string
  subject?: string
}

export function contactNotificationTemplate(
  data: ContactTemplateData,
  sourcePage?: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Website Contact Submission</h2>
      <p>A new message has been received from your contact form.</p>

      <h3>Sender Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ''}
        <li><strong>Inquiry Type:</strong> ${data.inquiryType}</li>
        ${data.subject ? `<li><strong>Subject:</strong> ${data.subject}</li>` : ''}
        ${sourcePage ? `<li><strong>Source Page:</strong> <a href="${sourcePage}">${sourcePage}</a></li>` : ''}
        <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>

      <h3>Message</h3>
      <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message}</p>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated notification from AMTMTI.
      </p>
    </div>
  `
}

export function contactConfirmationTemplate(
  data: ContactTemplateData,
  sourcePage?: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Thank You For Contacting AMTMTI</h2>

      <p>Dear ${data.name},</p>

      <p>Thank you for your submission.</p>

      <p>We have successfully received your message and our team will review it shortly.</p>

      <p>Your submission details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Inquiry Type:</strong> ${data.inquiryType}</li>
        ${data.subject ? `<li><strong>Subject:</strong> ${data.subject}</li>` : ''}
        <li><strong>Message:</strong> ${data.message}</li>
      </ul>

      ${sourcePage ? `<p><strong>Submitted from:</strong> <a href="${sourcePage}">${sourcePage}</a></p>` : ''}

      <p>If further information is required, we will contact you using the details you provided.</p>

      <p>Kind regards,<br/>
      <strong>AMTMTI Team</strong><br/>
      Africa Medication Therapy Management Institute<br/>
      <a href="${SITE_URL}" style="color: #0F4C81;">${SITE_URL}</a>
      </p>
    </div>
  `
}
