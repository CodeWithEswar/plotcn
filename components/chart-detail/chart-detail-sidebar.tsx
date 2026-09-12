"use client"

import React, { useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import type { ChartEngine, ChartMetadata } from "@/lib/charts/metadata"
import { Button } from "@/components/ui/button"
import { EngineBrandBadge } from "./engine-badge"
import { ChartSidebarFamily } from "./chart-sidebar-family"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  SheetClose,
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
        <Link
          href="/charts"
          className="chart-nav-root-link chart-nav-back-btn"
          onClick={onItemClick}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={13} className="text-muted-foreground shrink-0" />
          <span>All charts</span>
          <span>{filteredCharts.length}</span>
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
                className="flex cursor-pointer items-center justify-between rounded-lg py-1.5 px-2 text-left transition-colors hover:bg-muted/50"
              >
                <EngineBrandBadge engine={engine} className="border-0 bg-transparent p-0" />
                <small className="font-mono text-[10px] text-muted-foreground">
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
            className="w-full flex-1 h-9 min-h-[36px] max-h-[36px] rounded-lg gap-2 px-3 text-xs font-medium border-border bg-background hover:bg-muted text-foreground justify-start shrink-0 focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
          />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} size={15} className="text-muted-foreground shrink-0" />
        <span className="truncate">Browse charts</span>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="charts-surface flex flex-col h-full w-[300px] sm:w-[340px] max-w-[85vw] p-0 gap-0 border-r border-border bg-background text-foreground shadow-2xl"
        data-theme="follow"
      >
        {/* Responsive Header: Fixed, perfectly aligned in a single row with back button, compact title, badge, and close button */}
        <div className="chart-detail-drawer-header flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-background/90 backdrop-blur-sm shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SheetClose
              render={
                <button
                  type="button"
                  className="size-7 rounded-md bg-muted/60 border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center shrink-0 transition-colors shadow-xs cursor-pointer"
                  aria-label="Back to chart"
                />
              }
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            </SheetClose>
            <SheetTitle
              className="!text-[12px] !font-semibold uppercase tracking-wider text-foreground truncate m-0 leading-none"
              style={{ fontSize: "12px", lineHeight: "1" }}
            >
              Chart Catalog
            </SheetTitle>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
              {props.charts.length}
            </span>
          </div>
          <SheetClose
            render={
              <button
                type="button"
                className="size-7 rounded-md bg-muted/60 border border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center shrink-0 transition-colors shadow-xs cursor-pointer"
                aria-label="Close chart catalog"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </SheetClose>
        </div>
        <SheetDescription className="sr-only">
          Browse implemented Plotcn charts and components.
        </SheetDescription>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
          <Navigation {...props} onItemClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
