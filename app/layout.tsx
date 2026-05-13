import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: { default: "Cidade Sem Buracos — Fiscalização Cidadã", template: "%s | Cidade Sem Buracos" },
  description:
    "Plataforma pública de mapeamento de buracos urbanos. Registre, acompanhe e pressione as autoridades a resolverem os problemas das vias públicas.",
  openGraph: {
    title: "Cidade Sem Buracos",
    description: "Mapeamento público de buracos urbanos",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  )
}
