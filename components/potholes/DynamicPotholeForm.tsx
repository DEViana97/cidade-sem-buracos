"use client"

import dynamic from "next/dynamic"

const PotholeFormInner = dynamic(
  () => import("./PotholeForm").then((m) => m.PotholeForm),
  { ssr: false }
)

export function DynamicPotholeForm() {
  return <PotholeFormInner />
}
