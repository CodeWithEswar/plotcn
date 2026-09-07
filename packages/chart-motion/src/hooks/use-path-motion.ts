"use client"

import { useState, useEffect, useRef } from "react"
import { interpolatePath } from "../interpolation/path"
import type { ResolvedMotionPolicy } from "../types"

export interface UsePathMotionOptions {
  policy?: ResolvedMotionPolicy
  onComplete?: () => void
}

export interface UsePathMotionReturn {
  path: string
  isAnimating: boolean
  progress: number
}

/**
 * usePathMotion
 * Orchestrates path morphing and entrance transitions with interruptible, latest-state-wins semantics.
 * Section 10.50, 10.51, 10.53, 10.71, 10.72.
 */
export function usePathMotion(
  targetPath: string,
  options?: UsePathMotionOptions
): UsePathMotionReturn {
  const policy = options?.policy
  const isReduced = policy?.reducedMotion ?? false
  const durationMs = (policy?.duration ?? 0.3) * 1000

  const [currentPath, setCurrentPath] = useState(targetPath)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(1)

  // Track the resting source path and in-flight RAF handle
  const sourcePathRef = useRef(targetPath)
  const activePathRef = useRef(targetPath)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // If paths match or motion is disabled / reduced, jump immediately
    if (
      isReduced ||
      durationMs <= 0 ||
      policy?.update === "none" ||
      !targetPath ||
      targetPath === activePathRef.current
    ) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      sourcePathRef.current = targetPath
      activePathRef.current = targetPath
      setCurrentPath(targetPath)
      setIsAnimating(false)
      setProgress(1)
      return
    }

    // Interruption handling (Section 10.71):
    // In-flight interpolated path becomes the starting path for the new target.
    const startPath = activePathRef.current
    sourcePathRef.current = startPath
    const destinationPath = targetPath

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

      // Calculate interpolated path
      const result = interpolatePath(startPath, destinationPath, t)
      activePathRef.current = result.path
      setCurrentPath(result.path)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        sourcePathRef.current = destinationPath
        activePathRef.current = destinationPath
        setCurrentPath(destinationPath)
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
  }, [targetPath, durationMs, isReduced, policy?.update])

  return {
    path: currentPath,
    isAnimating,
    progress,
  }
}
