"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

interface Props {
  points: [number, number, number][]
}

export function HeatmapLayer({ points }: Props) {
  const map = useMap()

  useEffect(() => {
    let mounted = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let heatLayer: any = null

    async function init() {
      await import("leaflet.heat")
      const { default: L } = await import("leaflet")
      if (!mounted) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heatLayer = (L as any).heatLayer(points, {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        gradient: { 0.2: "#3b82f6", 0.5: "#f97316", 1: "#ef4444" },
      })
      heatLayer.addTo(map)
    }

    init()
    return () => {
      mounted = false
      if (heatLayer) map.removeLayer(heatLayer)
    }
  }, [map, points])

  return null
}
