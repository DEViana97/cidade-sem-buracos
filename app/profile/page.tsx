import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PotholeCard } from "@/components/potholes/PotholeCard"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Meu perfil" }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const potholes = await prisma.pothole.findMany({
    where: { userId: session.user.id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  const total = potholes.length
  const resolved = potholes.filter((p) => p.status === "RESOLVED").length
  const open = total - resolved

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <p className="text-muted-foreground text-sm">{session.user.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <MapPin className="size-5 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <AlertTriangle className="size-5 text-red-500 mb-2" />
            <p className="text-2xl font-bold">{open}</p>
            <p className="text-xs text-muted-foreground">Abertos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <CheckCircle className="size-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{resolved}</p>
            <p className="text-xs text-muted-foreground">Resolvidos</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Meus registros</h2>
        {potholes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="size-10 mx-auto mb-3 opacity-30" />
            <p>Você ainda não registrou nenhum buraco.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {potholes.map((p) => (
              <PotholeCard key={p.id} pothole={JSON.parse(JSON.stringify(p))} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
