import React, { forwardRef, type SVGProps } from "react"
import { polarToCartesian } from "../../../chart-core/src/coordinates/polar"

export interface AngularTick {
  /** Angle in radians */
  angle: number
  /** Label for this ray */
  label: string
}

export interface AngularAxisProps extends SVGProps<SVGGElement> {
  /** Angular divisions in radians and their labels */
  ticks: readonly AngularTick[]
  /** Outer radius of spokes in pixels */
  radius: number
  /** Label offset distance beyond outer radius */
  labelOffset?: number
  /** Hide spoke lines */
  hideSpokes?: boolean
}

/**
 * AngularAxis renders radial spokes radiating from the polar center with angle labels.
 */
export const AngularAxis = forwardRef<SVGGElement, AngularAxisProps>(
  function AngularAxis(
    {
      ticks,
      radius,
      labelOffset = 14,
      hideSpokes = false,
      stroke = "currentColor",
      strokeOpacity = 0.15,
      className,
      ...props
    },
    ref
  ) {
    return (
      <g
        ref={ref}
        className={className ? `plotcn-angular-axis ${className}` : "plotcn-angular-axis"}
        role="presentation"
        {...props}
      >
        {ticks.map((tick, idx) => {
          const spokeEnd = polarToCartesian({ angle: tick.angle, radius })
          const labelPos = polarToCartesian({
            angle: tick.angle,
            radius: radius + labelOffset,
          })

          return (
            <g key={`spoke-${tick.angle}-${idx}`}>
              {!hideSpokes && (
                <line
                  x1={0}
                  y1={0}
                  x2={spokeEnd.x}
                  y2={spokeEnd.y}
                  stroke={stroke}
                  strokeOpacity={strokeOpacity}
                  strokeWidth={1}
                />
              )}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fill="currentColor"
                fillOpacity={0.75}
              >
                {tick.label}
              </text>
            </g>
          )
        })}
      </g>
    )
  }
)
