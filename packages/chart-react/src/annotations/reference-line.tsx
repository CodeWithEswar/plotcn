import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"

export interface ReferenceLineProps extends SVGProps<SVGGElement> {
  /** Precomputed horizontal Y coordinate in pixels relative to plot */
  y?: number
  /** Precomputed vertical X coordinate in pixels relative to plot */
  x?: number
  /** Optional annotation label */
  label?: string
  /** Text label position along the line */
  labelPosition?: "start" | "middle" | "end"
  /** Stroke dash array */
  strokeDasharray?: string
}

/**
 * ReferenceLine renders a pre-computed horizontal or vertical benchmark threshold line.
 * Calculation belongs in data/scales layer; ReferenceLine only renders the SVG geometry.
 */
export const ReferenceLine = forwardRef<SVGGElement, ReferenceLineProps>(
  function ReferenceLine(
    {
      x,
      y,
      label,
      labelPosition = "end",
      stroke = "currentColor",
      strokeOpacity = 0.5,
      strokeWidth = 1.5,
      strokeDasharray = "4 4",
      className,
      ...props
    },
    ref
  ) {
    const { innerWidth, innerHeight } = useChart()

    const isHorizontal = y !== undefined
    const isVertical = x !== undefined && !isHorizontal

    if (!isHorizontal && !isVertical) {
      return null
    }

    const x1 = isHorizontal ? 0 : (x as number)
    const x2 = isHorizontal ? innerWidth : (x as number)
    const y1 = isHorizontal ? (y as number) : 0
    const y2 = isHorizontal ? (y as number) : innerHeight

    let labelX = x2
    let labelY = y1 - 4
    let textAnchor: "start" | "middle" | "end" = "end"

    if (isHorizontal) {
      if (labelPosition === "start") {
        labelX = 4
        textAnchor = "start"
      } else if (labelPosition === "middle") {
        labelX = innerWidth / 2
        textAnchor = "middle"
      } else {
        labelX = innerWidth - 4
        textAnchor = "end"
      }
    } else {
      labelX = (x as number) + 4
      textAnchor = "start"
      if (labelPosition === "start") {
        labelY = innerHeight - 4
      } else if (labelPosition === "middle") {
        labelY = innerHeight / 2
      } else {
        labelY = 12
      }
    }

    return (
      <g
        ref={ref}
        className={className ? `plotcn-reference-line ${className}` : "plotcn-reference-line"}
        role="presentation"
        {...props}
      >
        <line
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
        {label && (
          <text
            x={labelX}
            y={labelY}
            textAnchor={textAnchor}
            fontSize={11}
            fontWeight={500}
            fill="currentColor"
            fillOpacity={0.75}
          >
            {label}
          </text>
        )}
      </g>
    )
  }
)
