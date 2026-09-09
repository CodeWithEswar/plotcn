/**
 * Universal fallback for browsers without the View Transitions API.
 * The element stays mounted so changing themes never remounts application UI.
 */
export function ThemeTransitionOverlay() {
  return <div className="theme-transition-overlay" aria-hidden="true" />
}
