import type { Data } from "@measured/puck";
import { prisma } from "./db";

export interface Page {
  id: number;
  path: string;
  data: Data;
  userId: number;
}

/**
 * Get a page by path (only non-deleted pages)
 */
export async function getPage(path: string, userId: number): Promise<Data | null> {
  const page = await prisma.page.findFirst({
    where: {
      path,
      user_id: userId,
      deleted_at: null,
    },
  });

  return page ? (page.data as Data) : null;
}

/**
 * Save a page (create or update)
 */
export async function savePage(path: string, data: Data, userId: number): Promise<void> {
  await prisma.page.upsert({
    where: { path },
    update: { 
      data: data as any,
      updated_at: new Date(),
    },
    create: { 
      path, 
      data: data as any,
      user_id: userId,
    },
  });
}

/**
 * Resolve a page - returns the page data or a default empty page
 */
export async function resolvePage(path: string, userId: number): Promise<Data> {
  const data = await getPage(path, userId);
  
  if (!data) {
    // Return default empty page structure
    return {
      content: [],
      root: {
        props: {
          title: "New Page",
        },
      },
    };
  }
  
  return data;
}

/**
 * Soft delete a page
 */
export async function deletePage(path: string, userId: number): Promise<void> {
  await prisma.page.updateMany({
    where: {
      path,
      user_id: userId,
      deleted_at: null,
    },
    data: {
      deleted_at: new Date(),
    },
  });
}

/**
 * Get all pages for a user (non-deleted)
 */
export async function getUserPages(userId: number): Promise<Page[]> {
  const pages = await prisma.page.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    orderBy: {
      updated_at: 'desc',
    },
  });

  return pages.map(page => ({
    id: page.id,
    path: page.path,
    data: page.data as Data,
    userId: page.user_id,
  }));
}

