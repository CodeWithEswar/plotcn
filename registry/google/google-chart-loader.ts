/**
 * Plotcn Shared Google Charts Singleton Loader
 * Handles script injection, concurrent request deduplication, on-demand package loading, and SSR safety.
 */

export interface GoogleDataTableColumn {
  type: string
  id?: string
  label?: string
  role?: string
  p?: Record<string, unknown>
}

export interface GoogleVisualizationDataTable {
  addColumn: (typeOrCol: string | GoogleDataTableColumn, label?: string, id?: string) => number | void
  addRow: (cellValues: unknown[]) => number | void
  addRows: (numOrArray: number | unknown[][]) => number | void
  getNumberOfRows?: () => number
  getNumberOfColumns?: () => number
  getValue?: (rowIndex: number, columnIndex: number) => unknown
  getFormattedValue?: (rowIndex: number, columnIndex: number) => string
}

export interface GoogleVisualizationChart {
  draw: (data: GoogleVisualizationDataTable, options?: Record<string, unknown>) => void
  clearChart?: () => void
  getSelection?: () => Array<{ row?: number; column?: number }>
  setSelection?: (selection: Array<{ row?: number; column?: number }>) => void
}

export interface GoogleChartsApi {
  charts: {
    load: (version: string, options: { packages: readonly string[]; language?: string }) => Promise<void> | void
    setOnLoadCallback: (callback: () => void) => void
  }
  visualization: {
    DataTable: new (data?: unknown) => GoogleVisualizationDataTable
    arrayToDataTable?: (rows: unknown[][], opt_firstRowIsData?: boolean) => GoogleVisualizationDataTable
    LineChart: new (element: HTMLElement) => GoogleVisualizationChart
    ColumnChart: new (element: HTMLElement) => GoogleVisualizationChart
    GeoChart: new (element: HTMLElement) => GoogleVisualizationChart
    events: {
      addListener: (target: unknown, eventName: string, handler: (event?: unknown) => void) => unknown
      removeListener?: (listener: unknown) => void
      removeAllListeners?: (target: unknown) => void
    }
    [key: string]: unknown
  }
}

declare global {
  interface Window {
    google?: GoogleChartsApi
  }
}

export type GoogleChartsLoaderState = "idle" | "loading" | "ready" | "error"

export function escapeGoogleTooltipText(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export const googleChartPackages = {
  core: ["corechart"],
  geo: ["geochart"],
  timeline: ["timeline"],
  sankey: ["sankey"],
  org: ["orgchart"],
  table: ["table"],
} as const

export type GooglePackageKey = keyof typeof googleChartPackages

let loaderPromise: Promise<void> | null = null
let loaderState: GoogleChartsLoaderState = "idle"
const loadedPackages = new Set<string>()

export function getLoaderState(): GoogleChartsLoaderState {
  return loaderState
}

/**
 * Loads the base Google Charts JavaScript loader tag at most once.
 */
export function loadGoogleChartsBase(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (window.google?.charts) {
    loaderState = "ready"
    return Promise.resolve()
  }

  if (loaderPromise) {
    return loaderPromise
  }

  loaderState = "loading"
  loaderPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag already exists in DOM
    const existing = document.querySelector('script[src="https://www.gstatic.com/charts/loader.js"]')
    if (existing) {
      existing.addEventListener("load", () => {
        loaderState = "ready"
        resolve()
      })
      existing.addEventListener("error", () => {
        loaderState = "error"
        reject(new Error("Failed to load Google Charts base script."))
      })
      return
    }

    const script = document.createElement("script")
    script.src = "https://www.gstatic.com/charts/loader.js"
    script.async = true
    script.onload = () => {
      loaderState = "ready"
      resolve()
    }
    script.onerror = () => {
      loaderState = "error"
      loaderPromise = null
      reject(new Error("Failed to load Google Charts script from CDN."))
    }
    document.head.appendChild(script)
  })

  return loaderPromise
}

/**
 * Loads specific packages on demand.
 */
export async function loadGoogleChartsPackages(packages: readonly string[]): Promise<void> {
  await loadGoogleChartsBase()

  const pending = packages.filter((pkg) => !loadedPackages.has(pkg))
  if (pending.length === 0) {
    return
  }

  return new Promise<void>((resolve, reject) => {
    if (!window.google?.charts) {
      reject(new Error("Google Charts loader is not available."))
      return
    }
    window.google.charts.load("current", {
      packages: pending,
    })
    window.google.charts.setOnLoadCallback(() => {
      pending.forEach((pkg: string) => loadedPackages.add(pkg))
      resolve()
    })
  })
}

/**
 * Resolves any CSS color string (hex, rgb, hsl, oklch, CSS variable)
 * to a concrete color format that Google Charts SVG engine can render reliably.
 */
export function resolveGoogleColor(
  colorStr: string | undefined,
  element?: HTMLElement | null,
  fallback = "#10b981"
): string {
  if (!colorStr) return fallback

  let current = colorStr.trim()

  // 1. If it's already a standard hex color, return directly
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(current)) {
    return current
  }

  // 2. If it's a CSS variable e.g. var(--chart-1, #10b981)
  if (current.startsWith("var(")) {
    const inside = current.slice(4, -1).trim()
    const parts = inside.split(",")
    const varName = parts[0].trim()
    const defaultVal = parts[1]?.trim() || fallback

    if (element && typeof window !== "undefined") {
      const computed = getComputedStyle(element).getPropertyValue(varName).trim()
      current = computed || defaultVal
    } else {
      current = defaultVal
    }

    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(current)) {
      return current
    }
  }

  // 3. If standard rgba/rgb with numbers, return directly
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*[\d.]+/i.test(current)) {
    return current
  }

  // 4. Resolve modern CSS colors (oklch, lab, etc.) via 1x1 canvas pixel read
  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (ctx) {
        ctx.fillStyle = current
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        if (a === 255) {
          const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
          return `#${hex}`
        }
        return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`
      }
    } catch {
      // fallback
    }
  }

  return current || fallback
}
