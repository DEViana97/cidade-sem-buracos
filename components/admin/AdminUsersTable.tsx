"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: { potholes: number }
}

interface Props {
  users: AdminUser[]
}

export function AdminUsersTable({ users: initial }: Props) {
  const [users, setUsers] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    setLoading(userId)
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!res.ok) throw new Error("Erro ao atualizar")
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      toast.success(`${newRole === "ADMIN" ? "Promovido a Admin" : "Rebaixado para Usuário"}`)
    } catch {
      toast.error("Erro ao atualizar papel")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Usuário</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium">Buracos</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Cadastro</th>
              <th className="text-left px-4 py-3 font-medium">Papel</th>
              <th className="text-right px-4 py-3 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.email}</td>
                <td className="px-4 py-3">{user._count.potholes}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role === "ADMIN" ? (
                      <Shield className="size-3 mr-1" />
                    ) : (
                      <User className="size-3 mr-1" />
                    )}
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleRole(user.id, user.role)}
                    disabled={loading === user.id}
                  >
                    {loading === user.id && <Loader2 className="size-3 mr-1 animate-spin" />}
                    {user.role === "ADMIN" ? "Revogar admin" : "Tornar admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
