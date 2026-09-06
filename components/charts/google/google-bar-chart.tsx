"use client"

import React, { useMemo } from "react"
import { GoogleChart } from "./google-chart"
import type {
  GoogleChartBaseOptions,
  GoogleChartAccessibility,
  TabularData,
} from "@/lib/google-charts"

export interface GoogleBarChartProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: TabularData | readonly T[]
  horizontal?: boolean
  barWidth?: string | number
  options?: Partial<GoogleChartBaseOptions & { bar?: { groupWidth?: string | number } }>
  height?: number | string
  className?: string
  accessibility?: GoogleChartAccessibility
  onSelect?: (selection: Array<{ row?: number; column?: number }>) => void
  bordered?: boolean
}

export function GoogleBarChart<T extends Record<string, unknown>>({
  data,
  horizontal = false,
  barWidth = "60%",
  options = {},
  height = 320,
  className = "",
  accessibility,
  onSelect,
  bordered = true,
}: GoogleBarChartProps<T>) {
  const mergedOptions = useMemo(() => {
    return {
      bar: { groupWidth: barWidth },
      ...options,
    }
  }, [barWidth, options])

  return (
    <GoogleChart
      chartType={horizontal ? "BarChart" : "ColumnChart"}
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
