"use client"

import * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartContainer } from "../shared/chart-container"
import { ChartTooltip } from "../shared/chart-tooltip"
import {
  ChartLoadingState,
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "../shared/chart-state"

export interface LineBasicDatum {
  label: string
  value: number
  [key: string]: unknown
}

export interface LineBasicProps {
  data: LineBasicDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  showXAxis?: boolean
  showYAxis?: boolean
  grid?: "off" | "horizontal" | "both"
  tooltip?: boolean
  legend?: boolean
  curve?: "linear" | "monotone" | "step"
  className?: string
  /**
   * Optional motion configuration or toggle.
   * Section 10.46, 10.47, 10.60.
   */
  motion?: boolean | { duration?: number }
  /**
   * State and data safety props.
   * Section 12.5, 12.6, 12.146, 12.147.
   */
  loading?: boolean
  error?: Error | string | null
  unavailable?: boolean | string | null
  emptyContent?: React.ReactNode
  errorContent?: React.ReactNode
  loadingContent?: React.ReactNode
  onRetry?: () => void
}

/**
 * Recharts LineBasic
 * Fast, approachable Cartesian line chart with dark glassmorphic tooltip, normalized animation, and data safety.
 * Section 10.46, 10.47, 12.188.
 */
export function LineBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "var(--chart-1, #10b981)",
  height = 280,
  className,
  showXAxis = true,
  showYAxis = true,
  grid = "horizontal",
  tooltip = true,
  legend = false,
  curve = "monotone",

  motion = true,
  loading = false,
  error = null,
  unavailable = false,
  emptyContent,
  errorContent,
  loadingContent,
  onRetry,
}: LineBasicProps) {
  const reducedMotion = useChartReducedMotion()

  // Section 12.6: Deterministic state precedence
  // 1. Explicit error
  if (error) {
    if (errorContent) return <div className={className} style={{ width: "100%", height }}>{errorContent}</div>
    return (
      <div className={className} style={{ width: "100%", height }}>
        <ChartErrorState
          title="Unable to load chart"
          description={typeof error === "string" ? error : error.message}
          onRetry={onRetry}
        />
      </div>
    )
  }

  // 2. Explicit unavailable
  if (unavailable) {
    return (
      <div className={className} style={{ width: "100%", height }}>
        <ChartUnavailableState
          title="Metric unavailable"
          description={typeof unavailable === "string" ? unavailable : undefined}
        />
      </div>
    )
  }

  // 3. Loading state
  if (loading) {
    if (loadingContent) return <div className={className} style={{ width: "100%", height }}>{loadingContent}</div>
    return (
      <div className={className} style={{ width: "100%", height }}>
        <ChartLoadingState />
      </div>
    )
  }

  // 4. Empty data state
  if (!data || data.length === 0) {
    if (emptyContent) return <div className={className} style={{ width: "100%", height }}>{emptyContent}</div>
    return (
      <div className={className} style={{ width: "100%", height }}>
        <ChartEmptyState />
      </div>
    )
  }

  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 300

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 320, height: typeof height === "number" ? height : 280 }}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            {grid !== "off" && <CartesianGrid strokeDasharray="3 3" vertical={grid === "both"} stroke="var(--chart-grid, rgba(255,255,255,0.1))" />}
            <XAxis hide={!showXAxis}
              dataKey={labelKey}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
            />
            <YAxis hide={!showYAxis}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
            />
            {tooltip && (
              <Tooltip
                content={<ChartTooltip indicator="line" />}
                cursor={{ stroke: "var(--chart-crosshair, rgba(255,255,255,0.2))", strokeDasharray: "3 3" }}
              />
            )}
            {legend && <Legend />}
            <Line
              type={curve}
              dataKey={valueKey}
              stroke={color}
              strokeWidth={2}
              dot={
                data.length === 1
                  ? { r: 5, fill: color, stroke: "var(--background, #09090b)", strokeWidth: 2 }
                  : false
              }
              activeDot={{ r: 4, fill: color, stroke: "var(--background, #09090b)", strokeWidth: 2 }}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
