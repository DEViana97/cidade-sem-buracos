import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "Não autorizado" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { potholes: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(users)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { userId, role } = await req.json()
  if (!userId || !["USER", "ADMIN"].includes(role)) {
    return Response.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  })

  return Response.json(updated)
}
