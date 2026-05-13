import { cn } from "@/lib/utils"

interface Props {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  const isOpen = status === "OPEN"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isOpen
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", isOpen ? "bg-red-500" : "bg-green-500")} />
      {isOpen ? "Aberto" : "Resolvido"}
    </span>
  )
}
