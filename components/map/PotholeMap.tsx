"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import "leaflet/dist/leaflet.css"
import "react-leaflet-cluster/dist/assets/MarkerCluster.css"
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css"
import type { Pothole } from "@/types"
import { PotholeMarker } from "./PotholeMarker"
import { HeatmapLayer } from "./HeatmapLayer"
import { MapControls } from "./MapControls"

interface Props {
  potholes: Pothole[]
  height?: string
  center?: [number, number]
  zoom?: number
  showControls?: boolean
}

function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function PotholeMap({
  potholes,
  height = "100%",
  center = [-3.77722, -38.53554],
  zoom = 12,
  showControls = true,
}: Props) {
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [heatmapFilter, setHeatmapFilter] = useState<"OPEN" | "RESOLVED" | "ALL">("ALL")

  const heatmapData = potholes
    .filter((p) => {
      if (heatmapFilter === "ALL") return true
      return p.status === heatmapFilter
    })
    .map((p) => [p.latitude, p.longitude, 0.6] as [number, number, number])

  return (
    <div style={{ height, width: "100%" }} className="relative rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {showHeatmap ? (
          <HeatmapLayer points={heatmapData} />
        ) : (
          <MarkerClusterGroup chunkedLoading>
            {potholes.map((pothole) => (
              <PotholeMarker key={pothole.id} pothole={pothole} />
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      {showControls && (
        <MapControls
          showHeatmap={showHeatmap}
          onToggleHeatmap={setShowHeatmap}
          heatmapFilter={heatmapFilter}
          onFilterChange={setHeatmapFilter}
        />
      )}
    </div>
  )
}
