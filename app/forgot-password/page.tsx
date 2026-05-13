"use client"

import { useActionState } from "react"
import { forgotPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <MapPin className="size-6" />
            <span className="text-xl font-bold">Cidade Sem Buracos</span>
          </div>
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
          <p className="text-sm text-muted-foreground mt-1">Enviaremos um link para seu email</p>
        </div>
        <div className="border rounded-xl p-6 bg-card">
          {state?.success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                Se o email existir, você receberá as instruções em breve.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Voltar ao login</Button>
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              {state?.error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                  {state.error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending && <Loader2 className="size-4 mr-2 animate-spin" />}
                Enviar link
              </Button>
              <Link href="/login" className="block text-center text-sm text-muted-foreground hover:underline">
                Voltar ao login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
