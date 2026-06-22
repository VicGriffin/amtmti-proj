'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FullEnrollment } from '@/lib/validations/enrollment'

interface EnrollmentStep2Props {
  data: FullEnrollment
  onDataChange: (data: FullEnrollment) => void
}

const COUNTRIES = [
  'Kenya',
  'Uganda',
  'Tanzania',
  'Rwanda',
  'Burundi',
  'South Sudan',
  'Ethiopia',
  'Nigeria',
  'Ghana',
  'Cameroon',
  'South Africa',
  'Zimbabwe',
  'Zambia',
  'Malawi',
  'Mozambique',
]

const REGIONS: Record<string, string[]> = {
  Kenya: [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Kericho',
    'Eldoret',
    'Kilifi',
    'Nyeri',
  ],
  Uganda: ['Kampala', 'Jinja', 'Masaka', 'Mbarara', 'Fort Portal'],
  Tanzania: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mbeya', 'Zanzibar'],
}

const GENDERS = ['Male', 'Female', 'Prefer Not To Say']

export function EnrollmentStep2({ data, onDataChange }: EnrollmentStep2Props) {
  const handleChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    })
  }

  const regionOptions = REGIONS[data.country as keyof typeof REGIONS] || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Fill Personal Details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us more about yourself to personalize your learning experience.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="country" className="text-sm font-medium">
            Country <span className="text-red-500">*</span>
          </Label>
          <Input
            id="country"
            placeholder="Enter your country"
            value={data.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="region" className="text-sm font-medium">
            Region <span className="text-red-500">*</span>
          </Label>
          <Input
            id="region"
            placeholder="Enter your region"
            value={data.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="gender" className="text-sm font-medium">
            Gender
          </Label>
          <Select value={data.gender || ''} onValueChange={(value) => handleChange('gender', value)}>
            <SelectTrigger id="gender" className="mt-1.5">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
