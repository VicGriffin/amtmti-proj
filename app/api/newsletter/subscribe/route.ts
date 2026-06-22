import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { newsletterSubscribeSchema } from '@/lib/validations/newsletter'
import { sendNewsletterEmails } from '@/lib/email/newsletter'
import { insertWithColumnFallback } from '@/lib/supabase/insert-with-fallback'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = newsletterSubscribeSchema.parse(body)
    const subscriberId = crypto.randomUUID()

    // Create Supabase client
    const supabase = (await createClient()) as any

    // Insert into database
    const { error, removedColumns } = await insertWithColumnFallback(
      supabase,
      'newsletter_subscribers',
      {
        id: subscriberId,
        email: validatedData.email,
        status: 'Active',
        email_status: 'pending',
        source: 'web_form',
      },
    )

    if (removedColumns.length > 0) {
      console.warn('Newsletter insert dropped unsupported columns', {
        removedColumns,
      })
    }

    if (error) {
      console.error('Supabase error:', error)
    }

    // Send emails
    try {
      await sendNewsletterEmails(validatedData.email)
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        subscriberId,
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
