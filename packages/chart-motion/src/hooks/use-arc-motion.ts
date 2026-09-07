"use client"

import { useState, useEffect, useRef } from "react"
import type { ArcGeometry, ResolvedMotionPolicy } from "../types"
import { interpolateArcList } from "../interpolation/arc"

export interface UseArcMotionOptions {
  policy?: ResolvedMotionPolicy
  onComplete?: () => void
}

export interface UseArcMotionReturn {
  segments: ArcGeometry[]
  isAnimating: boolean
  progress: number
}

/**
 * useArcMotion
 * Coordinates angular and radial interpolation across arc segments using stable segment identity.
 * Section 10.24, 10.25, 10.54.
 */
export function useArcMotion(
  targetSegments: readonly ArcGeometry[],
  options?: UseArcMotionOptions
): UseArcMotionReturn {
  const policy = options?.policy
  const isReduced = policy?.reducedMotion ?? false
  const durationMs = (policy?.duration ?? 0.45) * 1000

  const [currentSegments, setCurrentSegments] = useState<ArcGeometry[]>([...targetSegments])
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(1)

  const activeSegmentsRef = useRef<ArcGeometry[]>([...targetSegments])
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (isReduced || durationMs <= 0 || policy?.update === "none" || !targetSegments.length) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      activeSegmentsRef.current = [...targetSegments]
      setCurrentSegments([...targetSegments])
      setIsAnimating(false)
      setProgress(1)
      return
    }

    const startSegments = [...activeSegmentsRef.current]
    const destinationSegments = [...targetSegments]

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    startTimeRef.current = null
    setIsAnimating(true)
    setProgress(0)

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const t = Math.min(1, elapsed / durationMs)
      setProgress(t)

      const interpolated = interpolateArcList(startSegments, destinationSegments, t)
      activeSegmentsRef.current = interpolated
      setCurrentSegments(interpolated)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        activeSegmentsRef.current = destinationSegments
        setCurrentSegments(destinationSegments)
        setIsAnimating(false)
        rafRef.current = null
        options?.onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [targetSegments, durationMs, isReduced, policy?.update])

  return {
    segments: currentSegments,
    isAnimating,
    progress,
  }
}
