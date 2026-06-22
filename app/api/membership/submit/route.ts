import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { membershipApplicationSchema } from '@/lib/validations/membership'
import { sendMembershipEmails } from '@/lib/email/membership'
import { insertWithColumnFallback } from '@/lib/supabase/insert-with-fallback'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = membershipApplicationSchema.parse(body)
    const applicationId = crypto.randomUUID()

    // Create Supabase client
    const supabase = (await createClient()) as any

    // Insert into database
    const { error, removedColumns } = await insertWithColumnFallback(
      supabase,
      'membership_applications',
      {
        id: applicationId,
        name: validatedData.fullName,
        email: validatedData.email,
        country: validatedData.country,
        profession: validatedData.profession,
        tier: validatedData.membershipTier,
        reason: validatedData.reasonForJoining,
        status: 'pending',
        source: 'web_form',
      },
    )

    if (removedColumns.length > 0) {
      console.warn('Membership insert dropped unsupported columns', {
        removedColumns,
      })
    }

    if (error) {
      console.error('Supabase error:', error)
    }

    // Send emails
    try {
      await sendMembershipEmails(validatedData)
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Membership application submitted successfully',
        applicationId,
        databaseSaved: !error,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.errors },
        { status: 422 },
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
