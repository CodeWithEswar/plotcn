import type { ChartThemePreset } from "../tokens/types"

export interface MonochromeStyle {
  color: string
  lineStyle: "solid" | "dashed" | "dotted"
  shape: "dot" | "square" | "line"
  strokeWidth: number
  opacity: number
}

/**
 * Monochrome series visual styling.
 * Differentiates series using luminance, stroke weight, dashes, and marker shapes rather than identical gray lines.
 * Section 9.13.
 */
export const monochromeStyles: readonly MonochromeStyle[] = [
  { color: "#fafafa", lineStyle: "solid", shape: "dot", strokeWidth: 2.5, opacity: 1.0 },
  { color: "#d4d4d8", lineStyle: "dashed", shape: "square", strokeWidth: 2.0, opacity: 0.85 },
  { color: "#a1a1aa", lineStyle: "dotted", shape: "line", strokeWidth: 2.0, opacity: 0.70 },
  { color: "#71717a", lineStyle: "solid", shape: "dot", strokeWidth: 1.5, opacity: 0.60 },
  { color: "#52525b", lineStyle: "dashed", shape: "square", strokeWidth: 1.5, opacity: 0.50 },
]

/**
 * Monochrome series palette.
 * Section 9.13.
 */
export const monochromePalette: ChartThemePreset = {
  name: "monochrome",
  label: "Monochrome Precision",
  description: "Minimalist grayscale palette differentiating series through luminance and pattern.",
  series: [
    "#fafafa", // zinc-50
    "#e4e4e7", // zinc-200
    "#d4d4d8", // zinc-300
    "#a1a1aa", // zinc-400
    "#71717a", // zinc-500
    "#52525b", // zinc-600
    "#3f3f46", // zinc-700
    "#27272a", // zinc-800
  ],
  positive: "#e4e4e7",
  negative: "#71717a",
  warning: "#a1a1aa",
  neutral: "#71717a",
}
