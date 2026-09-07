"use client"

import * as React from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer } from "@/components/charts/chart-container"

export interface AreaBasicDatum {
  label: string
  value: number
  [key: string]: any
}

export interface AreaBasicProps {
  data: AreaBasicDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  className?: string
}

export function AreaBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "var(--chart-1, #10b981)",
  height = 280,
  className,
}: AreaBasicProps) {
  const gradientId = React.useId().replace(/:/g, "")

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
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
            <Area type="monotone" dataKey={valueKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
