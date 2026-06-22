'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useEnrollmentForm } from '@/hooks/useEnrollmentForm'
import { EnrollmentStep1 } from './enrollment-step-1'
import { EnrollmentStep2 } from './enrollment-step-2'
import { EnrollmentStep3 } from './enrollment-step-3'
import { EnrollmentStep4 } from './enrollment-step-4'
import { EnrollmentStep5 } from './enrollment-step-5'
import { EnrollmentSuccess } from './enrollment-success'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

import type { Program } from '@/lib/programs-data'

interface EnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialProgram?: {
    slug: string
    title?: string
    level?: Program['level']
  } | null
}

interface ProgramDetails {
  name: string
  category: string
  duration: string
  mode: string
  fee: number
}

export function EnrollmentModal({ open, onOpenChange, initialProgram }: EnrollmentModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(null)
  const {
    formData,
    setFormData,
    validateStep,
    courses,
    loadingCourses,
  } = useEnrollmentForm()

  // If opened with an initial program, prefill course selection (uses slug)
  useEffect(() => {
    if (open && initialProgram) {
      setFormData((prev) => ({
        ...prev,
        courseType: initialProgram.level,
        courseId: initialProgram.slug || '',
        courseName: initialProgram.title || prev.courseName,
      }))
    }
  }, [open, initialProgram, setFormData])

  // Load program details when course is selected
  useEffect(() => {
    if (formData.courseId && courses.length > 0) {
      const selected = courses.find(
        (c) => c.id === formData.courseId || c.slug === formData.courseId,
      )
      if (selected) {
        setProgramDetails({
          name: selected.name,
          category: selected.category || '',
          duration: selected.duration || '',
          mode: selected.mode || '',
          fee: selected.fees_ksh || 0,
        })
      }
    }
  }, [formData.courseId, courses])

  useEffect(() => {
    if (initialProgram && courses.length > 0 && formData.courseId) {
      const selected = courses.find(
        (c) => c.id === formData.courseId || c.slug === formData.courseId,
      )
      if (selected && selected.id !== formData.courseId) {
        setFormData((prev) => ({
          ...prev,
          courseId: selected.id,
        }))
      }
    }
  }, [initialProgram, courses, formData.courseId, setFormData])

  useEffect(() => {
    if (!open) {
      setStep(1)
      setShowSuccess(false)
    }
  }, [open])

  const handleNext = async () => {
    if (!validateStep(step)) {
      toast.error('Please fill in all required fields correctly')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('Please complete all fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/enrollment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          programCategory: programDetails?.category || '',
          programDuration: programDetails?.duration || '',
          programStudyMode: programDetails?.mode || '',
          programFee: programDetails?.fee || 0,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Submission failed')
      }

      setShowSuccess(true)
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit application',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (showSuccess) {
      setStep(1)
      setShowSuccess(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+254',
        country: 'Kenya',
        region: '',
        dateOfBirth: '',
        gender: undefined,
        intake: 'January',
        courseType: 'Certificate',
        courseId: '',
        courseName: '',
        preferredLearningMode: 'Online',
      })
    }
    onOpenChange(false)
  }

  const progressPercentage = showSuccess ? 100 : (step / 5) * 100

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex h-auto max-h-[90vh] max-w-3xl flex-col border-0 p-0">
        {/* Progress Bar - Fixed Header */}
        <div className="bg-primary p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-foreground">
              {showSuccess ? 'Complete' : `Step ${step} of 5`}
            </span>
            <span className="text-xs text-primary-foreground/70">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1 bg-primary-foreground/20" />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnrollmentSuccess onClose={handleClose} onStartNew={handleClose} />
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <EnrollmentStep1
                      data={formData}
                      onDataChange={setFormData}
                    />
                  )}
                  {step === 2 && (
                    <EnrollmentStep2
                      data={formData}
                      onDataChange={setFormData}
                    />
                  )}
                  {step === 3 && (
                    <EnrollmentStep3
                      data={formData}
                      onDataChange={setFormData}
                      courses={courses}
                      loadingCourses={loadingCourses}
                      lockedProgram={Boolean(initialProgram)}
                    />
                  )}
                  {step === 4 && (
                    <EnrollmentStep4
                      data={formData}
                      onDataChange={setFormData}
                    />
                  )}
                  {step === 5 && (
                    <EnrollmentStep5
                      data={formData}
                      programDetails={programDetails || undefined}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer - Fixed */}
        {!showSuccess && (
          <div className="flex gap-3 border-t bg-slate-50 p-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="w-auto"
            >
              <ChevronLeft className="mr-2 size-4" />
              Back
            </Button>
            <div className="flex-1" />
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
