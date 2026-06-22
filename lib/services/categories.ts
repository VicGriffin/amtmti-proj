import { prisma } from '@/lib/db';
import type { ProgramCategory } from '@prisma/client';

/** Fetch all program categories */
export async function getAllCategories(): Promise<ProgramCategory[]> {
  try {
    return await prisma.programCategory.findMany({
      orderBy: { title: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching categories', err);
    return [];
  }
}

/** Get a single category by id */
export async function getCategoryById(id: string): Promise<ProgramCategory | null> {
  try {
    return await prisma.programCategory.findUnique({ where: { id } });
  } catch (err) {
    console.error(`Error fetching category ${id}`, err);
    return null;
  }
}

/** Create a new category */
export async function createCategory(data: Partial<ProgramCategory>): Promise<ProgramCategory | null> {
  try {
    return await prisma.programCategory.create({ data: data as any });
  } catch (err) {
    console.error('Error creating category', err);
    return null;
  }
}

/** Update an existing category */
export async function updateCategory(id: string, data: Partial<ProgramCategory>): Promise<ProgramCategory | null> {
  try {
    return await prisma.programCategory.update({ where: { id }, data: data as any });
  } catch (err) {
    console.error(`Error updating category ${id}`, err);
    return null;
  }
}

/** Delete a category */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await prisma.programCategory.delete({ where: { id } });
    return true;
  } catch (err) {
    console.error(`Error deleting category ${id}`, err);
    return false;
  }
}
