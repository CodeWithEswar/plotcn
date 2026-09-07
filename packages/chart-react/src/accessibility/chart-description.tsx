import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { useChart } from "../root/chart-context"

export interface ChartDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode
}

/**
 * ChartDescription provides an accessible prose description wired to the chart's aria-describedby attribute.
 */
export const ChartDescription = forwardRef<HTMLParagraphElement, ChartDescriptionProps>(
  function ChartDescription(
    { children, id: customId, className, ...props },
    ref
  ) {
    let descriptionId = customId
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const chart = useChart()
      if (!descriptionId) {
        descriptionId = chart.descriptionId
      }
    } catch {
      // Standalone usage
    }

    return (
      <p
        ref={ref}
        id={descriptionId}
        className={
          className
            ? `plotcn-chart-description text-xs text-muted-foreground ${className}`
            : "plotcn-chart-description text-xs text-muted-foreground"
        }
        {...props}
      >
        {children}
      </p>
    )
  }
)
