import type { MotionPresetDefinition } from "../types"
import { chartMotionDuration, chartMotionEasing } from "../policy/tokens"

/**
 * Fade Preset
 * Subtle opacity transition for marks, tooltips, legends, and unsupported geometry fallbacks.
 * Section 10.42.
 */
export const fadePreset: MotionPresetDefinition = {
  name: "fade",
  duration: chartMotionDuration.fast,
  easing: chartMotionEasing.enter,
  reducedMotionFallback: "fade",
  description: "Subtle opacity transition for series, tooltips, and fallback states",
}

export function getFadeStyle(progress: number, options?: { minOpacity?: number }): { opacity: number } {
  const min = options?.minOpacity ?? 0
  const opacity = min + (1 - min) * Math.max(0, Math.min(1, progress))
  return { opacity }
}
