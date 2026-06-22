'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, Download } from 'lucide-react'
import { toast } from 'sonner'

interface EnrollmentApplication {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  region: string
  course_name: string
  program_fee: number
  intake: string
  application_status: string
  payment_status: string
  email_status: string
  created_at: string
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadEnrollments()
  }, [])

  async function loadEnrollments() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/enrollments')
      if (!response.ok) throw new Error('Failed to load enrollments')

      const data = await response.json()
      setEnrollments(data)
    } catch (error) {
      console.error('Error loading enrollments:', error)
      toast.error('Failed to load enrollments')
    } finally {
      setLoading(false)
    }
  }

  const filteredEnrollments = enrollments.filter((e) => {
    if (statusFilter === 'all') return true
    return e.application_status === statusFilter
  })

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    return new Date(dateString).toLocaleDateString('en-KE')
  }

  const handleExport = () => {
    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Program',
      'Fee',
      'Application Status',
      'Payment Status',
      'Submitted',
    ]
    const rows = filteredEnrollments.map((e) => [
      `${e.first_name} ${e.last_name}`,
      e.email,
      e.phone,
      e.country,
      e.course_name,
      formatCurrency(e.program_fee),
      e.application_status,
      e.payment_status,
      formatDate(e.created_at),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enrollments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Enrollment Applications</h1>
              <p className="text-muted-foreground">
                {enrollments.length} total applications
              </p>
            </div>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading enrollments...</p>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No applications found</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Applicant Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Program</TableHead>
                  <TableHead className="font-semibold">Fee</TableHead>
                  <TableHead className="font-semibold">Application</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {enrollment.first_name} {enrollment.last_name}
                    </TableCell>
                    <TableCell className="text-sm">
                      <a
                        href={`mailto:${enrollment.email}`}
                        className="text-primary hover:underline"
                      >
                        {enrollment.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {enrollment.course_name}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatCurrency(enrollment.program_fee)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(enrollment.application_status)}>
                        {enrollment.application_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(enrollment.payment_status)}>
                        {enrollment.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(enrollment.created_at)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/enrollments/${enrollment.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
