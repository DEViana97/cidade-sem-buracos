import { prisma } from "@/lib/prisma"
import { DynamicMap } from "@/components/map/DynamicMap"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Mapa de buracos" }

export default async function MapPage() {
  const potholes = await prisma.pothole.findMany({
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <DynamicMap potholes={JSON.parse(JSON.stringify(potholes))} height="100%" showControls />
    </div>
  )
}
