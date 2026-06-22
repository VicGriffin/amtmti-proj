"use client"
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { MouseEventHandler } from 'react'

export interface Member {
  name: string
  organization: string | null
  country: string | null
  tier: string
  created_at: string
}

interface Props {
  member: Member
  onClick?: MouseEventHandler<HTMLDivElement>
}

import Link from 'next/link';

export function MemberCard({ member, onClick }: Props) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Build the URL to the member detail page (using the member's created_at as a pseudo‑id, or you could use a real UUID if exposed). We'll use the `created_at` timestamp as a unique query param for demo purposes.
  const memberId = encodeURIComponent(member.created_at);
  const href = `/members/${memberId}`;

  return (
    <Link href={href} legacyBehavior>
      <a>
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onClick}
        >
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{member.name}</h3>
              {member.organization && (
                <p className="text-sm text-muted-foreground">{member.organization}</p>
              )}
              {member.country && (
                <p className="text-xs text-muted-foreground">{member.country}</p>
              )}
            </div>
            <Badge variant="secondary" className="ml-auto whitespace-nowrap">{member.tier}</Badge>
          </div>
        </Card>
      </a>
    </Link>
  );
}
