import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { notes = '', adminId } = body

  const supabase = createAdminClient()

  // Get the membership to retrieve admin user info
  const { data: adminUser } = await supabase.auth.admin.getUserById(adminId)

  // Update membership status
  const { data, error } = await supabase
    .from('memberships')
    .update({
      status: 'approved',
      approval_notes: notes,
      approved_by: adminId,
      approved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
