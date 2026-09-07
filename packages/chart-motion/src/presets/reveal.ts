import type { MotionPresetDefinition } from "../types"
import { chartMotionDuration, chartMotionEasing } from "../policy/tokens"

/**
 * Reveal Preset
 * Directional clipping or masking for area charts and timeline sequences.
 * Section 10.39.
 */
export const revealPreset: MotionPresetDefinition = {
  name: "reveal",
  duration: chartMotionDuration.normal,
  easing: chartMotionEasing.enter,
  reducedMotionFallback: "none",
  description: "Directional clip-path masking for area charts and temporal sequences",
}

export type RevealDirection = "left-to-right" | "bottom-to-top"

/**
 * Generates an SVG or CSS clip-path inset string based on progress.
 * Section 10.39.
 */
export function calculateRevealClipPath(
  progress: number,
  direction: RevealDirection = "left-to-right",
  reducedMotion = false
): string {
  if (reducedMotion || progress >= 1) {
    return "inset(0% 0% 0% 0%)"
  }

  const t = Math.max(0, Math.min(1, progress))
  const remaining = (1 - t) * 100

  if (direction === "bottom-to-top") {
    return `inset(0% 0% ${remaining}% 0%)`
  }

  return `inset(0% ${remaining}% 0% 0%)`
}
