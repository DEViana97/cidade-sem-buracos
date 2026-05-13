import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const protectedPaths = ["/report", "/profile"]
  const adminPaths = ["/admin"]
  const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p))
  const isAdmin = adminPaths.some((p) => nextUrl.pathname.startsWith(p))

  if (isAdmin && (!isLoggedIn || session?.user?.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
