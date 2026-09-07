import { chartMotionDuration } from "../policy/tokens"

/**
 * Maximum total delay accumulation for staggered sequences.
 * Section 10.38.
 */
export const MAX_STAGGER_TOTAL_DELAY = 0.15 // 150ms cap

/**
 * Maximum element count eligible for staggered entrance.
 * For datasets larger than this threshold, stagger is bypassed to prevent render delay.
 * Section 10.37, 10.38.
 */
export const MAX_STAGGER_ITEM_COUNT = 16

/**
 * Calculates a capped stagger delay for an item in a sequence.
 * Section 10.37, 10.38.
 */
export function calculateStaggerDelay(
  index: number,
  totalItems: number,
  options?: {
    baseDelay?: number
    maxTotalDelay?: number
    reducedMotion?: boolean
  }
): number {
  if (options?.reducedMotion || totalItems <= 1 || totalItems > MAX_STAGGER_ITEM_COUNT) {
    return 0
  }

  const maxTotal = options?.maxTotalDelay ?? MAX_STAGGER_TOTAL_DELAY
  const desiredDelay = options?.baseDelay ?? 0.02 // 20ms baseline

  // Cap the per-item delay so total delay never exceeds maxTotal
  const effectiveDelay = Math.min(desiredDelay, maxTotal / (totalItems - 1))
  return Math.min(index * effectiveDelay, maxTotal)
}
