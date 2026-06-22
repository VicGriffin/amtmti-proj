'use client'

import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROGRAM_LEVELS } from '@/lib/site-data'
import { formatKsh } from '@/lib/formatters'
import type { FullEnrollment } from '@/lib/validations/enrollment'

interface Course {
  id: string
  slug?: string
  name: string
  course_type: string
  category?: string
  duration?: string
  mode?: string
  fees_ksh?: number
}

interface EnrollmentStep3Props {
  data: FullEnrollment
  onDataChange: (data: FullEnrollment) => void
  courses: Course[]
  loadingCourses: boolean
  lockedProgram?: boolean
}

const INTAKES = ['January', 'March', 'May', 'July', 'September', 'November']
const COURSE_TYPES = [...PROGRAM_LEVELS]

export function EnrollmentStep3({
  data,
  onDataChange,
  courses,
  loadingCourses,
  lockedProgram = false,
}: EnrollmentStep3Props) {
  const handleChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    })
  }

  // Reset course selection when course type changes
  useEffect(() => {
    if (!lockedProgram) {
      handleChange('courseId', '')
      handleChange('courseName', '')
    }
  }, [data.courseType, lockedProgram])

  const filteredCourses = courses.filter((course) => course.course_type === data.courseType)
  const selectedCourse = courses.find(
    (course) => course.id === data.courseId || course.slug === data.courseId,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Fill Course Details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select the intake period and course that matches your goals.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="intake" className="text-sm font-medium">
            Intake <span className="text-red-500">*</span>
          </Label>
          <Select value={data.intake} onValueChange={(value) => handleChange('intake', value)}>
            <SelectTrigger id="intake" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTAKES.map((intake) => (
                <SelectItem key={intake} value={intake}>
                  {intake}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="courseType" className="text-sm font-medium">
            Course Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.courseType}
            onValueChange={(value) => handleChange('courseType', value)}
            disabled={lockedProgram}
          >
            <SelectTrigger id="courseType" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURSE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="course" className="text-sm font-medium">
            Course <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.courseId}
            onValueChange={(value) => {
              const selectedCourse = courses.find(
                (c) => c.id === value || c.slug === value,
              )
              if (selectedCourse) {
                onDataChange({
                  ...data,
                  courseId: selectedCourse.id,
                  courseName: selectedCourse.name,
                })
              }
            }}
            disabled={lockedProgram || loadingCourses || filteredCourses.length === 0}
          >
            <SelectTrigger id="course" className="mt-1.5">
              <SelectValue
                placeholder={
                  loadingCourses
                    ? 'Loading courses...'
                    : filteredCourses.length === 0
                      ? 'No courses available'
                      : 'Select course'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourse && (
          <div className="rounded-lg border border-border bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-foreground">Enrollment Summary</h3>
            <div className="mt-4 space-y-3 text-sm text-foreground">
              <p>
                <span className="font-medium">Program:</span>{' '}
                {selectedCourse.name}
              </p>
              <p>
                <span className="font-medium">Category:</span>{' '}
                {selectedCourse.category || data.courseType}
              </p>
              <p>
                <span className="font-medium">Program Type:</span>{' '}
                {data.courseType}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {selectedCourse.duration || 'TBD'}
              </p>
              <p>
                <span className="font-medium">Study Mode:</span>{' '}
                {selectedCourse.mode || 'TBD'}
              </p>
              <p>
                <span className="font-medium">Intake:</span>{' '}
                {data.intake}
              </p>
              <p>
                <span className="font-medium">Amount Payable:</span>{' '}
                {formatKsh(selectedCourse.fees_ksh || 0)}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                Pending Application
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
