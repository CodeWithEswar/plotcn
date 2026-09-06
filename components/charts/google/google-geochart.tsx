"use client"

import React, { useMemo } from "react"
import { GoogleChart } from "./google-chart"
import type {
  GoogleGeoChartOptions,
  GoogleChartAccessibility,
  TabularData,
} from "@/lib/google-charts"

export interface GoogleGeoChartProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: TabularData | readonly T[]
  regionKey?: keyof T
  valueKey?: keyof T
  labelKey?: keyof T
  region?: string
  displayMode?: "regions" | "markers" | "auto"
  resolution?: "countries" | "provinces" | "metros"
  googleOptions?: Partial<GoogleGeoChartOptions>
  height?: number | string
  className?: string
  accessibility?: GoogleChartAccessibility
  onRegionSelect?: (regionCode: string) => void
  bordered?: boolean
  tooltipFormatter?: (item: T) => string
}

export function GoogleGeoChart<T extends Record<string, unknown>>({
  data,
  regionKey,
  valueKey,
  labelKey,
  region = "world",
  displayMode = "regions",
  resolution = "countries",
  googleOptions = {},
  height = 380,
  className = "",
  accessibility,
  onRegionSelect,
  bordered = true,
  tooltipFormatter,
}: GoogleGeoChartProps<T>) {
  // Convert object array to standard 2D array if object records provided
  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    // If already 2D array format e.g. [["Country", "Value"], ["IN", 100]]
    if (Array.isArray(data[0])) {
      return data as TabularData
    }

    const objectRows = data as unknown as readonly T[]
    const rKey = regionKey || ("region" as keyof T) || ("country" as keyof T) || (Object.keys(objectRows[0])[0] as keyof T)
    const vKey = valueKey || ("value" as keyof T) || ("users" as keyof T) || (Object.keys(objectRows[0])[1] as keyof T)

    const header = [
      labelKey ? String(labelKey) : "Region",
      String(vKey),
      { role: "tooltip", type: "string", p: { html: true } },
    ]

    const rows = objectRows.map((item) => {
      const regionVal = String(item[rKey] ?? "")
      const numVal = Number(item[vKey]) || 0
      const formattedNum = numVal.toLocaleString()
      const metricLabel = labelKey ? String(item[labelKey]) : String(vKey)

      const tooltipContent = tooltipFormatter
        ? tooltipFormatter(item)
        : `<div class="plotcn-tooltip-card"><div class="plotcn-tooltip-header"><span class="plotcn-tooltip-indicator"></span><span class="plotcn-tooltip-title">${regionVal}</span></div><div class="plotcn-tooltip-metric"><span class="plotcn-tooltip-label">${metricLabel}</span><span class="plotcn-tooltip-value">${formattedNum}</span></div></div>`

      return [
        item[rKey],
        numVal,
        tooltipContent,
      ]
    })

    return [header, ...rows]
  }, [data, regionKey, valueKey, labelKey, tooltipFormatter])

  const mergedOptions: GoogleGeoChartOptions = useMemo(() => {
    return {
      region,
      displayMode,
      resolution,
      tooltip: {
        isHtml: true,
      },
      ...googleOptions,
    }
  }, [region, displayMode, resolution, googleOptions])

  const handleSelect = (selection: Array<{ row?: number; column?: number }>) => {
    if (!onRegionSelect || selection.length === 0 || selection[0].row === undefined) return

    const rowIndex = selection[0].row
    // Account for header row in processedData
    const selectedRow = processedData[rowIndex + 1]
    if (selectedRow && selectedRow[0]) {
      onRegionSelect(String(selectedRow[0]))
    }
  }

  const defaultAccessibility: GoogleChartAccessibility = {
    title: accessibility?.title || `Choropleth map for ${region}`,
    description:
      accessibility?.description ||
      `Geographic choropleth visualization displaying statistical metric distributions across ${region} regions.`,
    summary: accessibility?.summary,
  }

  return (
    <GoogleChart
      chartType="GeoChart"
      data={processedData}
      options={mergedOptions as Record<string, unknown>}
      height={height}
      className={className}
      accessibility={defaultAccessibility}
      onSelect={onRegionSelect ? handleSelect : undefined}
      bordered={bordered}
    />
  )
}
