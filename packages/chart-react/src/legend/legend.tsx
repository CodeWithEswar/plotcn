import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { LegendItem } from "./legend-item"
import type { ChartLegendItem, LegendOrientation, LegendOverflow, LegendInteraction } from "../types/legend"

export interface LegendProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  items?: readonly ChartLegendItem[]
  align?: "start" | "center" | "end"
  orientation?: LegendOrientation
  overflow?: LegendOverflow
  interaction?: LegendInteraction
  hiddenSeriesIds?: readonly string[]
  onToggleSeries?: (id: string) => void
  onIsolateSeries?: (id: string) => void
  onHoverSeries?: (id: string | null) => void
  /** When true, prevents toggling off the last remaining visible series (Section 8.50) */
  preventHideAll?: boolean
  /** When false, automatically hides legend if there is only 1 series (Section 8.47) */
  showSingleSeriesLegend?: boolean
}

/**
 * Legend establishes the semantic, accessible container for chart series legends.
 * Supports horizontal/vertical orientation, wrapping, scrolling, and interactive toggle/isolation.
 * Section 8.41 - 8.52.
 */
export const Legend = forwardRef<HTMLDivElement, LegendProps>(
  function Legend(
    {
      children,
      items,
      align = "center",
      orientation = "horizontal",
      overflow = "wrap",
      interaction = "toggle",
      hiddenSeriesIds = [],
      onToggleSeries,
      onIsolateSeries,
      onHoverSeries,
      preventHideAll = true,
      showSingleSeriesLegend = false,
      className,
      ...props
    },
    ref
  ) {
    // Single series default: hide legend unless explicitly enabled (Section 8.47)
    if (items && items.length <= 1 && !showSingleSeriesLegend && !children) {
      return null
    }

    const alignClass =
      align === "start"
        ? "justify-start"
        : align === "end"
        ? "justify-end"
        : "justify-center"

    const orientationClass =
      orientation === "vertical" ? "flex-col items-start" : "flex-row items-center"

    const overflowClass =
      overflow === "scroll"
        ? "overflow-x-auto no-scrollbar flex-nowrap"
        : overflow === "wrap"
        ? "flex-wrap"
        : ""

    const hiddenSet = new Set(hiddenSeriesIds)

    const handleToggle = (id: string) => {
      if (!onToggleSeries) return

      if (preventHideAll && items) {
        const visibleCount = items.filter((item) => !hiddenSet.has(item.id)).length
        const isCurrentlyVisible = !hiddenSet.has(id)
        if (visibleCount <= 1 && isCurrentlyVisible) {
          // Prevent hiding the final visible series (Section 8.50)
          return
        }
      }

      onToggleSeries(id)
    }

    const handleIsolate = (id: string) => {
      if (onIsolateSeries) {
        onIsolateSeries(id)
      } else if (onToggleSeries && items) {
        // Fallback isolation: hide all other series
        items.forEach((item) => {
          if (item.id !== id && !hiddenSet.has(item.id)) {
            onToggleSeries(item.id)
          } else if (item.id === id && hiddenSet.has(item.id)) {
            onToggleSeries(item.id)
          }
        })
      }
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Chart Legend"
        className={
          className
            ? `plotcn-legend flex gap-3 pt-3 text-xs ${alignClass} ${orientationClass} ${overflowClass} ${className}`
            : `plotcn-legend flex gap-3 pt-3 text-xs ${alignClass} ${orientationClass} ${overflowClass}`
        }
        {...props}
      >
        {items
          ? items.map((item) => (
              <LegendItem
                key={item.id}
                item={{
                  ...item,
                  hidden: hiddenSet.has(item.id),
                }}
                onToggle={interaction !== "none" ? handleToggle : undefined}
                onIsolate={interaction === "isolate" || interaction === "toggle-and-isolate" ? handleIsolate : undefined}
                onHoverChange={onHoverSeries}
              />
            ))
          : children}
      </div>
    )
  }
)
