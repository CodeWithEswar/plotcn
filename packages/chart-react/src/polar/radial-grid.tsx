import React, { forwardRef, type SVGProps } from "react"
import { RadialAxis, type RadialTick } from "./radial-axis"
import { AngularAxis, type AngularTick } from "./angular-axis"

export interface RadialGridProps extends SVGProps<SVGGElement> {
  /** Concentric ring radii */
  radialTicks: readonly (RadialTick | number)[]
  /** Angular ray ticks */
  angularTicks: readonly AngularTick[]
  /** Outer boundary radius */
  maxRadius: number
  /** Line stroke color */
  stroke?: string
  /** Line opacity */
  strokeOpacity?: number
}

/**
 * RadialGrid renders a web grid composed of concentric rings and radial spokes.
 */
export const RadialGrid = forwardRef<SVGGElement, RadialGridProps>(
  function RadialGrid(
    {
      radialTicks,
      angularTicks,
      maxRadius,
      stroke = "currentColor",
      strokeOpacity = 0.08,
      className,
      ...props
    },
    ref
  ) {
    return (
      <g
        ref={ref}
        className={className ? `plotcn-radial-grid ${className}` : "plotcn-radial-grid"}
        role="presentation"
        {...props}
      >
        <RadialAxis
          ticks={radialTicks}
          hideLabels
          stroke={stroke}
          strokeOpacity={strokeOpacity}
        />
        <AngularAxis
          ticks={angularTicks}
          radius={maxRadius}
          hideSpokes={false}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
        />
      </g>
    )
  }
)
