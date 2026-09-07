import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"

export interface AxisTick {
  value: string | number | Date
  position: number
  label: string
}

export interface XAxisProps extends SVGProps<SVGGElement> {
  /** Array of pre-computed tick values and pixel positions */
  ticks?: readonly AxisTick[]
  /** Axis orientation relative to plot area. Defaults to "bottom". */
  orientation?: "bottom" | "top"
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
 * XAxis renders a horizontal axis with render-ready tick representations.
 */
export const XAxis = forwardRef<SVGGElement, XAxisProps>(function XAxis(
  {
    ticks = [],
    orientation = "bottom",
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
  const yPosition = orientation === "bottom" ? innerHeight : 0
  const tickSign = orientation === "bottom" ? 1 : -1

  return (
    <g
      ref={ref}
      className={className ? `plotcn-x-axis ${className}` : "plotcn-x-axis"}
      transform={`translate(0, ${yPosition})`}
      role="region"
      aria-label={label || "X Axis"}
      {...props}
    >
      {/* Baseline */}
      {!hideLine && (
        <line
          x1={0}
          x2={innerWidth}
          y1={0}
          y2={0}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={1}
        />
      )}

      {/* Ticks and labels */}
      {ticks.map((tick, idx) => (
        <g
          key={`${tick.value}-${idx}`}
          transform={`translate(${tick.position}, 0)`}
          className="plotcn-axis-tick"
        >
          {!hideTicks && (
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={tickLength * tickSign}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          )}
          <text
            y={(tickLength + 6) * tickSign}
            textAnchor="middle"
            dominantBaseline={orientation === "bottom" ? "hanging" : "auto"}
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
          x={innerWidth / 2}
          y={(tickLength + 22) * tickSign}
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
