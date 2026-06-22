import { prisma } from '@/lib/db';
import type { EnrollmentApplication, Program } from '@prisma/client';

interface ProgramSummary {
  id: string
  slug: string
  title: string
  feesKsh: number
  category: string
  duration: string | null
  mode: string
}

/** Find a program by selector (id, slug, or title) */
export async function findProgramBySelector(
  field: 'id' | 'slug' | 'title',
  value: string,
): Promise<ProgramSummary | null> {
  try {
    const where: Record<string, string> = { [field]: value };
    return await prisma.program.findFirst({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        feesKsh: true,
        category: true,
        duration: true,
        mode: true,
      },
    }) as ProgramSummary | null;
  } catch (err) {
    console.error('Error fetching program by selector', err);
    return null;
  }
}

/** Create a new enrollment application */
export async function createEnrollmentApplication(
  data: Omit<EnrollmentApplication, 'id' | 'createdAt'>,
): Promise<EnrollmentApplication | null> {
  try {
    return await prisma.enrollmentApplication.create({ data });
  } catch (err) {
    console.error('Error creating enrollment application', err);
    return null;
  }
}

/** Update email_status of enrollment application */
export async function setEnrollmentEmailStatus(
  id: string,
  status: string,
): Promise<boolean> {
  try {
    await prisma.enrollmentApplication.update({
      where: { id },
      data: { emailStatus: status },
    });
    return true;
  } catch (err) {
    console.error('Error updating email_status', err);
    return false;
  }
}

/** Get enrollment by id */
export async function getEnrollmentById(id: string): Promise<EnrollmentApplication | null> {
  try {
    return await prisma.enrollmentApplication.findUnique({ where: { id } });
  } catch (err) {
    console.error('Error fetching enrollment by id', err);
    return null;
  }
}

/** List all enrollment applications ordered by createdAt descending */
export async function listEnrollments(): Promise<EnrollmentApplication[]> {
  try {
    return await prisma.enrollmentApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Error listing enrollments', err);
    return [];
  }
}
