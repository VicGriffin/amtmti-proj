import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Public endpoint returning approved members only.
 * Fields: name, organization, country, tier, created_at (as ISO string)
 * Pagination via `page` (1‑based) and `limit` query params.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get('page') ?? '1'), 1);
  const limit = Math.max(parseInt(url.searchParams.get('limit') ?? '20'), 1);
  const offset = (page - 1) * limit;

  let supabase
  try {
    supabase = await createClient({
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
  } catch (error) {
    console.error('Public members API: Supabase not configured', error)
    return NextResponse.json(
      { members: [], pagination: { page, limit, total: 0 } },
      { status: 200 },
    )
  }

  const { data, error, count } = await supabase
    .from('membership_applications')
    .select('name, organization, country, tier, created_at', { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  console.log('Approved members count:', data?.length);
  console.log('Approved members:', data);

  if (error) {
    console.error('Public members API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return data plus pagination meta.
  return NextResponse.json({
    members: data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
    },
  });
}
