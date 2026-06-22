import { prisma } from '@/lib/db';
import type { NewsletterSubscriber } from '@prisma/client';

/** Subscribe a new email to the newsletter */
export async function subscribeNewsletter(email: string): Promise<NewsletterSubscriber | null> {
  try {
    return await prisma.newsletterSubscriber.create({
      data: { email },
    });
  } catch (err) {
    console.error('Error subscribing to newsletter', err);
    return null;
  }
}

/** List all subscribers (admin use) */
export async function listSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    return await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Error fetching newsletter subscribers', err);
    return [];
  }
}
