"use client"
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MemberCard } from '@/components/marketing/member-card'
import { MemberModal } from '@/components/marketing/member-modal'
import { Loader2 } from 'lucide-react'

interface Member {
  name: string
  organization: string | null
  country: string | null
  tier: string
  created_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Member | null>(null)
  const [page, setPage] = useState(1)

  const limit = 20 // as per user choice

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true)
      try {
        const res = await fetch(`/api/members/public?page=${page}&limit=${limit}`)
        if (!res.ok) throw new Error('Network error')
        const json = await res.json()
        setMembers(json.members)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [page])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin size-8" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-2xl p-6 mt-12 text-center">
        <p className="text-red-600">Failed to load members: {error}</p>
      </Card>
    )
  }

  if (members.length === 0) {
    return (
      <Card className="mx-auto max-w-2xl p-6 mt-12 text-center">
        <p className="text-muted-foreground">No approved members found.</p>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-center">Community Members</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <MemberCard key={m.name} member={m} onClick={() => setSelected(m)} />
        ))}
      </div>
      {/* Simple pagination controls */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="rounded border px-3 py-1"
        >
          Next
        </button>
      </div>

      {selected && (
        <MemberModal member={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
