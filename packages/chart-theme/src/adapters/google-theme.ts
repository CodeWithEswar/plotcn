import type { ChartThemeSnapshot } from "../tokens/types"

export interface GoogleThemeOptions {
  backgroundColor?: string | { fill?: string; stroke?: string; strokeWidth?: number }
  colors?: string[]
  legend?: {
    textStyle?: { color?: string; fontSize?: number }
    position?: string
  }
  hAxis?: {
    title?: string
    titleTextStyle?: { color?: string; fontSize?: number }
    textStyle?: { color?: string; fontSize?: number }
    gridlines?: { color?: string; count?: number }
    baselineColor?: string
  }
  vAxis?: {
    title?: string
    titleTextStyle?: { color?: string; fontSize?: number }
    textStyle?: { color?: string; fontSize?: number }
    gridlines?: { color?: string; count?: number }
    baselineColor?: string
  }
  tooltip?: {
    textStyle?: { color?: string; fontSize?: number }
    isHtml?: boolean
  }
  [key: string]: unknown
}

/**
 * Maps a Plotcn ChartThemeSnapshot into Google ChartOptions.
 * Enables Google Charts to seamlessly respect the unified Plotcn semantic theme.
 * Section 9.59, 9.60.
 */
export function getGoogleChartThemeOptions(
  snapshot: ChartThemeSnapshot,
  overrides?: Partial<GoogleThemeOptions>
): GoogleThemeOptions {
  const baseOptions: GoogleThemeOptions = {
    backgroundColor: {
      fill: snapshot.background,
      stroke: snapshot.border,
      strokeWidth: 0,
    },
    colors: [...snapshot.series],
    legend: {
      textStyle: {
        color: snapshot.foreground,
        fontSize: 12,
      },
    },
    hAxis: {
      textStyle: {
        color: snapshot.axis,
        fontSize: 11,
      },
      gridlines: {
        color: snapshot.grid,
      },
      baselineColor: snapshot.zeroLine,
    },
    vAxis: {
      textStyle: {
        color: snapshot.axis,
        fontSize: 11,
      },
      gridlines: {
        color: snapshot.grid,
      },
      baselineColor: snapshot.zeroLine,
    },
    tooltip: {
      textStyle: {
        color: snapshot.tooltipForeground,
        fontSize: 12,
      },
      isHtml: true,
    },
  }

  if (!overrides) {
    return baseOptions
  }

  // Deep merge key options
  return {
    ...baseOptions,
    ...overrides,
    backgroundColor: overrides.backgroundColor ?? baseOptions.backgroundColor,
    colors: overrides.colors ?? baseOptions.colors,
    legend: {
      ...baseOptions.legend,
      ...overrides.legend,
      textStyle: {
        ...baseOptions.legend?.textStyle,
        ...overrides.legend?.textStyle,
      },
    },
    hAxis: {
      ...baseOptions.hAxis,
      ...overrides.hAxis,
      textStyle: {
        ...baseOptions.hAxis?.textStyle,
        ...overrides.hAxis?.textStyle,
      },
      gridlines: {
        ...baseOptions.hAxis?.gridlines,
        ...overrides.hAxis?.gridlines,
      },
    },
    vAxis: {
      ...baseOptions.vAxis,
      ...overrides.vAxis,
      textStyle: {
        ...baseOptions.vAxis?.textStyle,
        ...overrides.vAxis?.textStyle,
      },
      gridlines: {
        ...baseOptions.vAxis?.gridlines,
        ...overrides.vAxis?.gridlines,
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      ...overrides.tooltip,
      textStyle: {
        ...baseOptions.tooltip?.textStyle,
        ...overrides.tooltip?.textStyle,
      },
    },
  }
}
