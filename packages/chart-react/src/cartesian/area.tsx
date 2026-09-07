import React, { forwardRef, type SVGProps } from "react"

export interface AreaProps extends SVGProps<SVGPathElement> {
  /** Precomputed closed SVG path string for filled area */
  path: string
}

/**
 * Area renders an already-computed filled area path.
 */
export const Area = forwardRef<SVGPathElement, AreaProps>(function Area(
  {
    path,
    fill = "currentColor",
    fillOpacity = 0.15,
    stroke = "none",
    className,
    ...props
  },
  ref
) {
  return (
    <path
      ref={ref}
      d={path}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      className={className ? `plotcn-area ${className}` : "plotcn-area"}
      {...props}
    />
  )
})
