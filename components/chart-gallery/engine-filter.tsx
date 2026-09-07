"use client"

import React from "react"
import type { ChartEngine } from "@/lib/charts/metadata"
import { cn } from "@/lib/utils"

export interface EngineFilterProps {
  selected: ChartEngine | "all"
  onChange: (engine: ChartEngine | "all") => void
  counts: Record<ChartEngine | "all", number>
}

const engines: Array<{ id: ChartEngine | "all"; label: string }> = [
  { id: "all", label: "All Engines" },
  { id: "recharts", label: "Recharts" },
  { id: "d3", label: "D3.js" },
  { id: "google", label: "Google Charts" },
]

export function EngineFilter({ selected, onChange, counts }: EngineFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-md">
      {engines.map((e) => {
        const isActive = selected === e.id
        const count = counts[e.id] ?? 0

        return (
          <button
            key={e.id}
            onClick={() => onChange(e.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              isActive
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            )}
          >
            <span>{e.label}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                isActive ? "bg-white/20 text-white" : "bg-white/[0.06] text-zinc-500"
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
