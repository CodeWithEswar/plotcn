"use client"

import React, { useRef, useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerIcon,
  Tablet01Icon,
  SmartPhone01Icon,
  RefreshIcon,
  Maximize01Icon,
  Minimize01Icon,
  Sun03Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { cn } from "@/lib/utils"

interface HeroPreviewWorkspaceProps {
  chart: ChartMetadata
}

export function HeroPreviewWorkspace({ chart }: HeroPreviewWorkspaceProps) {
  const [deviceWidth, setDeviceWidth] = useState<number | "100%">("100%")
  const [fsDeviceWidth, setFsDeviceWidth] = useState<number | "100%">("100%")
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [iteration, setIteration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [measuredWidth, setMeasuredWidth] = useState(1098)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setMeasuredWidth(Math.floor(entries[0].contentRect.width))
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Full-window / Full-screen handling and body scroll lock
  useEffect(() => {
    if (!fullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreen(false)
        if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {})
        }
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [fullscreen])

  // Sync with browser fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && fullscreen) {
        setFullscreen(false)
      }
    }
    document.addEventListener("fullscreenchange", handleFsChange)
    return () => document.removeEventListener("fullscreenchange", handleFsChange)
  }, [fullscreen])

  const openFullscreen = () => {
    setFsDeviceWidth(deviceWidth)
    setFullscreen(true)
    if (typeof document !== "undefined" && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  const closeFullscreen = () => {
    setFullscreen(false)
    if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }

  const devices = [
    { label: "Desktop", width: "100%" as const, icon: ComputerIcon },
    { label: "Tablet", width: 768, icon: Tablet01Icon },
    { label: "Mobile", width: 390, icon: SmartPhone01Icon },
  ]

  return (
    <section id="section-preview" className="space-y-3 scroll-mt-24">
      {/* 1. Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-sm text-xs">
        {/* Device Switcher */}
        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900/80 border border-white/[0.06]" role="group" aria-label="Container width">
          {devices.map((d) => {
            const active = deviceWidth === d.width
            return (
              <button
                key={d.label}
                type="button"
                aria-pressed={active}
                onClick={() => setDeviceWidth(d.width)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer",
                  active
                    ? "bg-white/[0.12] text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                )}
              >
                <HugeiconsIcon icon={d.icon} size={14} />
                <span>{d.label}</span>
              </button>
            )
          })}
        </div>

        {/* Action Controls: Theme / Refresh / Fullscreen */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle preview theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.06] bg-zinc-900/60 hover:bg-white/[0.06] text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={theme === "dark" ? Moon02Icon : Sun03Icon} size={13} />
            <span className="capitalize">{theme}</span>
          </button>

          {/* Refresh Animation */}
          <button
            type="button"
            aria-label="Replay chart animation"
            onClick={() => setIteration((i) => i + 1)}
            className="inline-flex items-center justify-center size-7 rounded-lg border border-white/[0.06] bg-zinc-900/60 hover:bg-white/[0.06] text-zinc-300 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={RefreshIcon} size={13} />
          </button>

          {/* Full-Screen Full-Window Expansion */}
          <button
            type="button"
            aria-label="Expand preview to full screen"
            onClick={openFullscreen}
            className="inline-flex items-center justify-center size-7 rounded-lg border border-white/[0.06] bg-zinc-900/60 hover:bg-white/[0.06] text-zinc-300 transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Maximize01Icon} size={13} />
          </button>
        </div>
      </div>

      {/* 2. Responsive Canvas Viewport */}
      <div className="flex justify-center rounded-2xl border border-white/[0.08] bg-black/40 p-3 sm:p-6 overflow-hidden min-h-[380px] max-h-[500px]">
        <div
          ref={containerRef}
          style={{ width: deviceWidth }}
          className="transition-all duration-300 ease-out max-w-full flex flex-col justify-center"
        >
          <div
            className="charts-surface rounded-xl border border-white/[0.06] bg-zinc-950/80 p-4 shadow-xl backdrop-blur-md"
            data-theme={theme}
          >
            <DynamicChartRenderer
              key={iteration}
              registryName={chart.registryName}
              height={320}
              motion={true}
            />
          </div>
        </div>
      </div>

      {/* 3. Runtime Technical Strip */}
      <div className="flex items-center justify-between px-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
        <span>
          {chart.engine.toUpperCase()} · {chart.renderer.toUpperCase()} · {measuredWidth} × 320PX · {theme.toUpperCase()}
        </span>
        <span className="hidden sm:inline">Container-driven ResizeObserver</span>
      </div>

      {/* 4. Full Window / Full Screen Takeover (No Dialog Box) */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[99999] w-screen h-screen bg-zinc-950 flex flex-col overflow-hidden charts-surface animate-in fade-in duration-200"
          data-theme={theme}
          role="region"
          aria-label={`${chart.title} Full Window Preview`}
        >
          {/* Top Control Strip */}
          <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-zinc-950/90 backdrop-blur-md shrink-0">
            {/* Left: Identity */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-semibold text-white text-sm sm:text-base truncate font-sans">
                  {chart.title}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Full Window Workspace
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] hidden md:inline">
                {chart.engine} · {chart.renderer}
              </span>
            </div>

            {/* Center: Device Simulation Switcher */}
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-xs">
              {devices.map((d) => {
                const active = fsDeviceWidth === d.width
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setFsDeviceWidth(d.width)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer",
                      active
                        ? "bg-white/[0.15] text-white shadow-xs"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    <HugeiconsIcon icon={d.icon} size={13} />
                    <span className="hidden sm:inline">{d.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Right: Actions & Exit */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-zinc-900/80 hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={theme === "dark" ? Moon02Icon : Sun03Icon} size={14} />
                <span className="capitalize hidden sm:inline">{theme}</span>
              </button>

              <button
                type="button"
                aria-label="Replay chart animation"
                onClick={() => setIteration((i) => i + 1)}
                className="inline-flex items-center justify-center size-8 rounded-lg border border-white/[0.08] bg-zinc-900/80 hover:bg-white/[0.08] text-zinc-300 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={RefreshIcon} size={14} />
              </button>

              <button
                type="button"
                onClick={closeFullscreen}
                aria-label="Exit full screen preview"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.15] bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-white font-medium transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Minimize01Icon} size={14} />
                <span>Exit</span>
                <kbd className="text-[10px] font-mono text-zinc-400 bg-black/40 px-1 py-0.2 rounded border border-white/10 hidden sm:inline">
                  ESC
                </kbd>
              </button>
            </div>
          </header>

          {/* Full Window Chart Canvas */}
          <div className="flex-1 w-full h-full min-h-0 p-4 sm:p-8 flex items-center justify-center bg-black/50 overflow-hidden">
            <div
              style={{ width: fsDeviceWidth }}
              className="h-full w-full max-w-full flex flex-col justify-center transition-all duration-300 ease-out"
            >
              <div className="w-full h-full max-h-[88vh] rounded-2xl border border-white/[0.08] bg-zinc-950/90 p-4 sm:p-8 shadow-2xl flex flex-col justify-center">
                <DynamicChartRenderer
                  key={`fs-${iteration}`}
                  registryName={chart.registryName}
                  height="100%"
                  motion={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
