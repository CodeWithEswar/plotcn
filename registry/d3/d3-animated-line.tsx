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
  /**
   * Optional motion configuration or toggle.
   * Section 10.5, 10.6.
   */
  motion?: boolean | { duration?: number }
}

/**
 * D3 Animated Line Chart
 * D3 computes continuous scale projections and monotone curves; React renders the SVG elements.
 * Features semantic initial draw animation and honors reduced-motion preferences.
 * Section 10.19, 10.20, 10.58.
 */
export function D3AnimatedLine({
  data,
  width = 600,
  height = 300,
  color = "var(--chart-1, #10b981)",
  className,
  motion = true,
}: D3AnimatedLineProps) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const pathRef = React.useRef<SVGPathElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const [pathLength, setPathLength] = React.useState(0)
  const [reducedMotion, setReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
    // Defer mount trigger to next frame for transition to run
    const timer = setTimeout(() => setMounted(true), 16)
    return () => clearTimeout(timer)
  }, [])

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

  const isAnimated = motion !== false && !reducedMotion
  const duration = typeof motion === "object" && motion?.duration !== undefined ? motion.duration : 0.35

  const pathStyle: React.CSSProperties =
    isAnimated && pathLength > 0
      ? {
          strokeDasharray: pathLength,
          strokeDashoffset: mounted ? 0 : pathLength,
          transition: `stroke-dashoffset ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        }
      : {}

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
              stroke="var(--chart-grid, rgba(255,255,255,0.1))"
              strokeDasharray="3 3"
            />
          ))}

          {/* Curve */}
          <path
            ref={pathRef}
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={pathStyle}
          />

          {/* Coordinate points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.y)}
              r={3.5}
              fill="var(--background, #09090b)"
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
