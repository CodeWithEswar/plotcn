import React, { useId, useMemo, type ReactNode } from "react"
import { ChartContext } from "./chart-context"
import type { ChartContextValue } from "../types/chart-context"
import type { ChartDimensions, ChartMargins } from "../../../chart-core/src/types/dimensions"
import {
  calculateInnerSize,
  createMargins,
  innerDimensionsToBounds,
} from "../../../chart-core/src/dimensions"

export interface ChartProviderProps {
  children?: ReactNode
  /** Total chart outer dimensions in pixels */
  dimensions: ChartDimensions
  /** Optional margin overrides */
  margins?: Partial<ChartMargins>
  /** Optional custom stable chart identifier */
  id?: string
  /** Optional title element ID for ARIA association */
  titleId?: string
  /** Optional description element ID for ARIA association */
  descriptionId?: string
}

/**
 * ChartProvider orchestrates dimension calculations, margin normalizations,
 * and stable accessibility IDs without performing DOM measurements.
 */
export function ChartProvider({
  children,
  dimensions,
  margins: partialMargins,
  id: customId,
  titleId,
  descriptionId,
}: ChartProviderProps) {
  const generatedId = useId()
  const chartId = customId || `plotcn-chart-${generatedId.replace(/:/g, "")}`

  const contextValue = useMemo<ChartContextValue>(() => {
    const margins = createMargins(partialMargins)
    const innerSize = calculateInnerSize(dimensions, margins)
    const plotBounds = innerDimensionsToBounds(innerSize)

    return {
      width: dimensions.width,
      height: dimensions.height,
      innerWidth: innerSize.innerWidth,
      innerHeight: innerSize.innerHeight,
      margins,
      plotBounds,
      chartId,
      titleId,
      descriptionId,
    }
  }, [
    dimensions.width,
    dimensions.height,
    partialMargins?.top,
    partialMargins?.right,
    partialMargins?.bottom,
    partialMargins?.left,
    chartId,
    titleId,
    descriptionId,
  ])

  return (
    <ChartContext.Provider value={contextValue}>
      {children}
    </ChartContext.Provider>
  )
}
