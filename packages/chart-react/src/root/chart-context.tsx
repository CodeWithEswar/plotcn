import { createContext, useContext } from "react"
import type { ChartContextValue } from "../types/chart-context"

export const ChartContext = createContext<ChartContextValue | null>(null)
ChartContext.displayName = "ChartContext"

/**
 * Accesses the current ChartContext.
 * Throws a descriptive error if called outside a <ChartProvider> or <ChartRoot>.
 */
export function useChart(): ChartContextValue {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error(
      "useChart must be used within a <ChartRoot> or <ChartProvider>. " +
      "Ensure your chart elements are wrapped in a Plotcn chart container."
    )
  }
  return context
}
