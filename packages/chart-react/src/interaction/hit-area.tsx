import React, { forwardRef, type SVGProps } from "react"

export interface RectHitAreaProps extends SVGProps<SVGRectElement> {
  shape?: "rect"
  x: number
  y: number
  width: number
  height: number
}

export interface CircleHitAreaProps extends SVGProps<SVGCircleElement> {
  shape: "circle"
  cx: number
  cy: number
  r: number
}

export type HitAreaProps = RectHitAreaProps | CircleHitAreaProps

/**
 * HitArea provides an oversized, transparent SVG target area for small visual marks,
 * ensuring accessible and reliable pointer and touch interactions.
 */
export const HitArea = forwardRef<SVGElement, HitAreaProps>(function HitArea(
  props,
  ref
) {
  if (props.shape === "circle") {
    const { shape: _s, cx, cy, r, className, style, ...circleProps } = props
    return (
      <circle
        ref={ref as React.Ref<SVGCircleElement>}
        cx={cx}
        cy={cy}
        r={r}
        fill="transparent"
        className={className ? `plotcn-hit-area cursor-pointer ${className}` : "plotcn-hit-area cursor-pointer"}
        style={{ cursor: "pointer", ...style }}
        {...circleProps}
      />
    )
  }

  const { shape: _s, x, y, width, height, className, style, ...rectProps } = props
  return (
    <rect
      ref={ref as React.Ref<SVGRectElement>}
      x={x}
      y={y}
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      fill="transparent"
      className={className ? `plotcn-hit-area cursor-pointer ${className}` : "plotcn-hit-area cursor-pointer"}
      style={{ cursor: "pointer", ...style }}
      {...rectProps}
    />
  )
})
