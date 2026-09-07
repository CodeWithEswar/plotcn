import React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { EngineBadge } from "./engine-badge"
import { RendererBadge } from "./renderer-badge"

export interface ChartHeaderProps {
  chart: ChartMetadata
}

export function ChartHeader({ chart }: ChartHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Back to Gallery */}
      <div>
        <Link
          href="/charts"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          <span>Back to Gallery</span>
        </Link>
      </div>

      {/* Standard Badges (Section 64, 65, 66) */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <EngineBadge engine={chart.engine} />
        <RendererBadge renderer={chart.renderer} />
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded border border-border/50">
          {chart.category}
        </span>
        {chart.status && chart.status !== "stable" && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {chart.status}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {chart.title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {chart.description}
        </p>
      </div>
    </div>
  )
}
