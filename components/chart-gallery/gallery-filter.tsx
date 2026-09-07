"use client"

import React from "react"
import type { ChartCategory } from "@/lib/charts/metadata"
import { chartCategories } from "@/lib/charts/categories"
import { cn } from "@/lib/utils"

export interface GalleryFilterProps {
  selected: ChartCategory | "all"
  onChange: (category: ChartCategory | "all") => void
  availableCategories: Set<ChartCategory>
}

export function GalleryFilter({ selected, onChange, availableCategories }: GalleryFilterProps) {
  const visibleCategories = chartCategories.filter((c) => availableCategories.has(c.id))

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors",
          selected === "all"
            ? "bg-zinc-800 text-white border border-zinc-700"
            : "text-zinc-400 hover:text-white bg-zinc-950/60 border border-white/[0.06] hover:bg-zinc-900"
        )}
      >
        All Categories
      </button>

      {visibleCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors",
            selected === cat.id
              ? "bg-zinc-800 text-white border border-zinc-700"
              : "text-zinc-400 hover:text-white bg-zinc-950/60 border border-white/[0.06] hover:bg-zinc-900"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
