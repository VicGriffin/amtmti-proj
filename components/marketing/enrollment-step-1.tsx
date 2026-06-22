'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { FullEnrollment } from '@/lib/validations/enrollment'

interface EnrollmentStep1Props {
  data: FullEnrollment
  onDataChange: (data: FullEnrollment) => void
}

export function EnrollmentStep1({ data, onDataChange }: EnrollmentStep1Props) {
  const handleChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Register with AMTMTI Today</h2>
        <p className="text-sm text-muted-foreground">Apply for Session 2026</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill out the form below to begin registration for AMTMTI.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+254 712 345 678"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            International format (e.g., +254 for Kenya)
          </p>
        </div>
      </div>
    </div>
  )
}
