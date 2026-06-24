import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Program } from '@/lib/programs-data'

const PROGRAM_SELECT = '*'

function createAnonSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

function mapProgram(row: any): Program {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    category_label: row.category_label,
    level: row.level,
    programme: row.programme || undefined,
    mode: row.mode,
    duration: row.duration || '',
    fees_ksh: row.fees_ksh || 0,
    summary: row.summary || '',
    outcomes: row.outcomes || [],
    featured: row.featured || false,
    image: row.image || undefined,
    intake: row.intake || 'Rolling enrolment',
    learning_methods: row.learning_methods || [
      'Guided modules with readings, case studies, and assessments.',
      'Live sessions and interactive clinics with faculty and peers.',
      'Applied practice tasks that translate learning into patient impact.',
    ],
  }
}

export async function getPrograms(options?: {
  programme?: string
  category?: string
  featured?: boolean
}) {
  const supabase = createAnonSupabaseClient()
  if (!supabase) {
    return [] as Program[]
  }

  let query = supabase
    .from('programs')
    .select(PROGRAM_SELECT)
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (options?.programme) {
    query = query.eq('programme', options.programme)
  }

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured) {
    query = query.eq('featured', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error loading programs:', error)
    return [] as Program[]
  }

  return (data || []).map(mapProgram)
}

export async function getFeaturedPrograms(limit = 4) {
  const programs = await getPrograms({ featured: true })
  return programs.slice(0, limit)
}

export async function getProgramBySlug(slug: string) {
  const supabase = createAnonSupabaseClient()
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('programs')
    .select(PROGRAM_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('Supabase error loading program by slug:', error)
    return null
  }

  if (!data) {
    return null
  }

  return mapProgram(data)
}

export async function getAllProgramSlugs() {
  const supabase = createAnonSupabaseClient()
  if (!supabase) {
    return [] as string[]
  }

  const { data, error } = await supabase
    .from('programs')
    .select('slug')
    .eq('status', 'published')

  if (error) {
    console.error('Supabase error loading program slugs:', error)
    return [] as string[]
  }

  return (data || []).map((row: any) => row.slug)
}
