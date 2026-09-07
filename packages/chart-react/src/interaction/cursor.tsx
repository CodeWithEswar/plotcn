import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"
import type { ChartCursor } from "../types/interaction"

export interface CursorProps extends SVGProps<SVGGElement> {
  /** Active X coordinate in plot area */
  x?: number
  /** Active Y coordinate in plot area */
  y?: number
  /** Cursor visual style. Section 8.34 & 8.35. */
  styleType?: ChartCursor
  /** Band width for categorical band cursor */
  bandWidth?: number
  /** Width alias */
  width?: number
}

/**
 * Cursor provides category context highlighting (line, band, crosshair, point).
 * Section 8.34 & 8.35.
 */
export const Cursor = forwardRef<SVGGElement, CursorProps>(function Cursor(
  {
    x,
    y,
    styleType,
    bandWidth,
    width,
    fill = "currentColor",
    fillOpacity = 0.08,
    stroke = "currentColor",
    strokeOpacity = 0.3,
    strokeWidth = 1,
    className,
    ...props
  },
  ref
) {
  const { innerHeight } = useChart()

  if (x === undefined || styleType === "none") {
    return null
  }

  const effectiveWidth = width ?? bandWidth ?? 24
  const isLine = styleType === "line"
  const isCrosshair = styleType === "crosshair"
  const isPoint = styleType === "point" && y !== undefined

  return (
    <g
      ref={ref}
      className={
        className
          ? `plotcn-cursor pointer-events-none ${className}`
          : "plotcn-cursor pointer-events-none"
      }
      role="presentation"
      {...props}
    >
      {isLine ? (
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
        />
      ) : isCrosshair ? (
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          strokeDasharray="3 3"
        />
      ) : isPoint ? (
        <circle
          cx={x}
          cy={y}
          r={6}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : (
        <rect
          x={x - effectiveWidth / 2}
          y={0}
          width={effectiveWidth}
          height={innerHeight}
          fill={fill}
          fillOpacity={fillOpacity}
          rx={3}
        />
      )}
    </g>
  )
})

