import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { daysSince } from "@/lib/utils"
import { AlertTriangle, ExternalLink } from "lucide-react"
import type { Pothole } from "@/types"

interface Props {
  potholes: Pothole[]
}

export function OldestPotholes({ potholes }: Props) {
  return (
    <Card>
      <CardHeader className="pb-0 font-semibold text-sm flex flex-row items-center gap-2">
        <AlertTriangle className="size-4 text-red-500" />
        Buracos mais antigos sem solução
      </CardHeader>
      <CardContent className="pt-3">
        {potholes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum buraco aberto. 🎉</p>
        ) : (
          <ol className="space-y-2">
            {potholes.map((p, i) => (
              <li key={p.id} className="flex items-start gap-3">
                <span className="text-muted-foreground font-mono text-xs w-5 shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.address}</p>
                  <p className="text-xs text-red-500 font-medium">{daysSince(p.createdAt)} dias sem solução</p>
                </div>
                <Link href={`/potholes/${p.id}`} className="shrink-0">
                  <ExternalLink className="size-3.5 text-muted-foreground hover:text-foreground" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
