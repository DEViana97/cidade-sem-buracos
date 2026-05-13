"use client"

import { useQuery } from "@tanstack/react-query"
import type { Stats, UserStats } from "@/types"

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats")
      if (!res.ok) throw new Error("Erro ao carregar estatísticas")
      return res.json()
    },
    staleTime: 60000,
  })
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Erro ao carregar perfil")
      return res.json()
    },
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users")
      if (!res.ok) throw new Error("Erro ao carregar usuários")
      return res.json()
    },
  })
}
