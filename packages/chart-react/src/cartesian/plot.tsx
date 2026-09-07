import React, { forwardRef, type SVGProps, type ReactNode } from "react"
import { useChart } from "../root/chart-context"

export interface PlotProps extends Omit<SVGProps<SVGGElement>, "clip"> {
  children?: ReactNode
  /** Enable SVG clipPath to prevent series from drawing outside plot boundaries */
  clip?: boolean
}

/**
 * Plot defines the inner translated Cartesian drawing area.
 * Automatically applies translate(margins.left, margins.top) using ChartContext.
 */
export const Plot = forwardRef<SVGGElement, PlotProps>(function Plot(
  { children, clip = false, className, transform, ...props },
  ref
) {
  const { margins, innerWidth, innerHeight, chartId } = useChart()
  const clipId = `${chartId}-plot-clip`

  return (
    <g
      ref={ref}
      className={className ? `plotcn-cartesian-plot ${className}` : "plotcn-cartesian-plot"}
      transform={transform || `translate(${margins.left}, ${margins.top})`}
      clipPath={clip ? `url(#${clipId})` : undefined}
      {...props}
    >
      {clip && (
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={innerWidth} height={innerHeight} />
          </clipPath>
        </defs>
      )}
      {children}
    </g>
  )
})
