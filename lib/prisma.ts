import { PrismaClient } from "./generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

function getConnectionString(): string {
  const url = process.env.DATABASE_URL ?? ""
  if (url.startsWith("prisma+postgres://")) {
    try {
      const parsed = new URL(url)
      const apiKey = parsed.searchParams.get("api_key") ?? ""
      const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString("utf-8"))
      return decoded.databaseUrl as string
    } catch {
      throw new Error("Invalid prisma+postgres DATABASE_URL")
    }
  }
  return url
}

function createPrismaClient() {
  const connectionString = getConnectionString()
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
