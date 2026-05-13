import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { AdminUsersTable } from "@/components/admin/AdminUsersTable"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Painel Admin" }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/")

  const [total, resolved, users] = await Promise.all([
    prisma.pothole.count(),
    prisma.pothole.count({ where: { status: "RESOLVED" } }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { potholes: true } },
      },
      orderBy: { createdAt: "desc" },
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
          resolvedWithTime.reduce(
            (acc, p) => acc + (p.resolvedAt!.getTime() - p.createdAt.getTime()) / 86400000,
            0
          ) / resolvedWithTime.length
        )
      : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground text-sm">Visão geral e gestão de usuários</p>
      </div>

      <StatsCards
        total={total}
        open={open}
        resolved={resolved}
        resolutionRate={resolutionRate}
        avgResolutionDays={avgResolutionDays}
      />

      <div>
        <h2 className="text-lg font-semibold mb-4">Usuários ({users.length})</h2>
        <AdminUsersTable users={JSON.parse(JSON.stringify(users))} />
      </div>
    </div>
  )
}
