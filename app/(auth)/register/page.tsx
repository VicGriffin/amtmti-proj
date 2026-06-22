import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Register for the AMTMTI student portal.',
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const redirect = params.redirect
    ? `?redirect=${encodeURIComponent(params.redirect)}`
    : ''

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Join Africa&apos;s leading MTM training community.
        </p>
      </div>

      <Suspense>
        <RegisterForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={`/login${redirect}`}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
