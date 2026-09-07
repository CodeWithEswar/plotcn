"use client"

import React, { useState, useMemo } from "react"
import type { ChartMetadata, ChartEngine, ChartCategory } from "@/lib/charts/metadata"
import { GalleryToolbar } from "./gallery-toolbar"
import { ChartGrid } from "./chart-grid"

export interface GalleryShellProps {
  initialCharts: readonly ChartMetadata[]
}

export function GalleryShell({ initialCharts }: GalleryShellProps) {
  const [engine, setEngine] = useState<ChartEngine | "all">("all")
  const [category, setCategory] = useState<ChartCategory | "all">("all")
  const [search, setSearch] = useState("")

  // Engine item counts
  const counts = useMemo(() => {
    return {
      all: initialCharts.length,
      recharts: initialCharts.filter((c) => c.engine === "recharts").length,
      d3: initialCharts.filter((c) => c.engine === "d3").length,
      google: initialCharts.filter((c) => c.engine === "google").length,
    }
  }, [initialCharts])

  // Filtered categories currently available
  const availableCategories = useMemo(() => {
    const cats = new Set<ChartCategory>()
    initialCharts.forEach((c) => {
      if (engine === "all" || c.engine === engine) {
        cats.add(c.category)
      }
    })
    return cats
  }, [initialCharts, engine])

  // Filtered charts list
  const filteredCharts = useMemo(() => {
    return initialCharts.filter((c) => {
      if (engine !== "all" && c.engine !== engine) return false
      if (category !== "all" && c.category !== category) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchTitle = c.title.toLowerCase().includes(q)
        const matchDesc = c.description.toLowerCase().includes(q)
        const matchTags = c.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchTitle && !matchDesc && !matchTags) return false
      }
      return true
    })
  }, [initialCharts, engine, category, search])

  const handleResetFilters = () => {
    setEngine("all")
    setCategory("all")
    setSearch("")
  }

  return (
    <div className="w-full">
      <GalleryToolbar
        engine={engine}
        category={category}
        search={search}
        onEngineChange={setEngine}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        counts={counts}
        availableCategories={availableCategories}
      />

      <ChartGrid charts={filteredCharts} onResetFilters={handleResetFilters} />
    </div>
  )
}
