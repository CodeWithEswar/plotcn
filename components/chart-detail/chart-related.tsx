import React from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { ChartCard } from "@/components/chart-gallery/chart-card"

export interface ChartRelatedProps {
  relatedCharts: readonly ChartMetadata[]
}

export function ChartRelated({ relatedCharts }: ChartRelatedProps) {
  if (!relatedCharts || relatedCharts.length === 0) return null

  return (
    <div className="flex flex-col mt-12 pt-8 border-t border-white/[0.08]">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-4">Related Visualizations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedCharts.map((chart) => (
          <ChartCard key={chart.id} chart={chart} />
        ))}
      </div>
    </div>
  )
}
