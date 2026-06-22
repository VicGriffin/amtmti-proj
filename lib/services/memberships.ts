import { prisma } from '@/lib/db';
import type { MembershipApplication } from '@prisma/client';

interface PublicMembership {
  name: string
  organization: string | null
  country: string | null
  tier: string
  createdAt: Date
}

/** Get all approved membership applications (public API) */
export async function getApprovedMemberships({ page = 1, limit = 20 }: { page?: number; limit?: number; } = {}): Promise<{ members: PublicMembership[]; total: number }> {
  const skip = (page - 1) * limit;
  try {
    const [members, total] = await Promise.all([
      prisma.membershipApplication.findMany({
        where: { status: 'approved' },
        select: {
          name: true,
          organization: true,
          country: true,
          tier: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }) as Promise<PublicMembership[]>,
      prisma.membershipApplication.count({ where: { status: 'approved' } }),
    ]);
    return { members, total };
  } catch (err) {
    console.error('Error fetching approved memberships', err);
    return { members: [], total: 0 };
  }
}

/** Create a new membership application */
export async function createMembershipApplication(data: Omit<MembershipApplication, 'id' | 'createdAt'>): Promise<MembershipApplication | null> {
  try {
    return await prisma.membershipApplication.create({ data });
  } catch (err) {
    console.error('Error creating membership application', err);
    return null;
  }
}

/** Approve a membership application */
export async function approveMembership(id: string): Promise<boolean> {
  try {
    await prisma.membershipApplication.update({
      where: { id },
      data: { status: 'approved' },
    });
    return true;
  } catch (err) {
    console.error(`Error approving membership ${id}`, err);
    return false;
  }
}

/** Reject a membership application */
export async function rejectMembership(id: string): Promise<boolean> {
  try {
    await prisma.membershipApplication.update({
      where: { id },
      data: { status: 'rejected' },
    });
    return true;
  } catch (err) {
    console.error(`Error rejecting membership ${id}`, err);
    return false;
  }
}
