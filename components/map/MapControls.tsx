"use client"

import { Button } from "@/components/ui/button"
import { Flame, MapPin } from "lucide-react"

interface Props {
  showHeatmap: boolean
  onToggleHeatmap: (v: boolean) => void
  heatmapFilter: "OPEN" | "RESOLVED" | "ALL"
  onFilterChange: (v: "OPEN" | "RESOLVED" | "ALL") => void
}

export function MapControls({ showHeatmap, onToggleHeatmap, heatmapFilter, onFilterChange }: Props) {
  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
      <Button
        size="sm"
        variant={showHeatmap ? "default" : "outline"}
        onClick={() => onToggleHeatmap(!showHeatmap)}
        className="bg-white/90 backdrop-blur-sm shadow-md"
      >
        {showHeatmap ? <MapPin className="size-4 mr-1" /> : <Flame className="size-4 mr-1" />}
        {showHeatmap ? "Pins" : "Heatmap"}
      </Button>

      {showHeatmap && (
        <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          {(["ALL", "OPEN", "RESOLVED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                heatmapFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {f === "ALL" ? "Todos" : f === "OPEN" ? "🔴 Abertos" : "✅ Resolvidos"}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
