import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { ChartProvider } from "./chart-provider"
import type { ChartMargins } from "../../../chart-core/src/types/dimensions"

export interface ChartRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Total chart width in pixels */
  width: number
  /** Total chart height in pixels */
  height: number
  /** Optional margin overrides */
  margins?: Partial<ChartMargins>
  /** Optional stable chart identifier */
  id?: string
  /** Optional custom title element ID for ARIA association */
  titleId?: string
  /** Optional custom description element ID for ARIA association */
  descriptionId?: string
}

/**
 * ChartRoot establishes the shared React chart environment, normalizes margins,
 * calculates inner plot bounds, and provides semantic grouping.
 */
export const ChartRoot = forwardRef<HTMLDivElement, ChartRootProps>(
  function ChartRoot(
    {
      children,
      width,
      height,
      margins,
      id,
      titleId,
      descriptionId,
      className,
      style,
      ...props
    },
    ref
  ) {
    return (
      <ChartProvider
        dimensions={{ width, height }}
        margins={margins}
        id={id}
        titleId={titleId}
        descriptionId={descriptionId}
      >
        <div
          ref={ref}
          className={className ? `plotcn-chart-root relative w-full ${className}` : "plotcn-chart-root relative w-full"}
          style={{
            position: "relative",
            width: "100%",
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </ChartProvider>
    )
  }
)
