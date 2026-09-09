"use client"

import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartEmptyState, ChartErrorState } from "../shared/chart-state"
import * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { ChartLegend } from "../shared/chart-legend"
import { ChartContainer } from "../shared/chart-container"
import { ChartTooltip } from "../shared/chart-tooltip"

export interface MultiSeriesDatum {
  label: string
  current: number
  previous: number
  [key: string]: unknown
}

export interface LineMultipleProps {
  data: MultiSeriesDatum[]
  height?: number | string
  motion?: boolean
  className?: string
}

export function LineMultiple({
  data,
  height = 280,
  className,
  motion = false,
}: LineMultipleProps) {
  const reduced = useChartReducedMotion()
  if(!data.length) return <div style={{height}}><ChartEmptyState/></div>
  if(data.some(row=>!Number.isFinite(row.current)||!Number.isFinite(row.previous))) return <div style={{height}}><ChartErrorState description="Both series require finite values."/></div>
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 320, height: typeof height === "number" ? height : 280 }}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} />
            <Tooltip
              content={<ChartTooltip indicator="line" />}
              cursor={{ stroke: "var(--chart-crosshair)", strokeDasharray: "3 3" }}
            />
            <Legend content={<ChartLegend/>} />
            <Line isAnimationActive={motion && !reduced} animationDuration={300} animationEasing="ease-out" type="monotone" name="Current Period" dataKey="current" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            <Line isAnimationActive={motion && !reduced} animationDuration={300} animationEasing="ease-out" type="monotone" name="Previous Period" dataKey="previous" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
