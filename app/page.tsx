import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, BarChart2, Shield, Users, Clock, AlertTriangle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-linear-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-medium mb-6">
            <AlertTriangle className="size-3.5" />
            Plataforma pública e gratuita
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            O <span className="text-red-500">Waze</span> dos{" "}
            <span className="text-red-500">buracos</span> urbanos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Registre buracos, acompanhe a resolução e pressione as autoridades a agirem.
            Dados públicos, transparência total.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/map">
              <Button size="lg" className="w-full sm:w-auto">
                <MapPin className="size-5 mr-2" />
                Ver mapa agora
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BarChart2 className="size-5 mr-2" />
                Ver estatísticas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Registre o buraco",
                desc: "Crie uma conta gratuita e registre buracos com localização exata e descrição.",
                color: "text-red-500 bg-red-50",
              },
              {
                icon: Users,
                title: "Visibilidade pública",
                desc: "Qualquer pessoa pode ver todos os buracos no mapa, sem precisar de login.",
                color: "text-blue-500 bg-blue-50",
              },
              {
                icon: Shield,
                title: "Pressão social",
                desc: "Compartilhe, acompanhe o tempo sem solução e pressione as autoridades.",
                color: "text-green-500 bg-green-50",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border p-6">
                <div className={`inline-flex p-2.5 rounded-lg mb-4 ${f.color}`}>
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Clock className="size-10 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Cada dia sem solução conta</h2>
          <p className="text-muted-foreground mb-6">
            Buracos não resolvidos ficam em destaque no sistema. Quanto mais tempo, maior a pressão.
          </p>
          <Link href="/register">
            <Button size="lg">Comece a registrar agora</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
