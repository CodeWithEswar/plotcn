"use client"

import React, {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

// Error boundary to protect gallery and detail previews
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ChartPreviewBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <span className="text-xs font-mono text-destructive">
              Preview Unavailable
            </span>
            <span className="mt-1 text-[11px] text-muted-foreground">
              This example could not be rendered. The source and install action
              are still available.
            </span>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              Retry preview
            </Button>
          </div>
        )
      )
    }
    return this.props.children
  }
}

// Sample mock data for previews
export const sampleLineData = [
  { label: "Jan", value: 180 },
  { label: "Feb", value: 240 },
  { label: "Mar", value: 310 },
  { label: "Apr", value: 280 },
  { label: "May", value: 390 },
  { label: "Jun", value: 460 },
  { label: "Jul", value: 520 },
]

export const sampleMultiSeriesData = [
  { label: "Jan", current: 180, previous: 120 },
  { label: "Feb", current: 240, previous: 190 },
  { label: "Mar", current: 310, previous: 220 },
  { label: "Apr", current: 280, previous: 260 },
  { label: "May", current: 390, previous: 310 },
  { label: "Jun", current: 460, previous: 380 },
  { label: "Jul", current: 520, previous: 410 },
]

export const sampleRangeData = [
  { label: "Jan", value: 120, lower: 105, upper: 138 },
  { label: "Feb", value: 135, lower: 118, upper: 152 },
  { label: "Mar", value: 150, lower: 125, upper: 175 },
  { label: "Apr", value: 142, lower: 115, upper: 168 },
  { label: "May", value: 168, lower: 132, upper: 204 },
  { label: "Jun", value: 185, lower: 145, upper: 225 },
  { label: "Jul", value: 198, lower: 155, upper: 242 },
]

export const sampleStepData = [
  { date: "Jan 01", limit: 10000 },
  { date: "Feb 01", limit: 10000 },
  { date: "Mar 01", limit: 15000 },
  { date: "Apr 15", limit: 12000 },
  { date: "May 01", limit: 12000 },
  { date: "Jun 01", limit: 20000 },
  { date: "Jul 01", limit: 20000 },
]

export const sampleMilestoneData = [
  { date: "Jan", users: 45000 },
  { date: "Feb", users: 52000 },
  { date: "Mar", users: 58000 },
  { date: "Apr", users: 63000 },
  { date: "May", users: 78000 },
  { date: "Jun", users: 84000 },
  { date: "Jul", users: 95000 },
  { date: "Aug", users: 104000 },
]

export const sampleMilestonesList = [
  { id: "m1", x: "Feb", label: "Pricing v2", description: "Updated subscription tiers" },
  { id: "m2", x: "May", label: "Mobile app", description: "iOS and Android public launch" },
  { id: "m3", x: "Jul", label: "Enterprise", description: "SSO and audit log availability" },
]

export const sampleThresholdData = [
  { time: "00:00", latency: 142 },
  { time: "04:00", latency: 158 },
  { time: "08:00", latency: 245 },
  { time: "12:00", latency: 285 },
  { time: "16:00", latency: 198 },
  { time: "20:00", latency: 172 },
  { time: "23:59", latency: 155 },
]

export const sampleThresholdsList = [
  { id: "warn", kind: "line" as const, value: 220, label: "Target limit (220ms)" },
  { id: "sla", kind: "line" as const, value: 300, label: "SLA ceiling (300ms)" },
  { id: "opt", kind: "region" as const, from: 130, to: 190, label: "Optimal band (130-190ms)" },
]

export const sampleFocusData = [
  { time: "09:00", latency: 122 },
  { time: "10:00", latency: 138 },
  { time: "11:00", latency: 147 },
  { time: "12:00", latency: 133 },
  { time: "13:00", latency: 164 },
  { time: "14:00", latency: 181 },
  { time: "15:00", latency: 156 },
]

export const sampleMultiSignalData = [
  { month: "Jan", web: 120, ios: 90, android: 100 },
  { month: "Feb", web: 136, ios: 105, android: 121 },
  { month: "Mar", web: 154, ios: 130, android: 145 },
  { month: "Apr", web: 148, ios: 138, android: 140 },
  { month: "May", web: 172, ios: 152, android: 165 },
  { month: "Jun", web: 189, ios: 168, android: 178 },
  { month: "Jul", web: 210, ios: 185, android: 195 },
]

export const sampleMultiSignalSeries = [
  { key: "web" as const, label: "Web" },
  { key: "ios" as const, label: "iOS" },
  { key: "android" as const, label: "Android" },
]

export const sampleForecastData = [
  { month: "Jan", actual: 82, forecast: null, lower: null, upper: null },
  { month: "Feb", actual: 91, forecast: null, lower: null, upper: null },
  { month: "Mar", actual: 98, forecast: null, lower: null, upper: null },
  { month: "Apr", actual: 104, forecast: 104, lower: 104, upper: 104 },
  { month: "May", actual: null, forecast: 112, lower: 102, upper: 122 },
  { month: "Jun", actual: null, forecast: 119, lower: 106, upper: 132 },
  { month: "Jul", actual: null, forecast: 126, lower: 110, upper: 142 },
]

export const sampleForecastSeries = {
  actualKey: "actual" as const,
  forecastKey: "forecast" as const,
  lowerKey: "lower" as const,
  upperKey: "upper" as const,
  actualLabel: "Actual",
  forecastLabel: "Forecast",
  confidenceLabel: "Forecast range",
}

export const samplePrismAreaData = [
  { date: "May 01", requests: 12400 },
  { date: "May 04", requests: 14200 },
  { date: "May 08", requests: 13800 },
  { date: "May 12", requests: 16900 },
  { date: "May 16", requests: 18400 },
  { date: "May 20", requests: 21500 },
  { date: "May 24", requests: 19800 },
  { date: "May 28", requests: 23400 },
  { date: "May 31", requests: 26100 },
]

export const samplePrismAreaSeries = {
  key: "requests" as const,
  label: "API Requests",
  valueFormatter: (v: number) => `${v.toLocaleString()} req/s`,
}

