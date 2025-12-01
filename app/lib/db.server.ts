import { PrismaClient } from '../../generated/prisma/client/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

declare global {
  var __prisma: PrismaClient | undefined;
}

const { Pool } = pg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter
const adapter = new PrismaPg(pool);

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.__prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export { prisma };
