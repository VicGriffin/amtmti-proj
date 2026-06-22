'use client'

import { Card } from '@/components/ui/card'
import { formatKsh } from '@/lib/formatters'
import type { FullEnrollment } from '@/lib/validations/enrollment'

interface EnrollmentStep5Props {
  data: FullEnrollment
  programDetails?: {
    name: string
    category: string
    duration: string
    mode: string
    fee: number
  }
}

export function EnrollmentStep5({ data, programDetails }: EnrollmentStep5Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review Your Application</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please review your information before submitting. Make sure everything is correct.
        </p>
      </div>

      <div className="space-y-6 max-h-[calc(100vh-28rem)] overflow-y-auto">
        <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Application Summary</h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Applicant Information</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-foreground">Name:</span> {data.firstName} {data.lastName}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Email:</span> {data.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Phone:</span> {data.phone}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Country:</span> {data.country}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Region:</span> {data.region}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Date of Birth:</span> {data.dateOfBirth}
                </p>
                {data.gender && (
                  <p className="text-sm">
                    <span className="font-medium text-foreground">Gender:</span> {data.gender}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Learning Preferences</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-foreground">Preferred Learning Mode:</span>{' '}
                  {data.preferredLearningMode || 'Not specified'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Program Details</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-foreground">Program:</span> {data.courseName}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Type:</span> {data.courseType}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Intake:</span> {data.intake}
                </p>
                {programDetails && (
                  <>
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Duration:</span> {programDetails.duration}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Study Mode:</span> {programDetails.mode}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-foreground">Application Status:</span>
                  <span className="ml-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    Pending Review
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Payment Status:</span>
                  <span className="ml-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    Pending
                  </span>
                </p>
              </div>

              {programDetails && programDetails.fee > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Program Fee:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatKsh(programDetails.fee)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-900">
          <span className="font-semibold">Ready to submit?</span> Click the Submit Application button below to complete your enrollment. You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  )
}