export const sampleStackFlowData = [
  { month: "Jan", web: 120, ios: 80, android: 95 },
  { month: "Feb", web: 130, ios: 94, android: 103 },
  { month: "Mar", web: 138, ios: 112, android: 119 },
  { month: "Apr", web: 149, ios: 123, android: 131 },
  { month: "May", web: 162, ios: 135, android: 148 },
  { month: "Jun", web: 175, ios: 144, android: 160 },
  { month: "Jul", web: 190, ios: 158, android: 172 },
]

export const sampleStackFlowSeries = [
  { key: "web" as const, label: "Web" },
  { key: "ios" as const, label: "iOS" },
  { key: "android" as const, label: "Android" },
]

export const samplePercentStreamData = [
  { month: "Jan", web: 500, ios: 300, android: 200 },
  { month: "Feb", web: 5000, ios: 3000, android: 2000 },
  { month: "Mar", web: 4800, ios: 3200, android: 2000 },
  { month: "Apr", web: 4000, ios: 3600, android: 2400 },
  { month: "May", web: 3600, ios: 3700, android: 2700 },
  { month: "Jun", web: 3300, ios: 3900, android: 2800 },
]

export const samplePercentStreamSeries = [
  { key: "web" as const, label: "Web" },
  { key: "ios" as const, label: "iOS" },
  { key: "android" as const, label: "Android" },
]

export const sampleRangeAreaData = [
  { time: "10:00", min: 18, max: 26, median: 22 },
  { time: "11:00", min: 19, max: 28, median: 23 },
  { time: "12:00", min: 20, max: 36, median: 28 },
  { time: "13:00", min: 17, max: 29, median: 21 },
  { time: "14:00", min: 18, max: 25, median: 21 },
  { time: "15:00", min: 21, max: 32, median: 25 },
]

export const sampleRangeAreaSeries = {
  lowerKey: "min" as const,
  upperKey: "max" as const,
  valueKey: "median" as const,
  label: "Latency envelope",
  lowerLabel: "Min latency",
  upperLabel: "Max latency",
  valueLabel: "Median latency",
  valueFormatter: (v: number) => `${v} ms`,
}

export const sampleComparisonAreaData = [
  { month: "Jan", current: 125, previous: 110 },
  { month: "Feb", current: 142, previous: 120 },
  { month: "Mar", current: 138, previous: 135 },
  { month: "Apr", current: 165, previous: 140 },
  { month: "May", current: 158, previous: 162 },
  { month: "Jun", current: 184, previous: 155 },
  { month: "Jul", current: 195, previous: 170 },
  { month: "Aug", current: 188, previous: 182 },
  { month: "Sep", current: 210, previous: 190 },
  { month: "Oct", current: 225, previous: 198 },
  { month: "Nov", current: 240, previous: 215 },
  { month: "Dec", current: 265, previous: 230 },
]

export const sampleComparisonAreaSeries = {
  primary: { key: "current" as const, label: "2026 (Current)" },
  reference: { key: "previous" as const, label: "2025 (Previous)" },
}

export const sampleGradientDepthAreaData = [
  { date: "May 01", requests: 12400 },
  { date: "May 05", requests: 14800 },
  { date: "May 10", requests: 13900 },
  { date: "May 15", requests: 18200 },
  { date: "May 20", requests: 21500 },
  { date: "May 25", requests: 19800 },
  { date: "May 30", requests: 24600 },
]

export const sampleGradientDepthAreaSeries = {
  key: "requests" as const,
  label: "API Requests",
  valueFormatter: (v: number) => v.toLocaleString(),
}

export const sampleBaselineAreaData = [
  { day: "Day 01", utilization: 68 },
  { day: "Day 03", utilization: 72 },
  { day: "Day 05", utilization: 84 },
  { day: "Day 07", utilization: 89 },
  { day: "Day 09", utilization: 79 },
  { day: "Day 11", utilization: 75 },
  { day: "Day 13", utilization: 66 },
  { day: "Day 15", utilization: 61 },
  { day: "Day 17", utilization: 74 },
  { day: "Day 19", utilization: 82 },
  { day: "Day 21", utilization: 88 },
  { day: "Day 23", utilization: 77 },
  { day: "Day 25", utilization: 71 },
  { day: "Day 27", utilization: 67 },
  { day: "Day 29", utilization: 75 },
  { day: "Day 30", utilization: 83 },
]

export const sampleBaselineAreaSeries = {
  key: "utilization" as const,
  label: "Resource Utilization",
  valueFormatter: (v: number) => `${v}%`,
}

export const sampleInteractiveAreaData = [
  { date: "May 01", requests: 12400 },
  { date: "May 04", requests: 14200 },
  { date: "May 08", requests: 11900 },
  { date: "May 12", requests: 16800 },
  { date: "May 16", requests: 18500 },
  { date: "May 20", requests: 15300 },
  { date: "May 24", requests: 19800 },
  { date: "May 28", requests: 23400 },
  { date: "May 31", requests: 26100 },
]

export const sampleInteractiveAreaSeries = {
  key: "requests" as const,
  label: "API Requests",
  valueFormatter: (v: number) => `${v.toLocaleString()} req/s`,
}

export const sampleSignalBarsData = [
  { region: "North", web: 128400, mobile: 94200 },
  { region: "South", web: 103800, mobile: 121300 },
  { region: "East", web: 87400, mobile: 69800 },
  { region: "West", web: 145100, mobile: 110600 },
  { region: "Central", web: 76200, mobile: 81900 },
]

export const sampleSignalBarsSeries = [
  { key: "web" as const, label: "Web", valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k req` },
  { key: "mobile" as const, label: "Mobile", valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k req` },
]

export const sampleGroupCompareData = [
  { quarter: "Q1", current: 184, previous: 163, target: 175 },
  { quarter: "Q2", current: 216, previous: 191, target: 200 },
  { quarter: "Q3", current: 228, previous: 207, target: 220 },
  { quarter: "Q4", current: 252, previous: 236, target: 240 },
]

export const sampleGroupCompareSeries = [
  { key: "current" as const, label: "Current Year", valueFormatter: (v: number) => `$${v}k` },
  { key: "previous" as const, label: "Previous Year", valueFormatter: (v: number) => `$${v}k` },
  { key: "target" as const, label: "Target", valueFormatter: (v: number) => `$${v}k` },
]


export const sampleStackLedgerData = [
  { quarter: "Q1", compute: 48, storage: 31, network: 21 },
  { quarter: "Q2", compute: 54, storage: 35, network: 24 },
  { quarter: "Q3", compute: 51, storage: 42, network: 26 },
  { quarter: "Q4", compute: 62, storage: 48, network: 31 },
]

