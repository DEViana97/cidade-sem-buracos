import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { daysSince, formatDate, timeAgo } from "@/lib/utils"
import { MapPin, Clock, User } from "lucide-react"
import type { Pothole } from "@/types"

interface Props {
  pothole: Pothole
}

export function PotholeCard({ pothole }: Props) {
  const days = daysSince(pothole.createdAt)

  return (
    <Link href={`/potholes/${pothole.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-4 pb-2">
          {pothole.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden h-32 bg-muted">
              <img src={pothole.imageUrl} alt="Buraco" className="w-full h-full object-cover" />
            </div>
          )}
          <StatusBadge status={pothole.status} className="mb-2" />
          <p className="text-sm font-medium line-clamp-2 mb-2">{pothole.address}</p>
          {pothole.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{pothole.description}</p>
          )}
        </CardContent>
        <CardFooter className="pt-0 pb-3 flex flex-col items-start gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span>{pothole.address.split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {pothole.status === "OPEN" ? (
              <span className={days > 30 ? "text-red-500 font-medium" : ""}>
                {timeAgo(pothole.createdAt)} sem solução
              </span>
            ) : (
              <span>Resolvido em {formatDate(pothole.resolvedAt!)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="size-3" />
            <span>{pothole.user.name}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
