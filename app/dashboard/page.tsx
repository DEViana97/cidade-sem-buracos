import { prisma } from "@/lib/prisma"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { RegionChart } from "@/components/dashboard/RegionChart"
import { ResolutionChart } from "@/components/dashboard/ResolutionChart"
import { OldestPotholes } from "@/components/dashboard/OldestPotholes"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Estatísticas Públicas" }

export default async function DashboardPage() {
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
            return acc + (p.resolvedAt!.getTime() - p.createdAt.getTime()) / 86400000
          }, 0) / resolvedWithTime.length
        )
      : null

  const all = await prisma.pothole.findMany({ select: { address: true } })
  const regionMap: Record<string, number> = {}
  for (const p of all) {
    const parts = p.address.split(",").map((s) => s.trim())
    // Nominatim BR: "Number, Street, Neighbourhood, City, ..."
    // parts[0]=number, parts[1]=street, parts[2]=neighbourhood
    const region = parts[2] ?? parts[1] ?? parts[0]
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Estatísticas Públicas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Dados em tempo real sobre buracos nas vias públicas.
        </p>
      </div>

      <StatsCards
        total={total}
        open={open}
        resolved={resolved}
        resolutionRate={resolutionRate}
        avgResolutionDays={avgResolutionDays}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <RegionChart data={regionBreakdown} />
        <OldestPotholes potholes={JSON.parse(JSON.stringify(openPotholes))} />
      </div>

      {recentResolved.length > 0 && <ResolutionChart data={recentResolved} />}
    </div>
  )
}
