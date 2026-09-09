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

export interface GeoChartDatum {
  region: string
  value: number
  [key: string]: unknown
}

export interface GoogleGeoChartProps {
  data: GeoChartDatum[]
  regionKey?: string
  valueKey?: string
  region?: string
  displayMode?: "regions" | "markers"
  color?: string
  colorMin?: string
  colorMax?: string
  height?: number | string
  className?: string
  onRegionSelect?: (regionCode: string) => void
}

/**
 * Google GeoChart Component
 * Renders statistical geographic choropleths with automatic data transformation and ResizeObserver redraw.
 */
export function GoogleGeoChart({
  data,
  regionKey = "region",
  valueKey = "value",
  region = "world",
  displayMode = "regions",
  color,
  colorMin = "var(--chart-grid-emphasis)",
  colorMax = "var(--chart-1)",
  height = 360,
  className,
  onRegionSelect,
}: GoogleGeoChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const chartInstanceRef = React.useRef<GoogleVisualizationChart | null>(null)
  const [status, setStatus] = React.useState<GoogleChartsLoaderState>("loading")
  const [errorMsg, setErrorMsg] = React.useState<string>()

  // Initialize and load geochart package
  React.useEffect(() => {
    let active = true

    loadGoogleChartsPackages(["geochart"])
      .then(() => {
        if (active) setStatus("ready")
      })
      .catch((err) => {
        if (active) {
          setStatus("error")
          setErrorMsg(err.message)
        }
      })

    return () => {
      active = false
    }
  }, [])

  // Draw chart when ready or data changes
  const drawChart = React.useCallback(() => {
    if (status !== "ready" || !chartRef.current || !window.google?.visualization) return

    // Transform application data to DataTable
    const dataTable = new window.google.visualization.DataTable()
    dataTable.addColumn("string", "Region")
    dataTable.addColumn("number", "Value")
    dataTable.addColumn({ type: "string", role: "tooltip", p: { html: true } })

    const css = getComputedStyle(chartRef.current)
    const gridColor = css.getPropertyValue("--chart-grid").trim() || "#27272a"
    const surfaceColor = css.getPropertyValue("--muted").trim() || "#18181b"
    const targetMax = color || colorMax
    const resolvedMin = resolveGoogleColor(colorMin, chartRef.current, "#1e293b")
    const resolvedMax = resolveGoogleColor(targetMax, chartRef.current, "#10b981")

    data.forEach((item) => {
      const regionName = String(item[regionKey])
      const safeRegionName = escapeGoogleTooltipText(regionName)
      const val = Number(item[valueKey])
      const displayVal = Number.isFinite(val) ? val.toLocaleString() : String(item[valueKey])
      const tooltipHtml = `
        <div class="plotcn-tooltip-card">
          <div class="plotcn-tooltip-header">
            <span class="plotcn-tooltip-indicator" style="background-color: ${resolvedMax};"></span>
            <span class="plotcn-tooltip-title">${safeRegionName}</span>
          </div>
          <div class="plotcn-tooltip-metric">
            <span class="plotcn-tooltip-label">${valueKey}</span>
            <span class="plotcn-tooltip-value">${displayVal}</span>
          </div>
        </div>
      `.trim()
      dataTable.addRow([regionName, val, tooltipHtml])
    })

    const options = {
      region,
      displayMode,
      backgroundColor: "transparent",
      datalessRegionColor: surfaceColor,
      defaultColor: gridColor,
      colorAxis: {
        colors: [resolvedMin, resolvedMax],
      },
      legend: "none",
      keepAspectRatio: true,
      tooltip: {
        isHtml: true,
      },
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new window.google.visualization.GeoChart(chartRef.current)
      if (onRegionSelect) {
        window.google.visualization.events.addListener(chartInstanceRef.current, "select", () => {
          const selection = chartInstanceRef.current?.getSelection?.()
          if (selection && selection.length > 0) {
            const row = selection[0].row
            if (row !== null && row !== undefined && dataTable.getValue) {
              const regionCode = dataTable.getValue(row, 0)
              onRegionSelect(String(regionCode))
            }
          }
        })
      }
    }

    chartInstanceRef.current?.draw(dataTable, options)
  }, [status, data, regionKey, valueKey, region, displayMode, color, colorMin, colorMax, onRegionSelect])

  React.useEffect(() => {
    drawChart()
  }, [drawChart])

  // Handle ResizeObserver debounced redraw
  React.useEffect(() => {
    if (!chartRef.current) return

    let timeoutId: NodeJS.Timeout
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        drawChart()
      }, 150)
    })

    observer.observe(chartRef.current)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [drawChart])

  // Cleanup chart instance ONLY on component unmount
  React.useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.clearChart?.()
        chartInstanceRef.current = null
      }
    }
  }, [])

  React.useEffect(() => {
    const surface = chartRef.current?.closest("[data-theme]")
    const observer = new MutationObserver(drawChart)
    if (surface) observer.observe(surface, { attributes: true, attributeFilter: ["data-theme"] })
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", drawChart)
    return () => { observer.disconnect(); media.removeEventListener("change", drawChart) }
  }, [drawChart])

  return (
    <GoogleChartContainer
      status={status}
      errorMessage={errorMsg}
      height={height}
      className={className}
      chartRef={chartRef}
      title={`GeoChart of ${region}`}
      onRetry={() => {
        setStatus("loading")
        loadGoogleChartsPackages(["geochart"])
          .then(() => setStatus("ready"))
          .catch((err) => {
            setStatus("error")
            setErrorMsg(err.message)
          })
      }}
    >
      <span className="sr-only">Interactive choropleth visualization displaying statistical regional values.</span>
    </GoogleChartContainer>
  )
}
