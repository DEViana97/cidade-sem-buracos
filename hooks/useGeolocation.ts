"use client"

import { useState, useCallback } from "react"

export function useGeolocation() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada")
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      () => {
        setError("Não foi possível obter localização")
        setLoading(false)
      }
    )
  }, [])

  return { position, loading, error, locate }
}
