export type Role = "USER" | "ADMIN"
export type Status = "OPEN" | "RESOLVED"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date
}

export interface Pothole {
  id: string
  address: string
  latitude: number
  longitude: number
  description: string | null
  imageUrl: string | null
  status: Status
  createdAt: Date
  resolvedAt: Date | null
  userId: string
  user: Pick<User, "id" | "name">
}

export interface PotholeWithUser extends Pothole {
  user: Pick<User, "id" | "name">
}

export interface Stats {
  total: number
  open: number
  resolved: number
  resolutionRate: number
  avgResolutionDays: number | null
  regionBreakdown: { address: string; count: number }[]
  oldestOpen: Pothole[]
  recentResolved: { date: string; count: number }[]
}

export interface UserStats {
  total: number
  open: number
  resolved: number
  potholes: Pothole[]
}
