'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from "sonner"

interface Membership {
  id: string
  user_id: string | null
  program_id: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'cancelled'
  tier: string
  approval_notes: string | null
  rejection_reason: string | null
  approved_at: string | null
  created_at: string
  programs?: {
    id: string
    title: string
    slug: string
  }
}

export default function MembershipsAdminPage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMemberships = async (status?: string) => {
    setLoading(true)
    try {
      const query = status ? `?status=${status}` : '?status=pending'
      const res = await fetch(`/api/admin/membership/list${query}`)
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setMemberships(data.data || [])
    } catch (e) {
      toast.error('Could not load memberships')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemberships(statusFilter)
  }, [statusFilter])

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/membership/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: notes[id] || '',
          adminId: 'admin-user-id', // Will be set by backend
        }),
      })
      if (!res.ok) throw new Error('Action failed')
      toast.success('Membership approved')
      await fetchMemberships(statusFilter)
      setExpandedId(null)
    } catch (e) {
      toast.error('Failed to approve membership')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/membership/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: notes[id] || '',
          adminId: 'admin-user-id',
        }),
      })
      if (!res.ok) throw new Error('Action failed')
      toast.success('Membership rejected')
      await fetchMemberships(statusFilter)
      setExpandedId(null)
    } catch (e) {
      toast.error('Failed to reject membership')
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Membership Management</h1>
          <p className="text-muted-foreground mt-1">Review and approve student memberships</p>
        </div>
        <Link href="/admin"><Button variant="outline">Back</Button></Link>
      </div>

      <div className="mb-6 flex gap-2">
        {['pending', 'approved', 'rejected'].map(status => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            onClick={() => setStatusFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {memberships.length === 0 ? (
        <Card className="p-6 text-center">
          No {statusFilter} memberships found.
        </Card>
      ) : (
        <div className="space-y-4">
          {memberships.map((m) => (
            <Card
              key={m.id}
              className="p-4 cursor-pointer hover:bg-accent/50 transition"
              onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{m.programs?.title || 'Program'}</h3>
                  <p className="text-sm text-muted-foreground">{m.user_id}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{m.tier}</Badge>
                    <Badge className={
                      m.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : m.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : m.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }>
                      {m.status}
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </div>

              {expandedId === m.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {m.approval_notes && (
                    <div>
                      <h4 className="text-sm font-medium">Approval Notes</h4>
                      <p className="text-sm text-muted-foreground">{m.approval_notes}</p>
                    </div>
                  )}
                  {m.rejection_reason && (
                    <div>
                      <h4 className="text-sm font-medium">Rejection Reason</h4>
                      <p className="text-sm text-muted-foreground">{m.rejection_reason}</p>
                    </div>
                  )}

                  {m.status === 'pending' && (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Add approval or rejection notes..."
                        value={notes[m.id] || ''}
                        onChange={(e) => setNotes({ ...notes, [m.id]: e.target.value })}
                        className="w-full p-2 border rounded text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(m.id)}
                          disabled={actionLoading === m.id}
                          className="gap-2"
                        >
                          {actionLoading === m.id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(m.id)}
                          variant="destructive"
                          disabled={actionLoading === m.id}
                          className="gap-2"
                        >
                          {actionLoading === m.id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
