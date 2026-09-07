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
  /**
   * Optional motion configuration or toggle.
   * Section 10.46, 10.47, 10.60.
   */
  motion?: boolean | { duration?: number }
}

/**
 * Recharts LineBasic
 * Fast, approachable Cartesian line chart with dark glassmorphic tooltip and normalized animation.
 * Section 10.46, 10.47.
 */
export function LineBasic({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "var(--chart-1, #10b981)",
  height = 280,
  className,
  motion = true,
}: LineBasicProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
  }, [])

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
