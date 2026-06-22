'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'

const PROFESSIONS = [
  'Pharmacist',
  'Clinician',
  'Nurse',
  'Pharmaceutical Technician',
  'Pharmaceutical Technologist',
  'Physician',
  'Healthcare Administrator',
  'Student',
  'Other',
]

const COUNTRIES = [
  'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan',
  'Ethiopia', 'Nigeria', 'Ghana', 'Cameroon', 'South Africa', 'Zimbabwe',
  'Zambia', 'Malawi', 'Mozambique',
]

const MEMBERSHIP_TIERS = [
  { value: 'Student', label: 'Student (Free)' },
  { value: 'Affiliate', label: 'Affiliate (KSH 10,400/year)' },
  { value: 'Corporate', label: 'Corporate (KSH 156,000/year)' },
]

export function MembershipForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: 'Kenya',
    profession: '',
    membershipTier: 'Student',
    reasonForJoining: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/membership/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Submission failed')
      }

      setIsSuccess(true)
      toast.success('Application submitted successfully!')
      setFormData({
        fullName: '',
        email: '',
        country: 'Kenya',
        profession: '',
        membershipTier: 'Student',
        reasonForJoining: '',
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit application',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="mb-6 size-16 text-green-600" />
        <h3 className="mb-2 text-2xl font-bold text-foreground">
          Application Submitted Successfully
        </h3>
        <p className="mb-6 text-muted-foreground">
          Thank you for your membership application. We will review it and contact you shortly.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="bg-gold text-gold-foreground hover:bg-gold/90"
        >
          Submit Another Application
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your.email@example.com"
            required
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="country">Country *</Label>
          <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
            <SelectTrigger id="country" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="profession">Profession *</Label>
          <Select value={formData.profession} onValueChange={(value) => handleChange('profession', value)}>
            <SelectTrigger id="profession" className="mt-1.5">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {PROFESSIONS.map((profession) => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="membershipTier">Membership Tier *</Label>
        <Select value={formData.membershipTier} onValueChange={(value) => handleChange('membershipTier', value)}>
          <SelectTrigger id="membershipTier" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEMBERSHIP_TIERS.map((tier) => (
              <SelectItem key={tier.value} value={tier.value}>
                {tier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reasonForJoining">Reason for Joining *</Label>
        <Textarea
          id="reasonForJoining"
          value={formData.reasonForJoining}
          onChange={(e) => handleChange('reasonForJoining', e.target.value)}
          placeholder="Tell us why you want to join AMTMTI..."
          rows={5}
          required
          className="mt-1.5"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Application'
        )}
      </Button>
    </form>
  )
}
