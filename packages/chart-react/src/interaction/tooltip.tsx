"use client"

import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { useInteraction } from "./interaction-context"
import { calculateTooltipPosition } from "./tooltip-position"
import { LegendMarkerIcon } from "../legend/legend-marker"
import type {
  TooltipDatum,
  TooltipAnchor,
  ChartTooltipContext,
  TooltipSelectionMode,
} from "../types/interaction"

export interface ChartTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode | ((context: ChartTooltipContext) => ReactNode)
  /** Explicit visibility toggle */
  active?: boolean
  /** Explicit anchor coordinate */
  anchor?: TooltipAnchor | null
  /** Explicit X coordinate in pixels */
  x?: number
  /** Explicit Y coordinate in pixels */
  y?: number
  /** Selection strategy indicator */
  mode?: TooltipSelectionMode
  /** Multi-series items */
  items?: readonly TooltipDatum[]
  /** Header label */
  label?: unknown
  /** Custom label formatter */
  labelFormatter?: (label: unknown) => ReactNode
  /** Custom value formatter */
  valueFormatter?: (value: unknown, datum: unknown) => ReactNode
  /** Pixel offset from target coordinate. Defaults to { x: 12, y: 12 } */
  offset?: { x: number; y: number }
  /** Container bounds for collision detection */
  containerBounds?: { width: number; height: number }
  /** Enables compact top-anchored mode */
  compact?: boolean
  /** Whether the tooltip is currently locked (e.g. from touch tap) */
  locked?: boolean
}

/**
 * ChartTooltip renders a collision-aware, accessible HTML interaction overlay.
 * Formats series rows, tabular values, and non-color markers with deterministic hierarchy.
 * Section 8.1 - 8.24, 8.65.
 */
export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  function ChartTooltip(
    {
      children,
      active: customActive,
      anchor: customAnchor,
      x: customX,
      y: customY,
      mode = "nearest",
      items: customItems,
      label: customLabel,
      labelFormatter,
      valueFormatter,
      offset = { x: 12, y: 12 },
      containerBounds,
      compact = false,
      locked: customLocked,
      className,
      style,
      ...props
    },
    ref
  ) {
    let active = customActive
    let anchor = customAnchor
    let items = customItems
    let label = customLabel
    let locked = customLocked ?? false

    // Attempt to read from interaction context if explicit props are not passed
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const interaction = useInteraction()
      if (active === undefined) {
        active = interaction.isHovered || interaction.isFocused || interaction.activeDatumId !== null || interaction.locked
      }
      if (!anchor && interaction.anchor) {
        anchor = interaction.anchor
      } else if (!anchor && interaction.pointer) {
        anchor = interaction.pointer
      }
      if (!items && interaction.items.length > 0) {
        // Filter out hidden series (Section 8.64)
        items = interaction.items.filter((item) => !interaction.hiddenSeriesIds.has(item.id))
      }
      if (label === undefined && interaction.activeLabel !== null) {
        label = interaction.activeLabel
      }
      if (customLocked === undefined) {
        locked = interaction.locked
      }
    } catch {
      // Standalone usage outside InteractionProvider
    }

    if (customX !== undefined && customY !== undefined && !anchor) {
      anchor = { x: customX, y: customY }
    }

    if (!active || !anchor) {
      return null
    }

    // Position calculation
    let posX = anchor.x + offset.x
    let posY = anchor.y + offset.y

    if (containerBounds || compact) {
      const estimatedSize = {
        width: compact ? 280 : 200,
        height: 40 + (items ? items.length * 24 : 32),
      }
      const bounds = containerBounds || {
        width: typeof window !== "undefined" ? window.innerWidth : 1000,
        height: typeof window !== "undefined" ? window.innerHeight : 800,
      }
      const position = calculateTooltipPosition(anchor, estimatedSize, bounds, {
        offset,
        compact,
      })
      posX = position.x
      posY = position.y
    }

    const tooltipContext: ChartTooltipContext = {
      active,
      label,
      items: items || [],
      anchor,
      locked,
    }

    const formattedLabel = labelFormatter ? labelFormatter(label) : label ? String(label) : null

    return (
      <div
        ref={ref}
        role="tooltip"
        aria-hidden={!active}
        className={
          className
            ? `plotcn-chart-tooltip pointer-events-none absolute z-50 min-w-[160px] max-w-[320px] rounded-lg border border-border/60 bg-popover/95 p-2.5 text-xs text-popover-foreground shadow-lg backdrop-blur-md transition-transform duration-75 ${className}`
            : "plotcn-chart-tooltip pointer-events-none absolute z-50 min-w-[160px] max-w-[320px] rounded-lg border border-border/60 bg-popover/95 p-2.5 text-xs text-popover-foreground shadow-lg backdrop-blur-md transition-transform duration-75"
        }
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${posX}px, ${posY}px, 0)`,
          pointerEvents: "none",
          ...style,
        }}
        {...props}
      >

        {typeof children === "function" ? (
          children(tooltipContext)
        ) : children ? (
          children
        ) : (
          <div className="flex flex-col gap-1.5">
            {formattedLabel && (
              <div className="flex items-center justify-between border-b border-border/40 pb-1 font-medium text-foreground">
                <span>{formattedLabel}</span>
                {locked && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    Locked
                  </span>
                )}
              </div>
            )}
            {items && items.length > 0 && (
              <div className="flex flex-col gap-1 pt-0.5">
                {items.map((item) => {
                  const val = item.value
                  // Format missing/null values with em dash (Section 8.65)
                  const displayValue =
                    valueFormatter
                      ? valueFormatter(val, item.datum)
                      : item.formattedValue !== undefined
                      ? item.formattedValue
                      : val === null || val === undefined || Number.isNaN(val)
                      ? "—"
                      : String(val)

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <LegendMarkerIcon
                          marker={item.marker}
                          color={item.color}
                          size={10}
                        />
                        <span className="truncate text-muted-foreground">
                          {item.label || item.id}
                        </span>
                      </div>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {displayValue}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
