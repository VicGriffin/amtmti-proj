import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fullEnrollmentSchema } from '@/lib/validations/enrollment'
import { sendEnrollmentEmails } from '@/lib/email/enrollment'
import { insertWithColumnFallback } from '@/lib/supabase/insert-with-fallback'

async function resolveProgramByEnrollmentSelection(
  supabase: any,
  courseId: string,
  courseName: string,
) {
  const selectors = [
    { field: 'id', value: courseId },
    { field: 'slug', value: courseId },
    { field: 'title', value: courseName },
  ]

  for (const selector of selectors) {
    if (!selector.value) continue

    const { data } = await supabase
      .from('programs')
      .select('id, slug, title, fees_ksh, category, duration, mode')
      .eq(selector.field, selector.value)
      .maybeSingle()

    if (data) {
      return data
    }
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = fullEnrollmentSchema.parse(body)
    const applicationId = crypto.randomUUID()

    // Create Supabase client
    const supabase = (await createClient()) as any

    // Fetch program details to get accurate fee and metadata
    let programFee = 0
    let programCategory = ''
    let programDuration = ''
    let programStudyMode = ''
    let programId: string | null = null

    if (validatedData.courseId) {
      const program = await resolveProgramByEnrollmentSelection(
        supabase,
        validatedData.courseId,
        validatedData.courseName,
      )

      if (program) {
        programId = program.id
        programFee = program.fees_ksh || 0
        programCategory = program.category || ''
        programDuration = program.duration || ''
        programStudyMode = program.mode || ''
      } else {
        console.warn(
          'Program lookup missed; saving application with submitted selection',
          {
            courseId: validatedData.courseId,
            courseName: validatedData.courseName,
          },
        )
        programId = validatedData.courseId
        programFee = validatedData.programFee || 0
        programCategory = validatedData.programCategory || ''
        programDuration = validatedData.programDuration || ''
        programStudyMode = validatedData.programStudyMode || ''
      }
    }

    // Insert into database
    const enrollmentRow = {
      id: applicationId,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      country: validatedData.country,
      region: validatedData.region,
      date_of_birth: validatedData.dateOfBirth,
      gender: validatedData.gender || null,
      intake: validatedData.intake,
      course_type: validatedData.courseType,
      course_id: programId,
      course_name: validatedData.courseName,
      program_category: programCategory,
      program_duration: programDuration,
      program_study_mode: programStudyMode,
      program_fee: programFee,
      preferred_learning_mode: validatedData.preferredLearningMode,
      application_status: 'Pending Review',
      payment_status: 'Pending',
      source: 'web_form',
      email_status: 'pending',
    }

    const { error, removedColumns } = await insertWithColumnFallback(
      supabase,
      'enrollment_applications',
      enrollmentRow,
    )

    if (removedColumns.length > 0) {
      console.warn('Enrollment insert dropped unsupported columns', {
        removedColumns,
      })
    }

    if (error) {
      console.error('Supabase error:', error)
    }

    // Prepare data for email
    const emailData = {
      ...validatedData,
      programCategory,
      programDuration,
      programStudyMode,
      programFee,
    }

    // Send emails
    try {
      const { adminSent, applicantSent } = await sendEnrollmentEmails(emailData)
      const emailStatus = adminSent && applicantSent ? 'sent' : 'failed'

      if (!error) {
        // Update email_status in database only if the insert succeeded
        await supabase
          .from('enrollment_applications')
          .update({ email_status: emailStatus })
          .eq('id', applicationId)
      }
    } catch (emailError) {
      console.error('Email error:', emailError)
      if (!error) {
        // Update email_status as failed only if the insert succeeded
        await supabase
          .from('enrollment_applications')
          .update({ email_status: 'failed' })
          .eq('id', applicationId)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId,
        databaseSaved: !error,
      },
      { status: 201 },
    )
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.errors },
        { status: 400 },
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}