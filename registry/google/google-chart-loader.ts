/**
 * Plotcn Shared Google Charts Singleton Loader
 * Handles script injection, concurrent request deduplication, on-demand package loading, and SSR safety.
 */

declare global {
  interface Window {
    google?: any
  }
}

export type GoogleChartsLoaderState = "idle" | "loading" | "ready" | "error"

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
