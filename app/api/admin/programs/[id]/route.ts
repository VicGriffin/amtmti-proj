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
  const url = new URL(req.url)
  const id = url.pathname.split('/').filter(Boolean).pop()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('programs').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const token = await getToken(req)
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const id = url.pathname.split('/').filter(Boolean).pop()
  const body = await req.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('programs').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const token = await getToken(req)
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const id = url.pathname.split('/').filter(Boolean).pop()
  const supabase = createAdminClient()
  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
