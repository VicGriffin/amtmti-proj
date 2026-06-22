import { formatKsh } from '@/lib/formatters'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export interface EnrollmentTemplateData {
  fullName: string
  email: string
  phone?: string
  country?: string
  region?: string
  dateOfBirth?: string
  gender?: string
  program: string
  programCategory?: string
  programDuration?: string
  programMode?: string
  programFee?: number
  intakeMonth?: string
  preferredLearningMode?: string
}

const formatCurrency = (amount?: number) => {
  if (!amount) return 'N/A'
  return formatKsh(amount)
}

export function enrollmentNotificationTemplate(data: EnrollmentTemplateData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Program Enrollment Application</h2>
      <p>A new enrollment application was submitted via your website.</p>

      <h3 style="color: #0F4C81; margin-top: 20px;">Applicant Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Full Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Country:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.country || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Region:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.region || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Date of Birth:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.dateOfBirth || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Gender:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.gender || 'Not specified'}</td>
        </tr>
      </table>

      <h3 style="color: #0F4C81; margin-top: 20px;">Learning Preferences</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Preferred Learning Mode:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.preferredLearningMode || 'N/A'}</td>
        </tr>
      </table>

      <h3 style="color: #0F4C81; margin-top: 20px;">Program Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Program:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.program}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Category:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.programCategory || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Duration:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.programDuration || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Study Mode:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.programMode || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Intake Month:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.intakeMonth || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Program Fee:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #0F4C81;">${formatCurrency(data.programFee)}</td>
        </tr>
      </table>

      <h3 style="color: #0F4C81; margin-top: 20px;">Status</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Application Status:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="background-color: #fff3cd; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold;">Pending Review</span></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Payment Status:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="background-color: #d4edff; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold;">Pending</span></td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Submission Date:</td>
          <td style="padding: 8px;">${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated notification from AMTMTI. Please review this application and take appropriate action.
      </p>
    </div>
  `
}

export function enrollmentConfirmationTemplate(data: EnrollmentTemplateData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Your AMTMTI Program Application Has Been Received</h2>
      
      <p>Dear ${data.fullName},</p>

      <p>Thank you for applying to the Africa Medication Therapy Management Training Institute (AMTMTI).</p>

      <p>We have successfully received your enrollment application and our admissions team is reviewing your information.</p>

      <h3 style="color: #0F4C81; margin-top: 20px;">Application Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Program:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.program}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Program Type:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.programCategory || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Duration:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.programDuration || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Study Mode:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.programMode || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Intake Month:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.intakeMonth || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Program Fee:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #0F4C81;">${formatCurrency(data.programFee)}</td>
        </tr>
      </table>

      <h3 style="color: #0F4C81; margin-top: 20px;">Current Status</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Application Status:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="background-color: #fff3cd; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold;">Pending Review</span></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Payment Status:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="background-color: #d4edff; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold;">Pending</span></td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        Our admissions team will review your application and contact you shortly with the next steps. We will reach out via the email or phone number you provided.
      </p>

      <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>

      <p style="margin-top: 20px;">
        We appreciate your interest in advancing your healthcare education through AMTMTI and look forward to supporting your professional development.
      </p>

      <p>Kind regards,<br/>
      <strong>AMTMTI Admissions Team</strong><br/>
      Africa Medication Therapy Management Training Institute<br/>
      <a href="${SITE_URL}" style="color: #0F4C81;">${SITE_URL}</a>
      </p>
    </div>
  `
}
