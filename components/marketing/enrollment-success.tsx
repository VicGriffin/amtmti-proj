'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EnrollmentSuccessProps {
  onClose: () => void
  onStartNew: () => void
}

export function EnrollmentSuccess({ onClose, onStartNew }: EnrollmentSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6">
        <CheckCircle2 className="mx-auto size-16 text-green-600" />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Thank You For Applying To AMTMTI
      </h2>

      <p className="mb-6 max-w-sm text-muted-foreground">
        Our team will reach out to you shortly.
      </p>

      <div className="mb-8 space-y-2 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-medium text-foreground">
          Congratulations on taking the first step towards your medical journey.
        </p>
        <p className="text-xs text-muted-foreground">
          You will receive a confirmation email with your application details shortly.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-6"
        >
          Close
        </Button>
        <Button
          onClick={onStartNew}
          className="bg-gold text-gold-foreground hover:bg-gold/90 px-6"
        >
          Start New Form
        </Button>
      </div>
    </div>
  )
}
