import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-secondary">
        404
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button className="mt-8" render={<Link href="/">Back to homepage</Link>} />
    </div>
  )
}
