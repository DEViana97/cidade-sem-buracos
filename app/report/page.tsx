import { DynamicPotholeForm as PotholeForm } from "@/components/potholes/DynamicPotholeForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Registrar buraco" }

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Registrar buraco</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Clique no mapa para marcar a localização exata do problema.
        </p>
      </div>
      <div className="border rounded-xl p-6 bg-card">
        <PotholeForm />
      </div>
    </div>
  )
}
