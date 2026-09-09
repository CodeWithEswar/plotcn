"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import type { ChartEngine, ChartMetadata } from "@/lib/charts/metadata"
import { Button } from "@/components/ui/button"
import { EngineBrandBadge } from "./engine-badge"
import { ChartSidebarFamily } from "./chart-sidebar-family"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavigationProps {
  current: ChartMetadata
  charts: readonly ChartMetadata[]
  onItemClick?: () => void
}

const EXCLUDED_SIDEBAR_SLUGS = new Set([
  "line-basic",
  "line-multiple",
  "area-basic",
  "bar-basic",
])

function Navigation({ current, charts, onItemClick }: NavigationProps) {
  const engines: ChartEngine[] = ["recharts", "d3", "google"]
  const filteredCharts = charts.filter((chart) => !EXCLUDED_SIDEBAR_SLUGS.has(chart.slug))

  // Manage expanded state per engine+family. The active route's family is always expanded.
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>(() => ({
    [`${current.engine}-${current.category}`]: true,
  }))

  // Auto-expand family when user navigates to a chart in a different category/engine
  useEffect(() => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [`${current.engine}-${current.category}`]: true,
    }))
  }, [current.engine, current.category])

  const toggleFamily = (key: string) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <nav aria-label="Chart catalog" className="chart-detail-nav">
      {/* Root quick navigation links */}
      <div className="chart-nav-section">
        <p>Charts</p>
        <Link href="/charts" className="chart-nav-root-link" onClick={onItemClick}>
          All charts <span>{filteredCharts.length}</span>
        </Link>
        <Link href="/playground" className="chart-nav-root-link" onClick={onItemClick}>
          Playground
        </Link>
        <Link href="/docs/installation" className="chart-nav-root-link" onClick={onItemClick}>
          Getting started
        </Link>
      </div>

      {/* Engine and Family Taxonomy Rail */}
      <div className="chart-nav-section">
        <p>By engine</p>
        {engines.map((engine) => {
          const engineCharts = filteredCharts.filter((chart) => chart.engine === engine)
          if (engineCharts.length === 0) return null
          const categories = [...new Set(engineCharts.map((chart) => chart.category))]

          return (
            <details
              key={engine}
              open={engine === current.engine}
              className="chart-engine-details group/engine mb-3"
            >
              <summary
                data-active={engine === current.engine || undefined}
                className="flex cursor-pointer items-center justify-between rounded-lg py-1.5 px-2 text-left transition-colors hover:bg-zinc-900/50"
              >
                <EngineBrandBadge engine={engine} className="border-0 bg-transparent p-0" />
                <small className="font-mono text-[10px] text-zinc-500">
                  {engineCharts.length}
                </small>
              </summary>

              {/* Family Sections with Vertical Taxonomy Rail */}
              <div className="chart-nav-taxonomy relative mt-2 space-y-2">
                {categories.map((category) => {
                  const categoryCharts = engineCharts.filter(
                    (chart) => chart.category === category
                  )
                  const key = `${engine}-${category}`
                  const isExpanded =
                    expandedFamilies[key] ??
                    (current.engine === engine && current.category === category)

                  return (
                    <ChartSidebarFamily
                      key={key}
                      engine={engine}
                      category={category}
                      items={categoryCharts}
                      currentChart={current}
                      isExpanded={isExpanded}
                      onToggle={() => toggleFamily(key)}
                      onItemClick={onItemClick}
                    />
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
    </nav>
  )
}

export function ChartDetailSidebar(props: Omit<NavigationProps, "onItemClick">) {
  return (
    <aside className="chart-detail-sidebar" aria-label="Chart documentation navigation">
      <Navigation {...props} />
    </aside>
  )
}

export function ChartDetailMobileSidebar(props: Omit<NavigationProps, "onItemClick">) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-9 gap-2 px-3 text-xs font-medium border-white/[0.1] bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 justify-center sm:justify-start shrink-0"
          />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} size={15} className="text-zinc-400 shrink-0" />
        <span className="truncate">Browse charts</span>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="charts-surface overflow-y-auto p-5"
        data-theme="dark"
      >
        <SheetHeader>
          <SheetTitle>Chart catalog</SheetTitle>
          <SheetDescription>Browse implemented Plotcn charts.</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Navigation {...props} onItemClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
