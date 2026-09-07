"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartTooltipItem {
  name?: string
  value?: number | string | null
  color?: string
  dataKey?: string | number
  unit?: string
  [key: string]: unknown
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: ChartTooltipItem[]
  label?: React.ReactNode
  formatter?: (value: number | string, name?: string, item?: ChartTooltipItem) => React.ReactNode
  labelFormatter?: (label: React.ReactNode) => React.ReactNode
  className?: string
  indicator?: "dot" | "line" | "dashed"
  hideLabel?: boolean
}

/**
 * Standard Plotcn Tooltip
 * High-contrast, analytical developer styling with tabular numerals and semantic theme tokens.
 * Section 15, 16, 17, 12.31.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className,
  indicator = "dot",
  hideLabel = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--chart-tooltip-border,rgba(255,255,255,0.12))] bg-[var(--chart-tooltip-background,#09090b)]/95 p-2.5 text-[var(--chart-tooltip-foreground,#fafafa)] shadow-xl backdrop-blur-md text-xs min-w-[140px] pointer-events-none transition-all duration-75",
        className
      )}
      role="tooltip"
    >
      {!hideLabel && formattedLabel && (
        <div className="text-[11px] font-mono text-[var(--chart-tooltip-muted,#a1a1aa)] mb-1.5 pb-1 border-b border-[var(--chart-tooltip-border,rgba(255,255,255,0.08))]">
          {formattedLabel}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, index) => {
          const itemColor = item.color || "var(--chart-1, #10b981)"
          const rawVal = item.value
          let displayVal: React.ReactNode = "—"

          if (typeof rawVal === "number" && Number.isFinite(rawVal)) {
            displayVal = formatter
              ? formatter(rawVal, item.name, item)
              : rawVal.toLocaleString()
          } else if (typeof rawVal === "string" && rawVal.trim() !== "") {
            displayVal = formatter ? formatter(rawVal, item.name, item) : rawVal
          }

          return (
            <div
              key={`${item.dataKey || item.name || index}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {indicator === "dot" && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: itemColor }}
                    aria-hidden="true"
                  />
                )}
                {indicator === "line" && (
                  <span
                    className="h-0.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: itemColor }}
                    aria-hidden="true"
                  />
                )}
                {indicator === "dashed" && (
                  <span
                    className="h-0.5 w-3 shrink-0 border-t-2 border-dashed"
                    style={{ borderColor: itemColor }}
                    aria-hidden="true"
                  />
                )}
                <span className="text-[11px] text-[var(--chart-tooltip-muted,#a1a1aa)] truncate">
                  {item.name || "Value"}
                </span>
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums text-[var(--chart-tooltip-foreground,#fafafa)] shrink-0">
                {displayVal}
                {item.unit ? ` ${item.unit}` : ""}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
