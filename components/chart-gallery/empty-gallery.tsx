"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, RefreshIcon } from "@hugeicons/core-free-icons"

export interface EmptyGalleryProps {
  onReset: () => void
}

export function EmptyGallery({ onReset }: EmptyGalleryProps) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center text-card-foreground">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted/40 border border-border text-muted-foreground mb-4">
        <HugeiconsIcon icon={Search01Icon} size={22} />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">No matching visualizations</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        No chart components matched your current engine, category, or search filters.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium border border-border transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={RefreshIcon} size={14} />
        <span>Clear all filters</span>
      </button>
    </div>
  )
}
