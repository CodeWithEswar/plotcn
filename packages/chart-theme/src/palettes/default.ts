import type { ChartThemePreset } from "../tokens/types"

/**
 * Default categorical series palette.
 * Provides balanced chroma, dark-mode harmony, and clear multi-series separation.
 * Section 9.12.
 */
export const defaultPalette: ChartThemePreset = {
  name: "default",
  label: "Default Emerald",
  description: "Balanced categorical palette tailored for modern dark/light product dashboards.",
  series: [
    "#10b981", // series 1: emerald
    "#0ea5e9", // series 2: sky
    "#8b5cf6", // series 3: violet
    "#f59e0b", // series 4: amber
    "#f43f5e", // series 5: rose
    "#6366f1", // series 6: indigo
    "#14b8a6", // series 7: teal
    "#f97316", // series 8: orange
  ],
  positive: "#10b981",
  negative: "#ef4444",
  warning: "#f59e0b",
  neutral: "#71717a",
}
