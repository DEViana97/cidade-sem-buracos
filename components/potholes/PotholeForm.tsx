"use client"

import { useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreatePothole } from "@/hooks/usePotholes"
import { useGeolocation } from "@/hooks/useGeolocation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, MapPin, Navigation } from "lucide-react"

const markerIcon = L.divIcon({
  html: `<div style="width:28px;height:28px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function PotholeForm() {
  const router = useRouter()
  const { mutate, isPending } = useCreatePothole()
  const { locate, loading: geoLoading } = useGeolocation()
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const mapRef = useRef<L.Map | null>(null)

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      if (data.display_name) setAddress(data.display_name)
    } catch {
      // keep manual address
    }
  }

  function handleMapSelect(lat: number, lng: number) {
    setCoords({ lat, lng })
    reverseGeocode(lat, lng)
  }

  async function handleLocate() {
    if (!navigator.geolocation) return toast.error("Geolocalização não suportada")
    const pos = await new Promise<GeolocationPosition>((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej)
    ).catch(() => null)
    if (!pos) return toast.error("Não foi possível obter localização")
    const { latitude, longitude } = pos.coords
    setCoords({ lat: latitude, lng: longitude })
    reverseGeocode(latitude, longitude)
    mapRef.current?.setView([latitude, longitude], 16)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!coords) return toast.error("Clique no mapa para selecionar a localização")
    if (!address.trim()) return toast.error("Endereço obrigatório")

    mutate(
      { address, latitude: coords.lat, longitude: coords.lng, description, imageUrl: "" },
      {
        onSuccess: (pothole) => {
          toast.success("Buraco registrado com sucesso!")
          router.push(`/potholes/${pothole.id}`)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="mb-2 block">Localização no mapa *</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Clique no mapa para marcar o buraco ou use sua localização atual.
        </p>
        <div className="h-64 rounded-xl overflow-hidden border mb-2">
          <MapContainer
            center={[-3.77722, -38.53554]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onSelect={handleMapSelect} />
            {coords && <Marker position={[coords.lat, coords.lng]} icon={markerIcon} />}
          </MapContainer>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleLocate} disabled={geoLoading}>
          {geoLoading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Navigation className="size-4 mr-2" />}
          Usar minha localização
        </Button>
        {coords && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="size-3" />
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço *</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Rua, número, bairro, cidade"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o problema: tamanho, profundidade, risco..."
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !coords}>
        {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
        Registrar buraco
      </Button>
    </form>
  )
}
