import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/potholes/[id]">) {
  const { id } = await ctx.params

  const pothole = await prisma.pothole.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } } },
  })

  if (!pothole) return Response.json({ error: "Não encontrado" }, { status: 404 })

  return Response.json(pothole)
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/potholes/[id]">) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await ctx.params
  const pothole = await prisma.pothole.findUnique({ where: { id } })
  if (!pothole) return Response.json({ error: "Não encontrado" }, { status: 404 })

  const isAdmin = session.user.role === "ADMIN"
  if (pothole.userId !== session.user.id && !isAdmin) {
    return Response.json({ error: "Proibido" }, { status: 403 })
  }

  await prisma.pothole.delete({ where: { id } })
  return Response.json({ success: true })
}
