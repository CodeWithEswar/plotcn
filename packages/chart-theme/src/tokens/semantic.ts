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
  selection: "#27272a",
  focus: "#09090b",

  series: [
    "#18181b", // series 1 (zinc-900)
    "#3f3f46", // series 2 (zinc-700)
    "#52525b", // series 3 (zinc-600)
    "#71717a", // series 4 (zinc-500)
    "#a1a1aa", // series 5 (zinc-400)
    "#27272a", // series 6 (zinc-800)
    "#d4d4d8", // series 7 (zinc-300)
    "#09090b", // series 8 (zinc-950)
  ],

  positive: "#18181b",
  negative: "#71717a",
  warning: "#52525b",
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
  selection: "#e4e4e7",
  focus: "#fafafa",

  series: [
    "#f4f4f5", // series 1 (zinc-100)
    "#d4d4d8", // series 2 (zinc-300)
    "#a1a1aa", // series 3 (zinc-400)
    "#71717a", // series 4 (zinc-500)
    "#52525b", // series 5 (zinc-600)
    "#3f3f46", // series 6 (zinc-700)
    "#e4e4e7", // series 7 (zinc-200)
    "#27272a", // series 8 (zinc-800)
  ],

  positive: "#e4e4e7",
  negative: "#71717a",
  warning: "#a1a1aa",
  neutral: "#a1a1aa",

  tooltipBackground: "#18181b",
  tooltipForeground: "#fafafa",
  tooltipMuted: "#a1a1aa",
  tooltipBorder: "#27272a",

  disabled: "#52525b",
  hidden: "#3f3f46",
}
