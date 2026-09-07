"use client"

import * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
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
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 320, height: typeof height === "number" ? height : 280 }}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, rgba(255,255,255,0.1))" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }} />
            <Tooltip
              content={<ChartTooltip indicator="line" />}
              cursor={{ stroke: "var(--chart-crosshair, rgba(255,255,255,0.2))", strokeDasharray: "3 3" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px", color: "var(--chart-foreground, #fafafa)" }} />
            <Line isAnimationActive={motion} type="monotone" name="Current Period" dataKey="current" stroke="var(--chart-1, #10b981)" strokeWidth={2} dot={false} />
            <Line isAnimationActive={motion} type="monotone" name="Previous Period" dataKey="previous" stroke="var(--chart-2, #0ea5e9)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
