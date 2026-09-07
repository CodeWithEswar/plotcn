import React, { forwardRef, type HTMLAttributes } from "react"
import { LegendMarkerIcon } from "./legend-marker"
import type { ChartLegendItem } from "../types/legend"

export type LegendItemData = ChartLegendItem

export interface LegendItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {

  item: ChartLegendItem
  /** Called when item is toggled via click or Enter/Space keyboard event */
  onToggle?: (id: string) => void
  /** Called when item is isolated (soloed) via Alt/Option click or context action */
  onIsolate?: (id: string) => void
  /** Called on hover to temporarily emphasize series */
  onHoverChange?: (id: string | null) => void
  /** Render custom color swatch */
  renderSwatch?: (item: ChartLegendItem) => React.ReactNode
}

/**
 * LegendItem renders an accessible, interactive series identifier in chart legends.
 * Follows button semantics with generous touch bounds and keyboard accessibility.
 * Section 8.43, 8.54, 8.55, 8.56, 8.57.
 */
export const LegendItem = forwardRef<HTMLDivElement, LegendItemProps>(
  function LegendItem(
    {
      item,
      onToggle,
      onIsolate,
      onHoverChange,
      renderSwatch,
      className,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) {
    const isInteractive = Boolean(onToggle && !item.disabled)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e)
      if (!isInteractive) return

      // Alt/Option+Click or Shift+Click triggers isolate mode (Section 8.51)
      if ((e.altKey || e.shiftKey) && onIsolate) {
        onIsolate(item.id)
      } else {
        onToggle?.(item.id)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (!isInteractive) return

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if ((e.altKey || e.shiftKey) && onIsolate) {
          onIsolate(item.id)
        } else {
          onToggle?.(item.id)
        }
      }
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e)
      if (isInteractive) {
        onHoverChange?.(item.id)
      }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e)
      if (isInteractive) {
        onHoverChange?.(null)
      }
    }

    const isHidden = Boolean(item.hidden)
    const isDisabled = Boolean(item.disabled)

    return (
      <div
        ref={ref}
        role={isInteractive ? "button" : "listitem"}
        tabIndex={isInteractive ? 0 : undefined}
        aria-pressed={isInteractive ? !isHidden : undefined}
        aria-label={`${item.label} series, ${isHidden ? "hidden" : "visible"}`}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={
          className
            ? `plotcn-legend-item inline-flex min-h-[32px] cursor-pointer select-none items-center gap-2 rounded px-2 py-1 text-xs transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isHidden ? "opacity-35 line-through" : "opacity-100"
              } ${isDisabled ? "cursor-not-allowed opacity-30" : ""} ${className}`
            : `plotcn-legend-item inline-flex min-h-[32px] cursor-pointer select-none items-center gap-2 rounded px-2 py-1 text-xs transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isHidden ? "opacity-35 line-through" : "opacity-100"
              } ${isDisabled ? "cursor-not-allowed opacity-30" : ""}`

        }
        {...props}
      >
        {renderSwatch ? (
          renderSwatch(item)
        ) : (
          <LegendMarkerIcon
            marker={item.marker}
            color={item.color}
            className={isHidden ? "grayscale opacity-50" : ""}
          />
        )}
        <span className="font-medium text-foreground">{item.label}</span>
        {item.value !== undefined && (
          <span className="tabular-nums text-muted-foreground">({item.value})</span>
        )}
      </div>
    )
  }
)
