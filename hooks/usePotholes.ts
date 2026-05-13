"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Pothole } from "@/types"

async function fetchPotholes(status?: string): Promise<Pothole[]> {
  const url = status ? `/api/potholes?status=${status}` : "/api/potholes"
  const res = await fetch(url)
  if (!res.ok) throw new Error("Erro ao carregar buracos")
  return res.json()
}

async function fetchPothole(id: string): Promise<Pothole> {
  const res = await fetch(`/api/potholes/${id}`)
  if (!res.ok) throw new Error("Buraco não encontrado")
  return res.json()
}

export function usePotholes(status?: string) {
  return useQuery({
    queryKey: ["potholes", status],
    queryFn: () => fetchPotholes(status),
    staleTime: 30000,
  })
}

export function usePothole(id: string) {
  return useQuery({
    queryKey: ["pothole", id],
    queryFn: () => fetchPothole(id),
  })
}

export function useResolvePothole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/potholes/${id}/resolve`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao resolver")
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["potholes"] })
    },
  })
}

export function useCreatePothole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      address: string
      latitude: number
      longitude: number
      description?: string
      imageUrl?: string
    }) => {
      const res = await fetch("/api/potholes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao registrar")
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["potholes"] })
    },
  })
}

export function useDeletePothole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/potholes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao deletar")
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["potholes"] })
    },
  })
}
