import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeEnrollmentCourseType } from '@/lib/validations/enrollment'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawCourseType = searchParams.get('courseType')
    const courseType = rawCourseType
      ? normalizeEnrollmentCourseType(rawCourseType)
      : null

    const supabase = await createClient()

    let query = supabase
      .from('programs')
      .select('id, slug, title, category, level, duration, mode, fees_ksh')

    if (courseType) {
      query = query.eq('level', courseType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 },
      )
    }

    const mapped = (data || []).map((program: any) => ({
      id: program.slug || program.id,
      slug: program.slug,
      name: program.title,
      course_type: program.level,
      category: program.category,
      duration: program.duration,
      mode: program.mode,
      fees_ksh: program.fees_ksh,
    }))

    return NextResponse.json(mapped, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
