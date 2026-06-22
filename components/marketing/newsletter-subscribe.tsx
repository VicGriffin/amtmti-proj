'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function NewsletterSubscribe() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Subscription failed')
      }

      setIsSuccess(true)
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to subscribe',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="mb-4 size-12 text-green-600" />
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Welcome to the AMTMTI Newsletter!
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Check your email for confirmation. We'll keep you updated with news, events, and opportunities.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          size="sm"
        >
          Subscribe Another Email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newsletter-email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  )
}
