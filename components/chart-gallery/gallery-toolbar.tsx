"use client"

import React from "react"
import type { ChartEngine, ChartCategory } from "@/lib/charts/metadata"
import { EngineFilter } from "./engine-filter"
import { GalleryFilter } from "./gallery-filter"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

export interface GalleryToolbarProps {
  engine: ChartEngine | "all"
  category: ChartCategory | "all"
  search: string
  onEngineChange: (engine: ChartEngine | "all") => void
  onCategoryChange: (category: ChartCategory | "all") => void
  onSearchChange: (search: string) => void
  counts: Record<ChartEngine | "all", number>
  availableCategories: Set<ChartCategory>
}

export function GalleryToolbar({
  engine,
  category,
  search,
  onEngineChange,
  onCategoryChange,
  onSearchChange,
  counts,
  availableCategories,
}: GalleryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Top Row: Engine Selector & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <EngineFilter selected={engine} onChange={onEngineChange} counts={counts} />

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search charts or tags..."
            className="w-full rounded-xl border border-border/80 bg-background/80 pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all font-mono"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <GalleryFilter
        selected={category}
        onChange={onCategoryChange}
        availableCategories={availableCategories}
      />
    </div>
  )
}
