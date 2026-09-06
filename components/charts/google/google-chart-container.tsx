"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons"
import type { GoogleChartAccessibility, GoogleChartsStatus } from "@/lib/google-charts"

interface GoogleChartContainerProps {
  status: GoogleChartsStatus
  errorMessage?: string
  isEmpty?: boolean
  height?: number | string
  className?: string
  accessibility?: GoogleChartAccessibility
  onRetry?: () => void
  children: React.ReactNode
  chartRef: React.RefObject<HTMLDivElement | null>
  bordered?: boolean
}

export function GoogleChartContainer({
  status,
  errorMessage,
  isEmpty = false,
  height = 360,
  className = "",
  accessibility,
  onRetry,
  children,
  chartRef,
  bordered = true,
}: GoogleChartContainerProps) {
  const containerHeight = typeof height === "number" ? `${height}px` : height
  const isFullHeight = height === "100%"

  return (
    <figure
      role="region"
      aria-label={accessibility?.title || "Google Chart visualization"}
      className={`relative w-full transition-colors flex flex-col justify-center min-w-0 ${
        bordered
          ? "rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4"
          : "p-0 border-0 bg-transparent"
      } ${isFullHeight ? "h-full" : ""} ${className}`}
      style={{
        height: isFullHeight ? "100%" : undefined,
        minHeight: typeof height === "number" ? containerHeight : undefined,
      }}
    >
      {/* Hidden Accessible Description for Screen Readers */}
      {accessibility && (
        <figcaption className="sr-only">
          <h3>{accessibility.title || "Chart Overview"}</h3>
          {accessibility.description && <p>{accessibility.description}</p>}
          {accessibility.summary && <p>{accessibility.summary}</p>}
        </figcaption>
      )}

      {/* 1. Loading Skeleton */}
      {status === "loading" && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-950/70 backdrop-blur-sm rounded-xl select-none"
          aria-live="polite"
        >
          <div className="size-6 rounded-full border-2 border-zinc-700 border-t-zinc-200 animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Loading visualization engine…</span>
        </div>
      )}

      {/* 2. Error Boundary State */}
      {status === "error" && (
        <div
          className="flex flex-col items-center justify-center gap-2.5 p-6 text-center text-zinc-400"
          role="alert"
        >
          <div className="size-8 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center text-red-400">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} strokeWidth={1.8} />
          </div>
          <p className="text-xs font-medium text-zinc-200">Unable to load Google Charts</p>
          <p className="font-mono text-[11px] text-zinc-500 max-w-sm">
            {errorMessage || "The external Google visualization runtime could not be reached. Verify network connectivity."}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2 h-7 text-xs gap-1.5 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            >
              <HugeiconsIcon icon={RefreshIcon} size={12} strokeWidth={1.8} />
              Retry
            </Button>
          )}
        </div>
      )}

      {/* 3. Empty Data State */}
      {status === "ready" && isEmpty && (
        <div className="flex flex-col items-center justify-center gap-1.5 p-6 text-center text-zinc-500">
          <p className="text-xs font-medium text-zinc-400">No chart data available</p>
          <p className="text-[11px] font-mono text-zinc-600">Provide at least one data record to render visualization.</p>
        </div>
      )}

      {/* 4. Chart Render DOM Node */}
      <div
        ref={chartRef}
        style={{ height: isFullHeight ? "100%" : containerHeight }}
        className={`w-full min-w-0 transition-opacity duration-200 plotcn-google-chart ${isFullHeight ? "h-full" : ""} ${
          status === "ready" && !isEmpty ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {children}
    </figure>
  )
}
