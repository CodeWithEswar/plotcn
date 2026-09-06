import type { GoogleChartPackage, GoogleChartType } from "./types"

/**
 * Mapping of Plotcn/Google chart types to the required Google Visualization package.
 */
export const CHART_PACKAGE_MAP: Record<GoogleChartType, GoogleChartPackage> = {
  LineChart: "corechart",
  AreaChart: "corechart",
  BarChart: "corechart",
  ColumnChart: "corechart",
  PieChart: "corechart",
  ScatterChart: "corechart",
  GeoChart: "geochart",
  Table: "table",
  Timeline: "timeline",
}

export function getPackageForChartType(type: GoogleChartType): GoogleChartPackage {
  return CHART_PACKAGE_MAP[type] || "corechart"
}
