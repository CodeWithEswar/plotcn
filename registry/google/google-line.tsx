"use client"

import * as React from "react"
import {
  loadGoogleChartsPackages,
  resolveGoogleColor,
  escapeGoogleTooltipText,
  type GoogleChartsLoaderState,
  type GoogleVisualizationChart,
} from "./google-chart-loader"
import { GoogleChartContainer } from "./google-chart-container"

export interface GoogleLineDatum {
  label: string
  value: number
  [key: string]: unknown
}

export interface GoogleLineProps {
  data: GoogleLineDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  curveType?: "function" | "none"
  pointSize?: number
  showGrid?: boolean
  loading?: boolean
  error?: string | null
  className?: string
}

export function GoogleLine({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "var(--chart-1)",
  height = 320,
  curveType = "function",
  pointSize = 0,
  showGrid = true,
  loading = false,
  error = null,
  className,
}: GoogleLineProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const chartInstanceRef = React.useRef<GoogleVisualizationChart | null>(null)
  const [loaderStatus, setLoaderStatus] = React.useState<GoogleChartsLoaderState>("loading")

  React.useEffect(() => {
    loadGoogleChartsPackages(["corechart"])
      .then(() => setLoaderStatus("ready"))
      .catch(() => setLoaderStatus("error"))
  }, [])

  const effectiveStatus: GoogleChartsLoaderState = loading
    ? "loading"
    : error
      ? "error"
      : loaderStatus

  const drawChart = React.useCallback(() => {
    if (effectiveStatus !== "ready" || !chartRef.current || !window.google?.visualization) return

    const css = getComputedStyle(chartRef.current)
    const resolvedColor = resolveGoogleColor(color, chartRef.current, "#f4f4f5")
    const axisColor = css.getPropertyValue("--chart-axis").trim() || "#a1a1aa"
    const gridColor = css.getPropertyValue("--chart-grid").trim() || "rgba(255,255,255,0.08)"

    const dataTable = new window.google.visualization.DataTable()
    dataTable.addColumn("string", "Label")
    dataTable.addColumn("number", "Value")
    dataTable.addColumn({ type: "string", role: "tooltip", p: { html: true } })

    data.forEach((item) => {
      const label = String(item[labelKey])
      const safeLabel = escapeGoogleTooltipText(label)
      const val = Number(item[valueKey])
      const displayVal = Number.isFinite(val) ? val.toLocaleString() : String(item[valueKey])
      const tooltipHtml = `
        <div class="plotcn-tooltip-card">
          <div class="plotcn-tooltip-header">
            <span class="plotcn-tooltip-indicator" style="background-color: ${resolvedColor};"></span>
            <span class="plotcn-tooltip-title">${safeLabel}</span>
          </div>
          <div class="plotcn-tooltip-metric">
            <span class="plotcn-tooltip-label">${valueKey}</span>
            <span class="plotcn-tooltip-value">${displayVal}</span>
          </div>
        </div>
      `.trim()
      dataTable.addRow([label, val, tooltipHtml])
    })

    const options = {
      backgroundColor: "transparent",
      colors: [resolvedColor],
      curveType: curveType,
      pointSize: pointSize,
      legend: "none",
      hAxis: {
        textStyle: { color: axisColor, fontSize: 11 },
        baselineColor: gridColor,
        gridlines: { color: "transparent" },
      },
      vAxis: {
        textStyle: { color: axisColor, fontSize: 11 },
        baselineColor: gridColor,
        gridlines: { color: showGrid ? gridColor : "transparent" },
      },
      tooltip: {
        isHtml: true,
      },
      chartArea: { width: "85%", height: "75%" },
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new window.google.visualization.LineChart(chartRef.current)
    }

    chartInstanceRef.current.draw(dataTable, options)
  }, [effectiveStatus, data, labelKey, valueKey, color, curveType, pointSize, showGrid])

  // Redraw chart on prop update
  React.useEffect(() => {
    drawChart()
  }, [drawChart])

  // ResizeObserver for responsive redraw
  React.useEffect(() => {
    if (!chartRef.current) return
    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(drawChart)
    })
    observer.observe(chartRef.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [drawChart])

  // Unmount cleanup ONLY
  React.useEffect(() => {
    return () => {
      chartInstanceRef.current?.clearChart?.()
      chartInstanceRef.current = null
    }
  }, [])

  React.useEffect(() => {
    const surface = chartRef.current?.closest("[data-theme]")
    const observer = new MutationObserver(drawChart)
    if (surface) observer.observe(surface, { attributes: true, attributeFilter: ["data-theme"] })
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] })
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", drawChart)
    return () => { observer.disconnect(); media.removeEventListener("change", drawChart) }
  }, [drawChart])

  return (
    <GoogleChartContainer
      status={effectiveStatus}
      errorMessage={typeof error === "string" ? error : undefined}
      height={height}
      className={className}
      chartRef={chartRef}
      title="Google Line Chart"
    >
      <span className="sr-only">Line chart rendered with Google Charts corechart package.</span>
    </GoogleChartContainer>
  )
}
