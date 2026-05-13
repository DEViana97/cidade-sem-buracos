"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useResolvePothole } from "@/hooks/usePotholes"
import { toast } from "sonner"
import { CheckCircle, Loader2 } from "lucide-react"

interface Props {
  potholeId: string
  onResolved?: () => void
}

export function ResolveButton({ potholeId, onResolved }: Props) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useResolvePothole()

  function handleResolve() {
    mutate(potholeId, {
      onSuccess: () => {
        toast.success("Buraco marcado como resolvido!")
        setOpen(false)
        onResolved?.()
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="default" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="size-4 mr-2" />
            Marcar como resolvido
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar resolução</DialogTitle>
          <DialogDescription>
            Esse buraco já foi tapado? Essa ação irá marcar o problema como resolvido no sistema.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleResolve}
            disabled={isPending}
          >
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Sim, foi resolvido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
