"use client"

import { ChartEmptyState, ChartErrorState } from "../shared/chart-state"
import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartLegend } from "../shared/chart-legend"
import { ChartContainer } from "../shared/chart-container"
import { ChartTooltip } from "../shared/chart-tooltip"

export interface BarBasicDatum {
  label: string
  value: number
  [key: string]: unknown
}

export interface BarBasicProps {
  data: BarBasicDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  showXAxis?: boolean
  showYAxis?: boolean
  grid?: "off" | "horizontal" | "both"
  tooltip?: boolean
  legend?: boolean
  className?: string
  /**
   * Optional motion configuration or toggle.
   * Section 10.26, 10.46, 10.60.
   */
  motion?: boolean | { duration?: number }
}

/**
 * Recharts BarBasic
 * Categorical vertical bar chart with rounded caps, baseline grow animation, and reduced-motion awareness.
 * Section 10.26, 10.46, 10.60.
 */
export function BarBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "var(--chart-1)",
  height = 280,
  className,
  showXAxis = true,
  showYAxis = true,
  grid = "horizontal",
  tooltip = true,
  legend = false,

  motion = true,
}: BarBasicProps) {
  const reducedMotion = useChartReducedMotion()

  if(!data.length) return <div style={{height}}><ChartEmptyState/></div>
  if(data.some(row=>typeof row[valueKey]!=="number" || !Number.isFinite(row[valueKey]))) return <div style={{height}}><ChartErrorState description="Values must be finite numbers. Missing values are not replaced with zero."/></div>
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 300

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 320, height: typeof height === "number" ? height : 280 }}>
          <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            {grid !== "off" && <CartesianGrid strokeDasharray="3 3" vertical={grid === "both"} stroke="var(--chart-grid)" />}
            <XAxis hide={!showXAxis} dataKey={labelKey} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
            <YAxis hide={!showYAxis} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
            {tooltip && (
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "var(--chart-grid)" }}
              />
            )}
            {legend && <Legend content={<ChartLegend kind="bar"/>} />}
            <Bar
              dataKey={valueKey}
              fill={color}
              radius={[4, 4, 0, 0]}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
