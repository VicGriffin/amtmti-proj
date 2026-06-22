'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  status: string
}

import { useRouter } from 'next/navigation';

export default function AdminMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/contact/list')
      if (!res.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await res.json()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load messages')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <Button variant="outline" onClick={() => router.push('/admin')}>
          ← Back
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {!loading && !error && messages.length === 0 && (
        <Card className="p-6 text-center">No messages found.</Card>
      )}

      {!loading && !error && messages.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell>{formatDate(msg.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
