export { defaultPalette } from "./default"
export { monochromePalette, monochromeStyles, type MonochromeStyle } from "./monochrome"
export { colorblindSafePalette, colorblindSafeStyles, type ColorblindStyle } from "./colorblind-safe"

import { defaultPalette } from "./default"
import { monochromePalette } from "./monochrome"
import { colorblindSafePalette } from "./colorblind-safe"
import type { ChartPalette, ChartAccessibilityPalette, ChartThemePreset } from "../tokens/types"

/**
 * Registry of available curated palettes.
 * Initially scoped to default, monochrome, and colorblind-safe per Section 9.98.
 */
export const palettes: Record<string, ChartThemePreset> = {
  default: defaultPalette,
  monochrome: monochromePalette,
  "colorblind-safe": colorblindSafePalette,
}

/**
 * Resolve a palette preset by name, falling back to default.
 */
export function getPalette(name: ChartPalette | ChartAccessibilityPalette | string): ChartThemePreset {
  return palettes[name] ?? defaultPalette
}
