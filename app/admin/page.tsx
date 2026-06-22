'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminLogoutAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { FileText, Mail, Users, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    enrollments: 0,
    messages: 0,
    applications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats();
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const [enrollmentsRes, messagesRes, applicationsRes] = await Promise.all([
        fetch('/api/admin/enrollments'),
        fetch('/api/admin/contact/list'),
        fetch('/api/admin/membership/list'),
      ])

      // Temporary variables to hold the raw API arrays for logging later
      let enrollmentsData: any[] | undefined
      let messagesData: any[] | undefined
      let applicationsData: any[] | undefined

      if (enrollmentsRes.ok) {
        const enrollments = await enrollmentsRes.json()
        console.log('Enrollments API response:', enrollments)
        enrollmentsData = enrollments
        console.log('Enrollments count:', enrollments.length)
        setStats((s) => ({ ...s, enrollments: enrollments.length }))
      }
      if (messagesRes.ok) {
        const messages = await messagesRes.json()
        console.log('Messages API response:', messages)
        messagesData = messages
        console.log('Messages count:', messages.length)
        setStats((s) => ({ ...s, messages: messages.length }))
      }
      if (applicationsRes.ok) {
        const applications = await applicationsRes.json()
        console.log('Membership API response:', applications)
        applicationsData = applications
        console.log('Memberships count:', applications.length)
        setStats((s) => ({ ...s, applications: applications.length }))
      }

      // Log the aggregate values that were just set
      console.log('Stats being set:', {
        enrollments: enrollmentsData?.length ?? 0,
        messages: messagesData?.length ?? 0,
        applications: applicationsData?.length ?? 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await adminLogoutAction()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.back()}>← Back</Button>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage the AMTMTI platform</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/enrollments" className="block">
            <div className="bg-card border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Enrollments</div>
                  <div className="text-3xl font-bold mt-2">{stats.enrollments}</div>
                </div>
                <FileText className="h-8 w-8 text-primary/40" />
              </div>
            </div>
          </Link>

          <Link href="/admin/messages" className="block">
            <div className="bg-card border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Messages</div>
                  <div className="text-3xl font-bold mt-2">{stats.messages}</div>
                </div>
                <Mail className="h-8 w-8 text-primary/40" />
              </div>
            </div>
          </Link>

          <Link href="/admin/memberships" className="block">
            <div className="bg-card border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Memberships</div>
                  <div className="text-3xl font-bold mt-2">{stats.applications}</div>
                </div>
                <Users className="h-8 w-8 text-primary/40" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/enrollments">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Enrollments
              </Button>
            </Link>
            <Link href="/admin/messages">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                View Messages
              </Button>
            </Link>
            <Link href="/admin/memberships">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View Applications
              </Button>
            </Link>
            <Link href="/admin/programs">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
