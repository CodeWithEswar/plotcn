"use client"

import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer } from "@/components/charts/chart-container"

export interface BarBasicDatum {
  label: string
  value: number
  [key: string]: any
}

export interface BarBasicProps {
  data: BarBasicDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  className?: string
}

export function BarBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "hsl(var(--chart-1, 142 71% 45%))",
  height = 280,
  className,
}: BarBasicProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
            <XAxis dataKey={labelKey} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
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
            <Bar dataKey={valueKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
