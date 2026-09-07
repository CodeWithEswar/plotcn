import type {
  KeyboardNavigationAction,
  KeyboardNavigationConfig,
  KeyboardNavigationState,
} from "./types"

/**
 * Calculates next datum index with deterministic boundary clamping.
 * Section 11.75, 11.76.
 */
export function getNextDatumIndex(
  currentIndex: number,
  totalCount: number,
  wrap = false
): number {
  if (totalCount <= 0) return 0
  if (currentIndex < 0) return 0

  if (currentIndex >= totalCount - 1) {
    return wrap ? 0 : totalCount - 1
  }

  return currentIndex + 1
}

/**
 * Calculates previous datum index with deterministic boundary clamping.
 * Section 11.75, 11.76.
 */
export function getPreviousDatumIndex(
  currentIndex: number,
  totalCount: number,
  wrap = false
): number {
  if (totalCount <= 0) return 0
  if (currentIndex <= 0) {
    return wrap ? totalCount - 1 : 0
  }

  return currentIndex - 1
}

/**
 * Calculates next series index across multi-series visualizations.
 * Section 11.19.
 */
export function getNextSeriesIndex(
  currentIndex: number,
  totalSeriesCount: number,
  wrap = false
): number {
  if (totalSeriesCount <= 1) return 0
  if (currentIndex >= totalSeriesCount - 1) {
    return wrap ? 0 : totalSeriesCount - 1
  }
  return currentIndex + 1
}

/**
 * Calculates previous series index across multi-series visualizations.
 * Section 11.19.
 */
export function getPreviousSeriesIndex(
  currentIndex: number,
  totalSeriesCount: number,
  wrap = false
): number {
  if (totalSeriesCount <= 1) return 0
  if (currentIndex <= 0) {
    return wrap ? totalSeriesCount - 1 : 0
  }
  return currentIndex - 1
}

/**
 * Returns first datum index.
 * Section 11.77.
 */
export function getFirstDatumIndex(): number {
  return 0
}

/**
 * Returns last datum index.
 * Section 11.77.
 */
export function getLastDatumIndex(totalCount: number): number {
  return Math.max(0, totalCount - 1)
}

/**
 * Maps a KeyboardEvent key code to an abstract chart navigation action.
 * Section 11.17, 11.75.
 */
export function mapKeyToNavigationAction(key: string): KeyboardNavigationAction {
  switch (key) {
    case "ArrowLeft":
      return "PREV_DATUM"
    case "ArrowRight":
      return "NEXT_DATUM"
    case "ArrowUp":
      return "PREV_SERIES"
    case "ArrowDown":
      return "NEXT_SERIES"
    case "Home":
      return "FIRST_DATUM"
    case "End":
      return "LAST_DATUM"
    case "Enter":
    case " ":
      return "ACTIVATE"
    case "Escape":
      return "CLEAR"
    default:
      return "NONE"
  }
}

/**
 * Pure state transition function applying a keyboard action to the navigation state.
 * Section 11.17 - 11.20, 11.74 - 11.79.
 */
export function applyKeyboardAction(
  action: KeyboardNavigationAction,
  currentState: KeyboardNavigationState,
  config: KeyboardNavigationConfig
): KeyboardNavigationState {
  const { totalCount, totalSeriesCount = 1, wrap = false } = config

  switch (action) {
    case "PREV_DATUM":
      return {
        ...currentState,
        datumIndex: getPreviousDatumIndex(currentState.datumIndex, totalCount, wrap),
      }
    case "NEXT_DATUM":
      return {
        ...currentState,
        datumIndex: getNextDatumIndex(currentState.datumIndex, totalCount, wrap),
      }
    case "PREV_SERIES":
      return {
        ...currentState,
        seriesIndex: getPreviousSeriesIndex(currentState.seriesIndex, totalSeriesCount, wrap),
      }
    case "NEXT_SERIES":
      return {
        ...currentState,
        seriesIndex: getNextSeriesIndex(currentState.seriesIndex, totalSeriesCount, wrap),
      }
    case "FIRST_DATUM":
      return {
        ...currentState,
        datumIndex: getFirstDatumIndex(),
      }
    case "LAST_DATUM":
      return {
        ...currentState,
        datumIndex: getLastDatumIndex(totalCount),
      }
    case "ACTIVATE":
      return {
        ...currentState,
        isLocked: !currentState.isLocked,
      }
    case "CLEAR":
      return {
        ...currentState,
        isLocked: false,
      }
    case "NONE":
    default:
      return currentState
  }
}
