/**
 * @plotcn/chart-theme Types
 * Semantic visualization theme tokens, palettes, and adapter contracts.
 * Section 9.1 - 9.11.
 */

/**
 * Curated categorical series palettes.
 * Section 9.11.
 */
export type ChartPalette =
  | "default"
  | "monochrome"
  | "ocean"
  | "aurora"
  | "sunset"
  | "pastel"
  | "corporate"

/**
 * Dedicated accessibility visual modes.
 * Section 9.19.
 */
export type ChartAccessibilityPalette =
  | "standard"
  | "high-contrast"
  | "colorblind-safe"

/**
 * Comprehensive semantic chart token contract.
 * Section 9.3.
 */
export interface ChartThemeTokens {
  // Surface
  background: string
  foreground: string
  mutedForeground: string
  border: string

  // Structure
  grid: string
  gridEmphasis: string
  axis: string
  axisEmphasis: string
  zeroLine: string

  // Interaction
  crosshair: string
  cursor: string
  selection: string
  focus: string

  // Series (1 through 8)
  series: readonly string[]

  // Semantic Status Values
  positive: string
  negative: string
  warning: string
  neutral: string

  // Tooltip
  tooltipBackground: string
  tooltipForeground: string
  tooltipMuted: string
  tooltipBorder: string

  // States
  disabled: string
  hidden: string
}

/**
 * Resolved theme snapshot used for Canvas rendering, Google ChartOptions,
 * and vector/raster image exports.
 * Section 9.62.
 */
export interface ChartThemeSnapshot {
  background: string
  foreground: string
  mutedForeground: string
  border: string
  grid: string
  gridEmphasis: string
  axis: string
  axisEmphasis: string
  zeroLine: string
  crosshair: string
  cursor: string
  selection: string
  focus: string
  series: readonly string[]
  positive: string
  negative: string
  warning: string
  neutral: string
  tooltipBackground: string
  tooltipForeground: string
  tooltipMuted: string
  tooltipBorder: string
  disabled: string
  hidden: string
}

/**
 * Declarative theme preset definition.
 * Section 9.50.
 */
export interface ChartThemePreset {
  name: ChartPalette
  label: string
  description: string
  series: readonly string[]
  positive?: string
  negative?: string
  warning?: string
  neutral?: string
}
