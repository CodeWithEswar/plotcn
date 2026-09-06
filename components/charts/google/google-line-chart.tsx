"use client"

import React, { useMemo } from "react"
import { GoogleChart } from "./google-chart"
import type {
  GoogleChartBaseOptions,
  GoogleChartAccessibility,
  TabularData,
} from "@/lib/google-charts"

export interface GoogleLineChartProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: TabularData | readonly T[]
  smooth?: boolean
  lineWidth?: number
  pointSize?: number
  options?: Partial<GoogleChartBaseOptions & { curveType?: "function" | "none"; lineWidth?: number; pointSize?: number }>
  height?: number | string
  className?: string
  accessibility?: GoogleChartAccessibility
  onSelect?: (selection: Array<{ row?: number; column?: number }>) => void
  bordered?: boolean
}

export function GoogleLineChart<T extends Record<string, unknown>>({
  data,
  smooth = true,
  lineWidth = 2.5,
  pointSize = 4,
  options = {},
  height = 320,
  className = "",
  accessibility,
  onSelect,
  bordered = true,
}: GoogleLineChartProps<T>) {
  const mergedOptions = useMemo(() => {
    return {
      curveType: smooth ? "function" : "none",
      lineWidth,
      pointSize,
      ...options,
    }
  }, [smooth, lineWidth, pointSize, options])

  return (
    <GoogleChart
      chartType="LineChart"
      data={data as TabularData}
      options={mergedOptions}
      height={height}
      className={className}
      accessibility={accessibility}
      onSelect={onSelect}
      bordered={bordered}
    />
  )
}
