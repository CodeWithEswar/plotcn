import React, { forwardRef, type SVGProps } from "react"

export interface BarGeometry {
  x: number
  y: number
  width: number
  height: number
  rx?: number
  ry?: number
}

export interface BarProps extends SVGProps<SVGRectElement> {
  /** Precomputed bar geometric coordinates and dimensions */
  geometry: BarGeometry
}

/**
 * Bar renders a single bar element using precomputed geometry.
 */
export const Bar = forwardRef<SVGRectElement, BarProps>(function Bar(
  {
    geometry,
    fill = "currentColor",
    className,
    ...props
  },
  ref
) {
  return (
    <rect
      ref={ref}
      x={geometry.x}
      y={geometry.y}
      width={Math.max(0, geometry.width)}
      height={Math.max(0, geometry.height)}
      rx={geometry.rx}
      ry={geometry.ry || geometry.rx}
      fill={fill}
      className={className ? `plotcn-bar ${className}` : "plotcn-bar"}
      {...props}
    />
  )
})
