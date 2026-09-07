"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
  type SupportedFramework,
  type PackageManager,
  frameworks,
} from "./installation-config"

interface InstallationContextValue {
  framework: SupportedFramework
  setFramework: (framework: SupportedFramework) => void
  packageManager: PackageManager
  setPackageManager: (pkg: PackageManager) => void
}

const InstallationContext = createContext<InstallationContextValue | null>(null)

export function InstallationProvider({
  children,
  defaultFramework = "next",
  defaultPackageManager = "pnpm",
}: {
  children: React.ReactNode
  defaultFramework?: SupportedFramework
  defaultPackageManager?: PackageManager
}) {
  const [framework, setFrameworkState] = useState<SupportedFramework>(defaultFramework)
  const [packageManager, setPackageManagerState] = useState<PackageManager>(defaultPackageManager)

  // Initialize from URL search params & localStorage after client mount
  useEffect(() => {
    try {
      // 1. Check URL query param for ?framework=...
      const params = new URLSearchParams(window.location.search)
      const fwParam = params.get("framework") as SupportedFramework | null
      if (fwParam && frameworks.some((f) => f.id === fwParam)) {
        setFrameworkState(fwParam)
      }

      // 2. Check localStorage for package manager preference
      const storedPkg = localStorage.getItem("plotcn_pkg_mgr") as PackageManager | null
      if (storedPkg && ["pnpm", "npm", "yarn", "bun"].includes(storedPkg)) {
        setPackageManagerState(storedPkg)
      }
    } catch {
      // Ignore local storage or search param errors in restricted sandbox
    }
  }, [])

  const setFramework = useCallback((fw: SupportedFramework) => {
    setFrameworkState(fw)
    try {
      const url = new URL(window.location.href)
      if (fw === "next") {
        url.searchParams.delete("framework")
      } else {
        url.searchParams.set("framework", fw)
      }
      window.history.replaceState({}, "", url.toString())
    } catch {
      // Non-browser or SSR fallback
    }
  }, [])

  const setPackageManager = useCallback((pkg: PackageManager) => {
    setPackageManagerState(pkg)
    try {
      localStorage.setItem("plotcn_pkg_mgr", pkg)
    } catch {
      // Non-browser or SSR fallback
    }
  }, [])

  return (
    <InstallationContext.Provider
      value={{
        framework,
        setFramework,
        packageManager,
        setPackageManager,
      }}
    >
      {children}
    </InstallationContext.Provider>
  )
}

export function useInstallation(): InstallationContextValue {
  const ctx = useContext(InstallationContext)
  if (!ctx) {
    // Fallback safe values if used outside provider
    return {
      framework: "next",
      setFramework: () => {},
      packageManager: "pnpm",
      setPackageManager: () => {},
    }
  }
  return ctx
}
