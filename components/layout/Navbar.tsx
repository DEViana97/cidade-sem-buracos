import Link from "next/link"
import { auth } from "@/lib/auth"
import { MapPin } from "lucide-react"
import { MobileMenu } from "./MobileMenu"
import { NavLinks } from "./NavLinks"

export async function Navbar() {
  const session = await auth()
  const isLoggedIn = !!session
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary shrink-0">
          <MapPin className="size-5" />
          <span className="hidden sm:block">Cidade Sem Buracos</span>
        </Link>

        <NavLinks isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

        {/* Mobile hamburger */}
        <MobileMenu isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      </div>
    </header>
  )
}
