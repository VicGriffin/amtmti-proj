import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactEmails } from '@/lib/email/contact'
import { insertWithColumnFallback } from '@/lib/supabase/insert-with-fallback'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = contactFormSchema.parse(body)
    const messageId = crypto.randomUUID()

    // Create Supabase client
    const supabase = (await createClient()) as any

    // Insert into database
    const { error, removedColumns } = await insertWithColumnFallback(
      supabase,
      'contact_messages',
      {
        id: messageId,
        name: validatedData.name,
        email: validatedData.email,
        inquiry_type: validatedData.inquiryType,
        message: validatedData.message,
        phone: validatedData.phone || null,
        source: 'web_form',
        email_status: 'pending',
        status: 'new',
      },
    )

    if (removedColumns.length > 0) {
      console.warn('Contact insert dropped unsupported columns', {
        removedColumns,
      })
    }

    if (error) {
      console.error('Supabase error:', error)
    }

    // Send emails (non-blocking — contact submission succeeds even if email fails)
    let emailStatus = 'failed'
    try {
      const emailResult = await sendContactEmails(validatedData)
      emailStatus = emailResult.adminSent && emailResult.senderSent ? 'sent' : 'failed'
    } catch (emailError) {
      console.error('Email error:', emailError)
    }

    if (!error) {
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ email_status: emailStatus })
        .eq('id', messageId)

      if (updateError) {
        console.error('Failed to update contact email status:', updateError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        messageId,
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
