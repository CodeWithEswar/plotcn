"use client"

import React, { forwardRef, type HTMLAttributes, useEffect, useState } from "react"
import { ChartStateShell } from "./chart-state-shell"

export interface ChartLoadingProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  minHeight?: number | string
}

/**
 * ChartLoading
 * Abstract loading skeleton preserving visualization footprint without deceptive business marks.
 * Section 12.8 - 12.11.
 */
export const ChartLoading = forwardRef<HTMLDivElement, ChartLoadingProps>(
  function ChartLoading(
    {
      title = "Loading visualization…",
      description = "Preparing data coordinates and rendering layout",
      minHeight,
      className,
      ...props
    },
    ref
  ) {
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
      if (typeof window !== "undefined" && window.matchMedia) {
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      }
    }, [])

    return (
      <ChartStateShell
        ref={ref}
        minHeight={minHeight}
        role="status"
        aria-live="polite"
        className={className}
        {...props}
      >
        {reducedMotion ? (
          <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/40" />
        ) : (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
        )}
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </ChartStateShell>
    )
  }
)
