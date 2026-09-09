"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { GoogleChartsLoaderState } from "./google-chart-loader"
import { ChartErrorState, ChartLoadingState } from "../shared/chart-state"

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
        "plotcn-chart relative w-full rounded-xl border border-[var(--chart-border)] bg-[var(--chart-background)] p-4 transition-colors min-w-0 overflow-hidden",
        className
      )}
      style={{ height: containerHeight }}
    >
      {/* Loading Skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 z-10 bg-[var(--chart-background)]">
          <ChartLoadingState title="Loading Google visualization…" description="Loading the Google Charts runtime." />
        </div>
      )}

      {/* Error Fallback */}
      {status === "error" && (
        <div className="absolute inset-0 z-10 bg-[var(--chart-background)]">
          <ChartErrorState
            title="Unable to load Google Charts"
            description={errorMessage || "The external runtime could not be loaded. Check the network or content security policy."}
            onRetry={onRetry}
            retryLabel="Retry"
          />
        </div>
      )}

      {/* Actual Chart Mount Node */}
      <div ref={chartRef} className="w-full h-full" />
      {children}
    </figure>
  )
}
