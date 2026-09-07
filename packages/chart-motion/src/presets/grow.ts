import type { MotionPresetDefinition } from "../types"
import { chartMotionDuration, chartMotionEasing } from "../policy/tokens"

/**
 * Grow Preset
 * Expands marks from a semantic baseline (zero value) rather than arbitrary SVG boundaries.
 * Section 10.26, 10.27, 10.41.
 */
export const growPreset: MotionPresetDefinition = {
  name: "grow",
  duration: chartMotionDuration.normal,
  easing: chartMotionEasing.enter,
  reducedMotionFallback: "none",
  description: "Semantic baseline expansion for vertical/horizontal bars and columns",
}

export interface BarGeometry {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Computes interpolated bar geometry from a semantic baseline.
 * Handles positive and negative bars correctly.
 * Section 10.26, 10.27.
 */
export function interpolateBarFromBaseline(
  target: BarGeometry,
  baselineY: number,
  progress: number,
  options?: { isHorizontal?: boolean; baselineX?: number }
): BarGeometry {
  const t = Math.max(0, Math.min(1, progress))

  if (options?.isHorizontal) {
    const baseline = options.baselineX ?? 0
    const targetWidth = target.width
    const isNegative = target.x < baseline
    const currentWidth = targetWidth * t

    return {
      x: isNegative ? baseline - currentWidth : baseline,
      y: target.y,
      width: currentWidth,
      height: target.height,
    }
  }

  // Vertical bar
  const targetHeight = target.height
  const isNegative = target.y > baselineY
  const currentHeight = targetHeight * t

  return {
    x: target.x,
    y: isNegative ? baselineY : baselineY - currentHeight,
    width: target.width,
    height: currentHeight,
  }
}
