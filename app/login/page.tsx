import { LoginForm } from "@/components/auth/LoginForm"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Entrar" }

interface Props {
  searchParams: Promise<{ callbackUrl?: string; registered?: string; reset?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl, registered, reset } = await searchParams

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <MapPin className="size-6" />
            <span className="text-xl font-bold">Cidade Sem Buracos</span>
          </div>
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm mt-1">Entre para registrar buracos</p>
        </div>

        {registered && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            Conta criada! Faça login.
          </div>
        )}
        {reset && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            Senha redefinida com sucesso!
          </div>
        )}

        <div className="border rounded-xl p-6 bg-card">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  )
}
