"use client"

import { useState, useEffect, useMemo } from "react"
import type {
  ChartMotionConfig,
  MotionPreset,
  ResolvedMotionPolicy,
} from "../types"
import type { ChartFamily, MotionPolicyOptions } from "../policy/types"
import { resolveMotionPolicy } from "../policy/resolve-motion"
import { detectReducedMotion } from "../policy/reduced-motion"

/**
 * useChartMotion
 * Resolves the active motion policy for a chart component.
 * Automatically tracks browser `prefers-reduced-motion` changes.
 * Section 10.52, 10.59.
 */
export function useChartMotion(
  config?: ChartMotionConfig | MotionPreset | boolean,
  family?: ChartFamily,
  options?: MotionPolicyOptions
): ResolvedMotionPolicy {
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(() => detectReducedMotion())

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const effectiveReducedMotion = options?.reducedMotion ?? systemReducedMotion

  return useMemo(() => {
    return resolveMotionPolicy(config, family, {
      ...options,
      reducedMotion: effectiveReducedMotion,
    })
  }, [config, family, effectiveReducedMotion, options?.isContinuousResize, options?.isStreaming])
}
