"use client"

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { useInteraction } from "./interaction-context"

export interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Explicit visibility toggle. If omitted, derives from interaction context */
  active?: boolean
  /** Explicit X coordinate in pixels. If omitted, derives from pointer */
  x?: number
  /** Explicit Y coordinate in pixels. If omitted, derives from pointer */
  y?: number
  /** Pixel offset from target coordinate. Defaults to { x: 12, y: 12 } */
  offset?: { x: number; y: number }
}

/**
 * ChartTooltip renders an HTML overlay positioned near the pointer or active datum.
 * Completely independent from shadcn/ui generic tooltips to accommodate multi-series rows and metrics.
 */
export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  function ChartTooltip(
    {
      children,
      active: customActive,
      x: customX,
      y: customY,
      offset = { x: 12, y: 12 },
      className,
      style,
      ...props
    },
    ref
  ) {
    let active = customActive
    let x = customX
    let y = customY

    // Attempt to read from interaction context if explicit coordinates are not provided
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const interaction = useInteraction()
      if (active === undefined) {
        active = interaction.isHovered || interaction.isFocused || interaction.activeDatumId !== null
      }
      if (x === undefined && interaction.pointer) {
        x = interaction.pointer.x
      }
      if (y === undefined && interaction.pointer) {
        y = interaction.pointer.y
      }
    } catch {
      // Standalone usage outside InteractionProvider
    }

    if (!active || x === undefined || y === undefined) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tooltip"
        className={
          className
            ? `plotcn-chart-tooltip pointer-events-none absolute z-50 rounded-md border border-border/50 bg-popover/95 px-3 py-1.5 text-xs text-popover-foreground shadow-md backdrop-blur-sm transition-transform duration-75 ${className}`
            : "plotcn-chart-tooltip pointer-events-none absolute z-50 rounded-md border border-border/50 bg-popover/95 px-3 py-1.5 text-xs text-popover-foreground shadow-md backdrop-blur-sm transition-transform duration-75"
        }
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${x + offset.x}px, ${y + offset.y}px, 0)`,
          pointerEvents: "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
