/**
 * Detects pointer precision and hover capability.
 * Safely handles SSR with fallback defaults.
 * Section 7.3.
 */
export function detectPointerCapabilities(): {
  pointer: "fine" | "coarse"
  hover: boolean
} {
  if (typeof window === "undefined" || !window.matchMedia) {
    return { pointer: "fine", hover: true }
  }

  const isCoarse = window.matchMedia("(pointer: coarse)").matches
  const canHover = window.matchMedia("(hover: hover)").matches

  return {
    pointer: isCoarse ? "coarse" : "fine",
    hover: canHover,
  }
}
