import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('enrollments')
    .select('*, programs(id, title, slug, image, category_label)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { program_id } = body

  if (!program_id) {
    return NextResponse.json({ error: 'Program ID is required' }, { status: 400 })
  }

  // Check if user is already enrolled
  const { data: existingEnrollment, error: checkError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('program_id', program_id)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking enrollment:', checkError)
    return NextResponse.json({ error: checkError.message }, { status: 500 })
  }

  if (existingEnrollment) {
    return NextResponse.json(
      { error: 'Already enrolled in this program' },
      { status: 409 }
    )
  }

  // Create enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .insert({
      user_id: user.id,
      program_id,
      status: 'active',
    })
    .select()
    .single()

  if (enrollError) {
    console.error('Error creating enrollment:', enrollError)
    return NextResponse.json({ error: enrollError.message }, { status: 500 })
  }

  // Auto-create membership with pending status
  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .insert({
      user_id: user.id,
      enrollment_id: enrollment.id,
      program_id,
      status: 'pending',
      tier: 'student',
    })
    .select()
    .single()

  if (membershipError) {
    console.error('Error creating membership:', membershipError)
    return NextResponse.json({ error: membershipError.message }, { status: 500 })
  }

  return NextResponse.json({ enrollment, membership }, { status: 201 })
}
