"use client"

import * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer } from "@/components/charts/chart-container"

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
}

/**
 * Recharts LineBasic
 * Fast, approachable Cartesian line chart with dark glassmorphic tooltip.
 */
export function LineBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "hsl(var(--chart-1, 142 71% 45%))",
  height = 280,
  className,
}: LineBasicProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
            <XAxis
              dataKey={labelKey}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border border-white/[0.08] bg-zinc-950/90 p-2.5 shadow-xl backdrop-blur-md">
                    <div className="text-[11px] font-mono text-zinc-400 mb-1">{label}</div>
                    <div className="text-xs font-semibold text-white">
                      {payload[0].value?.toLocaleString()}
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
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#000", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
