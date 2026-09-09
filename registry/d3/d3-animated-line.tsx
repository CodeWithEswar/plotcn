"use client"

import * as React from "react"
import { scaleLinear } from "d3-scale"
import { line, curveMonotoneX, curveLinear, curveStep } from "d3-shape"
import { max, min } from "d3-array"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartEmptyState, ChartErrorState } from "../shared/chart-state"
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
  curve?: "linear" | "monotone" | "step"
  grid?: "off" | "horizontal"
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
  color = "var(--chart-1)",
  className,
  curve = "monotone",
  grid = "horizontal",
  motion = true,
}: D3AnimatedLineProps) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const pathRef = React.useRef<SVGPathElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const [pathLength, setPathLength] = React.useState(0)
  const reducedMotion = useChartReducedMotion()

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
    // Defer mount trigger to next frame for transition to run
    const timer = setTimeout(() => setMounted(true), 16)
    return () => clearTimeout(timer)
  }, [data, width, height, curve])

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
      .curve({linear:curveLinear,monotone:curveMonotoneX,step:curveStep}[curve])

    return generator(data) || ""
  }, [data, xScale, yScale, curve])

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)

  if (!data.length) return <ChartEmptyState />
  if (data.some((datum) => !Number.isFinite(datum.y))) {
    return <ChartErrorState description="Values must be finite numbers. Missing values are not replaced with zero." />
  }

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
    <div className={cn("plotcn-chart relative w-full overflow-hidden rounded-xl border border-[var(--chart-border)] bg-[var(--chart-background)] p-4", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        aria-label="D3 Animated Line Chart"
        role="img"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid lines (decorative - Section 11.41) */}
          <g aria-hidden="true">
            {grid !== "off" && yScale.ticks(5).map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={innerWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="var(--chart-grid)"
                strokeDasharray="3 3"
              />
            ))}
          </g>

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

          {/* Interactive Crosshair & Highlighted Point */}
          {hoveredIndex !== null && data[hoveredIndex] && (
            <g pointerEvents="none">
              <line
                x1={xScale(hoveredIndex)}
                x2={xScale(hoveredIndex)}
                y1={0}
                y2={innerHeight}
                stroke="var(--chart-crosshair)"
                strokeDasharray="3 3"
              />
              <circle
                cx={xScale(hoveredIndex)}
                cy={yScale(data[hoveredIndex].y)}
                r={6}
                fill="var(--chart-background)"
                stroke={color}
                strokeWidth={2.5}
              />
            </g>
          )}

          {/* Coordinate points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.y)}
              r={hoveredIndex === i ? 5.5 : 3.5}
              fill="var(--chart-background)"
              stroke={color}
              strokeWidth={2}
              className="transition-all duration-150"
            />
          ))}

          {/* Transparent Overlay for Smooth Crosshair Hover Tracking */}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            className="cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
              const idx = Math.round((relX / rect.width) * (data.length - 1))
              const clamped = Math.max(0, Math.min(data.length - 1, idx))
              setHoveredIndex(clamped)
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </g>
      </svg>

      {/* Floating Theme Tooltip */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-full transition-all duration-75"
          style={{
            left: `${((margin.left + xScale(hoveredIndex)) / width) * 100}%`,
            top: `${((margin.top + yScale(data[hoveredIndex].y)) / height) * 100}%`,
            marginTop: "-12px",
          }}
        >
          <div className="plotcn-chart-tooltip">
            <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-[var(--chart-tooltip-border)] pb-1 font-mono text-[11px] text-[var(--chart-tooltip-muted)]">
              <span>{String(data[hoveredIndex].x)}</span>
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 font-mono">
              <span className="text-[11px] text-[var(--chart-tooltip-muted)]">Value</span>
              <span className="text-xs font-semibold tabular-nums text-[var(--chart-tooltip-foreground)]">
                {data[hoveredIndex].y.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
