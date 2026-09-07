import React from "react"
import type { ChartEngine } from "@/lib/charts/metadata"
import { cn } from "@/lib/utils"

export interface EngineBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  engine: ChartEngine
  size?: "sm" | "md"
}

export function EngineBadge({ engine, size = "md", className, ...props }: EngineBadgeProps) {
  const configs = {
    recharts: {
      label: "RECHARTS",
      dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
      container: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:border-sky-500/40",
    },
    d3: {
      label: "D3.JS",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      container: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/40",
    },
    google: {
      label: "GOOGLE",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      container: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40",
    },
  }

  const current = configs[engine] || configs.recharts

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        current.container,
        className
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", current.dot)} />
      {current.label}
    </span>
  )
}
