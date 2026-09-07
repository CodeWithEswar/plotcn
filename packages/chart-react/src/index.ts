/**
 * @plotcn/chart-react
 * Small, reusable React primitives for Plotcn-owned visualization composition.
 */

import { ChartRoot, ChartProvider, ChartSurface } from "./root"
import { Plot, XAxis, YAxis, Grid, Line, Area, Bar, ScatterPoint } from "./cartesian"
import { PolarPlot, RadialAxis, AngularAxis, RadialGrid } from "./polar"
import { Crosshair, Cursor, HitArea, ChartTooltip, ChartSelection, InteractionProvider } from "./interaction"
import { Legend, LegendItem, LegendList, LegendMarkerIcon } from "./legend"
import { ReferenceLine, ReferenceBand, ReferencePoint, Annotation } from "./annotations"
import { ChartTitle, ChartDescription, ChartSummary } from "./accessibility"

export * from "./types"
export * from "./root"
export * from "./cartesian"
export * from "./polar"
export * from "./interaction"
export * from "./legend"
export * from "./annotations"
export * from "./accessibility"
export * from "./state"

import { ChartLoading, ChartEmpty, ChartError, ChartUnavailable, ChartStateShell } from "./state"

/**
 * Compound Chart namespace providing composable primitives for custom Plotcn/D3 charts (section 6.47 & 6.73).
 * Example:
 * ```tsx
 * <Chart.Root width={width} height={height}>
 *   <Chart.Title>Revenue</Chart.Title>
 *   <Chart.Surface>
 *     <Chart.Plot>
 *       <Chart.Grid yTicks={yTicks} />
 *       <Chart.Line path={linePath} />
 *     </Chart.Plot>
 *   </Chart.Surface>
 * </Chart.Root>
 * ```
 */
export const Chart = {
  Root: ChartRoot,
  Provider: ChartProvider,
  Surface: ChartSurface,
  Plot,
  XAxis,
  YAxis,
  Grid,
  Line,
  Area,
  Bar,
  Scatter: ScatterPoint,
  PolarPlot,
  RadialAxis,
  AngularAxis,
  RadialGrid,
  Crosshair,
  Cursor,
  HitArea,
  Tooltip: ChartTooltip,
  Selection: ChartSelection,
  InteractionProvider,
  Legend,
  LegendItem,
  LegendList,
  LegendMarker: LegendMarkerIcon,
  ReferenceLine,
  ReferenceBand,
  ReferencePoint,
  Annotation,
  Title: ChartTitle,
  Description: ChartDescription,
  Summary: ChartSummary,
  Loading: ChartLoading,
  Empty: ChartEmpty,
  Error: ChartError,
  Unavailable: ChartUnavailable,
  StateShell: ChartStateShell,
} as const


