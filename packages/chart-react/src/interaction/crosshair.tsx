import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"
import type { CrosshairMode } from "../types/interaction"

export interface CrosshairProps extends SVGProps<SVGGElement> {
  /** Active X coordinate in plot area */
  x?: number
  /** Active Y coordinate in plot area */
  y?: number
  /** Crosshair line mode. Section 8.27 - 8.31. */
  mode?: CrosshairMode | "vertical" | "horizontal"
  /** Radius for point crosshair mode */
  pointRadius?: number
  /** Radius for point halo ring */
  haloRadius?: number
  /** Dash pattern */
  strokeDasharray?: string
}

/**
 * Crosshair is a presentational SVG guide indicating active pointer/datum coordinate.
 * Supports x (vertical), y (horizontal), both, and point-halo modes.
 * Section 8.27 - 8.33.
 */
export const Crosshair = forwardRef<SVGGElement, CrosshairProps>(function Crosshair(
  {
    x,
    y,
    mode,
    pointRadius = 4,
    haloRadius = 8,
    stroke = "currentColor",
    strokeOpacity = 0.35,
    strokeWidth = 1,
    strokeDasharray = "4 4",
    className,
    ...props
  },
  ref
) {
  const { innerWidth, innerHeight } = useChart()

  const resolvedMode = mode ?? (x !== undefined && y !== undefined ? "both" : x !== undefined ? "x" : "y")
  const isVertical = resolvedMode === "x" || resolvedMode === "vertical" || resolvedMode === "both"
  const isHorizontal = resolvedMode === "y" || resolvedMode === "horizontal" || resolvedMode === "both"
  const isPoint = resolvedMode === "point"

  const showVertical = isVertical && x !== undefined
  const showHorizontal = isHorizontal && y !== undefined
  const showPoint = isPoint && x !== undefined && y !== undefined


  if (!showVertical && !showHorizontal && !showPoint) {
    return null
  }

  return (
    <g
      ref={ref}
      className={
        className
          ? `plotcn-crosshair pointer-events-none ${className}`
          : "plotcn-crosshair pointer-events-none"
      }
      role="presentation"
      {...props}
    >
      {showVertical && (
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      )}
      {showHorizontal && (
        <line
          x1={0}
          x2={innerWidth}
          y1={y}
          y2={y}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      )}
      {showPoint && (
        <g>
          {/* Subtle outer halo */}
          <circle
            cx={x}
            cy={y}
            r={haloRadius}
            fill={stroke}
            fillOpacity={0.15}
          />
          {/* Active target mark */}
          <circle
            cx={x}
            cy={y}
            r={pointRadius}
            fill={stroke}
            stroke="var(--background, #09090b)"
            strokeWidth={1.5}
          />
        </g>
      )}
    </g>
  )
})
