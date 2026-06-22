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

const INQUIRY_TYPES = ['General', 'Programs', 'Research', 'Membership', 'Support', 'Other']

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General',
    message: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Submission failed')
      }

      setIsSuccess(true)
      toast.success('Message sent successfully!')
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'General',
        message: '',
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send message',
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
          Message Sent Successfully
        </h3>
        <p className="mb-6 text-muted-foreground">
          Thank you for contacting us. We will respond to your message shortly.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="bg-gold text-gold-foreground hover:bg-gold/90"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your name"
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
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+254 712 345 678"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="inquiryType">Inquiry Type *</Label>
          <Select value={formData.inquiryType} onValueChange={(value) => handleChange('inquiryType', value)}>
            <SelectTrigger id="inquiryType" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Write your message here..."
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
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}
