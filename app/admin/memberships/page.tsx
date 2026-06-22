'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from "sonner"

interface MembershipApplication {
  id: string
  name: string
  email: string
  organization: string | null
  country: string | null
  profession: string | null
  reason: string | null
  tier: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function MembershipsAdminPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/membership/list')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
        console.log('Fetched membership applications:', data)
        console.log('Applications length:', data.length)
      setApplications(data)
    } catch (e) {
      toast.error('Could not load membership applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleAction = async (id: string, type: 'approve' | 'reject') => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/membership/${id}/${type}`, { method: 'POST' })
      if (!res.ok) throw new Error('Action failed')
      toast.success(`Application ${type}d`)
      // Refresh list
      await fetchApplications()
    } catch (e) {
      toast.error(`Failed to ${type} application`)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">Membership Applications</h1>
        <Link href="/admin"><Button variant="outline">Back</Button></Link>
      </div>

      {applications.length === 0 ? (
        <Card className="p-6 text-center">No membership applications found.</Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Membership Tier</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.organization ?? '-'}</TableCell>
                <TableCell>{app.country ?? '-'}</TableCell>
                <TableCell>{app.profession ?? '-'}</TableCell>
                <TableCell>{app.tier}</TableCell>
                <TableCell>{app.reason ?? '-'}</TableCell>
                <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize"><Badge className={
        app.status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : app.status === 'approved'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }>{app.status}</Badge></TableCell>
                <TableCell className="text-right space-x-2">
                  {app.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoading === app.id}
                        onClick={() => handleAction(app.id, 'approve')}
                      >
                        {actionLoading === app.id ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-1" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={actionLoading === app.id}
                        onClick={() => handleAction(app.id, 'reject')}
                      >
                        {actionLoading === app.id ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-1" />
                        ) : (
                          <X className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
