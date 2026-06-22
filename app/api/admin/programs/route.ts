import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-token'

async function getToken(req: Request): Promise<string | undefined> {
  const cookie = req.headers.get('cookie') ?? ''
  const match = cookie.split(';').find(c => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`))
  return match?.split('=')[1]
}

export async function GET(req: Request) {
  const token = await getToken(req)
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('title', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const token = await getToken(req)
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const {
    slug,
    title,
    category,
    category_label,
    level,
    mode,
    duration,
    fees_ksh,
    summary,
    outcomes,
    featured,
    status,
    intake,
    image,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('programs')
    .insert([{
      slug,
      title,
      category,
      category_label,
      level,
      mode,
      duration,
      fees_ksh,
      summary,
      outcomes: outcomes ?? [],
      featured: featured ?? false,
      status: status ?? 'draft',
      intake,
      image,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
