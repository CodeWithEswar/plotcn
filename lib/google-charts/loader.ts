import type { GoogleChartPackage, GoogleGlobal } from "./types"

declare global {
  interface Window {
    google?: GoogleGlobal
  }
}

const GOOGLE_CHARTS_SCRIPT_URL = "https://www.gstatic.com/charts/loader.js"

let scriptPromise: Promise<void> | null = null
const loadedPackages = new Set<string>()

/**
 * Injects Google's official chart loader script once into the document.
 * Returns a shared Promise that resolves when the loader script is ready.
 */
function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Charts cannot be loaded in server-side environment."))
  }

  if (window.google?.charts) {
    return Promise.resolve()
  }

  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    // Check if script element already exists in document
    const existingScript = document.querySelector(`script[src="${GOOGLE_CHARTS_SCRIPT_URL}"]`)
    if (existingScript) {
      if (window.google?.charts) {
        resolve()
        return
      }
      existingScript.addEventListener("load", () => resolve())
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Charts loader script.")))
      return
    }

    const script = document.createElement("script")
    script.src = GOOGLE_CHARTS_SCRIPT_URL
    script.type = "text/javascript"
    script.async = true

    const timeoutId = setTimeout(() => {
      reject(new Error("Google Charts loader script timed out after 10 seconds."))
    }, 10000)

    script.onload = () => {
      clearTimeout(timeoutId)
      resolve()
    }

    script.onerror = () => {
      clearTimeout(timeoutId)
      scriptPromise = null
      reject(new Error("Failed to download Google Charts loader from https://www.gstatic.com/charts/loader.js"))
    }

    document.head.appendChild(script)
  })

  return scriptPromise
}

export interface LoadGoogleChartsOptions {
  packages?: GoogleChartPackage[]
  version?: string
}

/**
 * Loads Google Charts library with requested visualization packages.
 * Deduplicates concurrent calls and caches loaded packages.
 */
export async function loadGoogleCharts(options: LoadGoogleChartsOptions = {}): Promise<GoogleGlobal> {
  await loadGoogleScript()

  if (!window.google?.charts) {
    throw new Error("window.google.charts is unavailable after script loading.")
  }

  const packagesToLoad = (options.packages || ["corechart"]).filter(
    (pkg) => !loadedPackages.has(pkg)
  )

  if (packagesToLoad.length === 0) {
    return window.google
  }

  const version = options.version || "current"

  await new Promise<void>((resolve, reject) => {
    try {
      window.google!.charts.load(version, {
        packages: packagesToLoad,
      })

      window.google!.charts.setOnLoadCallback(() => {
        packagesToLoad.forEach((pkg) => loadedPackages.add(pkg))
        resolve()
      })
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)))
    }
  })

  return window.google
}
