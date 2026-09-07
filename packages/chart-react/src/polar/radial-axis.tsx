import React, { forwardRef, type SVGProps } from "react"

export interface RadialTick {
  radius: number
  label?: string
}

export interface RadialAxisProps extends SVGProps<SVGGElement> {
  /** Radii in pixels for concentric scale rings */
  ticks: readonly (RadialTick | number)[]
  /** Hide ring line circles */
  hideRings?: boolean
  /** Hide value labels */
  hideLabels?: boolean
}

/**
 * RadialAxis renders concentric circle rings indicating distance from polar origin.
 */
export const RadialAxis = forwardRef<SVGGElement, RadialAxisProps>(
  function RadialAxis(
    {
      ticks,
      hideRings = false,
      hideLabels = false,
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
        className={className ? `plotcn-radial-axis ${className}` : "plotcn-radial-axis"}
        role="presentation"
        {...props}
      >
        {ticks.map((tick, idx) => {
          const radius = typeof tick === "number" ? tick : tick.radius
          const label = typeof tick === "number" ? undefined : tick.label

          return (
            <g key={`ring-${radius}-${idx}`}>
              {!hideRings && (
                <circle
                  cx={0}
                  cy={0}
                  r={radius}
                  fill="none"
                  stroke={stroke}
                  strokeOpacity={strokeOpacity}
                  strokeWidth={1}
                />
              )}
              {!hideLabels && label && (
                <text
                  x={4}
                  y={-radius + 4}
                  fontSize={10}
                  fill="currentColor"
                  fillOpacity={0.65}
                >
                  {label}
                </text>
              )}
            </g>
          )
        })}
      </g>
    )
  }
)
