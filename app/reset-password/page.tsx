"use client"

import { useActionState } from "react"
import { resetPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [state, action, pending] = useActionState(resetPassword, undefined)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {state.error}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="password">Nova senha</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 mr-2 animate-spin" />}
        Redefinir senha
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <MapPin className="size-6" />
            <span className="text-xl font-bold">Cidade Sem Buracos</span>
          </div>
          <h1 className="text-2xl font-bold">Nova senha</h1>
        </div>
        <div className="border rounded-xl p-6 bg-card">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
