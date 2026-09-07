import {
  chartMotionDuration,
  chartMotionEasing,
  type MotionPreset,
  type MotionPresetDefinition,
} from "../types"

export { chartMotionDuration, chartMotionEasing }

/**
 * Standard registry of preset definitions.
 * Section 10.90, 10.91.
 */
export const presetDefinitions: Record<MotionPreset, MotionPresetDefinition> = {
  none: {
    name: "none",
    duration: 0,
    easing: chartMotionEasing.linear,
    reducedMotionFallback: "none",
    description: "Immediate geometry rendering without animation",
  },
  fade: {
    name: "fade",
    duration: chartMotionDuration.fast,
    easing: chartMotionEasing.enter,
    reducedMotionFallback: "fade",
    description: "Subtle opacity transition for marks and surfaces",
  },
  grow: {
    name: "grow",
    duration: chartMotionDuration.normal,
    easing: chartMotionEasing.enter,
    reducedMotionFallback: "none",
    description: "Expansion from semantic baseline for bars and columns",
  },
  draw: {
    name: "draw",
    duration: chartMotionDuration.normal,
    easing: chartMotionEasing.enter,
    reducedMotionFallback: "none",
    description: "Stroke-dash path length reveal for line entrance",
  },
  reveal: {
    name: "reveal",
    duration: chartMotionDuration.normal,
    easing: chartMotionEasing.enter,
    reducedMotionFallback: "none",
    description: "Directional clip-path reveal for areas and sequences",
  },
  sweep: {
    name: "sweep",
    duration: chartMotionDuration.slow,
    easing: chartMotionEasing.enter,
    reducedMotionFallback: "none",
    description: "Angular progression for pie, donut, and radial marks",
  },
  morph: {
    name: "morph",
    duration: chartMotionDuration.normal,
    easing: chartMotionEasing.update,
    reducedMotionFallback: "none",
    description: "Geometric path coordinate interpolation across updates",
  },
}
