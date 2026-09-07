import type { GoogleChartBaseOptions, GoogleGeoChartOptions } from "./types"

/**
 * Safely converts any CSS color (including modern oklch, lab, color(), hsl)
 * to a standard Hex or RGB(A) color string supported by Google Charts SVG engine.
 */
export function toSafeGoogleColor(colorStr: string | undefined, fallback = "#10b981"): string {
  if (!colorStr) return fallback
  const s = colorStr.trim()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) return s
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*[\d.]+/i.test(s)) return s

  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (ctx) {
        ctx.fillStyle = s
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        if (a === 255) {
          const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
          return `#${hex}`
        }
        return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`
      }
    } catch {
      // fallback
    }
  }

  return fallback
}

/**
 * Standard Plotcn theme configuration for core Google Charts.
 * Replaces default white backgrounds and bright saturation with dark zinc aesthetic.
 */
export function getGoogleChartTheme(
  userOptions: Partial<GoogleChartBaseOptions> = {}
): Record<string, unknown> {
  let colors = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#f43f5e"]
  let axisColor = "#a1a1aa"
  let gridColor = "rgba(255, 255, 255, 0.08)"
  let baselineColor = "rgba(255, 255, 255, 0.16)"
  let tooltipColor = "#fafafa"

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const style = getComputedStyle(document.documentElement)
    const read = (v: string) => style.getPropertyValue(v).trim()
    const c1 = read("--chart-1")
    const c2 = read("--chart-2")
    const c3 = read("--chart-3")
    const c4 = read("--chart-4")
    const c5 = read("--chart-5")
    if (c1) {
      colors = [
        toSafeGoogleColor(c1, "#10b981"),
        toSafeGoogleColor(c2, "#0ea5e9"),
        toSafeGoogleColor(c3, "#8b5cf6"),
        toSafeGoogleColor(c4, "#f59e0b"),
        toSafeGoogleColor(c5, "#f43f5e"),
      ]
    }
    const axis = read("--chart-axis")
    if (axis) axisColor = toSafeGoogleColor(axis, "#a1a1aa")
    const grid = read("--chart-grid")
    if (grid) gridColor = toSafeGoogleColor(grid, "rgba(255, 255, 255, 0.08)")
    const zero = read("--chart-zero-line")
    if (zero) baselineColor = toSafeGoogleColor(zero, "rgba(255, 255, 255, 0.16)")
    const tt = read("--chart-tooltip-foreground")
    if (tt) tooltipColor = toSafeGoogleColor(tt, "#fafafa")
  }

  const safeUserOptions = { ...userOptions }
  if (Array.isArray(safeUserOptions.colors)) {
    safeUserOptions.colors = safeUserOptions.colors.map((c, i) =>
      typeof c === "string" ? toSafeGoogleColor(c, colors[i % colors.length]) : c
    )
  }

  const baseTheme: GoogleChartBaseOptions = {
    backgroundColor: "transparent",
    colors,
    legend: {
      position: "bottom",
      textStyle: {
        color: axisColor,
        fontSize: 11,
      },
    },
    hAxis: {
      textStyle: {
        color: axisColor,
        fontSize: 11,
      },
      gridlines: {
        color: gridColor,
        count: 5,
      },
      baselineColor,
    },
    vAxis: {
      textStyle: {
        color: axisColor,
        fontSize: 11,
      },
      gridlines: {
        color: gridColor,
        count: 5,
      },
      baselineColor,
    },
    chartArea: {
      left: 36,
      top: 14,
      width: "86%",
      height: "74%",
    },
    tooltip: {
      isHtml: true,
      ignoreBounds: false,
      textStyle: {
        color: tooltipColor,
        fontSize: 12,
      },
    },
  }

  return deepMerge(baseTheme as unknown as Record<string, unknown>, userOptions as Record<string, unknown>)
}

/**
 * Standard Plotcn theme configuration for Google GeoChart.
 * Uses refined monochrome zinc gradients for choropleth maps.
 */
export function getGoogleGeoChartTheme(
  userOptions: Partial<GoogleGeoChartOptions> = {}
): Record<string, unknown> {
  const baseGeoTheme: GoogleGeoChartOptions = {
    backgroundColor: {
      fill: "transparent",
      stroke: "transparent",
      strokeWidth: 0,
    },
    datalessRegionColor: "#141416",
    defaultColor: "#27272a",
    colorAxis: {
      colors: [
        "#27272a", // Low values: dark zinc
        "#52525b",
        "#a1a1aa",
        "#f4f4f5", // High values: light zinc/white
      ],
    },
    legend: {
      textStyle: {
        color: "#71717a",
        fontSize: 10,
      },
    },
    tooltip: {
      isHtml: true,
      ignoreBounds: false,
      textStyle: {
        color: "#fafafa",
        fontSize: 12,
      },
    },
    keepAspectRatio: true,
  }

  return deepMerge(baseGeoTheme as unknown as Record<string, unknown>, userOptions as Record<string, unknown>)
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target }
  if (!source) return output

  for (const key of Object.keys(source)) {
    const sourceVal = source[key]
    const targetVal = target[key]

    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      output[key] = deepMerge(targetVal as Record<string, unknown>, sourceVal as Record<string, unknown>)
    } else if (sourceVal !== undefined) {
      output[key] = sourceVal
    }
  }

  return output
}
