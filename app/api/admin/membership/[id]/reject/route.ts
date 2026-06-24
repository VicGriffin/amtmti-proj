import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { reason = '', adminId } = body

  const supabase = createAdminClient()

  // Update membership status with rejection reason
  const { data, error } = await supabase
    .from('memberships')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      approved_by: adminId,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Reject error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
