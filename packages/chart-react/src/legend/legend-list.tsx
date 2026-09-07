import React, { forwardRef, type HTMLAttributes } from "react"
import { LegendItem, type LegendItemData } from "./legend-item"

export interface LegendListProps extends HTMLAttributes<HTMLDivElement> {
  items: readonly LegendItemData[]
  /** Optional set or array of currently hidden series IDs */
  hiddenSeries?: readonly string[] | ReadonlySet<string>
  /** Callback fired when a series visibility is toggled */
  onToggleSeries?: (id: string) => void
}

/**
 * LegendList renders an array of series legend items with controlled/uncontrolled visibility.
 */
export const LegendList = forwardRef<HTMLDivElement, LegendListProps>(
  function LegendList(
    {
      items,
      hiddenSeries,
      onToggleSeries,
      className,
      ...props
    },
    ref
  ) {
    const isHidden = (id: string) => {
      if (!hiddenSeries) return false
      if (hiddenSeries instanceof Set) return hiddenSeries.has(id)
      return (hiddenSeries as readonly string[]).includes(id)
    }

    return (
      <div
        ref={ref}
        role="list"
        className={
          className
            ? `plotcn-legend-list flex flex-wrap items-center gap-4 ${className}`
            : "plotcn-legend-list flex flex-wrap items-center gap-4"
        }
        {...props}
      >
        {items.map((item) => (
          <LegendItem
            key={item.id}
            item={{
              ...item,
              hidden: item.hidden ?? isHidden(item.id),
            }}
            onToggle={onToggleSeries}
          />
        ))}
      </div>
    )
  }
)
