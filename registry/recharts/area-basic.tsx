"use client"

import * as React from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer } from "../shared/chart-container"
import { ChartTooltip } from "../shared/chart-tooltip"

export interface AreaBasicDatum {
  label: string
  value: number
  [key: string]: unknown
}

export interface AreaBasicProps {
  data: AreaBasicDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  motion?: boolean
  className?: string
}

export function AreaBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "var(--chart-1, #10b981)",
  height = 280,
  className,
  motion = false,
}: AreaBasicProps) {
  const gradientId = React.useId().replace(/:/g, "")

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 320, height: typeof height === "number" ? height : 280 }}>
          <AreaChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, rgba(255,255,255,0.1))" />
            <XAxis dataKey={labelKey} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }} />
            <Tooltip
              content={<ChartTooltip indicator="line" />}
              cursor={{ stroke: "var(--chart-crosshair, rgba(255,255,255,0.2))", strokeDasharray: "3 3" }}
            />
            <Area isAnimationActive={motion} type="monotone" dataKey={valueKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
