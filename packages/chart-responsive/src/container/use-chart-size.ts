"use client"

import * as React from "react"
import { resolveBreakpoint, isCompact as checkIsCompact } from "../breakpoints/resolve-breakpoint"
import { normalizeDimensions, shouldUpdateSize } from "./chart-size-observer"
import type { ChartDimensions, UseChartSizeOptions } from "../types"

/**
 * Normalizes margins input into standard 4-side object.
 */
function normalizeMargins(margins?: UseChartSizeOptions["margins"]) {
  if (typeof margins === "number") {
    return { top: margins, right: margins, bottom: margins, left: margins }
  }
  return {
    top: margins?.top ?? 16,
    right: margins?.right ?? 16,
    bottom: margins?.bottom ?? 24,
    left: margins?.left ?? 32,
  }
}

/**
 * React hook observing the chart container via ResizeObserver.
 * Provides container-driven dimensions, breakpoint resolution, and SSR hydration safety.
 * Section 7.1, 7.6, 7.8, 7.9, 7.70.
 */
export function useChartSize<TElement extends HTMLElement = HTMLDivElement>(
  options: UseChartSizeOptions = {}
): {
  ref: React.RefObject<TElement | null>
  dimensions: ChartDimensions
  isReady: boolean
} {
  const {
    initialWidth = 0,
    initialHeight = 0,
    aspectRatio,
    threshold = 0.5,
    margins = {},
  } = options

  const ref = React.useRef<TElement | null>(null)
  const normMargins = normalizeMargins(margins)

  // Compute initial dimensions
  const initW = Math.max(0, initialWidth)
  const initH = aspectRatio && initW > 0 ? initW / aspectRatio : Math.max(0, initialHeight)

  const [state, setState] = React.useState<{
    width: number
    height: number
    isReady: boolean
  }>({
    width: initW,
    height: initH,
    isReady: initW > 0 && initH > 0,
  })

  // Track latest measurements to compare against threshold
  const latestSize = React.useRef({ width: initW, height: initH })

  React.useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === "undefined") {
      return
    }

    let rafId: number | null = null

    const handleResize: ResizeObserverCallback = (entries) => {
      const entry = entries[0]
      if (!entry) return

      let measuredWidth = 0
      let measuredHeight = 0

      if (entry.contentBoxSize) {
        const box = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize
        if (box) {
          measuredWidth = box.inlineSize
          measuredHeight = box.blockSize
        }
      } else if (entry.contentRect) {
        measuredWidth = entry.contentRect.width
        measuredHeight = entry.contentRect.height
      }

      // If height is zero or unconstrained and an aspect ratio is provided, derive height (Section 7.11)
      if ((measuredHeight <= 0 || !Number.isFinite(measuredHeight)) && aspectRatio && measuredWidth > 0) {
        measuredHeight = measuredWidth / aspectRatio
      }

      const normalized = normalizeDimensions(measuredWidth, measuredHeight)

      // Zero-size handling: postpone rendering until measurable (Section 7.8 & 7.93)
      if (normalized.width === 0 || normalized.height === 0) {
        setState((prev) => (prev.isReady ? { ...prev, isReady: false } : prev))
        return
      }

      // Filter subpixel jitter (Section 7.71)
      if (!shouldUpdateSize(latestSize.current, normalized, threshold)) {
        return
      }

      latestSize.current = normalized

      // Batch with requestAnimationFrame to prevent resize loops (Section 7.70)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        setState({
          width: normalized.width,
          height: normalized.height,
          isReady: true,
        })
      })
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(element)

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      observer.disconnect()
    }
  }, [aspectRatio, threshold])

  const innerWidth = Math.max(0, state.width - normMargins.left - normMargins.right)
  const innerHeight = Math.max(0, state.height - normMargins.top - normMargins.bottom)
  const breakpoint = resolveBreakpoint(state.width)
  const isCompact = checkIsCompact(breakpoint)

  const dimensions: ChartDimensions = {
    width: state.width,
    height: state.height,
    innerWidth,
    innerHeight,
    breakpoint,
    isCompact,
  }

  return {
    ref,
    dimensions,
    isReady: state.isReady,
  }
}
