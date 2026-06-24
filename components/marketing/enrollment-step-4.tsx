'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FullEnrollment } from '@/lib/validations/enrollment'

const LEARNING_MODES = ['Online', 'Hybrid', 'In-Person']

interface EnrollmentStep4Props {
  data: FullEnrollment
  onDataChange: (data: FullEnrollment) => void
}

export function EnrollmentStep4({ data, onDataChange }: EnrollmentStep4Props) {
  const handleChange = (field: string, value: string | null) => {
    onDataChange({
      ...data,
      [field]: value ?? '',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Learning Preferences</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose how you prefer to attend the training.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="preferredLearningMode" className="text-sm font-medium">
            Preferred Learning Mode <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.preferredLearningMode || ''}
            onValueChange={(value) => handleChange('preferredLearningMode', value)}
          >
            <SelectTrigger id="preferredLearningMode" className="mt-1.5">
              <SelectValue placeholder="Select learning mode" />
            </SelectTrigger>
            <SelectContent>
              {LEARNING_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
