import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"

export interface LegendProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  align?: "start" | "center" | "end"
  orientation?: "horizontal" | "vertical"
}

/**
 * Legend establishes the semantic container for chart legends.
 */
export const Legend = forwardRef<HTMLDivElement, LegendProps>(
  function Legend(
    {
      children,
      align = "center",
      orientation = "horizontal",
      className,
      ...props
    },
    ref
  ) {
    const alignClass =
      align === "start"
        ? "justify-start"
        : align === "end"
        ? "justify-end"
        : "justify-center"

    const orientationClass =
      orientation === "vertical" ? "flex-col items-start" : "flex-row items-center"

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Chart Legend"
        className={
          className
            ? `plotcn-legend flex flex-wrap gap-4 pt-3 ${alignClass} ${orientationClass} ${className}`
            : `plotcn-legend flex flex-wrap gap-4 pt-3 ${alignClass} ${orientationClass}`
        }
        {...props}
      >
        {children}
      </div>
    )
  }
)
