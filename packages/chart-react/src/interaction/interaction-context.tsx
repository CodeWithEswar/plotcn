"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import type {
  PointerPosition,
  TooltipAnchor,
  TooltipDatum,
  ChartInteractionMode,
  InteractionContextValue,
} from "../types/interaction"

export const InteractionContext = createContext<InteractionContextValue | null>(null)
InteractionContext.displayName = "InteractionContext"

/**
 * Accesses normalized chart interaction state (active datum, anchor, mode, locked, items).
 * Section 8.3 & 8.67.
 */
export function useInteraction(): InteractionContextValue {
  const context = useContext(InteractionContext)
  if (!context) {
    throw new Error(
      "useInteraction must be used within an <InteractionProvider>. " +
      "Wrap your interactive chart elements in an InteractionProvider."
    )
  }
  return context
}

export interface InteractionProviderProps {
  children?: ReactNode
  /** Initial selected datum ID */
  defaultSelectedDatumId?: string | null
  /** Initially hidden series IDs */
  defaultHiddenSeriesIds?: readonly string[]
}

/**
 * InteractionProvider coordinates normalized interaction state across
 * tooltips, crosshairs, cursors, and legends without rerendering full chart geometry.
 * Section 8.67 - 8.74.
 */
export function InteractionProvider({
  children,
  defaultSelectedDatumId = null,
  defaultHiddenSeriesIds = [],
}: InteractionProviderProps) {
  const [activeDatumId, setActiveDatumId] = useState<string | null>(null)
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null)
  const [selectedDatumId, setSelectedDatumId] = useState<string | null>(defaultSelectedDatumId)
  const [pointer, setPointer] = useState<PointerPosition | null>(null)
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null)
  const [activeLabel, setActiveLabel] = useState<unknown>(null)
  const [items, setItems] = useState<readonly TooltipDatum[]>(() => [])
  const [locked, setLocked] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [mode, setMode] = useState<ChartInteractionMode>("idle")
  const [hiddenSeriesIds, setHiddenSeriesIds] = useState<ReadonlySet<string>>(
    () => new Set(defaultHiddenSeriesIds)
  )

  const toggleSeries = useCallback((seriesId: string) => {
    setHiddenSeriesIds((prev) => {
      const next = new Set(prev)
      if (next.has(seriesId)) {
        next.delete(seriesId)
      } else {
        next.add(seriesId)
      }
      return next
    })
  }, [])

  const isolateSeries = useCallback((seriesId: string) => {
    setHiddenSeriesIds((prev) => {
      // If only this series is unhidden, toggle all back
      if (prev.size > 0 && !prev.has(seriesId)) {
        return new Set()
      }
      return new Set([seriesId])
    })
  }, [])

  const setActiveState = useCallback(
    (options: {
      activeDatumId?: string | null
      activeSeriesId?: string | null
      anchor?: TooltipAnchor | null
      activeLabel?: unknown
      items?: readonly TooltipDatum[]
      mode?: ChartInteractionMode
    }) => {
      if (options.activeDatumId !== undefined) setActiveDatumId(options.activeDatumId)
      if (options.activeSeriesId !== undefined) setActiveSeriesId(options.activeSeriesId)
      if (options.anchor !== undefined) setAnchor(options.anchor)
      if (options.activeLabel !== undefined) setActiveLabel(options.activeLabel)
      if (options.items !== undefined) setItems(options.items)
      if (options.mode !== undefined) setMode(options.mode)
    },
    []
  )

  const reset = useCallback(() => {
    setActiveDatumId(null)
    setActiveSeriesId(null)
    setPointer(null)
    setAnchor(null)
    setActiveLabel(null)
    setItems([])
    setLocked(false)
    setIsHovered(false)
    setIsFocused(false)
    setMode("idle")
  }, [])

  const contextValue = useMemo<InteractionContextValue>(
    () => ({
      activeDatumId,
      activeSeriesId,
      selectedDatumId,
      pointer,
      anchor,
      activeLabel,
      items,
      locked,
      isHovered,
      isFocused,
      mode,
      hiddenSeriesIds,
      setActiveDatum: setActiveDatumId,
      setActiveSeries: setActiveSeriesId,
      setSelectedDatum: setSelectedDatumId,
      setPointer,
      setAnchor,
      setActiveState,
      setLocked,
      setIsHovered,
      setIsFocused,
      toggleSeries,
      isolateSeries,
      reset,
    }),
    [
      activeDatumId,
      activeSeriesId,
      selectedDatumId,
      pointer,
      anchor,
      activeLabel,
      items,
      locked,
      isHovered,
      isFocused,
      mode,
      hiddenSeriesIds,
      setActiveState,
      toggleSeries,
      isolateSeries,
      reset,
    ]
  )

  return (
    <InteractionContext.Provider value={contextValue}>
      {children}
    </InteractionContext.Provider>
  )
}
