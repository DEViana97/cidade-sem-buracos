import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

export const potholeSchema = z.object({
  address: z.string().min(3, "Endereço obrigatório"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PotholeInput = z.infer<typeof potholeSchema>
