"use client"

import * as React from "react"
import { loadGoogleChartsPackages, type GoogleChartsLoaderState } from "./google-chart-loader"
import { GoogleChartContainer } from "./google-chart-container"

export interface GoogleLineDatum {
  label: string
  value: number
  [key: string]: any
}

export interface GoogleLineProps {
  data: GoogleLineDatum[]
  valueKey?: string
  labelKey?: string
  color?: string
  height?: number | string
  className?: string
}

export function GoogleLine({
  data,
  valueKey = "value",
  labelKey = "label",
  color = "#10b981",
  height = 320,
  className,
}: GoogleLineProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const chartInstanceRef = React.useRef<any>(null)
  const [status, setStatus] = React.useState<GoogleChartsLoaderState>("loading")

  React.useEffect(() => {
    loadGoogleChartsPackages(["corechart"])
      .then(() => setStatus("ready"))
      .catch(() => setStatus("error"))
  }, [])

  const drawChart = React.useCallback(() => {
    if (status !== "ready" || !chartRef.current || !window.google?.visualization) return

    const dataTable = new window.google.visualization.DataTable()
    dataTable.addColumn("string", "Label")
    dataTable.addColumn("number", "Value")

    data.forEach((item) => {
      dataTable.addRow([String(item[labelKey]), Number(item[valueKey])])
    })

    const options = {
      backgroundColor: "transparent",
      colors: [color],
      curveType: "function",
      legend: "none",
      hAxis: {
        textStyle: { color: "#71717a", fontSize: 11 },
        baselineColor: "#27272a",
        gridlines: { color: "transparent" },
      },
      vAxis: {
        textStyle: { color: "#71717a", fontSize: 11 },
        baselineColor: "#27272a",
        gridlines: { color: "#27272a" },
      },
      chartArea: { width: "85%", height: "75%" },
    }

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new window.google.visualization.LineChart(chartRef.current)
    }

    chartInstanceRef.current.draw(dataTable, options)
  }, [status, data, labelKey, valueKey, color])

  React.useEffect(() => {
    drawChart()
  }, [drawChart])

  return (
    <GoogleChartContainer
      status={status}
      height={height}
      className={className}
      chartRef={chartRef}
      title="Google Line Chart"
    >
      <span className="sr-only">Line chart rendered with Google Charts corechart package.</span>
    </GoogleChartContainer>
  )
}
