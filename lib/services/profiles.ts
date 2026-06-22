import { prisma } from '@/lib/db';
import type { Profile } from '@/prisma/generated/client'; // generated type

/**
 * Fetch a profile by its UUID.
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    return await prisma.profile.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error('Error fetching profile', err);
    return null;
  }
}
