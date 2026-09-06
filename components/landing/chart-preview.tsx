"use client"
import dynamic from "next/dynamic"
import { PlotLineChart } from "@/components/charts/plot-line-chart"
import { ChartBoundary } from "@/components/charts/chart-boundary"
import { activity } from "./demo-data"
import type { ChartEntry } from "./chart-catalog"

const D3Plot = dynamic(() => import("@/components/charts/d3-plot").then(m => m.D3Plot), {
  ssr: false,
  loading: () => <div className="chart-fallback" role="status">Loading preview…</div>,
})

const GoogleGeoChart = dynamic(() => import("@/components/charts/google").then(m => m.GoogleGeoChart), {
  ssr: false,
  loading: () => <div className="chart-fallback" role="status">Loading GeoChart…</div>,
})

const GoogleLineChart = dynamic(() => import("@/components/charts/google").then(m => m.GoogleLineChart), {
  ssr: false,
  loading: () => <div className="chart-fallback" role="status">Loading chart…</div>,
})

const GoogleBarChart = dynamic(() => import("@/components/charts/google").then(m => m.GoogleBarChart), {
  ssr: false,
  loading: () => <div className="chart-fallback" role="status">Loading chart…</div>,
})

const geoDemoData = [
  { country: "United States", users: 1240 },
  { country: "India", users: 980 },
  { country: "Germany", users: 430 },
  { country: "United Kingdom", users: 390 },
  { country: "Brazil", users: 320 },
  { country: "Japan", users: 290 },
  { country: "France", users: 260 },
  { country: "Canada", users: 240 },
  { country: "Australia", users: 210 },
]

const googleLineData = [
  ["Month", "Signals", "Confidence"],
  ["Jan", 30, 45],
  ["Feb", 48, 52],
  ["Mar", 65, 59],
  ["Apr", 80, 72],
  ["May", 95, 88],
]

const googleBarData = [
  ["Region", "Latency"],
  ["US-East", 24],
  ["EU-West", 38],
  ["AP-South", 52],
  ["AP-East", 64],
]

export function ChartPreview({ kind, compact = false }: { kind: ChartEntry["kind"]; compact?: boolean }) {
  if (kind === "line" || kind === "area") {
    return (
      <ChartBoundary>
        <PlotLineChart data={activity} compact={compact} area={kind === "area"} label="Sessions" />
      </ChartBoundary>
    )
  }

  if (kind === "geochart") {
    return (
      <ChartBoundary>
        <GoogleGeoChart
          data={geoDemoData}
          regionKey="country"
          valueKey="users"
          bordered={false}
          height={compact ? 190 : 320}
          className="w-full h-full"
        />
      </ChartBoundary>
    )
  }

  if (kind === "google-line") {
    return (
      <ChartBoundary>
        <GoogleLineChart
          data={googleLineData}
          smooth
          bordered={false}
          height={compact ? "100%" : 320}
          className="w-full h-full"
        />
      </ChartBoundary>
    )
  }

  if (kind === "google-bar") {
    return (
      <ChartBoundary>
        <GoogleBarChart
          data={googleBarData}
          horizontal
          bordered={false}
          height={compact ? "100%" : 320}
          className="w-full h-full"
        />
      </ChartBoundary>
    )
  }

  return (
    <ChartBoundary>
      <D3Plot kind={kind} compact={compact} />
    </ChartBoundary>
  )
}
