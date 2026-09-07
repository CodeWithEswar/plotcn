import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { useChart } from "../root/chart-context"

export interface ChartTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
  /** Semantic heading level. Defaults to 3 (<h3>) */
  as?: "h1" | "h2" | "h3" | "h4" | "span"
}

/**
 * ChartTitle renders an accessible heading wired to the chart's aria-labelledby attribute.
 */
export const ChartTitle = forwardRef<HTMLHeadingElement, ChartTitleProps>(
  function ChartTitle(
    { children, as: Component = "h3", id: customId, className, ...props },
    ref
  ) {
    let titleId = customId
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const chart = useChart()
      if (!titleId) {
        titleId = chart.titleId
      }
    } catch {
      // Standalone usage
    }

    return (
      <Component
        ref={ref}
        id={titleId}
        className={
          className
            ? `plotcn-chart-title text-base font-semibold tracking-tight text-foreground ${className}`
            : "plotcn-chart-title text-base font-semibold tracking-tight text-foreground"
        }
        {...props}
      >
        {children}
      </Component>
    )
  }
)
