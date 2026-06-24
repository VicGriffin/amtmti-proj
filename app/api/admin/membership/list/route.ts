import { NextResponse, NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const admin = await isAdminAuthenticated()
  if (!admin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = createAdminClient()
  const status = req.nextUrl.searchParams.get('status')
  const programId = req.nextUrl.searchParams.get('programId')

  let query = supabase
    .from('memberships')
    .select('*, enrollments(*), programs(id, title, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (programId) {
    query = query.eq('program_id', programId)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching memberships:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [], total: count ?? 0 })
}
