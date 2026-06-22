import { prisma } from '@/lib/db';
import type { ContactMessage } from '@prisma/client';

/** Create a new contact message */
export async function createContactMessage(data: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage | null> {
  try {
    return await prisma.contactMessage.create({ data });
  } catch (err) {
    console.error('Error creating contact message', err);
    return null;
  }
}

/** List all contact messages (admin) */
export async function listContactMessages(): Promise<ContactMessage[]> {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Error fetching contact messages', err);
    return [];
  }
}
