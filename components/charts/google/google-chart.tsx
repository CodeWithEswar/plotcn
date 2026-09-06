"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import {
  loadGoogleCharts,
  getPackageForChartType,
  getGoogleChartTheme,
  getGoogleGeoChartTheme,
  buildDataTable,
  type GoogleChartType,
  type GoogleChartsStatus,
  type GoogleChartAccessibility,
  type GoogleChartInstance,
  type TabularData,
} from "@/lib/google-charts"
import { GoogleChartContainer } from "./google-chart-container"

export interface GoogleChartProps {
  chartType: GoogleChartType
  data: TabularData | Array<Record<string, unknown>>
  options?: Record<string, unknown>
  height?: number | string
  className?: string
  accessibility?: GoogleChartAccessibility
  onSelect?: (selection: Array<{ row?: number; column?: number }>) => void
  bordered?: boolean
}

export function GoogleChart({
  chartType,
  data,
  options = {},
  height = 360,
  className = "",
  accessibility,
  onSelect,
  bordered = true,
}: GoogleChartProps) {
  const [status, setStatus] = useState<GoogleChartsStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<GoogleChartInstance | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const pkg = getPackageForChartType(chartType)
  const isEmpty = !data || !Array.isArray(data) || data.length === 0

  const drawChart = useCallback(() => {
    if (!window.google?.visualization || !chartRef.current || isEmpty) return

    try {
      const dataTable = buildDataTable(window.google, data)

      // Create instance if not already existing
      if (!chartInstanceRef.current) {
        const ChartConstructor = (window.google.visualization as Record<string, any>)[chartType]
        if (!ChartConstructor) {
          throw new Error(`Chart type "${chartType}" is not loaded in package "${pkg}".`)
        }
        chartInstanceRef.current = new ChartConstructor(chartRef.current)

        // Event listener for user selection
        if (onSelect && window.google.visualization.events) {
          window.google.visualization.events.addListener(
            chartInstanceRef.current,
            "select",
            () => {
              const selection = chartInstanceRef.current?.getSelection?.() || []
              onSelect(selection)
            }
          )
        }
      }

      // Apply Plotcn dark theme by default
      const themedOptions =
        chartType === "GeoChart"
          ? getGoogleGeoChartTheme(options)
          : getGoogleChartTheme(options)

      // Measure exact container width & height so Google Charts draws across full width
      const containerWidth = chartRef.current.clientWidth
      const containerHeight = chartRef.current.clientHeight

      const finalOptions = {
        ...themedOptions,
        ...(containerWidth > 0 ? { width: containerWidth } : {}),
        ...(containerHeight > 0
          ? { height: containerHeight }
          : typeof height === "number"
          ? { height }
          : {}),
      }

      chartInstanceRef.current?.draw(dataTable, finalOptions)
    } catch (err) {
      console.error(`[Plotcn GoogleChart] Failed to render ${chartType}:`, err)
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : String(err))
    }
  }, [chartType, data, isEmpty, onSelect, options, pkg])

  const initGoogleCharts = useCallback(async () => {
    setStatus("loading")
    setErrorMessage(undefined)

    try {
      await loadGoogleCharts({ packages: [pkg] })
      setStatus("ready")
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Failed to load Google Charts.")
    }
  }, [pkg])

  useEffect(() => {
    initGoogleCharts()
  }, [initGoogleCharts])

  // Draw chart once ready and data changes
  useEffect(() => {
    if (status === "ready") {
      drawChart()
    }
  }, [status, drawChart])

  // ResizeObserver to redraw chart responsively when container changes
  useEffect(() => {
    const el = chartRef.current
    if (!el) return

    let timeoutId: NodeJS.Timeout
    let lastWidth = el.clientWidth
    let lastHeight = el.clientHeight

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (status === "ready" && el) {
          const newWidth = el.clientWidth
          const newHeight = el.clientHeight
          if (newWidth !== lastWidth || newHeight !== lastHeight) {
            lastWidth = newWidth
            lastHeight = newHeight
            drawChart()
          }
        }
      }, 60)
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(el)
    window.addEventListener("resize", handleResize)
    resizeObserverRef.current = observer

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [status, drawChart])

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current && window.google?.visualization?.events) {
        window.google.visualization.events.removeAllListeners(chartInstanceRef.current)
        chartInstanceRef.current.clearChart?.()
        chartInstanceRef.current = null
      }
    }
  }, [])

  return (
    <GoogleChartContainer
      status={status}
      errorMessage={errorMessage}
      isEmpty={isEmpty}
      height={height}
      className={className}
      accessibility={accessibility}
      onRetry={initGoogleCharts}
      chartRef={chartRef}
      bordered={bordered}
    >
      <span className="sr-only">Plotcn Google Chart</span>
    </GoogleChartContainer>
  )
}
