import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { ChartStateShell } from "./chart-state-shell"

export interface ChartErrorProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: ReactNode
  onRetry?: () => void
  retryLabel?: string
  minHeight?: number | string
}

/**
 * ChartError
 * Controlled error fallback communicating failures truthfully without exposing raw stack traces.
 * Section 12.16 - 12.18, 12.92.
 */
export const ChartError = forwardRef<HTMLDivElement, ChartErrorProps>(
  function ChartError(
    {
      title = "Unable to load chart",
      description = "An unexpected error occurred while calculating visualization data.",
      action,
      onRetry,
      retryLabel = "Try again",
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
        role="alert"
        className={`border-destructive/20 bg-destructive/5 ${className || ""}`}
        {...props}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h4 className="text-xs font-semibold text-destructive">{title}</h4>
        <p className="text-[11px] text-muted-foreground">{description}</p>
        {onRetry && (
          <div className="mt-2">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {retryLabel}
            </button>
          </div>
        )}
        {action && !onRetry && <div className="mt-2">{action}</div>}
      </ChartStateShell>
    )
  }
)
