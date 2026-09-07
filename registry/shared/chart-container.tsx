"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  config?: Record<string, { label?: React.ReactNode; color?: string }>
  children: React.ReactNode
}

/**
 * Plotcn Shared ChartContainer
 * Container-aware responsive wrapper using ResizeObserver with semantic token support.
 */
export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div
      data-chart={chartId}
      className={cn(
        "flex aspect-video justify-center text-xs text-zinc-100",
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
        "[&_.recharts-cartesian-grid_line]:stroke-border/50",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
        "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
        "[&_.recharts-layer]:outline-none",
        "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
        "[&_.recharts-radial-bar-background-sector]:fill-muted",
        "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/20",
        "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
        "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
        "[&_.recharts-sector]:outline-none",
        "[&_.recharts-surface]:overflow-visible",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
