"use client"

import React from "react"
import type { ChartEngine, ChartCategory } from "@/lib/charts/metadata"
import { EngineFilter } from "./engine-filter"
import { GalleryFilter } from "./gallery-filter"
import { Search, X } from "lucide-react"

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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search charts or tags..."
            className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/70 pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 backdrop-blur-md focus:border-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-white"
            >
              <X className="size-3.5" />
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
