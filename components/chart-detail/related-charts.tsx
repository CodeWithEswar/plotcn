"use client"

import React from "react"
import Link from "next/link"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { charts } from "@/config/charts"
import { chartHref, engineLabels } from "@/lib/charts/filters"
import { getCategoryLabel } from "@/lib/charts/categories"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface RelatedChartsProps {
  relatedCharts: readonly ChartMetadata[]
  currentChart: ChartMetadata
}

export function RelatedCharts({ relatedCharts, currentChart }: RelatedChartsProps) {
  // Correctly find previous and next components from the canonical catalog order
  const currentIndex = charts.findIndex((c) => c.id === currentChart.id)
  const prevChart = currentIndex > 0 ? charts[currentIndex - 1] : null
  const nextChart =
    currentIndex !== -1 && currentIndex < charts.length - 1 ? charts[currentIndex + 1] : null

  return (
    <section id="section-related" className="space-y-6 pt-4 scroll-mt-20 border-t border-border">
      <div className="space-y-1 pt-4">
        <div className="text-[11px] font-mono tracking-widest text-muted-foreground font-semibold uppercase">
          08 / Ecosystem Discovery
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Related Components & Family
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Explore alternative charting components in the {engineLabels[currentChart.engine]} family and{" "}
          {getCategoryLabel(currentChart.category)} category.
        </p>
      </div>

      {/* Related Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedCharts.map((c) => (
          <Link
            key={c.id}
            href={chartHref(c)}
            className="group flex flex-col justify-between p-4 rounded-2xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/50 hover:border-white/[0.15] transition-all space-y-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                <span>{engineLabels[c.engine]}</span>
                <span className="text-muted-foreground font-semibold">{c.status}</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors flex items-center justify-between">
                <span>{c.title}</span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground shrink-0"
                />
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-1">
              Category: <span className="text-zinc-300 capitalize">{c.category}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Previous / Next Navigation */}
      <div className="space-y-3 pt-6 border-t border-white/[0.08]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Catalog Navigation
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevChart && (
            <Link
              href={chartHref(prevChart)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/50 hover:bg-zinc-900/60 hover:border-white/[0.15] transition-all group shadow-xs"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                className="text-zinc-500 group-hover:text-white group-hover:-translate-x-0.5 transition-transform shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Previous Component
                </span>
                <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate block">
                  {prevChart.title}
                </span>
              </div>
            </Link>
          )}

          {nextChart && (
            <Link
              href={chartHref(nextChart)}
              className={cn(
                "flex items-center justify-end text-right gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/50 hover:bg-zinc-900/60 hover:border-white/[0.15] transition-all group shadow-xs w-full",
                !prevChart && "sm:col-start-2"
              )}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Next Component
                </span>
                <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate block">
                  {nextChart.title}
                </span>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
