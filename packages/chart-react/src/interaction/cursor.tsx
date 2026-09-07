import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"

export interface CursorProps extends SVGProps<SVGRectElement> {
  /** X start coordinate in pixels */
  x: number
  /** Y start coordinate in pixels. Defaults to 0 */
  y?: number
  /** Width of the cursor band. */
  width: number
  /** Height of the cursor band. Defaults to innerHeight */
  height?: number
}

/**
 * Cursor renders a highlight/selection band representing the active category or bar column.
 */
export const Cursor = forwardRef<SVGRectElement, CursorProps>(function Cursor(
  {
    x,
    y = 0,
    width,
    height: customHeight,
    fill = "currentColor",
    fillOpacity = 0.05,
    className,
    ...props
  },
  ref
) {
  const { innerHeight } = useChart()
  const height = customHeight !== undefined ? customHeight : innerHeight

  return (
    <rect
      ref={ref}
      x={x}
      y={y}
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      fill={fill}
      fillOpacity={fillOpacity}
      className={className ? `plotcn-cursor pointer-events-none ${className}` : "plotcn-cursor pointer-events-none"}
      role="presentation"
      {...props}
    />
  )
})
