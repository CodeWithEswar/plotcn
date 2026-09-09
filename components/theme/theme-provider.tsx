"use client"

import * as React from "react"
import { ThemeTransitionOverlay } from "./theme-transition-overlay"

export type ThemeMode = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export interface ThemeContextValue {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  isTransitioning: boolean
  targetResolvedTheme: ResolvedTheme | null
  setTheme: (theme: ThemeMode, options?: { skipTransition?: boolean }) => void
}

const STORAGE_KEY = "plotcn-theme"
const THEME_CHANGE_EVENT = "plotcn-theme-change"

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeMode
  storageKey?: string
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getStoredTheme(storageKey: string, fallback: ThemeMode): ThemeMode {
  if (typeof window === "undefined") return fallback
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (stored === "light" || stored === "dark" || stored === "system") return stored
  } catch {
    // Storage may be unavailable in privacy-restricted browsing contexts.
  }
  return fallback
}

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.classList.toggle("light", resolved === "light")
  root.dataset.theme = resolved
  root.style.colorScheme = resolved
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const transitionIdRef = React.useRef(0)
  const animationFrameRef = React.useRef<number | null>(null)
  const cleanupTimerRef = React.useRef<number | null>(null)
  const activeViewTransitionRef = React.useRef<ViewTransition | null>(null)
  const [transitionState, setTransitionState] = React.useState<{
    active: boolean
    target: ResolvedTheme | null
  }>({ active: false, target: null })

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) onStoreChange()
      }
      media.addEventListener("change", onStoreChange)
      window.addEventListener("storage", handleStorage)
      window.addEventListener(THEME_CHANGE_EVENT, onStoreChange)
      return () => {
        media.removeEventListener("change", onStoreChange)
        window.removeEventListener("storage", handleStorage)
        window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange)
      }
    },
    [storageKey]
  )

  const getSnapshot = React.useCallback(() => {
    const preference = getStoredTheme(storageKey, defaultTheme)
    return `${preference}:${resolveTheme(preference)}`
  }, [defaultTheme, storageKey])

  const getServerSnapshot = React.useCallback(() => {
    const resolved = defaultTheme === "dark" ? "dark" : "light"
    return `${defaultTheme}:${resolved}`
  }, [defaultTheme])

  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [theme, resolvedTheme] = snapshot.split(":") as [ThemeMode, ResolvedTheme]

  React.useEffect(() => {
    applyThemeToDOM(resolvedTheme)
  }, [resolvedTheme])

  const commitTheme = React.useCallback(
    (nextTheme: ThemeMode, nextResolved: ResolvedTheme) => {
      try {
        window.localStorage.setItem(storageKey, nextTheme)
      } catch {
        // The current page still updates even when persistence is unavailable.
      }
      applyThemeToDOM(nextResolved)
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
    },
    [storageKey]
  )

  const clearTransition = React.useCallback((transitionId: number) => {
    if (transitionId !== transitionIdRef.current) return
    const root = document.documentElement
    delete root.dataset.themeTransition
    root.style.removeProperty("--plotcn-theme-reveal-radius")
    activeViewTransitionRef.current = null
    setTransitionState({ active: false, target: null })
  }, [])

  const setTheme = React.useCallback(
    (nextTheme: ThemeMode, options?: { skipTransition?: boolean }) => {
      const nextResolved = resolveTheme(nextTheme)
      const transitionId = ++transitionIdRef.current

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current)
        cleanupTimerRef.current = null
      }
      activeViewTransitionRef.current?.skipTransition()
      activeViewTransitionRef.current = null
      delete document.documentElement.dataset.themeTransition

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (options?.skipTransition || reduceMotion || nextResolved === resolvedTheme) {
        commitTheme(nextTheme, nextResolved)
        setTransitionState({ active: false, target: null })
        return
      }

      setTransitionState({ active: true, target: nextResolved })

      /* One frame lets a dropdown selection close before the root snapshot is
         captured. No application content is keyed by theme or remounted. */
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null
        if (transitionId !== transitionIdRef.current) return

        const root = document.documentElement
        const radius = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight)) + 2
        root.style.setProperty("--plotcn-theme-reveal-radius", `${radius}px`)

        if (typeof document.startViewTransition === "function") {
          root.dataset.themeTransition = "view"
          const transition = document.startViewTransition(() => {
            commitTheme(nextTheme, nextResolved)
          })
          activeViewTransitionRef.current = transition
          void transition.finished
            .catch(() => undefined)
            .finally(() => clearTransition(transitionId))
          return
        }

        root.dataset.themeTransition = "fallback"
        commitTheme(nextTheme, nextResolved)
        cleanupTimerRef.current = window.setTimeout(
          () => clearTransition(transitionId),
          560
        )
      })
    },
    [clearTransition, commitTheme, resolvedTheme]
  )

  React.useEffect(() => {
    return () => {
      transitionIdRef.current += 1
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current)
      if (cleanupTimerRef.current !== null) window.clearTimeout(cleanupTimerRef.current)
      activeViewTransitionRef.current?.skipTransition()
      delete document.documentElement.dataset.themeTransition
      document.documentElement.style.removeProperty("--plotcn-theme-reveal-radius")
    }
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      isTransitioning: transitionState.active,
      targetResolvedTheme: transitionState.target,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme, transitionState]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeTransitionOverlay />
      {children}
    </ThemeContext.Provider>
  )
}

/** Runs before first paint so the saved or system theme never flashes. */
export const themeInitScript = `(function(){try{var key='${STORAGE_KEY}';var stored=localStorage.getItem(key);var theme=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';var resolved=theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;var root=document.documentElement;if(resolved==='dark'){root.classList.add('dark');root.classList.remove('light');}else{root.classList.remove('dark');root.classList.add('light');}root.dataset.theme=resolved;root.style.colorScheme=resolved;}catch(e){}})();`
