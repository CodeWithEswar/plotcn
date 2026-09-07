"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, Copy01Icon } from "@hugeicons/core-free-icons"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { chartHref, engineLabels } from "@/lib/charts/filters"
import { getCategoryLabel } from "@/lib/charts/categories"
import { DynamicChartRenderer } from "./chart-renderer"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { InstallCommand } from "@/components/registry/install-command"

export function ChartCard({
  chart,
  compact = false,
}: {
  chart: ChartMetadata
  compact?: boolean
}) {
  const rawFeature =
    chart.features.find((f) => f !== "responsive") || chart.features[0]
  const primaryFeature =
    rawFeature === "accessible-data" ? "Accessible" : rawFeature

  return (
    <article className="lens-module">
      {/* Rail — Engine Badge + Category Badge + Install Icon */}
      <div className="lens-module-rail">
        <div className="lens-module-badges">
          <span className="lens-badge" data-engine={chart.engine}>
            <span className="lens-badge-dot" />
            {chart.engine === "google" ? "Google" : engineLabels[chart.engine]}
          </span>
          <span className="lens-badge">
            {getCategoryLabel(chart.category)}
          </span>
        </div>
        <div className="lens-module-rail-actions">
          <Popover>
            <PopoverTrigger
              className="lens-install-icon"
              aria-label={`Install ${chart.title} via command`}
            >
              <HugeiconsIcon icon={Copy01Icon} size={14} />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px] p-0 border border-border bg-popover shadow-xl rounded-lg overflow-hidden"
            >
              <InstallCommand
                registryName={chart.registryName}
                engine={chart.engine}
                variant="compact"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Info — Title + Description */}
      <div className="lens-module-info">
        <div className="lens-title-row">
          <h2>
            <Link href={chartHref(chart)}>{chart.title}</Link>
          </h2>
          {chart.status !== "stable" && (
            <span className="lens-status">{chart.status}</span>
          )}
        </div>
        <p>{chart.description}</p>
      </div>

      {/* Live Preview */}
      <div className="lens-plot" aria-label={`${chart.title} example preview`}>
        <DynamicChartRenderer
          registryName={chart.registryName}
          height={compact ? 190 : 260}
          motion={false}
        />
      </div>

      {/* Footer — Capabilities + View Source */}
      <div className="lens-module-footer">
        <div
          className="lens-capabilities"
          title={`Difficulty: ${chart.difficulty} • Features: ${chart.features.join(", ")}`}
        >
          <span className="lens-diff-badge" data-difficulty={chart.difficulty}>
            <span className="lens-diff-dot" data-difficulty={chart.difficulty} />
            {chart.difficulty}
          </span>
          {primaryFeature && (
            <span className="lens-feature-badge">{primaryFeature}</span>
          )}
        </div>
        <Link href={chartHref(chart)} className="lens-view-source">
          <span>View Source</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={13} className="lens-view-source-icon" />
        </Link>
      </div>
    </article>
  )
}
