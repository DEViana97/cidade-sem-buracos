import { RegisterForm } from "@/components/auth/RegisterForm"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Cadastro" }

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <MapPin className="size-6" />
            <span className="text-xl font-bold">Cidade Sem Buracos</span>
          </div>
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-muted-foreground text-sm mt-1">Gratuito. Sem spam.</p>
        </div>
        <div className="border rounded-xl p-6 bg-card">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
