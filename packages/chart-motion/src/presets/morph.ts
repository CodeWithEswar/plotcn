import type { MotionPresetDefinition } from "../types"
import { chartMotionDuration, chartMotionEasing } from "../policy/tokens"

/**
 * Morph Preset
 * Coordinate-level geometric interpolation between consecutive states of the same series.
 * Section 10.21 - 10.23.
 */
export const morphPreset: MotionPresetDefinition = {
  name: "morph",
  duration: chartMotionDuration.normal,
  easing: chartMotionEasing.update,
  reducedMotionFallback: "none",
  description: "Continuous coordinate interpolation with safe semantic fallback",
}
