import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface Props {
  total: number
  open: number
  resolved: number
  resolutionRate: number
  avgResolutionDays: number | null
}

export function StatsCards({ total, open, resolved, resolutionRate, avgResolutionDays }: Props) {
  const cards = [
    { label: "Total registrados", value: total, icon: TrendingUp, color: "text-blue-600" },
    { label: "Abertos", value: open, icon: AlertTriangle, color: "text-red-500" },
    { label: "Resolvidos", value: resolved, icon: CheckCircle, color: "text-green-600" },
    {
      label: "Taxa de resolução",
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      color: resolutionRate >= 50 ? "text-green-600" : "text-orange-500",
    },
    {
      label: "Tempo médio de resolução",
      value: avgResolutionDays != null ? `${avgResolutionDays} dias` : "—",
      icon: Clock,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="pt-5 pb-4">
            <c.icon className={`size-6 mb-2 ${c.color}`} />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
