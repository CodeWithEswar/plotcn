import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"
import type { AxisTick } from "./x-axis"

export interface YAxisProps extends SVGProps<SVGGElement> {
  /** Array of pre-computed tick values and pixel positions */
  ticks?: readonly AxisTick[]
  /** Axis orientation relative to plot area. Defaults to "left". */
  orientation?: "left" | "right"
  /** Optional axis title label */
  label?: string
  /** Length of tick marks in pixels. Defaults to 4. */
  tickLength?: number
  /** Hide the continuous baseline */
  hideLine?: boolean
  /** Hide tick marks */
  hideTicks?: boolean
}

/**
 * YAxis renders a vertical axis with render-ready tick representations.
 */
export const YAxis = forwardRef<SVGGElement, YAxisProps>(function YAxis(
  {
    ticks = [],
    orientation = "left",
    label,
    tickLength = 4,
    hideLine = false,
    hideTicks = false,
    className,
    ...props
  },
  ref
) {
  const { innerWidth, innerHeight } = useChart()
  const xPosition = orientation === "left" ? 0 : innerWidth
  const tickSign = orientation === "left" ? -1 : 1

  return (
    <g
      ref={ref}
      className={className ? `plotcn-y-axis ${className}` : "plotcn-y-axis"}
      transform={`translate(${xPosition}, 0)`}
      role="region"
      aria-label={label || "Y Axis"}
      {...props}
    >
      {/* Baseline */}
      {!hideLine && (
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={innerHeight}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={1}
        />
      )}

      {/* Ticks and labels */}
      {ticks.map((tick, idx) => (
        <g
          key={`${tick.value}-${idx}`}
          transform={`translate(0, ${tick.position})`}
          className="plotcn-axis-tick"
        >
          {!hideTicks && (
            <line
              x1={0}
              x2={tickLength * tickSign}
              y1={0}
              y2={0}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          )}
          <text
            x={(tickLength + 6) * tickSign}
            textAnchor={orientation === "left" ? "end" : "start"}
            dominantBaseline="middle"
            fontSize={11}
            fill="currentColor"
            fillOpacity={0.65}
          >
            {tick.label}
          </text>
        </g>
      ))}

      {/* Optional axis title */}
      {label && (
        <text
          transform={`rotate(-90) translate(${-innerHeight / 2}, ${(tickLength + 28) * tickSign})`}
          textAnchor="middle"
          fontSize={12}
          fontWeight={500}
          fill="currentColor"
          fillOpacity={0.8}
        >
          {label}
        </text>
      )}
    </g>
  )
})
