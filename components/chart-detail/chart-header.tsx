import React from "react"
import Link from "next/link"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { EngineBadge } from "./engine-badge"
import { ArrowLeft } from "lucide-react"

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
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Gallery</span>
        </Link>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <EngineBadge engine={chart.engine} />
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08]">
          {chart.category}
        </span>
        <span className="text-xs font-mono text-zinc-400 bg-white/[0.02] px-2 py-0.5 rounded border border-white/[0.04]">
          shadcn registry item
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {chart.title}
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
          {chart.description}
        </p>
      </div>
    </div>
  )
}
