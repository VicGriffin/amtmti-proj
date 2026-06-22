import { sendNotificationEmail } from './send-notification'
import { sendConfirmationEmail } from './send-confirmation'
import { enrollmentNotificationTemplate, enrollmentConfirmationTemplate } from './templates/enrollment'
import { getSupportEmail } from './service'
import type { FullEnrollment } from '@/lib/validations/enrollment'

export async function sendEnrollmentEmails(data: FullEnrollment & {
  programCategory?: string
  programDuration?: string
  programStudyMode?: string
  programFee?: number
}) {
  const enrollmentData = {
    fullName: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    country: data.country,
    region: data.region,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    program: `${data.courseName} (${data.courseType})`,
    programCategory: data.programCategory || '',
    programDuration: data.programDuration || '',
    programMode: data.programStudyMode || '',
    programFee: data.programFee || 0,
    intakeMonth: data.intake,
    preferredLearningMode: data.preferredLearningMode,
  }

  const adminHtml = enrollmentNotificationTemplate(enrollmentData)
  const applicantHtml = enrollmentConfirmationTemplate(enrollmentData)

  const [adminSent, applicantSent] = await Promise.all([
    sendNotificationEmail(
      'New Program Enrollment Application',
      adminHtml,
      {
        fromName: 'AMTMTI',
        fromEmail: getSupportEmail(),
        replyTo: data.email,
      },
    ),
    sendConfirmationEmail(
      data.email,
      'Your AMTMTI Program Application Has Been Received',
      applicantHtml,
      {
        fromName: 'AMTMTI Admissions',
        fromEmail: getSupportEmail(),
        replyTo: getSupportEmail(),
      },
    ),
  ])

  return { adminSent, applicantSent }
}
