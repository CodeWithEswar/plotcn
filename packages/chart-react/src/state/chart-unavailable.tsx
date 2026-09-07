import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { ChartStateShell } from "./chart-state-shell"

export interface ChartUnavailableProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: ReactNode
  minHeight?: number | string
}

/**
 * ChartUnavailable
 * Legitimate inability to provide a metric (permission restricted, unsupported breakdown, data not retained).
 * Distinct from both Empty and Error states.
 * Section 12.20, 12.21.
 */
export const ChartUnavailable = forwardRef<HTMLDivElement, ChartUnavailableProps>(
  function ChartUnavailable(
    {
      title = "Metric unavailable",
      description = "This visualization is not available for the selected account, timeframe, or permission tier.",
      action,
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
        aria-label="Metric unavailable"
        className={className}
        {...props}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
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
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        <p className="text-[11px] text-muted-foreground">{description}</p>
        {action && <div className="mt-2">{action}</div>}
      </ChartStateShell>
    )
  }
)
