import type { ChartThemeSnapshot } from "./types"

/**
 * Canonical light mode semantic theme tokens.
 * Section 9.3.
 */
export const defaultLightTokens: ChartThemeSnapshot = {
  background: "#ffffff",
  foreground: "#09090b",
  mutedForeground: "#71717a",
  border: "#e4e4e7",

  grid: "#f4f4f5",
  gridEmphasis: "#e4e4e7",
  axis: "#71717a",
  axisEmphasis: "#27272a",
  zeroLine: "#a1a1aa",

  crosshair: "#52525b",
  cursor: "#71717a",
  selection: "#6366f1",
  focus: "#6366f1",

  series: [
    "#10b981", // series 1 (emerald)
    "#0ea5e9", // series 2 (sky)
    "#8b5cf6", // series 3 (violet)
    "#f59e0b", // series 4 (amber)
    "#f43f5e", // series 5 (rose)
    "#6366f1", // series 6 (indigo)
    "#14b8a6", // series 7 (teal)
    "#f97316", // series 8 (orange)
  ],

  positive: "#10b981",
  negative: "#ef4444",
  warning: "#f59e0b",
  neutral: "#71717a",

  tooltipBackground: "#09090b",
  tooltipForeground: "#fafafa",
  tooltipMuted: "#a1a1aa",
  tooltipBorder: "#27272a",

  disabled: "#a1a1aa",
  hidden: "#d4d4d8",
}

/**
 * Canonical dark mode semantic theme tokens.
 * Section 9.8.
 */
export const defaultDarkTokens: ChartThemeSnapshot = {
  background: "#09090b",
  foreground: "#fafafa",
  mutedForeground: "#a1a1aa",
  border: "#27272a",

  grid: "#18181b",
  gridEmphasis: "#27272a",
  axis: "#a1a1aa",
  axisEmphasis: "#e4e4e7",
  zeroLine: "#52525b",

  crosshair: "#a1a1aa",
  cursor: "#71717a",
  selection: "#818cf8",
  focus: "#818cf8",

  series: [
    "#10b981", // series 1
    "#38bdf8", // series 2
    "#a78bfa", // series 3
    "#fbbf24", // series 4
    "#fb7185", // series 5
    "#818cf8", // series 6
    "#2dd4bf", // series 7
    "#fb923c", // series 8
  ],

  positive: "#10b981",
  negative: "#ef4444",
  warning: "#f59e0b",
  neutral: "#a1a1aa",

  tooltipBackground: "#18181b",
  tooltipForeground: "#fafafa",
  tooltipMuted: "#a1a1aa",
  tooltipBorder: "#27272a",

  disabled: "#52525b",
  hidden: "#3f3f46",
}
