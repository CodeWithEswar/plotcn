import React, { forwardRef, type SVGProps } from "react"

export interface ScatterPointProps extends SVGProps<SVGCircleElement> {
  /** Center X coordinate in pixels */
  x: number
  /** Center Y coordinate in pixels */
  y: number
  /** Point circle radius in pixels. Defaults to 4. */
  radius?: number
}

/**
 * ScatterPoint renders an individual scatter point circle using precomputed coordinates.
 */
export const ScatterPoint = forwardRef<SVGCircleElement, ScatterPointProps>(
  function ScatterPoint(
    {
      x,
      y,
      radius = 4,
      fill = "currentColor",
      className,
      ...props
    },
    ref
  ) {
    return (
      <circle
        ref={ref}
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        className={className ? `plotcn-scatter-point ${className}` : "plotcn-scatter-point"}
        {...props}
      />
    )
  }
)
