import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "Não autorizado" }, { status: 401 })

  const potholes = await prisma.pothole.findMany({
    where: { userId: session.user.id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  const total = potholes.length
  const resolved = potholes.filter((p) => p.status === "RESOLVED").length

  return Response.json({ total, open: total - resolved, resolved, potholes })
}
