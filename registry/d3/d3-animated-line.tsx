"use client"

import * as React from "react"
import { scaleLinear } from "d3-scale"
import { line, curveMonotoneX } from "d3-shape"
import { max, min } from "d3-array"
import { cn } from "@/lib/utils"

export interface D3LineDatum {
  x: number | string
  y: number
}

export interface D3AnimatedLineProps {
  data: D3LineDatum[]
  width?: number
  height?: number
  color?: string
  className?: string
}

/**
 * D3 Animated Line Chart
 * D3 computes continuous scale projections and monotone curves; React renders the SVG elements.
 */
export function D3AnimatedLine({
  data,
  width = 600,
  height = 300,
  color = "hsl(var(--chart-1, 142 71% 45%))",
  className,
}: D3AnimatedLineProps) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const yValues = data.map((d) => d.y)
  const minY = min(yValues) ?? 0
  const maxY = max(yValues) ?? 100

  const xScale = React.useMemo(() => {
    return scaleLinear()
      .domain([0, Math.max(data.length - 1, 1)])
      .range([0, innerWidth])
  }, [data.length, innerWidth])

  const yScale = React.useMemo(() => {
    return scaleLinear()
      .domain([Math.min(0, minY), maxY * 1.1])
      .range([innerHeight, 0])
  }, [minY, maxY, innerHeight])

  const linePath = React.useMemo(() => {
    const generator = line<D3LineDatum>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.y))
      .curve(curveMonotoneX)

    return generator(data) || ""
  }, [data, xScale, yScale])

  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        aria-label="D3 Animated Line Chart"
        role="img"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid lines */}
          {yScale.ticks(5).map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="hsl(var(--border) / 0.3)"
              strokeDasharray="3 3"
            />
          ))}

          {/* Curve */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />

          {/* Coordinate points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.y)}
              r={3.5}
              fill="hsl(var(--background, 240 10% 3.9%))"
              stroke={color}
              strokeWidth={2}
              className="hover:r-5 transition-all"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
