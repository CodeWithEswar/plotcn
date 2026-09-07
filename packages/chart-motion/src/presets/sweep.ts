import type { MotionPresetDefinition } from "../types"
import { chartMotionDuration, chartMotionEasing } from "../policy/tokens"

/**
 * Sweep Preset
 * Angular progression for pie, donut, radial, and gauge marks.
 * Section 10.40.
 */
export const sweepPreset: MotionPresetDefinition = {
  name: "sweep",
  duration: chartMotionDuration.slow,
  easing: chartMotionEasing.enter,
  reducedMotionFallback: "none",
  description: "Angular sweep progression for radial, pie, and donut geometry",
}

/**
 * Computes an interpolated sweep angle from a base start angle.
 * Section 10.40.
 */
export function interpolateSweepAngle(
  startAngle: number,
  targetEndAngle: number,
  progress: number,
  reducedMotion = false
): number {
  if (reducedMotion || progress >= 1) {
    return targetEndAngle
  }

  const t = Math.max(0, Math.min(1, progress))
  return startAngle + (targetEndAngle - startAngle) * t
}
