import type { ChartThemeSnapshot, ChartPalette, ChartAccessibilityPalette } from "../tokens/types"
import { defaultLightTokens, defaultDarkTokens } from "../tokens/semantic"
import { getPalette } from "../palettes"

export interface ResolveSnapshotOptions {
  element?: Element | null
  mode?: "light" | "dark" | "system"
  palette?: ChartPalette | ChartAccessibilityPalette | string
}

// Simple in-memory cache to avoid repeated getComputedStyle calls in high-frequency loops (Section 9.58)
const snapshotCache = new WeakMap<Element, { snapshot: ChartThemeSnapshot; timestamp: number }>()

const CSS_VAR_MAP: Record<keyof Omit<ChartThemeSnapshot, "series">, string> = {
  background: "--chart-background",
  foreground: "--chart-foreground",
  mutedForeground: "--chart-muted-foreground",
  border: "--chart-border",
  grid: "--chart-grid",
  gridEmphasis: "--chart-grid-emphasis",
  axis: "--chart-axis",
  axisEmphasis: "--chart-axis-emphasis",
  zeroLine: "--chart-zero-line",
  crosshair: "--chart-crosshair",
  cursor: "--chart-cursor",
  selection: "--chart-selection",
  focus: "--chart-focus",
  positive: "--chart-positive",
  negative: "--chart-negative",
  warning: "--chart-warning",
  neutral: "--chart-neutral",
  tooltipBackground: "--chart-tooltip-background",
  tooltipForeground: "--chart-tooltip-foreground",
  tooltipMuted: "--chart-tooltip-muted",
  tooltipBorder: "--chart-tooltip-border",
  disabled: "--chart-disabled",
  hidden: "--chart-hidden",
}

/**
 * Resolves a complete ChartThemeSnapshot from DOM computed styles or static tokens.
 * Used for Canvas draw loops, Google ChartOptions generation, and vector/raster exports.
 * Section 9.58, 9.62.
 */
export function resolveThemeSnapshot(options: ResolveSnapshotOptions = {}): ChartThemeSnapshot {
  const { element, mode, palette } = options

  // Determine dark mode if DOM is available
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined"
  const targetElement = element || (isBrowser ? document.documentElement : null)

  let isDark = mode === "dark"
  if (!mode && targetElement && typeof targetElement.classList?.contains === "function") {
    isDark = targetElement.classList.contains("dark")
  }

  const baseTokens = isDark ? defaultDarkTokens : defaultLightTokens

  // If no DOM element available (e.g. SSR, tests without DOM), return base tokens with palette overrides
  if (!targetElement || typeof window === "undefined" || !window.getComputedStyle) {
    if (palette) {
      const p = getPalette(palette)
      return {
        ...baseTokens,
        series: p.series,
        positive: p.positive ?? baseTokens.positive,
        negative: p.negative ?? baseTokens.negative,
        warning: p.warning ?? baseTokens.warning,
        neutral: p.neutral ?? baseTokens.neutral,
      }
    }
    return { ...baseTokens }
  }

  // Check cache for this element
  const cached = snapshotCache.get(targetElement)
  const now = Date.now()
  if (cached && now - cached.timestamp < 1000) {
    return cached.snapshot
  }

  try {
    const computed = window.getComputedStyle(targetElement)
    const readVar = (varName: string, fallback: string): string => {
      const val = computed.getPropertyValue(varName).trim()
      if (!val) return fallback
      // If the CSS variable is raw HSL channels like "240 10% 4%" (shadcn convention), wrap in hsl()
      if (/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/.test(val)) {
        return `hsl(${val})`
      }
      return val
    }

    const series: string[] = []
    for (let i = 1; i <= 8; i++) {
      const seriesVal = readVar(`--chart-${i}`, baseTokens.series[i - 1] ?? "#888888")
      series.push(seriesVal)
    }

    const snapshot: ChartThemeSnapshot = {
      background: readVar(CSS_VAR_MAP.background, baseTokens.background),
      foreground: readVar(CSS_VAR_MAP.foreground, baseTokens.foreground),
      mutedForeground: readVar(CSS_VAR_MAP.mutedForeground, baseTokens.mutedForeground),
      border: readVar(CSS_VAR_MAP.border, baseTokens.border),
      grid: readVar(CSS_VAR_MAP.grid, baseTokens.grid),
      gridEmphasis: readVar(CSS_VAR_MAP.gridEmphasis, baseTokens.gridEmphasis),
      axis: readVar(CSS_VAR_MAP.axis, baseTokens.axis),
      axisEmphasis: readVar(CSS_VAR_MAP.axisEmphasis, baseTokens.axisEmphasis),
      zeroLine: readVar(CSS_VAR_MAP.zeroLine, baseTokens.zeroLine),
      crosshair: readVar(CSS_VAR_MAP.crosshair, baseTokens.crosshair),
      cursor: readVar(CSS_VAR_MAP.cursor, baseTokens.cursor),
      selection: readVar(CSS_VAR_MAP.selection, baseTokens.selection),
      focus: readVar(CSS_VAR_MAP.focus, baseTokens.focus),
      series,
      positive: readVar(CSS_VAR_MAP.positive, baseTokens.positive),
      negative: readVar(CSS_VAR_MAP.negative, baseTokens.negative),
      warning: readVar(CSS_VAR_MAP.warning, baseTokens.warning),
      neutral: readVar(CSS_VAR_MAP.neutral, baseTokens.neutral),
      tooltipBackground: readVar(CSS_VAR_MAP.tooltipBackground, baseTokens.tooltipBackground),
      tooltipForeground: readVar(CSS_VAR_MAP.tooltipForeground, baseTokens.tooltipForeground),
      tooltipMuted: readVar(CSS_VAR_MAP.tooltipMuted, baseTokens.tooltipMuted),
      tooltipBorder: readVar(CSS_VAR_MAP.tooltipBorder, baseTokens.tooltipBorder),
      disabled: readVar(CSS_VAR_MAP.disabled, baseTokens.disabled),
      hidden: readVar(CSS_VAR_MAP.hidden, baseTokens.hidden),
    }

    // Apply palette override if explicitly requested
    if (palette) {
      const p = getPalette(palette)
      snapshot.series = p.series
      if (p.positive) snapshot.positive = p.positive
      if (p.negative) snapshot.negative = p.negative
      if (p.warning) snapshot.warning = p.warning
      if (p.neutral) snapshot.neutral = p.neutral
    }

    snapshotCache.set(targetElement, { snapshot, timestamp: now })
    return snapshot
  } catch {
    return { ...baseTokens }
  }
}
