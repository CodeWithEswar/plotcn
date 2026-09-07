import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartStateProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  onRetry?: () => void
  retryLabel?: string
}

/**
 * Chart Loading State Skeleton
 * Abstract skeleton preserving footprint without deceptive business data.
 * Section 12.8 - 12.11.
 */
export function ChartLoadingState({
  className,
  title = "Loading visualization...",
  description = "Fetching metrics and preparing data points",
  ...props
}: ChartStateProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
  }, [])

  return (
    <div
      className={cn(
        "flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950/40 p-6 text-center backdrop-blur-sm",
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {reducedMotion ? (
        <div className="mb-3 h-6 w-6 rounded-full border-2 border-zinc-600" />
      ) : (
        <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400" />
      )}
      <h4 className="text-xs font-semibold text-zinc-200">{title}</h4>
      <p className="mt-1 text-[11px] text-zinc-500 max-w-[240px]">{description}</p>
    </div>
  )
}

/**
 * Chart Empty State Fallback
 * Section 12.12 - 12.15.
 */
export function ChartEmptyState({
  className,
  title = "No data available",
  description = "There are no records to display for the selected range.",
  action,
  icon,
  ...props
}: ChartStateProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-zinc-950/30 p-6 text-center",
        className
      )}
      role="region"
      aria-label="Empty visualization"
      {...props}
    >
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-zinc-900/60 text-zinc-400">
        {icon ? (
          icon
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h4 className="text-xs font-semibold text-zinc-200">{title}</h4>
      <p className="mt-1 text-[11px] text-zinc-500 max-w-[240px]">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

/**
 * Chart Error State Fallback
 * Section 12.16 - 12.18, 12.92.
 */
export function ChartErrorState({
  className,
  title = "Failed to load chart",
  description = "An error occurred while calculating coordinates or loading the runtime.",
  action,
  onRetry,
  retryLabel = "Try again",
  ...props
}: ChartStateProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-rose-500/20 bg-rose-950/10 p-6 text-center",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-950/40 text-rose-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h4 className="text-xs font-semibold text-rose-200">{title}</h4>
      <p className="mt-1 text-[11px] text-zinc-400 max-w-[260px]">{description}</p>
      {onRetry && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-white/[0.12] bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
          >
            {retryLabel}
          </button>
        </div>
      )}
      {action && !onRetry && <div className="mt-3">{action}</div>}
    </div>
  )
}

/**
 * Chart Unavailable State
 * Legitimate metric unavailability (permission, retention, unsupported breakdown).
 * Section 12.20, 12.21.
 */
export function ChartUnavailableState({
  className,
  title = "Metric unavailable",
  description = "This visualization is not available for the selected account, timeframe, or permission tier.",
  action,
  icon,
  ...props
}: ChartStateProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950/20 p-6 text-center",
        className
      )}
      role="region"
      aria-label="Metric unavailable"
      {...props}
    >
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-zinc-900/60 text-zinc-400">
        {icon ? (
          icon
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        )}
      </div>
      <h4 className="text-xs font-semibold text-zinc-200">{title}</h4>
      <p className="mt-1 text-[11px] text-zinc-500 max-w-[260px]">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
