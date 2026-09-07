export interface PointerPosition {
  x: number
  y: number
}

export interface ChartInteractionState {
  /** Identifier of the currently hovered/focused datum */
  activeDatumId: string | null
  /** Identifier of the currently active series */
  activeSeriesId: string | null
  /** Identifier of the persistently selected datum */
  selectedDatumId: string | null
  /** Current pointer coordinate relative to plot area */
  pointer: PointerPosition | null
  /** True when pointer is actively within chart bounds */
  isHovered: boolean
  /** True when chart receives keyboard focus */
  isFocused: boolean
}

export interface InteractionContextValue extends ChartInteractionState {
  setActiveDatum: (id: string | null) => void
  setActiveSeries: (id: string | null) => void
  setSelectedDatum: (id: string | null) => void
  setPointer: (pos: PointerPosition | null) => void
  setIsHovered: (hovered: boolean) => void
  setIsFocused: (focused: boolean) => void
  reset: () => void
}
