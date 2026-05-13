import { prisma } from "@/lib/prisma"

export async function GET() {
  const [total, resolved, openPotholes] = await Promise.all([
    prisma.pothole.count(),
    prisma.pothole.count({ where: { status: "RESOLVED" } }),
    prisma.pothole.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "asc" },
      take: 5,
      include: { user: { select: { id: true, name: true } } },
    }),
  ])

  const open = total - resolved
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  const resolvedWithTime = await prisma.pothole.findMany({
    where: { status: "RESOLVED", resolvedAt: { not: null } },
    select: { createdAt: true, resolvedAt: true },
  })

  const avgResolutionDays =
    resolvedWithTime.length > 0
      ? Math.round(
          resolvedWithTime.reduce((acc, p) => {
            const days = (p.resolvedAt!.getTime() - p.createdAt.getTime()) / 86400000
            return acc + days
          }, 0) / resolvedWithTime.length
        )
      : null

  const all = await prisma.pothole.findMany({ select: { address: true } })
  const regionMap: Record<string, number> = {}
  for (const p of all) {
    const region = p.address.split(",").slice(-2).join(",").trim()
    regionMap[region] = (regionMap[region] ?? 0) + 1
  }
  const regionBreakdown = Object.entries(regionMap)
    .map(([address, count]) => ({ address, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
  const recent = await prisma.pothole.findMany({
    where: { status: "RESOLVED", resolvedAt: { gte: thirtyDaysAgo } },
    select: { resolvedAt: true },
  })

  const byDay: Record<string, number> = {}
  for (const p of recent) {
    const day = p.resolvedAt!.toISOString().split("T")[0]
    byDay[day] = (byDay[day] ?? 0) + 1
  }
  const recentResolved = Object.entries(byDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return Response.json({
    total,
    open,
    resolved,
    resolutionRate,
    avgResolutionDays,
    regionBreakdown,
    oldestOpen: openPotholes,
    recentResolved,
  })
}
