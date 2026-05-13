"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, BarChart2, Plus, User, Shield } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

interface Props {
  isLoggedIn: boolean
  isAdmin: boolean
}

export function NavLinks({ isLoggedIn, isAdmin }: Props) {
  const pathname = usePathname()

  function active(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="hidden sm:flex items-center gap-1">
      <Link href="/map">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hover:bg-muted transition-colors",
            active("/map") && "bg-muted font-medium"
          )}
        >
          <MapPin className="size-4 mr-1.5" />
          Mapa
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hover:bg-muted transition-colors",
            active("/dashboard") && "bg-muted font-medium"
          )}
        >
          <BarChart2 className="size-4 mr-1.5" />
          Estatísticas
        </Button>
      </Link>

      {isLoggedIn ? (
        <>
          <Link href="/report">
            <Button
              size="sm"
              className={cn(
                "hover:opacity-90 transition-opacity",
                active("/report") && "ring-2 ring-primary/40"
              )}
            >
              <Plus className="size-4 mr-1.5" />
              Registrar buraco
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-muted transition-colors",
                active("/profile") && "bg-muted font-medium"
              )}
            >
              <User className="size-4 mr-1.5" />
              Meu perfil
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hover:bg-muted transition-colors",
                  active("/admin") && "bg-muted font-medium"
                )}
              >
                <Shield className="size-4 mr-1.5" />
                Admin
              </Button>
            </Link>
          )}
          <form action={logout}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              Sair
            </Button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-muted transition-colors",
                active("/login") && "bg-muted font-medium"
              )}
            >
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className={cn(
                "hover:opacity-90 transition-opacity",
                active("/register") && "ring-2 ring-primary/40"
              )}
            >
              Cadastrar
            </Button>
          </Link>
        </>
      )}
    </nav>
  )
}
