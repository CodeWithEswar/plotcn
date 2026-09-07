import type {
  ChartMargins,
  ChartDimensions,
  InnerChartDimensions,
  Bounds,
} from "../../../chart-core/src/types/dimensions"

export type {
  ChartMargins,
  ChartDimensions,
  InnerChartDimensions,
  Bounds,
}

export interface ChartContextValue {
  /** Total outer width in pixels */
  width: number
  /** Total outer height in pixels */
  height: number
  /** Drawable inner width excluding margins */
  innerWidth: number
  /** Drawable inner height excluding margins */
  innerHeight: number
  /** Canonical chart margins */
  margins: ChartMargins
  /** Drawable geometry bounds */
  plotBounds: Bounds
  /** Unique stable chart identifier */
  chartId: string
  /** Optional title element ID for ARIA association */
  titleId?: string
  /** Optional description element ID for ARIA association */
  descriptionId?: string
}
