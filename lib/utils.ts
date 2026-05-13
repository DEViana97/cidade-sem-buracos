import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor(diff / 60000)

  if (days > 0) return `há ${days} dia${days > 1 ? "s" : ""}`
  if (hours > 0) return `há ${hours} hora${hours > 1 ? "s" : ""}`
  if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`
  return "agora mesmo"
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function daysSince(date: Date | string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

export function getMarkerColor(status: string, createdAt: Date | string): string {
  if (status === "RESOLVED") return "#22c55e"
  const days = daysSince(createdAt)
  if (days > 30) return "#ef4444"
  if (days > 7) return "#f97316"
  return "#eab308"
}
