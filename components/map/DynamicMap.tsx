"use client"

import dynamic from "next/dynamic"
import type { Pothole } from "@/types"

const PotholeMap = dynamic(() => import("./PotholeMap"), { ssr: false })

interface Props {
  potholes: Pothole[]
  height?: string
  center?: [number, number]
  zoom?: number
  showControls?: boolean
}

export function DynamicMap(props: Props) {
  return <PotholeMap {...props} />
}
