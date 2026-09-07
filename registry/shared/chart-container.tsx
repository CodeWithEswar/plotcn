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
        "flex w-full h-full min-w-0 min-h-0 justify-center text-xs text-zinc-100",
        "[&_.recharts-cartesian-axis-tick_text]:fill-[var(--chart-axis,var(--color-muted-foreground,#a1a1aa))]",
        "[&_.recharts-cartesian-grid_line]:stroke-[var(--chart-grid,var(--color-border,rgba(255,255,255,0.1)))]",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-[var(--chart-crosshair,var(--color-border,#52525b))]",
        "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
        "[&_.recharts-layer]:outline-none",
        "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-[var(--chart-grid,var(--color-border,#27272a))]",
        "[&_.recharts-radial-bar-background-sector]:fill-muted",
        "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/20",
        "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-[var(--chart-zero-line,var(--color-border,#71717a))]",
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
