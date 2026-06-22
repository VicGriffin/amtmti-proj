'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We encountered an unexpected error while loading this page. Please try
        again or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" render={<Link href="/">Go home</Link>} />
      </div>
    </div>
  )
}
