import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json([])
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching public programs:', error)
    return NextResponse.json([])
  }

  return NextResponse.json(data ?? [])
}
