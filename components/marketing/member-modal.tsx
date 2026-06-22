"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
// Simple date formatter (fallback for date-fns)
function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
import type { Member } from '@/components/marketing/member-card'

interface Props {
  member: Member
  onClose: () => void
}

export function MemberModal({ member, onClose }: Props) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const memberSince = format(new Date(member.created_at), 'PPP')

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex items-center gap-4 mb-4">
            <Avatar size="lg">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {member.organization && <p>{member.organization}</p>}
              {member.country && <p>{member.country}</p>}
            </div>
          </div>
          <Badge variant="secondary" className="mb-2">{member.tier}</Badge>
          <p className="text-sm text-muted-foreground">Member Since: {memberSince}</p>
        </DialogDescription>
        <DialogClose />
      </DialogContent>
    </Dialog>
  )
}
