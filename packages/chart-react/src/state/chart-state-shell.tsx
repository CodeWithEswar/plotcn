import React, { forwardRef, type HTMLAttributes } from "react"

export interface ChartStateShellProps extends HTMLAttributes<HTMLDivElement> {
  minHeight?: number | string
}

/**
 * ChartStateShell
 * Preserves the exact visualization footprint and neutral surface without creating a heavy nested card.
 * Section 12.8, 12.87, 12.164.
 */
export const ChartStateShell = forwardRef<HTMLDivElement, ChartStateShellProps>(
  function ChartStateShell(
    { minHeight = 220, className = "", style, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`plotcn-chart-state-shell flex h-full w-full flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-6 text-center ${className}`}
        style={{
          minHeight,
          ...style,
        }}
        {...props}
      >
        <div className="flex max-w-[320px] flex-col items-center justify-center gap-2">
          {children}
        </div>
      </div>
    )
  }
)
