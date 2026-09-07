"use client"

import { useState, useEffect, useRef } from "react"
import type { SeriesTransitionItem, ResolvedMotionPolicy } from "../types"

export interface UseSeriesTransitionOptions {
  policy?: ResolvedMotionPolicy
}

/**
 * useSeriesTransition
 * Tracks entering, updating, and exiting series states with stable series identity.
 * Section 10.55, 10.76.
 */
export function useSeriesTransition<TData = unknown>(
  activeSeries: readonly { id: string; data: TData }[],
  options?: UseSeriesTransitionOptions
): SeriesTransitionItem<TData>[] {
  const policy = options?.policy
  const isReduced = policy?.reducedMotion ?? false

  const [items, setItems] = useState<SeriesTransitionItem<TData>[]>(() =>
    activeSeries.map((s) => ({
      id: s.id,
      status: "updating",
      data: s.data,
      opacity: 1,
    }))
  )

  const prevIdsRef = useRef<Set<string>>(new Set(activeSeries.map((s) => s.id)))

  useEffect(() => {
    const nextIds = new Set(activeSeries.map((s) => s.id))
    const prevIds = prevIdsRef.current

    if (isReduced) {
      setItems(
        activeSeries.map((s) => ({
          id: s.id,
          status: "updating",
          data: s.data,
          opacity: 1,
        }))
      )
      prevIdsRef.current = nextIds
      return
    }

    const updatedItems: SeriesTransitionItem<TData>[] = activeSeries.map((s) => {
      const isNew = !prevIds.has(s.id)
      return {
        id: s.id,
        status: isNew ? "entering" : "updating",
        data: s.data,
        opacity: 1,
      }
    })

    setItems(updatedItems)
    prevIdsRef.current = nextIds
  }, [activeSeries, isReduced])

  return items
}
