import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('membership_applications')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
