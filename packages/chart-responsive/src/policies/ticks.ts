import type {
  AdaptiveTicksOptions,
  ResolvedTick,
  TickCandidate,
  TickStrategy,
} from "../types"

/**
 * Fast character-heuristic text measurement.
 * Avoids costly synchronous DOM getBBox() during render loops.
 * Section 7.24.
 */
export function estimateLabelWidth(
  label: string,
  fontSize = 12,
  cache?: Map<string, number>
): number {
  if (cache?.has(label)) {
    return cache.get(label)!
  }

  // Baseline approximation: ~0.65em per character + 8px boundary padding
  const estimated = Math.max(16, Math.ceil(label.length * (fontSize * 0.65) + 8))
  if (cache) {
    cache.set(label, estimated)
  }
  return estimated
}

/**
 * Derives the optimal number of ticks for a given spatial dimension.
 * Section 7.19.
 */
export function calculateTargetTickCount(
  plotLength: number,
  averageLabelWidth = 48,
  minGap = 16
): number {
  if (plotLength <= 0) return 0
  const slot = averageLabelWidth + minGap
  const count = Math.floor(plotLength / slot)
  return Math.max(2, Math.min(count, 12))
}

/**
 * Automatic Tick Manager.
 * Evaluates candidate ticks, detects spatial label collisions, and resolves
 * a readable subset according to the specified preservation strategy.
 * Section 7.20 - 7.23.
 */
export function resolveAdaptiveTicks<TValue>(
  options: AdaptiveTicksOptions<TValue>
): ResolvedTick<TValue>[] {
  const {
    ticks,
    plotLength,
    getPosition,
    formatLabel,
    minGap = 12,
    strategy = "auto",
    estimateWidth = (lbl) => estimateLabelWidth(lbl),
  } = options

  if (ticks.length === 0 || plotLength <= 0) {
    return []
  }

  if (ticks.length === 1 || strategy === "all") {
    return ticks.map((value) => ({
      value,
      position: getPosition(value),
      label: formatLabel(value),
    }))
  }

  // 1. Build candidates with spatial bounds
  const candidates: TickCandidate<TValue>[] = ticks.map((value) => {
    const label = formatLabel(value)
    return {
      value,
      position: getPosition(value),
      label,
      estimatedWidth: estimateWidth(label),
    }
  })

  // Sort by position along the axis
  candidates.sort((a, b) => a.position - b.position)

  const n = candidates.length
  const preserveStart = strategy === "preserve-start" || strategy === "preserve-both" || strategy === "auto"
  const preserveEnd = strategy === "preserve-end" || strategy === "preserve-both" || strategy === "auto"

  // Quick overlap check between two tick candidates
  const doesCollide = (t1: TickCandidate<TValue>, t2: TickCandidate<TValue>): boolean => {
    const dist = Math.abs(t2.position - t1.position)
    const required = (t1.estimatedWidth / 2) + (t2.estimatedWidth / 2) + minGap
    return dist < required
  }

  // 2. Resolve candidates based on strategy
  const selectedIndices = new Set<number>()

  // Always mark endpoints if requested
  if (preserveStart && n > 0) selectedIndices.add(0)
  if (preserveEnd && n > 1) {
    // If end collides with start, keep start
    if (!doesCollide(candidates[0], candidates[n - 1])) {
      selectedIndices.add(n - 1)
    }
  }

  // 3. Step through candidates to thin out collisions
  let lastAccepted = 0

  for (let i = 1; i < n; i++) {
    // If end is preserved and this tick is near the end, check collision with end
    if (preserveEnd && i === n - 1) {
      continue // Already handled
    }

    const candidate = candidates[i]
    const collidesWithLast = doesCollide(candidates[lastAccepted], candidate)

    let collidesWithEnd = false
    if (preserveEnd && selectedIndices.has(n - 1)) {
      collidesWithEnd = doesCollide(candidate, candidates[n - 1])
    }

    if (!collidesWithLast && !collidesWithEnd) {
      selectedIndices.add(i)
      lastAccepted = i
    }
  }

  return candidates
    .filter((_, idx) => selectedIndices.has(idx))
    .map(({ value, position, label }) => ({ value, position, label }))
}

/**
 * Categorical Axis Thinner.
 * Skips label text display on crowded categorical charts (e.g. 24 months)
 * while preserving all visual bars/points in the dataset.
 * "Never confuse tick reduction with data reduction." - Section 7.26.
 */
export function resolveCategoricalTicks<TItem>(
  items: readonly TItem[],
  plotLength: number,
  getLabel: (item: TItem) => string,
  minLabelWidth = 40
): { item: TItem; index: number; showTick: boolean; label: string }[] {
  const count = items.length
  if (count === 0) return []

  const maxVisibleTicks = calculateTargetTickCount(plotLength, minLabelWidth, 12)
  const step = Math.max(1, Math.ceil(count / Math.max(1, maxVisibleTicks)))

  return items.map((item, index) => {
    const label = getLabel(item)
    // Show tick at regular step intervals and ensure the last item is shown if within bounds
    const showTick = index % step === 0 || (index === count - 1 && (count - 1) % step !== 0 && step <= 2)
    return {
      item,
      index,
      showTick,
      label,
    }
  })
}
