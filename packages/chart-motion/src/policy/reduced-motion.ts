import type { MotionPreset } from "../types"

/**
 * Safely detects the system reduced-motion preference.
 * SSR-safe, defaults to false if window or matchMedia is not available.
 * Section 10.59.
 */
export function detectReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Maps a semantic motion preset to its reduced-motion equivalent.
 * Section 10.58:
 * - draw -> none (immediate final path)
 * - morph -> none (immediate update)
 * - grow -> none (immediate final bar geometry)
 * - sweep -> none (immediate final arc)
 * - reveal -> none (immediate presentation)
 * - stagger -> none / disabled
 * - fade -> fade (clamped duration)
 * - none -> none
 */
export function resolveReducedMotionFallback(preset: MotionPreset): MotionPreset {
  switch (preset) {
    case "draw":
    case "morph":
    case "grow":
    case "sweep":
    case "reveal":
      return "none"
    case "fade":
      return "fade"
    case "none":
    default:
      return "none"
  }
}
