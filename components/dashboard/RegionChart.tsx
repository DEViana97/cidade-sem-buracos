"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Props {
  data: { address: string; count: number }[]
}

export function RegionChart({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-0 font-semibold text-sm">Buracos por região</CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="address"
              tick={{ fontSize: 10 }}
              angle={-35}
              textAnchor="end"
              tickFormatter={(v) => (v.length > 14 ? v.slice(0, 14) + "…" : v)}
            />
            <YAxis type="number" tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, "buracos"]} />
            <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
