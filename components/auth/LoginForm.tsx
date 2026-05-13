"use client"

import { useActionState } from "react"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface Props {
  callbackUrl?: string
}

export function LoginForm({ callbackUrl }: Props) {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/map"} />
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
          {state.error}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Senha</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 mr-2 animate-spin" />}
        Entrar
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Cadastre-se
        </Link>
      </p>
    </form>
  )
}
