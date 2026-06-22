import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminToken } from '@/lib/admin-token'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin authentication
    const token = req.cookies.get('amtmti_admin')?.value
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id } = await params
    const supabase = (await createClient({ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY })) as any

    const { data, error } = await supabase
      .from('enrollment_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin authentication
    const token = req.cookies.get('amtmti_admin')?.value
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await req.json()

    const { id } = await params
    const supabase = (await createClient({ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY })) as any

    const { data, error } = await supabase
      .from('enrollment_applications')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update enrollment' },
        { status: 500 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
