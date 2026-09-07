import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"

export interface CrosshairProps extends SVGProps<SVGGElement> {
  /** Active X coordinate in plot area */
  x?: number
  /** Active Y coordinate in plot area */
  y?: number
  /** Line style type. Defaults to "both" if both x and y are passed, otherwise derives. */
  mode?: "vertical" | "horizontal" | "both"
  /** Dash pattern */
  strokeDasharray?: string
}

/**
 * Crosshair is a presentational SVG guide indicating active pointer/datum position.
 */
export const Crosshair = forwardRef<SVGGElement, CrosshairProps>(function Crosshair(
  {
    x,
    y,
    mode,
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

  const showVertical = (mode === "vertical" || mode === "both" || (mode === undefined && x !== undefined)) && x !== undefined
  const showHorizontal = (mode === "horizontal" || mode === "both" || (mode === undefined && y !== undefined)) && y !== undefined

  if (!showVertical && !showHorizontal) {
    return null
  }

  return (
    <g
      ref={ref}
      className={className ? `plotcn-crosshair pointer-events-none ${className}` : "plotcn-crosshair pointer-events-none"}
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
    </g>
  )
})
