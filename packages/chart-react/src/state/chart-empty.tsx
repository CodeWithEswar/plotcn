import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { ChartStateShell } from "./chart-state-shell"

export interface ChartEmptyProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  minHeight?: number | string
}

/**
 * ChartEmpty
 * Factual empty state for datasets with zero observations.
 * Section 12.12 - 12.15.
 */
export const ChartEmpty = forwardRef<HTMLDivElement, ChartEmptyProps>(
  function ChartEmpty(
    {
      title = "No data available",
      description = "There are no recorded observations for the current selection.",
      action,
      icon,
      minHeight,
      className,
      ...props
    },
    ref
  ) {
    return (
      <ChartStateShell
        ref={ref}
        minHeight={minHeight}
        role="region"
        aria-label="Empty chart state"
        className={className}
        {...props}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
          {icon ? (
            icon
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          )}
        </div>
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        <p className="text-[11px] text-muted-foreground">{description}</p>
        {action && <div className="mt-2">{action}</div>}
      </ChartStateShell>
    )
  }
)
