/**
 * Detects whether the user has requested reduced motion.
 * Safely handles SSR with fallback defaults.
 * Section 7.68.
 */
export function detectReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
