'use client'
// @ts-nocheck

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, Mail, Phone, Globe } from 'lucide-react'
import { toast } from 'sonner'

interface EnrollmentDetail {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  region: string
  date_of_birth: string
  gender: string
  highest_education: string
  current_profession: string
  employer: string
  years_of_experience: string
  course_name: string
  course_type: string
  program_category: string
  program_duration: string
  program_study_mode: string
  program_fee: number
  intake: string
  interest_reason: string
  preferred_learning_mode: string
  application_status: string
  payment_status: string
  email_status: string
  created_at: string
}

export default function EnrollmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.id as string

  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadEnrollment()
  }, [enrollmentId])

  async function loadEnrollment() {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`)
      if (!response.ok) throw new Error('Failed to load enrollment')

      const data = await response.json()
      setEnrollment(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load enrollment')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(field: string, value: string) {
    if (!enrollment) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      const updated = await response.json()
      setEnrollment(updated)
      toast.success('Status updated successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading enrollment details...</p>
        </div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">Enrollment not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/enrollments">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {enrollment.first_name} {enrollment.last_name}
              </h1>
              <p className="text-muted-foreground">Enrollment Application</p>
            </div>
          </div>
          <Badge className={getStatusColor(enrollment.application_status)}>
            {enrollment.application_status}
          </Badge>
        </div>

        {/* Contact Information */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href={`mailto:${enrollment.email}`} className="font-medium text-primary hover:underline">
                  {enrollment.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{enrollment.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{enrollment.country}, {enrollment.region}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{enrollment.date_of_birth}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{enrollment.gender || 'Not specified'}</p>
            </div>
          </div>
        </Card>

        {/* Professional Background */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Professional Background</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Highest Education</p>
              <p className="font-medium">{enrollment.highest_education}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profession</p>
              <p className="font-medium">{enrollment.current_profession}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Employer/Institution</p>
              <p className="font-medium">{enrollment.employer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Years of Experience</p>
              <p className="font-medium">{enrollment.years_of_experience}</p>
            </div>
          </div>
        </Card>

        {/* Program Information */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Program Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Program</p>
              <p className="font-medium">{enrollment.course_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{enrollment.course_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{enrollment.program_category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{enrollment.program_duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Mode</p>
              <p className="font-medium">{enrollment.program_study_mode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Intake Month</p>
              <p className="font-medium">{enrollment.intake}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Program Fee</p>
              <p className="font-bold text-lg text-primary">{formatCurrency(enrollment.program_fee)}</p>
            </div>
          </div>
        </Card>

        {/* Learning Preference */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Preference</h2>
          <div>
            <p className="text-sm text-muted-foreground">Preferred Learning Mode</p>
            <p className="font-medium">{enrollment.preferred_learning_mode}</p>
          </div>
        </Card>

        {/* Interest Reason */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Interest in Program</h2>
          <div className="bg-slate-50 p-4 rounded-md border">
            <p className="whitespace-pre-wrap text-sm text-foreground">{enrollment.interest_reason}</p>
          </div>
        </Card>

        {/* Application Status Management */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Application Management</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Application Status</label>
              <Select
                value={enrollment.application_status}
                onValueChange={(value) => updateStatus('application_status', value)}
                disabled={updating}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
              <Select
                value={enrollment.payment_status}
                onValueChange={(value) => updateStatus('payment_status', value)}
                disabled={updating}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Metadata */}
        <Card className="p-6 bg-slate-50">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">{formatDate(enrollment.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email Status</p>
              <Badge className={enrollment.email_status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {enrollment.email_status}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
