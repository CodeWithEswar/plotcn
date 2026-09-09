"use client"

import * as React from "react"
import { getChartColorRoles, type ChartColorRoleDef } from "@/lib/charts/chart-colors"

export interface ChartColorContextValue {
  registryName: string
  colorRoles: readonly ChartColorRoleDef[]
  customColors: Record<string, string>
  setColor: (propName: string, color: string) => void
  resetColor: (propName: string) => void
  resetAllColors: () => void
  swapColors: () => void
  hasCustomizedColors: boolean
  cssVariables: React.CSSProperties
}

const ChartColorContext = React.createContext<ChartColorContextValue | null>(null)

export function ChartColorProvider({
  registryName,
  children,
}: {
  registryName: string
  children: React.ReactNode
}) {
  const colorRoles = React.useMemo(() => getChartColorRoles(registryName), [registryName])
  const [customColors, setCustomColors] = React.useState<Record<string, string>>({})

  const setColor = React.useCallback((propName: string, color: string) => {
    setCustomColors((prev) => ({ ...prev, [propName]: color }))
  }, [])

  const resetColor = React.useCallback((propName: string) => {
    setCustomColors((prev) => {
      const next = { ...prev }
      delete next[propName]
      return next
    })
  }, [])

  const resetAllColors = React.useCallback(() => {
    setCustomColors({})
  }, [])

  const swapColors = React.useCallback(() => {
    if (colorRoles.length < 2) return
    const [first, second] = colorRoles
    const val1 = customColors[first.propName] || first.defaultToken
    const val2 = customColors[second.propName] || second.defaultToken
    setCustomColors((prev) => ({
      ...prev,
      [first.propName]: val2,
      [second.propName]: val1,
    }))
  }, [colorRoles, customColors])

  const hasCustomizedColors = React.useMemo(() => {
    return Object.keys(customColors).some(
      (k) => customColors[k] && customColors[k] !== "theme"
    )
  }, [customColors])

  // Derive CSS variable overrides for chart containers
  const cssVariables = React.useMemo(() => {
    const vars: Record<string, string> = {}
    const primary =
      customColors["color"] ||
      customColors["primaryColor"] ||
      customColors["positiveColor"] ||
      customColors["aboveColor"] ||
      customColors["valueColor"]
    const secondary =
      customColors["referenceColor"] ||
      customColors["rangeColor"] ||
      customColors["milestoneColor"] ||
      customColors["negativeColor"] ||
      customColors["belowColor"] ||
      customColors["targetColor"]

    if (primary && primary !== "theme") {
      vars["--chart-1"] = primary
      vars["--primary"] = primary
    }
    if (secondary && secondary !== "theme") {
      vars["--chart-2"] = secondary
    }

    return vars as React.CSSProperties
  }, [customColors])

  const value = React.useMemo(
    () => ({
      registryName,
      colorRoles,
      customColors,
      setColor,
      resetColor,
      resetAllColors,
      swapColors,
      hasCustomizedColors,
      cssVariables,
    }),
    [registryName, colorRoles, customColors, setColor, resetColor, resetAllColors, swapColors, hasCustomizedColors, cssVariables]
  )

  return (
    <ChartColorContext.Provider value={value}>
      {children}
    </ChartColorContext.Provider>
  )
}

export function useChartColors(): ChartColorContextValue {
  const ctx = React.useContext(ChartColorContext)
  if (!ctx) {
    return {
      registryName: "",
      colorRoles: [],
      customColors: {},
      setColor: () => {},
      resetColor: () => {},
      resetAllColors: () => {},
      swapColors: () => {},
      hasCustomizedColors: false,
      cssVariables: {},
    }
  }
  return ctx
}
