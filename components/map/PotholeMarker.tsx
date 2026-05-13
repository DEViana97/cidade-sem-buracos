"use client"

import { Marker, Popup, Tooltip } from "react-leaflet"
import L from "leaflet"
import { useRouter } from "next/navigation"
import type { Pothole } from "@/types"
import { getMarkerColor, timeAgo, formatDate } from "@/lib/utils"

function createIcon(color: string) {
  return L.divIcon({
    html: `<div style="
      width: 24px; height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

interface Props {
  pothole: Pothole
}

export function PotholeMarker({ pothole }: Props) {
  const router = useRouter()
  const color = getMarkerColor(pothole.status, pothole.createdAt)
  const icon = createIcon(color)

  return (
    <Marker
      position={[pothole.latitude, pothole.longitude]}
      icon={icon}
      eventHandlers={{ click: () => router.push(`/potholes/${pothole.id}`) }}
    >
      <Tooltip direction="top" offset={[0, -14]} opacity={1}>
        <div className="text-xs space-y-0.5">
          <p className="font-semibold truncate max-w-40">{pothole.address}</p>
          <p>{pothole.status === "RESOLVED" ? "✅ Resolvido" : "🔴 Aberto"}</p>
          <p className="text-gray-500">por {pothole.user.name}</p>
        </div>
      </Tooltip>
      <Popup>
        <div className="min-w-[180px]">
          <p className="font-semibold text-sm truncate">{pothole.address}</p>
          <p className="text-xs text-gray-500 mt-1">
            {pothole.status === "RESOLVED" ? "✅ Resolvido" : "🔴 Aberto"}
          </p>
          <p className="text-xs text-gray-500">
            {pothole.status === "OPEN"
              ? timeAgo(pothole.createdAt) + " sem solução"
              : "Registrado em " + formatDate(pothole.createdAt)}
          </p>
          <p className="text-xs text-gray-400 mt-1">por {pothole.user.name}</p>
        </div>
      </Popup>
    </Marker>
  )
}
