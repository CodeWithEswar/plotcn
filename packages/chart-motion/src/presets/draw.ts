import type { MotionPresetDefinition } from "../types"
import { chartMotionDuration, chartMotionEasing } from "../policy/tokens"

/**
 * Draw Preset
 * Uses stroke-dasharray and stroke-dashoffset for path-length entrance.
 * Intended for initial mount only, not continuous updates.
 * Section 10.19, 10.20.
 */
export const drawPreset: MotionPresetDefinition = {
  name: "draw",
  duration: chartMotionDuration.normal,
  easing: chartMotionEasing.enter,
  reducedMotionFallback: "none",
  description: "Stroke dasharray and dashoffset progressive line reveal",
}

export interface DrawStrokeStyle {
  strokeDasharray: number | string
  strokeDashoffset: number
}

/**
 * Calculates stroke dash styles for path draw animation.
 * Section 10.20.
 */
export function calculateDrawStroke(
  totalLength: number,
  progress: number,
  reducedMotion = false
): DrawStrokeStyle {
  if (reducedMotion || progress >= 1) {
    return {
      strokeDasharray: totalLength,
      strokeDashoffset: 0,
    }
  }

  const t = Math.max(0, Math.min(1, progress))
  const offset = totalLength * (1 - t)

  return {
    strokeDasharray: totalLength,
    strokeDashoffset: offset,
  }
}
