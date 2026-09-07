import React, { forwardRef, type SVGProps, type ReactNode } from "react"
import { useChart } from "../root/chart-context"

export interface PolarPlotProps extends SVGProps<SVGGElement> {
  children?: ReactNode
  /** Custom center X coordinate. Defaults to innerWidth / 2 */
  cx?: number
  /** Custom center Y coordinate. Defaults to innerHeight / 2 */
  cy?: number
}

/**
 * PolarPlot translates drawing coordinates to a polar origin (default center of plot area).
 */
export const PolarPlot = forwardRef<SVGGElement, PolarPlotProps>(
  function PolarPlot({ children, cx, cy, className, transform, ...props }, ref) {
    const { margins, innerWidth, innerHeight } = useChart()
    const centerX = margins.left + (cx !== undefined ? cx : innerWidth / 2)
    const centerY = margins.top + (cy !== undefined ? cy : innerHeight / 2)

    return (
      <g
        ref={ref}
        className={className ? `plotcn-polar-plot ${className}` : "plotcn-polar-plot"}
        transform={transform || `translate(${centerX}, ${centerY})`}
        {...props}
      >
        {children}
      </g>
    )
  }
)
