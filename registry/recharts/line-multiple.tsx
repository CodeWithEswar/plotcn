"use client"

import * as React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { ChartContainer } from "@/components/charts/chart-container"

export interface MultiSeriesDatum {
  label: string
  current: number
  previous: number
  [key: string]: any
}

export interface LineMultipleProps {
  data: MultiSeriesDatum[]
  height?: number | string
  className?: string
}

export function LineMultiple({
  data,
  height = 280,
  className,
}: LineMultipleProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, rgba(255,255,255,0.1))" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border border-white/[0.08] bg-zinc-950/90 p-2.5 shadow-xl backdrop-blur-md">
                    <div className="text-[11px] font-mono text-zinc-400 mb-1">{label}</div>
                    {payload.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
                        <span className="text-zinc-400">{entry.name}:</span>
                        <span className="font-semibold text-white">{entry.value?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px", color: "var(--chart-foreground, #fafafa)" }} />
            <Line type="monotone" name="Current Period" dataKey="current" stroke="var(--chart-1, #10b981)" strokeWidth={2} dot={false} />
            <Line type="monotone" name="Previous Period" dataKey="previous" stroke="var(--chart-2, #0ea5e9)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
