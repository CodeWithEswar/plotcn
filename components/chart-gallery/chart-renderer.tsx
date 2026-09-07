"use client"

import React, { Component, type ReactNode } from "react"
import dynamic from "next/dynamic"

// Error boundary to protect gallery and detail previews
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ChartPreviewBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chart preview error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <span className="text-xs font-mono text-destructive">Preview Unavailable</span>
            <span className="mt-1 text-[11px] text-muted-foreground">
              {this.state.error?.message || "Failed to render visualization"}
            </span>
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
  () => import("@/registry/google/google-geochart").then((m) => m.GoogleGeoChart),
  { ssr: false }
)

export interface DynamicChartRendererProps {
  registryName: string
  height?: number | string
  className?: string
}

export function DynamicChartRenderer({
  registryName,
  height = 240,
  className,
}: DynamicChartRendererProps) {
  const numHeight = typeof height === "number" ? height : parseInt(String(height), 10) || 240

  return (
    <ChartPreviewBoundary>
      <div className={className} style={{ width: "100%", height }}>
        {(() => {
          switch (registryName) {
            case "line-basic":
              return <RechartsLineBasic data={sampleLineData} height={height} />
            case "line-multiple":
              return <RechartsLineMultiple data={sampleMultiSeriesData} height={height} />
            case "area-basic":
              return <RechartsAreaBasic data={sampleLineData} height={height} />
            case "bar-basic":
              return <RechartsBarBasic data={sampleBarData} height={height} />
            case "d3-animated-line":
              return <D3AnimatedLine data={sampleD3Points} height={numHeight} />
            case "d3-force-network":
              return (
                <D3ForceNetwork
                  nodes={sampleNetworkData.nodes}
                  links={sampleNetworkData.links}
                  height={numHeight}
                />
              )
            case "google-line":
              return <GoogleLine data={sampleLineData} height={height} />
            case "google-bar":
              return <GoogleBar data={sampleBarData} height={height} />
            case "google-geochart":
              return <GoogleGeoChart data={sampleGeoData} height={height} region="world" />
            default:
              return (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground font-mono">
                  {registryName}
                </div>
              )
          }
        })()}
      </div>
    </ChartPreviewBoundary>
  )
}
