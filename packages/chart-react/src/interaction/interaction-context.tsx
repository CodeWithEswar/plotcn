"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import type { PointerPosition, InteractionContextValue } from "../types/interaction"

export const InteractionContext = createContext<InteractionContextValue | null>(null)
InteractionContext.displayName = "InteractionContext"

/**
 * Accesses chart interaction state (activeDatum, activeSeries, selectedDatum, pointer position).
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
}

/**
 * InteractionProvider isolates transient pointer positions, hover states,
 * active data, and persistent selections to prevent unnecessary chart redraws.
 */
export function InteractionProvider({
  children,
  defaultSelectedDatumId = null,
}: InteractionProviderProps) {
  const [activeDatumId, setActiveDatumId] = useState<string | null>(null)
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null)
  const [selectedDatumId, setSelectedDatumId] = useState<string | null>(defaultSelectedDatumId)
  const [pointer, setPointer] = useState<PointerPosition | null>(null)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const reset = useCallback(() => {
    setActiveDatumId(null)
    setActiveSeriesId(null)
    setPointer(null)
    setIsHovered(false)
  }, [])

  const contextValue = useMemo<InteractionContextValue>(
    () => ({
      activeDatumId,
      activeSeriesId,
      selectedDatumId,
      pointer,
      isHovered,
      isFocused,
      setActiveDatum: setActiveDatumId,
      setActiveSeries: setActiveSeriesId,
      setSelectedDatum: setSelectedDatumId,
      setPointer,
      setIsHovered,
      setIsFocused,
      reset,
    }),
    [activeDatumId, activeSeriesId, selectedDatumId, pointer, isHovered, isFocused, reset]
  )

  return (
    <InteractionContext.Provider value={contextValue}>
      {children}
    </InteractionContext.Provider>
  )
}
