import React, { forwardRef, type SVGProps } from "react"

export interface ReferencePointProps extends SVGProps<SVGGElement> {
  /** X coordinate in pixels */
  x: number
  /** Y coordinate in pixels */
  y: number
  /** Marker circle radius */
  radius?: number
  /** Optional annotation label */
  label?: string
  /** Text placement relative to point */
  labelPosition?: "top" | "bottom" | "left" | "right"
}

/**
 * ReferencePoint renders an individual milestone or target marker at specified coordinates.
 */
export const ReferencePoint = forwardRef<SVGGElement, ReferencePointProps>(
  function ReferencePoint(
    {
      x,
      y,
      radius = 4,
      label,
      labelPosition = "top",
      fill = "currentColor",
      stroke = "var(--background, #fff)",
      strokeWidth = 2,
      className,
      ...props
    },
    ref
  ) {
    let textX = x
    let textY = y - radius - 4
    let textAnchor: "start" | "middle" | "end" = "middle"
    let dominantBaseline: "auto" | "middle" | "hanging" = "auto"

    if (labelPosition === "bottom") {
      textY = y + radius + 10
      dominantBaseline = "hanging"
    } else if (labelPosition === "left") {
      textX = x - radius - 6
      textY = y
      textAnchor = "end"
      dominantBaseline = "middle"
    } else if (labelPosition === "right") {
      textX = x + radius + 6
      textY = y
      textAnchor = "start"
      dominantBaseline = "middle"
    }

    return (
      <g
        ref={ref}
        className={className ? `plotcn-reference-point ${className}` : "plotcn-reference-point"}
        role="presentation"
        {...props}
      >
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {label && (
          <text
            x={textX}
            y={textY}
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
            fontSize={11}
            fontWeight={500}
            fill="currentColor"
            fillOpacity={0.8}
          >
            {label}
          </text>
        )}
      </g>
    )
  }
)
