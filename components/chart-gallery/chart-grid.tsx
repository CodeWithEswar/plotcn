"use client"

import React from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { ChartCard } from "./chart-card"
import { EmptyGallery } from "./empty-gallery"

export interface ChartGridProps {
  charts: readonly ChartMetadata[]
  onResetFilters: () => void
}

export function ChartGrid({ charts, onResetFilters }: ChartGridProps) {
  if (charts.length === 0) {
    return <EmptyGallery onReset={onResetFilters} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {charts.map((chart) => (
        <ChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  )
}
