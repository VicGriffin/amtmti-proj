import { z } from 'zod'

export const membershipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().optional(),
  profession: z.string().optional(),
  organization: z.string().optional(),
  membershipTier: z.enum(['Student', 'Affiliate', 'Corporate']),
  reasonForJoining: z.string().optional(),
})

export type MembershipApplication = z.infer<typeof membershipApplicationSchema>
