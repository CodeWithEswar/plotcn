"use client"

import React, { useState, useCallback, useEffect, type ReactNode } from "react"
import { useInteraction } from "./interaction-context"

export interface ChartSelectionProps {
  children?: ReactNode
  /** Controlled selected datum ID */
  value?: string | null
  /** Default uncontrolled selected datum ID */
  defaultValue?: string | null
  /** Callback fired when selection changes */
  onValueChange?: (id: string | null) => void
}

/**
 * ChartSelection coordinates controlled and uncontrolled persistent selection state,
 * synchronizing with the parent InteractionContext.
 */
export function ChartSelection({
  children,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
}: ChartSelectionProps) {
  const [internalValue, setInternalValue] = useState<string | null>(
    controlledValue !== undefined ? controlledValue : defaultValue
  )

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  let interaction: ReturnType<typeof useInteraction> | null = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    interaction = useInteraction()
  } catch {
    // Standalone usage
  }

  const handleSelect = useCallback(
    (id: string | null) => {
      if (!isControlled) {
        setInternalValue(id)
      }
      onValueChange?.(id)
      interaction?.setSelectedDatum(id)
    },
    [isControlled, onValueChange, interaction]
  )

  useEffect(() => {
    if (interaction && currentValue !== interaction.selectedDatumId) {
      interaction.setSelectedDatum(currentValue)
    }
  }, [currentValue, interaction])

  return <>{children}</>
}
