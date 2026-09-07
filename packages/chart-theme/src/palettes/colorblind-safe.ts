import type { ChartThemePreset } from "../tokens/types"

export interface ColorblindStyle {
  color: string
  lineStyle: "solid" | "dashed" | "dotted"
  shape: "dot" | "square" | "diamond" | "triangle"
  strokeWidth: number
}

/**
 * Colorblind-safe series visual styles combining the Okabe-Ito / Wong palette
 * with distinct stroke patterns and marker shapes to ensure distinguishability
 * without relying on hue alone.
 * Section 9.19, 9.20.
 */
export const colorblindSafeStyles: readonly ColorblindStyle[] = [
  { color: "#E69F00", lineStyle: "solid", shape: "dot", strokeWidth: 2.5 },       // Orange
  { color: "#56B4E9", lineStyle: "dashed", shape: "square", strokeWidth: 2.0 },    // Sky Blue
  { color: "#009E73", lineStyle: "dotted", shape: "diamond", strokeWidth: 2.0 },   // Bluish Green
  { color: "#0072B2", lineStyle: "solid", shape: "triangle", strokeWidth: 2.5 },   // Royal Blue
  { color: "#D55E00", lineStyle: "dashed", shape: "dot", strokeWidth: 2.0 },       // Vermillion
  { color: "#CC79A7", lineStyle: "dotted", shape: "square", strokeWidth: 2.0 },    // Reddish Purple
  { color: "#F0E442", lineStyle: "solid", shape: "diamond", strokeWidth: 2.0 },    // Yellow
  { color: "#2B2D42", lineStyle: "dashed", shape: "triangle", strokeWidth: 2.0 },   // Dark Slate
]

/**
 * Colorblind-safe palette based on the scientifically validated Okabe-Ito palette.
 * Section 9.19, 9.20.
 */
export const colorblindSafePalette: ChartThemePreset = {
  name: "default", // Accessibility palette variant
  label: "Colorblind Safe (Okabe-Ito)",
  description: "Universally distinguishable palette for protanopia, deuteranopia, and tritanopia.",
  series: [
    "#E69F00", // Orange
    "#56B4E9", // Sky Blue
    "#009E73", // Bluish Green
    "#0072B2", // Royal Blue
    "#D55E00", // Vermillion
    "#CC79A7", // Reddish Purple
    "#F0E442", // Yellow
    "#2B2D42", // Dark Slate
  ],
  positive: "#009E73", // Bluish Green
  negative: "#D55E00", // Vermillion
  warning: "#E69F00",  // Orange
  neutral: "#71717a",
}
