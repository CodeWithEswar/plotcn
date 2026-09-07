import type { ChartInteractionPolicy } from "../types"

export interface ResolveInteractionOptions {
  containerWidth: number
  pointer?: "fine" | "coarse"
  hover?: boolean
  enableZoom?: boolean
  enableBrush?: boolean
}

/**
 * Derives interaction policy (hit targets, tooltip trigger mode, touch-action)
 * based on input capabilities and spatial constraints.
 * Section 7.34 - 7.54.
 */
export function resolveInteractionPolicy(
  options: ResolveInteractionOptions
): ChartInteractionPolicy {
  const {
    containerWidth,
    pointer = "fine",
    hover = true,
    enableZoom = false,
    enableBrush = false,
  } = options

  const isCoarse = pointer === "coarse" || (!hover && containerWidth < 640)

  // Hit target sizing: 28-32px on touch/coarse pointers vs 14px on precision desktop mouse (Section 7.41)
  const minimumHitTarget = isCoarse ? 32 : 14

  // Tooltip policy: hover only available when pointer can hover; coarse pointers use tap/scrub (Section 7.34 & 7.42)
  const hoverTooltip = !isCoarse && hover
  const tapTooltip = true
  const scrubTooltip = isCoarse || containerWidth < 640

  // Touch-Action Policy: NEVER hijack page scroll globally with "none" on read-only charts (Section 7.38 & 7.39)
  let touchAction = "auto"
  if (enableZoom || enableBrush) {
    // Allows vertical page scrolling while enabling horizontal scrub/zoom
    touchAction = "pan-y"
  }

  const allowsPageScroll = touchAction !== "none"

  return {
    hoverTooltip,
    tapTooltip,
    scrubTooltip,
    minimumHitTarget,
    touchAction,
    allowsPageScroll,
  }
}
