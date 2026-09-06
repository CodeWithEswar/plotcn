import type { GoogleChartBaseOptions, GoogleGeoChartOptions } from "./types"

/**
 * Standard Plotcn theme configuration for core Google Charts.
 * Replaces default white backgrounds and bright saturation with dark zinc aesthetic.
 */
export function getGoogleChartTheme(
  userOptions: Partial<GoogleChartBaseOptions> = {}
): Record<string, unknown> {
  const baseTheme: GoogleChartBaseOptions = {
    backgroundColor: "transparent",
    colors: [
      "#f4f4f5", // zinc-100 (primary)
      "#a1a1aa", // zinc-400
      "#71717a", // zinc-500
      "#52525b", // zinc-600
      "#3f3f46", // zinc-700
    ],
    legend: {
      position: "bottom",
      textStyle: {
        color: "#a1a1aa",
        fontSize: 11,
      },
    },
    hAxis: {
      textStyle: {
        color: "#71717a",
        fontSize: 11,
      },
      gridlines: {
        color: "rgba(255, 255, 255, 0.06)",
        count: 5,
      },
      baselineColor: "rgba(255, 255, 255, 0.12)",
    },
    vAxis: {
      textStyle: {
        color: "#71717a",
        fontSize: 11,
      },
      gridlines: {
        color: "rgba(255, 255, 255, 0.06)",
        count: 5,
      },
      baselineColor: "rgba(255, 255, 255, 0.12)",
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
        color: "#fafafa",
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
