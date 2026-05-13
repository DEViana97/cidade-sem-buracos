"use client"

import { Button } from "@/components/ui/button"
import { Share2, MessageCircle, Link } from "lucide-react"
import { toast } from "sonner"

interface Props {
  potholeId: string
  address: string
}

export function ShareButtons({ potholeId, address }: Props) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/potholes/${potholeId}`
  const text = `🚧 Buraco não resolvido em: ${address}`

  function copyLink() {
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!")
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share2 className="size-3.5" /> Compartilhar:
      </span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
          <MessageCircle className="size-3.5 mr-1" /> WhatsApp
        </Button>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="sm" variant="outline" className="text-sky-600 border-sky-200 hover:bg-sky-50">
          𝕏 Twitter/X
        </Button>
      </a>
      <Button size="sm" variant="outline" onClick={copyLink}>
        <Link className="size-3.5 mr-1" /> Copiar link
      </Button>
    </div>
  )
}
