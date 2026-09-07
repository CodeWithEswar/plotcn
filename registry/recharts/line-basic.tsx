"use client"

import * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer } from "@/components/charts/chart-container"
import {
  ChartLoadingState,
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "@/components/charts/chart-state"

export interface LineBasicDatum {
  label: string
  value: number
  [key: string]: any
}

export interface LineBasicProps {
  data: LineBasicDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
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
  motion = true,
  loading = false,
  error = null,
  unavailable = false,
  emptyContent,
  errorContent,
  loadingContent,
  onRetry,
}: LineBasicProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
  }, [])

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
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, rgba(255,255,255,0.1))" />
            <XAxis
              dataKey={labelKey}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border border-white/[0.08] bg-zinc-950/90 p-2.5 shadow-xl backdrop-blur-md">
                    <div className="text-[11px] font-mono text-zinc-400 mb-1">{label}</div>
                    <div className="text-xs font-semibold text-white">
                      {typeof payload[0]?.value === "number" && Number.isFinite(payload[0].value)
                        ? payload[0].value.toLocaleString()
                        : "—"}
                    </div>
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
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
