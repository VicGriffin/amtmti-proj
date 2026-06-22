import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

/**
 * Server component that renders the public view of a single approved member.
 * The route param `memberId` is the ISO timestamp (created_at) encoded via encodeURIComponent.
 * We query the Supabase table directly (service‑role key) for that exact timestamp.
 */
export default async function MemberDetail({
  params,
}: {
  params: Promise<{ memberId: string }>
}) {
  const { memberId } = await params

  let supabase
  try {
    supabase = await createClient({
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
  } catch {
    return (
      <Card className="mx-auto mt-12 max-w-2xl p-6 text-center">
        <p className="text-muted-foreground">Member profiles are temporarily unavailable.</p>
      </Card>
    )
  }

  const createdAt = decodeURIComponent(memberId)

  const { data, error } = await supabase
    .from('membership_applications')
    .select('name, organization, country, tier, created_at')
    .eq('created_at', createdAt)
    .single();

  if (error || !data) {
    return (
      <Card className="mx-auto max-w-2xl p-6 mt-12 text-center">
        <p className="text-red-600">Member not found.</p>
      </Card>
    );
  }

  const initials = data.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  const memberSince = format(new Date(data.created_at), 'PPP');

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{data.name}</h2>
            {data.organization && <p>{data.organization}</p>}
            {data.country && <p>{data.country}</p>}
          </div>
        </div>
        <Badge variant="secondary" className="mb-2">{data.tier}</Badge>
        <p className="text-sm text-muted-foreground">Member Since: {memberSince}</p>
      </Card>
    </div>
  );
}
