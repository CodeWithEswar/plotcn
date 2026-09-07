"use client"

import * as React from "react"
import { loadGoogleChartsPackages, type GoogleChartsLoaderState } from "./google-chart-loader"
import { GoogleChartContainer } from "./google-chart-container"

export interface GeoChartDatum {
  region: string
  value: number
  [key: string]: any
}

export interface GoogleGeoChartProps {
  data: GeoChartDatum[]
  regionKey?: string
  valueKey?: string
  region?: string
  displayMode?: "regions" | "markers"
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
  colorMin = "#1e293b",
  colorMax = "#10b981",
  height = 360,
  className,
  onRegionSelect,
}: GoogleGeoChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const chartInstanceRef = React.useRef<any>(null)
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

    data.forEach((item) => {
      dataTable.addRow([String(item[regionKey]), Number(item[valueKey])])
    })

    const options = {
      region,
      displayMode,
      backgroundColor: "transparent",
      datalessRegionColor: "#18181b",
      defaultColor: "#27272a",
      colorAxis: {
        colors: [colorMin, colorMax],
      },
      legend: "none",
      keepAspectRatio: true,
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new window.google.visualization.GeoChart(chartRef.current)
      if (onRegionSelect) {
        window.google.visualization.events.addListener(chartInstanceRef.current, "select", () => {
          const selection = chartInstanceRef.current.getSelection()
          if (selection && selection.length > 0) {
            const row = selection[0].row
            if (row !== null && row !== undefined) {
              const regionCode = dataTable.getValue(row, 0)
              onRegionSelect(String(regionCode))
            }
          }
        })
      }
    }

    chartInstanceRef.current.draw(dataTable, options)
  }, [status, data, regionKey, valueKey, region, displayMode, colorMin, colorMax, onRegionSelect])

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
      if (chartInstanceRef.current) {
        chartInstanceRef.current.clearChart?.()
        chartInstanceRef.current = null
      }
    }
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