export const sampleStackLedgerSeries = [
  { key: "compute" as const, label: "Compute", valueFormatter: (v: number) => `$${v}k` },
  { key: "storage" as const, label: "Storage", valueFormatter: (v: number) => `$${v}k` },
  { key: "network" as const, label: "Network", valueFormatter: (v: number) => `$${v}k` },
]

export const samplePercentStackData = [
  { segment: "Startup", monthly: 620, annual: 310, multiYear: 70 },
  { segment: "Growth", monthly: 840, annual: 920, multiYear: 240 },
  { segment: "Enterprise", monthly: 90, annual: 215, multiYear: 195 },
]

export const samplePercentStackSeries = [
  { key: "monthly" as const, label: "Monthly", valueFormatter: (v: number) => `${v} users` },
  { key: "annual" as const, label: "Annual", valueFormatter: (v: number) => `${v} users` },
  { key: "multiYear" as const, label: "Multi-year", valueFormatter: (v: number) => `${v} users` },
]

export const sampleDivergingData = [
  { region: "North", variance: 18 },
  { region: "South", variance: -12 },
  { region: "East", variance: 31 },
  { region: "West", variance: -24 },
  { region: "Central", variance: 0 },
]

export const sampleDivergingSeries = {
  key: "variance" as const,
  label: "Variance from Plan",
  valueFormatter: (v: number) => `${v}%`,
}

export const sampleBulletData = [
  { service: "Auth API", actual: 99.95, target: 99.90 },
  { service: "Search API", actual: 99.82, target: 99.90 },
  { service: "Checkout API", actual: 99.91, target: 99.95 },
  { service: "Profiles API", actual: 99.97, target: 99.90 },
  { service: "Notifications API", actual: 99.88, target: 99.90 },
]

export const sampleBulletSeries = {
  valueKey: "actual" as const,
  targetKey: "target" as const,
  label: "Availability",
  valueFormatter: (v: number) => `${v.toFixed(2)}%`,
}

export const sampleVarianceData = [
  { segment: "Enterprise", actual: 124, plan: 110 },
  { segment: "Mid-market", actual: 92, plan: 100 },
  { segment: "SMB", actual: 74, plan: 74 },
  { segment: "Public Sector", actual: 68, plan: 72 },
  { segment: "Partners", actual: 81, plan: 75 },
]

export const sampleVarianceSeries = {
  actualKey: "actual" as const,
  planKey: "plan" as const,
  label: "Revenue Variance",
  valueFormatter: (v: number) => `$${v}M`,
  varianceFormatter: (v: number) => `${v > 0 ? "+" : ""}$${v}M`,
}

export const sampleIntervalData = [
  { service: "Authentication", start: 9.0, end: 10.5 },
  { service: "Payments API", start: 10.0, end: 12.25 },
  { service: "Notifications", start: 8.5, end: 9.75 },
  { service: "Analytics Engine", start: 11.0, end: 13.0 },
  { service: "Data Exporter", start: 12.25, end: 14.0 },
]

export const sampleIntervalSeries = {
  startKey: "start" as const,
  endKey: "end" as const,
  label: "Maintenance Window",
  startLabel: "Start",
  endLabel: "End",
  spanLabel: "Duration",
  valueFormatter: (h: number) => `${Math.floor(h).toString().padStart(2, "0")}:${((h % 1) * 60).toString().padStart(2, "0")}`,
  spanFormatter: (s: number) => `${Math.floor(s)}h ${Math.round((s % 1) * 60)}m`,
}

export const sampleInteractiveBarsData = [
  { quarter: "Q1", product: 82, services: 54, enterprise: 38 },
  { quarter: "Q2", product: 96, services: 61, enterprise: 44 },
  { quarter: "Q3", product: 88, services: 67, enterprise: 52 },
  { quarter: "Q4", product: 104, services: 72, enterprise: 58 },
]

export const sampleInteractiveBarsSeries = [
  { key: "product" as const, label: "Product", valueFormatter: (v: number) => `$${v}M` },
  { key: "services" as const, label: "Services", valueFormatter: (v: number) => `$${v}M` },
  { key: "enterprise" as const, label: "Enterprise", valueFormatter: (v: number) => `$${v}M` },
]


export const sampleBarData = [
  { label: "Mon", value: 45 },
  { label: "Tue", value: 72 },
  { label: "Wed", value: 61 },
  { label: "Thu", value: 89 },
  { label: "Fri", value: 95 },
  { label: "Sat", value: 53 },
  { label: "Sun", value: 38 },
]

export const sampleD3Points = [
  { x: 0, y: 30 },
  { x: 1, y: 65 },
  { x: 2, y: 45 },
  { x: 3, y: 90 },
  { x: 4, y: 70 },
  { x: 5, y: 110 },
  { x: 6, y: 95 },
  { x: 7, y: 140 },
]

export const sampleNetworkData = {
  nodes: [
    { id: "Core", label: "Core Service", group: 1 },
    { id: "API", label: "API Gateway", group: 1 },
    { id: "Web", label: "Web UI", group: 2 },
    { id: "DB", label: "Database", group: 2 },
    { id: "Cache", label: "Redis Cache", group: 3 },
    { id: "Worker", label: "Worker Queue", group: 3 },
  ],
  links: [
    { source: "Core", target: "API" },
    { source: "API", target: "Web" },
    { source: "API", target: "DB" },
    { source: "DB", target: "Cache" },
    { source: "Core", target: "Worker" },
    { source: "Worker", target: "DB" },
  ],
}

export const sampleGeoData = [
  { region: "US", value: 1200 },
  { region: "DE", value: 850 },
  { region: "IN", value: 980 },
  { region: "GB", value: 720 },
  { region: "JP", value: 650 },
  { region: "FR", value: 540 },
  { region: "BR", value: 430 },
]

