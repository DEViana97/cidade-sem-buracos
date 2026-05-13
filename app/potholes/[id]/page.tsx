import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { StatusBadge } from "@/components/potholes/StatusBadge"
import { ShareButtons } from "@/components/potholes/ShareButtons"
import { ResolveButton } from "@/components/potholes/ResolveButton"
import { daysSince, formatDate, timeAgo } from "@/lib/utils"
import { MapPin, Clock, User, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const pothole = await prisma.pothole.findUnique({ where: { id } })
  if (!pothole) return { title: "Buraco não encontrado" }
  return {
    title: `Buraco em ${pothole.address.split(",")[0]}`,
    description: `Buraco registrado em ${pothole.address}. Status: ${pothole.status === "OPEN" ? "Aberto" : "Resolvido"}.`,
    openGraph: {
      title: `🚧 Buraco em ${pothole.address.split(",")[0]}`,
      description: `${daysSince(pothole.createdAt)} dias sem solução`,
      images: pothole.imageUrl ? [{ url: pothole.imageUrl }] : [],
    },
  }
}

import { DynamicMap as MiniMap } from "@/components/map/DynamicMap"

export default async function PotholePage({ params }: Props) {
  const { id } = await params
  const [pothole, session] = await Promise.all([
    prisma.pothole.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    }),
    auth(),
  ])

  if (!pothole) notFound()

  const days = daysSince(pothole.createdAt)
  const canResolve =
    pothole.status === "OPEN" &&
    (session?.user?.id === pothole.userId || session?.user?.role === "ADMIN")

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-bold">{pothole.address}</h1>
          <StatusBadge status={pothole.status} />
        </div>

        {pothole.status === "OPEN" && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              days > 30 ? "text-red-600" : days > 7 ? "text-orange-600" : "text-yellow-600"
            }`}
          >
            <Clock className="size-4" />
            {days === 0 ? "Registrado hoje" : `${days} dia${days > 1 ? "s" : ""} sem solução`}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-64 rounded-xl overflow-hidden border">
        <MiniMap
          potholes={[JSON.parse(JSON.stringify(pothole))]}
          height="100%"
          center={[pothole.latitude, pothole.longitude]}
          zoom={16}
          showControls={false}
        />
      </div>

      {/* Image */}
      {pothole.imageUrl && (
        <img
          src={pothole.imageUrl}
          alt="Foto do buraco"
          className="w-full rounded-xl object-cover max-h-64 border"
        />
      )}

      {/* Details */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          {pothole.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Descrição
              </p>
              <p className="text-sm">{pothole.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Registrado em
              </p>
              <p className="text-sm font-medium">{formatDate(pothole.createdAt)}</p>
            </div>
            {pothole.resolvedAt && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" /> Resolvido em
                </p>
                <p className="text-sm font-medium">{formatDate(pothole.resolvedAt)}</p>
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="size-3" /> Registrado por
              </p>
              <p className="text-sm font-medium">{pothole.user.name}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3" /> Coordenadas
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                {pothole.latitude.toFixed(5)}, {pothole.longitude.toFixed(5)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {canResolve && <ResolveButton potholeId={pothole.id} />}
        <ShareButtons potholeId={pothole.id} address={pothole.address} />
      </div>
    </div>
  )
}
