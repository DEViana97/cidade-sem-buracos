"use server"

import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations"
import { redirect } from "next/navigation"
import crypto from "crypto"
import nodemailer from "nodemailer"

type ActionState = { error?: string; success?: boolean } | undefined

export async function register(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) return { error: "Email já cadastrado" }

  const hashed = await bcrypt.hash(parsed.data.password, 12)
  await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, password: hashed },
  })

  redirect("/login?registered=1")
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/map"
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: callbackUrl,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.includes("NEXT_REDIRECT")) throw e
    return { error: "Email ou senha inválidos" }
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" })
}

export async function forgotPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) return { error: "Email inválido" }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (!user) return { success: true }

  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

  await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } })

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await transporter.sendMail({
    to: user.email,
    subject: "Redefinição de senha — Cidade Sem Buracos",
    html: `<p>Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha. Link válido por 1 hora.</p>`,
  })

  return { success: true }
}

export async function resetPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  })

  if (!record || record.expiresAt < new Date()) return { error: "Token inválido ou expirado" }

  const hashed = await bcrypt.hash(parsed.data.password, 12)
  await prisma.user.update({ where: { id: record.userId }, data: { password: hashed } })
  await prisma.passwordResetToken.delete({ where: { token: parsed.data.token } })

  redirect("/login?reset=1")
}
