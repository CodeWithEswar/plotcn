import type { ChartThemePreset } from "../tokens/types"

/**
 * Default categorical series palette.
 * Provides balanced chroma, dark-mode harmony, and clear multi-series separation.
 * Section 9.12.
 */
export const defaultPalette: ChartThemePreset = {
  name: "default",
  label: "Monochrome",
  description: "Plotcn default Zinc monochrome categorical palette.",
  series: [
    "#f4f4f5", // series 1: zinc-100
    "#d4d4d8", // series 2: zinc-300
    "#a1a1aa", // series 3: zinc-400
    "#71717a", // series 4: zinc-500
    "#52525b", // series 5: zinc-600
    "#3f3f46", // series 6: zinc-700
    "#e4e4e7", // series 7: zinc-200
    "#27272a", // series 8: zinc-800
  ],
  positive: "#e4e4e7",
  negative: "#71717a",
  warning: "#a1a1aa",
  neutral: "#71717a",
}
