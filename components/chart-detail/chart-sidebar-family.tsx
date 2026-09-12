"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { chartHref } from "@/lib/charts/filters"
import { getCategoryLabel } from "@/lib/charts/categories"
import { ChartFamilyIcon } from "@/components/chart-family-icons/chart-family-icon"
import { cn } from "@/lib/utils"

export interface ChartSidebarFamilyProps {
  engine: string
  category: string
  items: readonly ChartMetadata[]
  currentChart: ChartMetadata
  isExpanded: boolean
  onToggle: () => void
  onItemClick?: () => void
}

export function ChartSidebarFamily({
  engine,
  category,
  items,
  currentChart,
  isExpanded,
  onToggle,
  onItemClick,
}: ChartSidebarFamilyProps) {
  const activeItemRef = useRef<HTMLAnchorElement>(null)
  const isRouteActive = currentChart.engine === engine && currentChart.category === category
  const controlsId = `sidebar-family-${engine}-${category}`

  // Ensure active chart item scrolls gently into view inside sticky sidebar
  useEffect(() => {
    if (isRouteActive && isExpanded && activeItemRef.current) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      activeItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      })
    }
  }, [isRouteActive, isExpanded, currentChart.id])

  if (items.length === 0) return null

  const label = getCategoryLabel(category as any)

  return (
    <div className="chart-family-section relative">
      {/* Family Heading / Disclosure Control */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={controlsId}
        className={cn(
          "group/family relative flex w-full items-center gap-2.5 rounded-lg py-1.5 px-2 text-left text-[13px] font-medium transition-colors select-none",
          "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
          isRouteActive
            ? "bg-muted text-foreground border border-border shadow-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {/* Family Icon Node on Rail */}
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded transition-colors",
            isRouteActive
              ? "text-foreground"
              : "text-muted-foreground group-hover/family:text-foreground"
          )}
        >
          <ChartFamilyIcon family={category} className="size-4" />
        </span>

        {/* Family Label */}
        <span className="truncate tracking-[-0.01em]">{label}</span>

        {/* Canonical Dynamic Count Badge */}
        <span
          className={cn(
            "ml-auto font-mono text-[11px] tabular-nums transition-colors",
            isRouteActive
              ? "text-foreground font-medium px-1.5 py-0.5 rounded bg-background border border-border"
              : "text-muted-foreground/80 group-hover/family:text-muted-foreground"
          )}
        >
          {items.length}
        </span>

        {/* Disclosure Chevron (Hugeicons) */}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={1.8}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none group-hover/family:text-foreground",
            isExpanded ? "rotate-0 text-foreground" : "-rotate-90 text-muted-foreground/60"
          )}
        />
      </button>

      {/* Child Chart Navigation List with Taxonomy Rail */}
      {isExpanded && (
        <div
          id={controlsId}
          role="region"
          aria-label={`${label} charts`}
          className="relative mt-1 ml-4 pl-3.5 border-l border-border space-y-0.5"
        >
          {items.map((chart) => {
            const isItemActive = chart.id === currentChart.id

            return (
              <Link
                key={chart.id}
                ref={isItemActive ? activeItemRef : undefined}
                href={chartHref(chart)}
                onClick={onItemClick}
                aria-current={isItemActive ? "page" : undefined}
                className={cn(
                  "group/item relative flex min-h-[32px] w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors",
                  "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
                  isItemActive
                    ? "bg-muted text-foreground font-medium border border-border shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Active Indicator Dot */}
                {isItemActive && (
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-foreground"
                  />
                )}

                <span className="truncate">{chart.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
