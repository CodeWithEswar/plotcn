import React, { forwardRef, type SVGProps, type ReactNode } from "react"
import { useChart } from "./chart-context"

export interface ChartSurfaceProps extends SVGProps<SVGSVGElement> {
  children?: ReactNode
  /** Custom accessible role. Defaults to "graphics-document". */
  role?: string
  /** Custom accessible roledescription. Defaults to "chart". */
  "aria-roledescription"?: string
  /** Explicit overflow behavior. Defaults to "visible". */
  overflow?: "visible" | "hidden" | "scroll" | "auto"
}

/**
 * ChartSurface renders the root SVG viewport for Plotcn-owned visualizations.
 * Automatically wires width, height, viewBox, and accessibility references from ChartContext.
 */
export const ChartSurface = forwardRef<SVGSVGElement, ChartSurfaceProps>(
  function ChartSurface(
    {
      children,
      className,
      role = "graphics-document",
      "aria-roledescription": ariaRoleDescription = "chart",
      overflow = "visible",
      style,
      ...props
    },
    ref
  ) {
    const { width, height, titleId, descriptionId } = useChart()

    return (
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        role={role}
        aria-roledescription={ariaRoleDescription}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={className}
        style={{
          overflow,
          display: "block",
          ...style,
        }}
        {...props}
      >
        {children}
      </svg>
    )
  }
)
