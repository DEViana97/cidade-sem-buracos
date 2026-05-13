import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { potholeSchema } from "@/lib/validations"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status = searchParams.get("status")

  const potholes = await prisma.pothole.findMany({
    where: status ? { status: status as "OPEN" | "RESOLVED" } : undefined,
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(potholes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Não autorizado" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const count = await prisma.pothole.count({
      where: { userId: session.user.id, createdAt: { gte: today } },
    })
    if (count >= 10) {
      return Response.json({ error: "Limite de 10 registros por dia atingido" }, { status: 429 })
    }
  }

  const body = await req.json()
  const parsed = potholeSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const pothole = await prisma.pothole.create({
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, name: true } } },
  })

  return Response.json(pothole, { status: 201 })
}
