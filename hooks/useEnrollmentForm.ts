'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  enrollmentStep1Schema,
  enrollmentStep2Schema,
  enrollmentStep3Schema,
  enrollmentStep4Schema,
  normalizeEnrollmentCourseType,
  type FullEnrollment,
} from '@/lib/validations/enrollment'

interface Course {
  id: string
  name: string
  course_type: string
  category?: string
  duration?: string
  mode?: string
  fees_ksh?: number
}

const STORAGE_KEY = 'amtmti-enrollment-form'

const initialFormData: FullEnrollment = {
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
}

export function useEnrollmentForm() {
  const [formData, setFormData] = useState<FullEnrollment>(() => {
    if (typeof window === 'undefined') {
      return initialFormData
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return initialFormData
      }

      const parsed = JSON.parse(stored) as Partial<FullEnrollment>

      return {
        ...initialFormData,
        ...parsed,
        courseType: normalizeEnrollmentCourseType(parsed.courseType),
      }
    } catch {
      return initialFormData
    }
  })

  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) return

      const fullName = user.user_metadata?.full_name as string | undefined
      const email = user.email ?? ''
      const phone = user.user_metadata?.phone as string | undefined

      if (
        fullName &&
        !formData.firstName &&
        !formData.lastName &&
        !formData.email
      ) {
        const [firstName = '', lastName = ''] = fullName.split(' ')
        setFormData((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: email || prev.email,
          phone: phone || prev.phone,
        }))
      }
    }

    loadUser().catch(console.error)
  }, [])

  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true)

      try {
        const response = await fetch(
          `/api/courses?courseType=${encodeURIComponent(formData.courseType)}`,
        )

        if (response.ok) {
          const data = await response.json()
          setCourses(data)
        }
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoadingCourses(false)
      }
    }

    loadCourses()
  }, [formData.courseType])

  const validateStep = useCallback(
    (step: number): boolean => {
      try {
        if (step === 1) {
          enrollmentStep1Schema.parse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          })
        } else if (step === 2) {
          enrollmentStep2Schema.parse({
            country: formData.country,
            region: formData.region,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
          })
        } else if (step === 3) {
          enrollmentStep3Schema.parse({
            intake: formData.intake,
            courseType: formData.courseType,
            courseId: formData.courseId,
            courseName: formData.courseName,
            programCategory: undefined,
            programDuration: undefined,
            programStudyMode: undefined,
            programFee: undefined,
          })
        } else if (step === 4) {
          enrollmentStep4Schema.parse({
            preferredLearningMode: formData.preferredLearningMode,
          })
        }

        return true
      } catch {
        return false
      }
    },
    [formData],
  )

  return {
    formData,
    setFormData,
    validateStep,
    courses,
    loadingCourses,
  }
}
