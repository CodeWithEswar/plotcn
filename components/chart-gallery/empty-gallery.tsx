"use client"

import React from "react"
import { Search, RefreshCw } from "lucide-react"

export interface EmptyGalleryProps {
  onReset: () => void
}

export function EmptyGallery({ onReset }: EmptyGalleryProps) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 mb-4">
        <Search className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">No matching visualizations</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6">
        No chart components matched your current engine, category, or search filters.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors"
      >
        <RefreshCw className="size-3.5" />
        <span>Clear all filters</span>
      </button>
    </div>
  )
}
