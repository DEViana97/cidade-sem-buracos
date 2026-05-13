"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, BarChart2, Plus, User, Shield } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

interface Props {
  isLoggedIn: boolean
  isAdmin: boolean
}

export function MobileMenu({ isLoggedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  function active(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <div className="absolute top-14 left-0 right-0 z-50 bg-background border-b shadow-md px-4 py-3 flex flex-col gap-1">
          <Link href="/map" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className={cn("w-full justify-start hover:bg-muted", active("/map") && "bg-muted font-medium")}>
              <MapPin className="size-4 mr-2" /> Mapa
            </Button>
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className={cn("w-full justify-start hover:bg-muted", active("/dashboard") && "bg-muted font-medium")}>
              <BarChart2 className="size-4 mr-2" /> Estatísticas
            </Button>
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/report" onClick={() => setOpen(false)}>
                <Button size="sm" className={cn("w-full justify-start hover:opacity-90", active("/report") && "ring-2 ring-primary/40")}>
                  <Plus className="size-4 mr-2" /> Registrar buraco
                </Button>
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className={cn("w-full justify-start hover:bg-muted", active("/profile") && "bg-muted font-medium")}>
                  <User className="size-4 mr-2" /> Meu perfil
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className={cn("w-full justify-start hover:bg-muted", active("/admin") && "bg-muted font-medium")}>
                    <Shield className="size-4 mr-2" /> Admin
                  </Button>
                </Link>
              )}
              <form action={logout}>
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className={cn("w-full justify-start hover:bg-muted", active("/login") && "bg-muted font-medium")}>
                  Entrar
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button size="sm" className={cn("w-full justify-start", active("/register") && "ring-2 ring-primary/40")}>
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
