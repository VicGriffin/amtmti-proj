/**
 * Prisma singleton that re-uses a single client instance during hot-module
 * replacement in development. Uses the Prisma 7 PostgreSQL driver adapter.
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare const globalThis: typeof global & {
  prisma?: PrismaClient
  prismaPool?: Pool
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured')
  }

  // Reuse pool across requests (cached in global for both dev + prod)
  const pool = globalThis.prismaPool ?? new Pool({ connectionString })
  globalThis.prismaPool = pool

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })
}

export function getPrisma(): PrismaClient {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient()
  }

  return globalThis.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
