const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export interface MembershipTemplateData {
  fullName: string
  email: string
  country?: string
  profession?: string
  membershipTier: string
  reasonForJoining?: string
  organization?: string
}

export function membershipNotificationTemplate(
  data: MembershipTemplateData,
  sourcePage?: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Membership Application</h2>
      <p>A new membership application was submitted via your website.</p>

      <h3>Applicant Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.fullName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.country ? `<li><strong>Country:</strong> ${data.country}</li>` : ''}
        ${data.profession ? `<li><strong>Profession:</strong> ${data.profession}</li>` : ''}
        ${data.organization ? `<li><strong>Organization:</strong> ${data.organization}</li>` : ''}
        <li><strong>Membership Tier:</strong> ${data.membershipTier}</li>
        <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
        ${sourcePage ? `<li><strong>Source Page:</strong> <a href="${sourcePage}">${sourcePage}</a></li>` : ''}
      </ul>

      ${data.reasonForJoining ? `<h3>Reason for joining</h3><p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${data.reasonForJoining}</p>` : ''}

      <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated notification from AMTMTI.</p>
    </div>
  `
}

export function membershipConfirmationTemplate(
  data: MembershipTemplateData,
  sourcePage?: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Thank You For Your AMTMTI Membership Application</h2>
      <p>Dear ${data.fullName},</p>
      <p>Thank you for applying for membership with AMTMTI.</p>
      <p>We have received your application successfully and our team will review it shortly.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Membership Tier:</strong> ${data.membershipTier}</li>
        ${data.country ? `<li><strong>Country:</strong> ${data.country}</li>` : ''}
        ${data.profession ? `<li><strong>Profession:</strong> ${data.profession}</li>` : ''}
        ${data.organization ? `<li><strong>Organization:</strong> ${data.organization}</li>` : ''}
      </ul>
      ${data.reasonForJoining ? `<p><strong>Reason for joining:</strong> ${data.reasonForJoining}</p>` : ''}
      ${sourcePage ? `<p><strong>Submitted from:</strong> <a href="${sourcePage}">${sourcePage}</a></p>` : ''}
      <p>Kind regards,<br/> <strong>AMTMTI Team</strong><br/> <a href="${SITE_URL}" style="color: #0F4C81;">${SITE_URL}</a></p>
    </div>
  `
}