// Dynamic chart imports
const RechartsSignalLine = dynamic(
  () => import("@/registry/recharts/line-signal").then((m) => m.SignalLine),
  { ssr: false }
)
const RechartsPulseLine = dynamic(
  () => import("@/registry/recharts/line-pulse").then((m) => m.PulseLine),
  { ssr: false }
)
const RechartsTwinlineCompare = dynamic(
  () => import("@/registry/recharts/line-twin-compare").then((m) => m.TwinlineCompare),
  { ssr: false }
)
const RechartsRangeLine = dynamic(
  () => import("@/registry/recharts/line-range").then((m) => m.RangeLine),
  { ssr: false }
)
const RechartsStepSignal = dynamic(
  () => import("@/registry/recharts/line-step-signal").then((m) => m.StepSignal),
  { ssr: false }
)
const RechartsMilestoneLine = dynamic(
  () => import("@/registry/recharts/line-milestones").then((m) => m.MilestoneLine),
  { ssr: false }
)
const RechartsThresholdLine = dynamic(
  () => import("@/registry/recharts/line-threshold").then((m) => m.ThresholdLine),
  { ssr: false }
)
const RechartsFocusLine = dynamic(
  () => import("@/registry/recharts/line-focus").then((m) => m.FocusLine),
  { ssr: false }
)
const RechartsMultiSignalLine = dynamic(
  () => import("@/registry/recharts/line-multi-signal").then((m) => m.MultiSignalLine),
  { ssr: false }
)
const RechartsForecastLine = dynamic(
  () => import("@/registry/recharts/line-forecast").then((m) => m.ForecastLine),
  { ssr: false }
)
const RechartsPrismArea = dynamic(
  () => import("@/registry/recharts/area-prism").then((m) => m.PrismArea),
  { ssr: false }
)
const RechartsStackFlowArea = dynamic(
  () => import("@/registry/recharts/area-stack-flow").then((m) => m.StackFlowArea),
  { ssr: false }
)
const RechartsPercentStreamArea = dynamic(
  () => import("@/registry/recharts/area-percent-stream").then((m) => m.PercentStreamArea),
  { ssr: false }
)
const RechartsRangeArea = dynamic(
  () => import("@/registry/recharts/area-range").then((m) => m.RangeArea),
  { ssr: false }
)
const RechartsComparisonArea = dynamic(
  () => import("@/registry/recharts/area-comparison").then((m) => m.ComparisonArea),
  { ssr: false }
)
const RechartsGradientDepthArea = dynamic(
  () => import("@/registry/recharts/area-gradient-depth").then((m) => m.GradientDepthArea),
  { ssr: false }
)
const RechartsBaselineArea = dynamic(
  () => import("@/registry/recharts/area-baseline").then((m) => m.BaselineArea),
  { ssr: false }
)
const RechartsInteractiveArea = dynamic(
  () => import("@/registry/recharts/area-interactive").then((m) => m.InteractiveArea),
  { ssr: false }
)
const RechartsSignalBars = dynamic(
  () => import("@/registry/recharts/bar-signal").then((m) => m.SignalBars),
  { ssr: false }
)
const RechartsGroupCompareBars = dynamic(
  () => import("@/registry/recharts/bar-group-compare").then((m) => m.GroupCompareBars),
  { ssr: false }
)
const RechartsStackLedgerBars = dynamic(
  () => import("@/registry/recharts/bar-stack-ledger").then((m) => m.StackLedgerBars),
  { ssr: false }
)
const RechartsPercentStackBars = dynamic(
  () => import("@/registry/recharts/bar-percent-stack").then((m) => m.PercentStackBars),
  { ssr: false }
)
const RechartsDivergingBars = dynamic(
  () => import("@/registry/recharts/bar-diverging").then((m) => m.DivergingBars),
  { ssr: false }
)
const RechartsBulletBars = dynamic(
  () => import("@/registry/recharts/bar-bullet").then((m) => m.BulletBars),
  { ssr: false }
)
const RechartsVarianceBars = dynamic(
  () => import("@/registry/recharts/bar-variance").then((m) => m.VarianceBars),
  { ssr: false }
)
const RechartsIntervalBars = dynamic(
  () => import("@/registry/recharts/bar-interval").then((m) => m.IntervalBars),
  { ssr: false }
)
const RechartsInteractiveBars = dynamic(
  () => import("@/registry/recharts/bar-interactive").then((m) => m.InteractiveBars),
  { ssr: false }
)
const RechartsLineBasic = dynamic(
  () => import("@/registry/recharts/line-basic").then((m) => m.LineBasic),
  { ssr: false }
)
const RechartsLineMultiple = dynamic(
  () => import("@/registry/recharts/line-multiple").then((m) => m.LineMultiple),
  { ssr: false }
)
const RechartsAreaBasic = dynamic(
  () => import("@/registry/recharts/area-basic").then((m) => m.AreaBasic),
  { ssr: false }
)
const RechartsBarBasic = dynamic(
  () => import("@/registry/recharts/bar-basic").then((m) => m.BarBasic),
  { ssr: false }
)

const RechartsDonutBasic = dynamic(() => import("@/registry/recharts/donut-basic").then(m => m.DonutBasic), { ssr: false })

const D3AnimatedLine = dynamic(
  () => import("@/registry/d3/d3-animated-line").then((m) => m.D3AnimatedLine),
  { ssr: false }
)
const D3ForceNetwork = dynamic(
  () => import("@/registry/d3/d3-force-network").then((m) => m.D3ForceNetwork),
  { ssr: false }
)

const GoogleLine = dynamic(
  () => import("@/registry/google/google-line").then((m) => m.GoogleLine),
  { ssr: false }
)
const GoogleBar = dynamic(
  () => import("@/registry/google/google-bar").then((m) => m.GoogleBar),
  { ssr: false }
)
const GoogleGeoChart = dynamic(
  () =>
    import("@/registry/google/google-geochart").then((m) => m.GoogleGeoChart),
  { ssr: false }
)

export interface DynamicChartRendererProps {
  registryName: string
  height?: number | string
  className?: string
  motion?: boolean
  color?: string
  chartProps?: Record<string, any>
}

