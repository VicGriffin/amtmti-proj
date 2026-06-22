import { prisma } from '@/lib/db';
import type { Program } from '@prisma/client';

/**
 * Fetch all published programs, optionally filtered.
 */
export async function getPublishedPrograms(): Promise<Program[]> {
  try {
    return await prisma.program.findMany({
      where: { status: 'published' },
      orderBy: { title: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching published programs', err);
    return [];
  }
}

/** Fetch a single program by slug (published only) */
export async function getProgramById(id: string): Promise<Program | null> {
  try {
    return await prisma.program.findUnique({ where: { id } });
  } catch (err) {
    console.error(`Error fetching program by id ${id}`, err);
    return null;
  }
}

/** Fetch all programs (any status) */
export async function getAllPrograms(): Promise<Program[]> {
  try {
    return await prisma.program.findMany({ orderBy: { title: 'asc' } });
  } catch (err) {
    console.error('Error fetching all programs', err);
    return [];
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    return await prisma.program.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.error(`Error fetching program ${slug}`, err);
    return null;
  }
}

/** Create a new program */
export async function createProgram(data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program | null> {
  try {
    return await prisma.program.create({ data });
  } catch (err) {
    console.error('Error creating program', err);
    return null;
  }
}

/** Update an existing program */
export async function updateProgram(id: string, data: Partial<Omit<Program, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Program | null> {
  try {
    return await prisma.program.update({
      where: { id },
      data,
    });
  } catch (err) {
    console.error(`Error updating program ${id}`, err);
    return null;
  }
}

/** Delete a program */
export async function deleteProgram(id: string): Promise<boolean> {
  try {
    await prisma.program.delete({ where: { id } });
    return true;
  } catch (err) {
    console.error(`Error deleting program ${id}`, err);
    return false;
  }
}
