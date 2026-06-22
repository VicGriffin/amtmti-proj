import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-token'

function getToken(req: Request): string | undefined {
  const cookie = req.headers.get('cookie') ?? ''
  const match = cookie.split(';').find(c => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`))
  return match?.split('=')[1]
}

export async function GET(req: Request) {
  const token = getToken(req)
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('program_categories').select('*').order('title')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const token = getToken(req)
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { slug, title, description } = body
  const supabase = createAdminClient()
  // Use .select().single() — .insert().single() is deprecated in Supabase v2
  const { data, error } = await supabase
    .from('program_categories')
    .insert({ slug, title, description })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
