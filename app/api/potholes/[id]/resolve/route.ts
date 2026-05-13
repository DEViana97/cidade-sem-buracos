import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/potholes/[id]/resolve">) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await ctx.params
  const pothole = await prisma.pothole.findUnique({ where: { id } })
  if (!pothole) return Response.json({ error: "Não encontrado" }, { status: 404 })

  const isAdmin = session.user.role === "ADMIN"
  if (pothole.userId !== session.user.id && !isAdmin) {
    return Response.json({ error: "Proibido" }, { status: 403 })
  }

  if (pothole.status === "RESOLVED") {
    return Response.json({ error: "Já resolvido" }, { status: 400 })
  }

  const updated = await prisma.pothole.update({
    where: { id },
    data: { status: "RESOLVED", resolvedAt: new Date() },
    include: { user: { select: { id: true, name: true } } },
  })

  revalidatePath("/map")
  revalidatePath(`/potholes/${id}`)
  revalidatePath("/dashboard")

  return Response.json(updated)
}
