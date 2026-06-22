import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
