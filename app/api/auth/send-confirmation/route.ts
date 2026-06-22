import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendConfirmationEmail } from '@/lib/email/send-confirmation'
import { getSupportEmail } from '@/lib/email/service'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()

    const { data, error } =
      await supabase.auth.admin.generateLink({
        type: 'signup',
        email,
      })

    if (error) {
      if (
        error.message.includes(
          'already been registered',
        )
      ) {
        return NextResponse.json({
          success: true,
          message:
            'Account exists. Please check your email.',
        })
      }

      console.error(
        'Generate link failed:',
        error,
      )

      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      )
    }

    await sendConfirmationEmail(
      email,
      'Confirm your AMTMTI account',
      `
        <h2>Welcome to AMTMTI</h2>

        <p>Confirm your account:</p>

        <a href="${data.properties.action_link}">
          Confirm Email
        </a>
      `,
      {
        fromName: 'AMTMTI Admissions',
        fromEmail: getSupportEmail(),
        replyTo: getSupportEmail(),
      },
    )

    return NextResponse.json({
      success: true,
    })

  } catch (error) {
    console.error(
      'Confirmation error:',
      error,
    )

    return NextResponse.json(
      {
        error: 'Failed sending confirmation',
      },
      {
        status: 500,
      },
    )
  }
}