export function DynamicChartRenderer({
  registryName,
  height = 240,
  className,
  motion = false,
  color,
  chartProps = {},
}: DynamicChartRendererProps) {
  const resolvedHeight =
    typeof chartProps?.height === "number"
      ? chartProps.height
      : typeof height === "number"
        ? height
        : parseInt(String(height), 10) || 240

  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [width, setWidth] = useState(600)
  const [reduced, setReduced] = useState(true)

  const effectivePrimary = chartProps?.primaryColor || chartProps?.color || color
  const effectiveSecondary =
    chartProps?.selectionColor ||
    chartProps?.referenceColor ||
    chartProps?.rangeColor ||
    chartProps?.milestoneColor

  const colorStyles: Record<string, string> = {}
  if (effectivePrimary && effectivePrimary !== "theme") {
    colorStyles["--chart-1"] = effectivePrimary
    colorStyles["--primary"] = effectivePrimary
    colorStyles["--chart-focus"] = effectivePrimary
    if (!effectiveSecondary || effectiveSecondary === "theme") {
      colorStyles["--chart-selection"] = effectivePrimary
    }
  }
  if (effectiveSecondary && effectiveSecondary !== "theme") {
    colorStyles["--chart-2"] = effectiveSecondary
    colorStyles["--chart-selection"] = effectiveSecondary
  }

  useEffect(() => {
    const element = root.current
    if (!element) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const motionChange = () => setReduced(media.matches)
    motionChange()
    media.addEventListener("change", motionChange)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "120px" }
    )
    observer.observe(element)
    const resize = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width)
      if (w > 0) setWidth(w)
    })
    resize.observe(element)
    return () => {
      observer.disconnect()
      resize.disconnect()
      media.removeEventListener("change", motionChange)
    }
  }, [])

  return (
    <ChartPreviewBoundary>
      <div
        ref={root}
        className={`w-full min-w-0 max-w-full overflow-hidden ${className || ""}`}
        style={{
          width: "100%",
          height: resolvedHeight,
          minHeight: resolvedHeight,
          ...colorStyles,
        }}
      >
        {visible ? (
          (() => {
            const cleanKey = registryName?.trim().toLowerCase()
            switch (cleanKey) {
              case "line-signal":
              case "recharts-line-signal":
                return (
                  <RechartsSignalLine
                    data={sampleLineData}
                    xKey="label"
                    seriesKey="value"
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "line-pulse":
              case "recharts-line-pulse":
                return (
                  <RechartsPulseLine
                    data={sampleLineData}
                    xKey="label"
                    seriesKey="value"
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    showLatestPoint
                    {...chartProps}
                  />
                )
              case "line-twin-compare":
              case "recharts-line-twin-compare":
                return (
                  <RechartsTwinlineCompare
                    data={sampleMultiSeriesData}
                    xKey="label"
                    primaryKey="current"
                    referenceKey="previous"
                    primaryLabel="2024"
                    referenceLabel="2023"
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    primaryColor={chartProps?.primaryColor || effectivePrimary}
                    referenceColor={chartProps?.referenceColor || effectiveSecondary}
                    {...chartProps}
                  />
                )
              case "line-range":
              case "recharts-line-range":
                return (
                  <RechartsRangeLine
                    data={sampleRangeData}
                    xKey="label"
                    valueKey="value"
                    lowerKey="lower"
                    upperKey="upper"
                    label="Forecast"
                    rangeLabel="Confidence"
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    rangeColor={chartProps?.rangeColor || effectiveSecondary}
                    {...chartProps}
                  />
                )
              case "line-step-signal":
              case "recharts-line-step-signal":
                return (
                  <RechartsStepSignal
                    data={sampleStepData}
                    xKey="date"
                    seriesKey="limit"
                    label="API Limit"
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "line-milestones":
              case "recharts-line-milestones":
                return (
                  <RechartsMilestoneLine
                    data={sampleMilestoneData}
                    xKey="date"
                    series={{ key: "users", label: "Active users" }}
                    milestones={sampleMilestonesList}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    milestoneColor={chartProps?.milestoneColor || effectiveSecondary}
                    {...chartProps}
                  />
                )
              case "line-threshold":
              case "recharts-line-threshold":
                return (
                  <RechartsThresholdLine
                    data={sampleThresholdData}
                    xKey="time"
                    seriesKey="latency"
                    label="Response Time"
                    thresholds={sampleThresholdsList}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    thresholdColor={chartProps?.thresholdColor || effectiveSecondary}
                    {...chartProps}
                  />
                )
              case "line-focus":
              case "recharts-line-focus":
                return (
                  <RechartsFocusLine
                    data={sampleFocusData}
                    xKey="time"
                    series={{ key: "latency", label: "P95 latency" }}
                    height={resolvedHeight}
                    animation={motion && !reduced ? "draw" : "none"}
                    color={effectivePrimary}
                    selectionColor={chartProps?.selectionColor || effectiveSecondary}
                    defaultLockedIndex={typeof chartProps?.defaultLockedIndex === "number" ? chartProps.defaultLockedIndex : 5}
                    lockableTooltip
                    {...chartProps}
                  />
                )
              case "line-multi-signal":
              case "recharts-line-multi-signal": {
                const dynamicSeries = [
                  {
                    key: "web",
                    label: "Web",
                    color: chartProps?.color_web && chartProps.color_web !== "theme" ? chartProps.color_web : undefined,
                  },
                  {
                    key: "ios",
                    label: "iOS",
                    color: chartProps?.color_ios && chartProps.color_ios !== "theme" ? chartProps.color_ios : undefined,
                  },
                  {
                    key: "android",
                    label: "Android",
                    color: chartProps?.color_android && chartProps.color_android !== "theme" ? chartProps.color_android : undefined,
                  },
                ]
                return (
                  <RechartsMultiSignalLine
                    data={chartProps?.data || sampleMultiSignalData}
                    xKey="month"
                    series={chartProps?.series || dynamicSeries}
                    height={resolvedHeight}
                    animation={motion && !reduced ? "draw" : "none"}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    {...chartProps}
                  />
                )
              }
              case "line-forecast":
              case "recharts-line-forecast":
                return (
                  <RechartsForecastLine
                    data={chartProps?.data || sampleForecastData}
                    xKey="month"
                    series={chartProps?.series || sampleForecastSeries}
                    height={resolvedHeight}
                    animation={motion && !reduced ? "draw" : "none"}
                    actualColor={chartProps?.actualColor && chartProps.actualColor !== "theme" ? chartProps.actualColor : undefined}
                    forecastColor={chartProps?.forecastColor && chartProps.forecastColor !== "theme" ? chartProps.forecastColor : undefined}
                    confidenceColor={chartProps?.confidenceColor && chartProps.confidenceColor !== "theme" ? chartProps.confidenceColor : undefined}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    defaultLockedIndex={typeof chartProps?.defaultLockedIndex === "number" ? chartProps.defaultLockedIndex : 3}
                    {...chartProps}
                  />
                )
              case "area-prism":
              case "recharts-area-prism":
                return (
                  <RechartsPrismArea
                    data={chartProps?.data || samplePrismAreaData}
                    xKey="date"
                    series={chartProps?.series || samplePrismAreaSeries}
                    height={resolvedHeight}
                    animation={motion && !reduced ? "draw" : "none"}
                    curve={chartProps?.curve ?? "monotone"}
                    color={chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary}
                    fillColor={chartProps?.fillColor && chartProps.fillColor !== "theme" ? chartProps.fillColor : undefined}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.22}
                    gradientMode={chartProps?.gradientMode ?? "none"}
                    baseline={chartProps?.baseline ?? "zero"}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "gap"}
                    {...chartProps}
                  />
                )
              case "area-stack-flow":
              case "recharts-area-stack-flow": {
                const dynamicSeries = [
                  {
                    key: "web",
                    label: "Web",
                    color: chartProps?.color_web && chartProps.color_web !== "theme" ? chartProps.color_web : undefined,
                  },
                  {
                    key: "ios",
                    label: "iOS",
                    color: chartProps?.color_ios && chartProps.color_ios !== "theme" ? chartProps.color_ios : undefined,
                  },
                  {
                    key: "android",
                    label: "Android",
                    color: chartProps?.color_android && chartProps.color_android !== "theme" ? chartProps.color_android : undefined,
                  },
                ]
                return (
                  <RechartsStackFlowArea
                    data={chartProps?.data || sampleStackFlowData}
                    xKey="month"
                    series={chartProps?.series || dynamicSeries}
                    height={resolvedHeight}
                    animation={motion && !reduced ? "draw" : "none"}
                    curve={chartProps?.curve ?? "monotone"}
                    stackMode={chartProps?.stackMode ?? "absolute"}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.65}
                    gradientMode={chartProps?.gradientMode ?? "none"}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "gap"}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    defaultLockedIndex={typeof chartProps?.defaultLockedIndex === "number" ? chartProps.defaultLockedIndex : null}
                    {...chartProps}
                  />
                )
              }
              case "area-percent-stream":
              case "recharts-area-percent-stream": {
                const dynamicSeries = [
                  {
                    key: "web",
                    label: "Web",
                    color: chartProps?.color_web && chartProps.color_web !== "theme" ? chartProps.color_web : undefined,
                  },
                  {
                    key: "ios",
                    label: "iOS",
                    color: chartProps?.color_ios && chartProps.color_ios !== "theme" ? chartProps.color_ios : undefined,
                  },
                  {
                    key: "android",
                    label: "Android",
                    color: chartProps?.color_android && chartProps.color_android !== "theme" ? chartProps.color_android : undefined,
                  },
                ]
                return (
                  <RechartsPercentStreamArea
                    data={chartProps?.data || samplePercentStreamData}
                    xKey="month"
                    series={chartProps?.series || dynamicSeries}
                    height={resolvedHeight}
                    animation={motion && !reduced ? "draw" : "none"}
                    curve={chartProps?.curve ?? "monotone"}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.75}
                    gradientMode={chartProps?.gradientMode ?? "none"}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "gap"}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    defaultLockedIndex={typeof chartProps?.defaultLockedIndex === "number" ? chartProps.defaultLockedIndex : null}
                    {...chartProps}
                  />
                )
              }
              case "area-range":
              case "recharts-area-range":
                return (
                  <RechartsRangeArea
                    data={chartProps?.data || sampleRangeAreaData}
                    xKey="time"
                    series={chartProps?.series || sampleRangeAreaSeries}
                    height={resolvedHeight}
                    curve={chartProps?.curve ?? "linear"}
                    color={chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary}
                    valueColor={chartProps?.valueColor && chartProps.valueColor !== "theme" ? chartProps.valueColor : effectiveSecondary}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.25}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    {...chartProps}
                  />
                )
              case "area-comparison":
              case "recharts-area-comparison":
                return (
                  <RechartsComparisonArea
                    data={chartProps?.data || sampleComparisonAreaData}
                    xKey="month"
                    series={chartProps?.series || sampleComparisonAreaSeries}
                    height={resolvedHeight}
                    curve={chartProps?.curve ?? "monotone"}
                    primaryColor={chartProps?.primaryColor && chartProps.primaryColor !== "theme" ? chartProps.primaryColor : effectivePrimary}
                    referenceColor={chartProps?.referenceColor && chartProps.referenceColor !== "theme" ? chartProps.referenceColor : effectiveSecondary}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.28}
                    showDelta={chartProps?.showDelta ?? true}
                    deltaType={chartProps?.deltaType ?? "both"}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    {...chartProps}
                  />
                )
              case "area-gradient-depth":
              case "recharts-area-gradient-depth":
                return (
                  <RechartsGradientDepthArea
                    data={chartProps?.data || sampleGradientDepthAreaData}
                    xKey="date"
                    series={chartProps?.series || sampleGradientDepthAreaSeries}
                    height={resolvedHeight}
                    curve={chartProps?.curve ?? "monotone"}
                    color={chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    gradientMode={chartProps?.gradientMode ?? "surface"}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.32}
                    baseline={chartProps?.baseline ?? "zero"}
                    domain={chartProps?.domain ?? "auto"}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "gap"}
                    {...chartProps}
                  />
                )
              case "area-baseline":
              case "recharts-area-baseline":
                return (
                  <RechartsBaselineArea
                    data={chartProps?.data || sampleBaselineAreaData}
                    xKey="day"
                    series={chartProps?.series || sampleBaselineAreaSeries}
                    baseline={typeof chartProps?.baseline === "number" ? chartProps.baseline : 75}
                    baselineLabel={chartProps?.baselineLabel ?? "Target"}
                    aboveLabel={chartProps?.aboveLabel ?? "Above target"}
                    belowLabel={chartProps?.belowLabel ?? "Below target"}
                    height={resolvedHeight}
                    curve={chartProps?.curve ?? "monotone"}
                    color={chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary}
                    aboveColor={chartProps?.aboveColor && chartProps.aboveColor !== "theme" ? chartProps.aboveColor : effectivePrimary}
                    belowColor={chartProps?.belowColor && chartProps.belowColor !== "theme" ? chartProps.belowColor : effectiveSecondary}
                    baselineColor={chartProps?.baselineColor && chartProps.baselineColor !== "theme" ? chartProps.baselineColor : undefined}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.24}
                    domain={chartProps?.domain ?? "auto"}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    showDeviation={chartProps?.showDeviation ?? true}
                    lockableTooltip={chartProps?.lockableTooltip ?? true}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "gap"}
                    {...chartProps}
                  />
                )
              case "area-interactive":
              case "recharts-area-interactive":
                return (
                  <RechartsInteractiveArea
                    data={chartProps?.data || sampleInteractiveAreaData}
                    xKey="date"
                    series={chartProps?.series || sampleInteractiveAreaSeries}
                    height={resolvedHeight}
                    curve={chartProps?.curve ?? "monotone"}
                    color={chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    fillOpacity={typeof chartProps?.fillOpacity === "number" ? chartProps.fillOpacity : 0.22}
                    baseline={chartProps?.baseline ?? "zero"}
                    domain={chartProps?.domain ?? "auto"}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    lockable={chartProps?.lockable ?? true}
                    defaultLockedIndex={typeof chartProps?.defaultLockedIndex === "number" ? chartProps.defaultLockedIndex : 4}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "gap"}
                    {...chartProps}
                  />
                )
              case "bar-signal":
              case "recharts-bar-signal":
                return (
                  <RechartsSignalBars
                    data={chartProps?.data || sampleSignalBarsData}
                    categoryKey="region"
                    series={
                      chartProps?.series || [
                        {
                          key: "web",
                          label: "Web",
                          color: chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary,
                          valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k req`,
                        },
                        {
                          key: "mobile",
                          label: "Mobile",
                          color: chartProps?.referenceColor && chartProps.referenceColor !== "theme" ? chartProps.referenceColor : undefined,
                          valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k req`,
                        },
                      ]
                    }
                    orientation={chartProps?.orientation ?? "vertical"}
                    height={resolvedHeight}
                    maxBarSize={typeof chartProps?.maxBarSize === "number" ? chartProps.maxBarSize : 48}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-group-compare":
              case "recharts-bar-group-compare":
                return (
                  <RechartsGroupCompareBars
                    data={chartProps?.data || sampleGroupCompareData}
                    categoryKey="quarter"
                    series={
                      chartProps?.series || [
                        {
                          key: "current",
                          label: "Current Year",
                          color: chartProps?.color_current && chartProps.color_current !== "theme" ? chartProps.color_current : effectivePrimary,
                          valueFormatter: (v: number) => `$${v}k`,
                        },
                        {
                          key: "previous",
                          label: "Previous Year",
                          color: chartProps?.color_previous && chartProps.color_previous !== "theme" ? chartProps.color_previous : undefined,
                          valueFormatter: (v: number) => `$${v}k`,
                        },
                        {
                          key: "target",
                          label: "Target",
                          color: chartProps?.color_target && chartProps.color_target !== "theme" ? chartProps.color_target : undefined,
                          valueFormatter: (v: number) => `$${v}k`,
                        },
                      ]
                    }
                    layout={chartProps?.layout ?? "vertical"}
                    height={resolvedHeight}
                    maxBarSize={typeof chartProps?.maxBarSize === "number" ? chartProps.maxBarSize : 36}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-stack-ledger":
              case "recharts-bar-stack-ledger":
                return (
                  <RechartsStackLedgerBars
                    data={chartProps?.data || sampleStackLedgerData}
                    categoryKey="quarter"
                    series={
                      chartProps?.series || [
                        {
                          key: "compute",
                          label: "Compute",
                          color: chartProps?.color_compute && chartProps.color_compute !== "theme" ? chartProps.color_compute : undefined,
                          valueFormatter: (v: number) => `$${v}k`,
                        },
                        {
                          key: "storage",
                          label: "Storage",
                          color: chartProps?.color_storage && chartProps.color_storage !== "theme" ? chartProps.color_storage : undefined,
                          valueFormatter: (v: number) => `$${v}k`,
                        },
                        {
                          key: "network",
                          label: "Network",
                          color: chartProps?.color_network && chartProps.color_network !== "theme" ? chartProps.color_network : undefined,
                          valueFormatter: (v: number) => `$${v}k`,
                        },
                      ]
                    }
                    layout={chartProps?.layout ?? "vertical"}
                    height={resolvedHeight}
                    maxBarSize={typeof chartProps?.maxBarSize === "number" ? chartProps.maxBarSize : 48}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "incomplete"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-percent-stack":
              case "recharts-bar-percent-stack":
                return (
                  <RechartsPercentStackBars
                    data={chartProps?.data || samplePercentStackData}
                    categoryKey="segment"
                    series={
                      chartProps?.series || [
                        {
                          key: "monthly",
                          label: "Monthly",
                          color: chartProps?.color_monthly && chartProps.color_monthly !== "theme" ? chartProps.color_monthly : undefined,
                          valueFormatter: (v: number) => `${v} users`,
                        },
                        {
                          key: "annual",
                          label: "Annual",
                          color: chartProps?.color_annual && chartProps.color_annual !== "theme" ? chartProps.color_annual : undefined,
                          valueFormatter: (v: number) => `${v} users`,
                        },
                        {
                          key: "multiYear",
                          label: "Multi-year",
                          color: chartProps?.color_multiYear && chartProps.color_multiYear !== "theme" ? chartProps.color_multiYear : undefined,
                          valueFormatter: (v: number) => `${v} users`,
                        },
                      ]
                    }
                    layout={chartProps?.layout ?? "vertical"}
                    height={resolvedHeight}
                    maxBarSize={typeof chartProps?.maxBarSize === "number" ? chartProps.maxBarSize : 48}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    missingValuePolicy={chartProps?.missingValuePolicy ?? "incomplete"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-diverging":
              case "recharts-bar-diverging":
                return (
                  <RechartsDivergingBars
                    data={chartProps?.data || sampleDivergingData}
                    categoryKey="region"
                    series={
                      chartProps?.series || {
                        key: "variance",
                        label: "Variance from Plan",
                        valueFormatter: (v: number) => `${v}%`,
                      }
                    }
                    layout={chartProps?.layout ?? "horizontal"}
                    baseline={chartProps?.baseline ?? 0}
                    baselineLabel={chartProps?.baselineLabel}
                    domain={chartProps?.domain ?? "symmetric"}
                    aboveColor={chartProps?.aboveColor && chartProps.aboveColor !== "theme" ? chartProps.aboveColor : undefined}
                    belowColor={chartProps?.belowColor && chartProps.belowColor !== "theme" ? chartProps.belowColor : undefined}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    height={resolvedHeight}
                    maxBarSize={typeof chartProps?.maxBarSize === "number" ? chartProps.maxBarSize : 36}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-bullet":
              case "recharts-bar-bullet":
                return (
                  <RechartsBulletBars
                    data={chartProps?.data || sampleBulletData}
                    categoryKey="service"
                    series={
                      chartProps?.series || {
                        valueKey: "actual",
                        targetKey: "target",
                        label: "Availability",
                        valueFormatter: (v: number) => `${v.toFixed(2)}%`,
                      }
                    }
                    ranges={chartProps?.ranges}
                    valueColor={chartProps?.valueColor && chartProps.valueColor !== "theme" ? chartProps.valueColor : effectivePrimary}
                    targetColor={chartProps?.targetColor && chartProps.targetColor !== "theme" ? chartProps.targetColor : undefined}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    height={resolvedHeight}
                    rowHeight={typeof chartProps?.rowHeight === "number" ? chartProps.rowHeight : 44}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-variance":
              case "recharts-bar-variance":
                return (
                  <RechartsVarianceBars
                    data={chartProps?.data || sampleVarianceData}
                    categoryKey="segment"
                    series={
                      chartProps?.series || {
                        actualKey: "actual",
                        planKey: "plan",
                        label: "Revenue Variance",
                        valueFormatter: (v: number) => `$${v}M`,
                        varianceFormatter: (v: number) => `${v > 0 ? "+" : ""}$${v}M`,
                      }
                    }
                    positiveColor={
                      chartProps?.positiveColor && chartProps.positiveColor !== "theme"
                        ? chartProps.positiveColor
                        : effectivePrimary || "var(--chart-1, #3b82f6)"
                    }
                    negativeColor={
                      chartProps?.negativeColor && chartProps.negativeColor !== "theme"
                        ? chartProps.negativeColor
                        : "var(--chart-2, #f97316)"
                    }
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    height={resolvedHeight}
                    orientation={chartProps?.orientation ?? "vertical"}
                    showGrid={chartProps?.showGrid ?? true}
                    showZeroLine={chartProps?.showZeroLine ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    tooltipMode={chartProps?.tooltipMode ?? "full"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-interval":
              case "recharts-bar-interval":
                return (
                  <RechartsIntervalBars
                    data={chartProps?.data || sampleIntervalData}
                    categoryKey="service"
                    series={
                      chartProps?.series || {
                        startKey: "start",
                        endKey: "end",
                        label: "Maintenance Window",
                        startLabel: "Start",
                        endLabel: "End",
                        spanLabel: "Duration",
                        valueFormatter: (h: number) => `${Math.floor(h).toString().padStart(2, "0")}:${((h % 1) * 60).toString().padStart(2, "0")}`,
                        spanFormatter: (s: number) => `${Math.floor(s)}h ${Math.round((s % 1) * 60)}m`,
                      }
                    }
                    color={chartProps?.color && chartProps.color !== "theme" ? chartProps.color : effectivePrimary || "var(--chart-1, #3b82f6)"}
                    selectionColor={chartProps?.selectionColor && chartProps.selectionColor !== "theme" ? chartProps.selectionColor : undefined}
                    height={resolvedHeight}
                    orientation={chartProps?.orientation ?? "horizontal"}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? false}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    tooltipMode={chartProps?.tooltipMode ?? "bounds-and-span"}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "bar-interactive":
              case "recharts-bar-interactive":
                return (
                  <RechartsInteractiveBars
                    data={chartProps?.data || sampleInteractiveBarsData}
                    categoryKey="quarter"
                    series={chartProps?.series || sampleInteractiveBarsSeries}
                    height={resolvedHeight}
                    layout={chartProps?.layout ?? "vertical"}
                    showGrid={chartProps?.showGrid ?? true}
                    showLegend={chartProps?.showLegend ?? true}
                    interactiveLegend={chartProps?.interactiveLegend ?? true}
                    cursorMode={chartProps?.cursorMode ?? "band-and-bar"}
                    valueLabel={chartProps?.valueLabel ?? "none"}
                    lockOnClick={chartProps?.lockOnClick ?? true}
                    lockOnTouch={chartProps?.lockOnTouch ?? true}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "line-basic":
                return (
                  <RechartsLineBasic
                    data={sampleLineData}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "line-multiple":
                return (
                  <RechartsLineMultiple
                    data={sampleMultiSeriesData}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "area-basic":
                return (
                  <RechartsAreaBasic
                    data={sampleLineData}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "bar-basic":
                return (
                  <RechartsBarBasic
                    data={sampleBarData}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "donut-basic":
                return (
                  <RechartsDonutBasic
                    data={sampleBarData}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    {...chartProps}
                  />
                )
              case "d3-animated-line":
                return (
                  <D3AnimatedLine
                    data={sampleD3Points}
                    width={width}
                    height={resolvedHeight}
                    motion={motion && !reduced}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "d3-force-network":
                return (
                  <D3ForceNetwork
                    nodes={sampleNetworkData.nodes}
                    links={sampleNetworkData.links}
                    width={Math.max(200, width - 32)}
                    motion={motion && !reduced}
                    height={resolvedHeight}
                    {...chartProps}
                  />
                )
              case "google-line":
                return (
                  <GoogleLine
                    data={sampleLineData}
                    height={resolvedHeight}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "google-bar":
                return (
                  <GoogleBar
                    data={sampleBarData}
                    height={resolvedHeight}
                    color={effectivePrimary}
                    {...chartProps}
                  />
                )
              case "google-geochart":
                return (
                  <GoogleGeoChart
                    data={sampleGeoData}
                    height={resolvedHeight}
                    region="world"
                    color={color}
                    {...chartProps}
                  />
                )
              default:
                return (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground font-mono">
                    {registryName}
                  </div>
                )
            }
          })()
        ) : (
          <div className="lens-preview-loading">
            Preview initializes near the viewport
          </div>
        )}
      </div>
    </ChartPreviewBoundary>
  )
}
