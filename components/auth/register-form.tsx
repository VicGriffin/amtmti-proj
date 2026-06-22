'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function RegisterForm() {
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/programs'
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem('amtmti-enrollment-form')
      if (!stored) return
      const parsed = JSON.parse(stored)
      if (parsed?.firstName || parsed?.lastName) {
        setFullName(`${parsed.firstName ?? ''} ${parsed.lastName ?? ''}`.trim())
      }
      if (parsed?.email) {
        setEmail(String(parsed.email))
      }
      if (parsed?.phone) {
        setPhone(String(parsed.phone))
      }
    } catch {
      // ignore bad local storage
    }
  }, [])


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const fullName = String(form.get('full_name') ?? '')
    const email = String(form.get('email') ?? '')
    const phone = String(form.get('phone') ?? '')
    const password = String(form.get('password') ?? '')
    const confirm = String(form.get('confirm') ?? '')

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          country,
        },
      },
    })

    setLoading(false)

    if (error) {
      toast.error(error.message || 'Could not create account.')
      return
    }

    toast.success('Account created. Please sign in.')
    window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+254 700 000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          required
          placeholder="Country of residence"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}