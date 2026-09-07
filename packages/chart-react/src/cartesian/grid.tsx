import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"
import type { AxisTick } from "./x-axis"

export interface GridProps extends SVGProps<SVGGElement> {
  /** X tick objects or pixel positions for vertical grid lines */
  xTicks?: readonly (AxisTick | number)[]
  /** Y tick objects or pixel positions for horizontal grid lines */
  yTicks?: readonly (AxisTick | number)[]
  /** Hide vertical grid lines */
  hideVertical?: boolean
  /** Hide horizontal grid lines */
  hideHorizontal?: boolean
  /** Grid line dash pattern */
  strokeDasharray?: string
}

/**
 * Grid renders horizontal and vertical Cartesian grid lines.
 * Uses semantic theme colors and keeps visual weight minimal.
 */
export const Grid = forwardRef<SVGGElement, GridProps>(function Grid(
  {
    xTicks = [],
    yTicks = [],
    hideVertical = false,
    hideHorizontal = false,
    stroke = "currentColor",
    strokeOpacity = 0.08,
    strokeDasharray = "3 3",
    strokeWidth = 1,
    className,
    ...props
  },
  ref
) {
  const { innerWidth, innerHeight } = useChart()

  return (
    <g
      ref={ref}
      className={className ? `plotcn-cartesian-grid ${className}` : "plotcn-cartesian-grid"}
      role="presentation"
      {...props}
    >
      {/* Horizontal grid lines */}
      {!hideHorizontal &&
        yTicks.map((tick, idx) => {
          const y = typeof tick === "number" ? tick : tick.position
          return (
            <line
              key={`h-${y}-${idx}`}
              x1={0}
              x2={innerWidth}
              y1={y}
              y2={y}
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeDasharray={strokeDasharray}
              strokeWidth={strokeWidth}
            />
          )
        })}

      {/* Vertical grid lines */}
      {!hideVertical &&
        xTicks.map((tick, idx) => {
          const x = typeof tick === "number" ? tick : tick.position
          return (
            <line
              key={`v-${x}-${idx}`}
              x1={x}
              x2={x}
              y1={0}
              y2={innerHeight}
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeDasharray={strokeDasharray}
              strokeWidth={strokeWidth}
            />
          )
        })}
    </g>
  )
})
