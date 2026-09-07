"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { GoogleChartsLoaderState } from "./google-chart-loader"

export interface GoogleChartContainerProps {
  status: GoogleChartsLoaderState
  errorMessage?: string
  height?: number | string
  className?: string
  onRetry?: () => void
  children: React.ReactNode
  chartRef: React.RefObject<HTMLDivElement | null>
  title?: string
}

/**
 * Google Chart Container
 * Provides client-side lifecycle mounting, dark glassmorphic skeleton loading, error surface, and accessibility wrapper.
 */
export function GoogleChartContainer({
  status,
  errorMessage,
  height = 360,
  className,
  onRetry,
  children,
  chartRef,
  title = "Google Chart Visualization",
}: GoogleChartContainerProps) {
  const containerHeight = typeof height === "number" ? `${height}px` : height

  return (
    <figure
      role="region"
      aria-label={title}
      className={cn(
        "relative w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 transition-colors min-w-0 overflow-hidden",
        className
      )}
      style={{ height: containerHeight }}
    >
      {/* Loading Skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/70 p-6 text-center backdrop-blur-sm">
          <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-400" />
          <span className="text-xs font-semibold text-zinc-300">Loading Google visualization runtime...</span>
        </div>
      )}

      {/* Error Fallback */}
      {status === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 p-6 text-center">
          <div className="mb-2 text-xs font-semibold text-rose-300">Failed to load Google Charts</div>
          <p className="text-[11px] text-zinc-500 max-w-xs mb-3">
            {errorMessage || "The external Google script failed to download. Check network connection or CSP policy."}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-mono px-3 py-1 rounded bg-white/[0.05] border border-white/[0.1] text-zinc-200 hover:bg-white/[0.1]"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Actual Chart Mount Node */}
      <div ref={chartRef} className="w-full h-full" />
      {children}
    </figure>
  )
}
