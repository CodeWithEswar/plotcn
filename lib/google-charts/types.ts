/**
 * Strict TypeScript types for Google Charts integration in Plotcn.
 */

export type ChartEngine = "recharts" | "d3" | "google"

export type GoogleChartsStatus = "idle" | "loading" | "ready" | "error"

export type GoogleChartPackage =
  | "corechart"
  | "geochart"
  | "timeline"
  | "sankey"
  | "orgchart"
  | "table"
  | "gauge"
  | "treemap"

export type GoogleChartType =
  | "LineChart"
  | "AreaChart"
  | "BarChart"
  | "ColumnChart"
  | "PieChart"
  | "ScatterChart"
  | "GeoChart"
  | "Table"
  | "Timeline"

export interface GoogleDataTableColumn {
  type: "string" | "number" | "boolean" | "date" | "datetime" | "timeofday"
  id?: string
  label?: string
  role?: string
}

export interface GoogleGeoChartOptions {
  region?: string
  displayMode?: "regions" | "markers" | "auto"
  resolution?: "countries" | "provinces" | "metros"
  colorAxis?: {
    minValue?: number
    maxValue?: number
    values?: number[]
    colors?: string[]
  }
  backgroundColor?: {
    fill?: string
    stroke?: string
    strokeWidth?: number
  }
  datalessRegionColor?: string
  defaultColor?: string
  keepAspectRatio?: boolean
  magnifyingGlass?: {
    enable?: boolean
    zoomFactor?: number
  }
  tooltip?: {
    textStyle?: {
      color?: string
      fontName?: string
      fontSize?: number
    }
    showColorCode?: boolean
    isHtml?: boolean
    ignoreBounds?: boolean
  }
  legend?:
    | "none"
    | {
        textStyle?: {
          color?: string
          fontName?: string
          fontSize?: number
        }
        numberFormat?: string
      }
  sizeAxis?: {
    minValue?: number
    maxValue?: number
    minSize?: number
    maxSize?: number
  }
}

export interface GoogleChartBaseOptions {
  title?: string
  titleTextStyle?: {
    color?: string
    fontName?: string
    fontSize?: number
    bold?: boolean
  }
  backgroundColor?: string | { fill?: string; stroke?: string; strokeWidth?: number }
  colors?: string[]
  legend?: "none" | { position?: "top" | "bottom" | "left" | "right" | "in" | "none"; textStyle?: { color?: string; fontSize?: number } }
  hAxis?: {
    title?: string
    titleTextStyle?: { color?: string }
    textStyle?: { color?: string; fontSize?: number }
    gridlines?: { color?: string; count?: number }
    baselineColor?: string
  }
  vAxis?: {
    title?: string
    titleTextStyle?: { color?: string }
    textStyle?: { color?: string; fontSize?: number }
    gridlines?: { color?: string; count?: number }
    baselineColor?: string
    minValue?: number
  }
  chartArea?: {
    left?: number | string
    top?: number | string
    right?: number | string
    bottom?: number | string
    width?: number | string
    height?: number | string
  }
  tooltip?: {
    textStyle?: { color?: string; fontSize?: number }
    isHtml?: boolean
    ignoreBounds?: boolean
  }
  animation?: {
    startup?: boolean
    duration?: number
    easing?: "linear" | "in" | "out" | "inAndOut"
  }
}

export interface GoogleChartAccessibility {
  title?: string
  description?: string
  summary?: string
}

/**
 * Minimal type definition for the global Google namespace.
 */
export interface GoogleGlobal {
  charts: {
    load: (version: string, options: { packages: string[]; language?: string }) => Promise<void>
    setOnLoadCallback: (callback: () => void) => void
  }
  visualization: {
    DataTable: new (data?: unknown) => GoogleDataTableInstance
    arrayToDataTable: (rows: unknown[][], opt_firstRowIsData?: boolean) => GoogleDataTableInstance
    events: {
      addListener: (target: unknown, eventName: string, handler: (event?: unknown) => void) => unknown
      removeListener: (listener: unknown) => void
      removeAllListeners: (target: unknown) => void
    }
    [key: string]: any
  }
}

export interface GoogleDataTableInstance {
  addColumn: (type: string | GoogleDataTableColumn, label?: string, id?: string) => number
  addRow: (cellValues: unknown[]) => number
  addRows: (numOrArray: number | unknown[][]) => number
  getNumberOfRows: () => number
  getNumberOfColumns: () => number
  getValue: (rowIndex: number, columnIndex: number) => unknown
  getFormattedValue: (rowIndex: number, columnIndex: number) => string
}

export interface GoogleChartInstance {
  draw: (data: GoogleDataTableInstance, options?: Record<string, unknown>) => void
  clearChart?: () => void
  getSelection?: () => Array<{ row?: number; column?: number }>
  setSelection?: (selection: Array<{ row?: number; column?: number }>) => void
}
