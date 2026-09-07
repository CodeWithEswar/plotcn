import React, { forwardRef, type SVGProps } from "react"

export interface LineProps extends SVGProps<SVGPathElement> {
  /** Precomputed SVG path string (e.g. from d3-shape or custom path generator) */
  path: string
}

/**
 * Line renders an already-computed continuous path.
 * Calculation belongs in chart-core/D3; Line only handles SVG rendering.
 */
export const Line = forwardRef<SVGPathElement, LineProps>(function Line(
  {
    path,
    fill = "none",
    stroke = "currentColor",
    strokeWidth = 2,
    strokeLinecap = "round",
    strokeLinejoin = "round",
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
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      className={className ? `plotcn-line ${className}` : "plotcn-line"}
      {...props}
    />
  )
})
