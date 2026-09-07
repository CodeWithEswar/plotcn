import React, { forwardRef, type SVGProps } from "react"
import { useChart } from "../root/chart-context"

export interface ReferenceBandProps extends SVGProps<SVGGElement> {
  /** Horizontal band start Y coordinate in pixels */
  y1?: number
  /** Horizontal band end Y coordinate in pixels */
  y2?: number
  /** Vertical band start X coordinate in pixels */
  x1?: number
  /** Vertical band end X coordinate in pixels */
  x2?: number
  /** Optional band label */
  label?: string
}

/**
 * ReferenceBand renders a pre-computed rectangular range highlight across the plot.
 */
export const ReferenceBand = forwardRef<SVGGElement, ReferenceBandProps>(
  function ReferenceBand(
    {
      x1,
      x2,
      y1,
      y2,
      label,
      fill = "currentColor",
      fillOpacity = 0.08,
      className,
      ...props
    },
    ref
  ) {
    const { innerWidth, innerHeight } = useChart()

    const isHorizontal = y1 !== undefined && y2 !== undefined
    const isVertical = x1 !== undefined && x2 !== undefined

    if (!isHorizontal && !isVertical) {
      return null
    }

    const rectX = isHorizontal ? 0 : Math.min(x1 as number, x2 as number)
    const rectY = isHorizontal ? Math.min(y1 as number, y2 as number) : 0
    const rectWidth = isHorizontal ? innerWidth : Math.abs((x2 as number) - (x1 as number))
    const rectHeight = isHorizontal ? Math.abs((y2 as number) - (y1 as number)) : innerHeight

    return (
      <g
        ref={ref}
        className={className ? `plotcn-reference-band ${className}` : "plotcn-reference-band"}
        role="presentation"
        {...props}
      >
        <rect
          x={rectX}
          y={rectY}
          width={Math.max(0, rectWidth)}
          height={Math.max(0, rectHeight)}
          fill={fill}
          fillOpacity={fillOpacity}
        />
        {label && (
          <text
            x={rectX + 6}
            y={rectY + 14}
            fontSize={10}
            fontWeight={500}
            fill="currentColor"
            fillOpacity={0.65}
          >
            {label}
          </text>
        )}
      </g>
    )
  }
)
