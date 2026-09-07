"use client"

import React, { useRef } from "react"
import { useInstallation } from "./installation-context"
import { frameworks, type SupportedFramework } from "./installation-config"
import {
  NextjsIcon,
  ViteIcon,
  TanStackIcon,
  LaravelIcon,
  ReactRouterIcon,
  AstroIcon,
  ManualIcon,
} from "./framework-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

export function FrameworkSelector() {
  const { framework, setFramework } = useInstallation()
  const radioGroupRef = useRef<HTMLDivElement>(null)

  const renderIcon = (id: SupportedFramework) => {
    switch (id) {
      case "next":
        return <NextjsIcon size={26} />
      case "vite":
        return <ViteIcon size={26} />
      case "tanstack-start":
        return <TanStackIcon size={26} />
      case "laravel":
        return <LaravelIcon size={26} />
      case "react-router":
        return <ReactRouterIcon size={26} />
      case "astro":
        return <AstroIcon size={26} />
      case "manual":
        return <ManualIcon size={24} />
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      nextIndex = (index + 1) % frameworks.length
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      nextIndex = (index - 1 + frameworks.length) % frameworks.length
    } else if (e.key === "Home") {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === "End") {
      e.preventDefault()
      nextIndex = frameworks.length - 1
    }

    if (nextIndex !== index) {
      const nextFw = frameworks[nextIndex]
      setFramework(nextFw.id)
      const targetBtn = radioGroupRef.current?.children[nextIndex] as HTMLElement
      targetBtn?.focus()
    }
  }

  // Split into main frameworks and the quieter manual option
  const mainFrameworks = frameworks.filter((f) => f.id !== "manual")
  const manualFramework = frameworks.find((f) => f.id === "manual")

  return (
    <div className="my-6 space-y-3">
      {/* 3-column / 2-column main framework grid */}
      <div
        ref={radioGroupRef}
        role="radiogroup"
        aria-label="Choose your framework"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {mainFrameworks.map((item, index) => {
          const isSelected = framework === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select ${item.name}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setFramework(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`group relative flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
                isSelected
                  ? "bg-zinc-900/90 border-white/[0.24] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                  : "bg-zinc-950/70 border-white/[0.07] hover:border-white/[0.15] hover:bg-zinc-900/40"
              }`}
            >
              {/* Framework Logo */}
              <div className="shrink-0 mt-0.5 transition-transform duration-150 group-hover:scale-[1.03]">
                {renderIcon(item.id)}
              </div>

              {/* Title & Short Descriptor */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[13px] font-medium tracking-tight truncate ${
                      isSelected ? "text-white font-semibold" : "text-zinc-200 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Selection Checkmark */}
              <div
                className={`absolute top-3.5 right-3.5 transition-opacity duration-150 ${
                  isSelected ? "opacity-100 text-white" : "opacity-0"
                }`}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2.2} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Quieter Manual Setup Card */}
      {manualFramework && (
        <button
          type="button"
          role="radio"
          aria-checked={framework === "manual"}
          aria-label="Select Manual setup"
          tabIndex={framework === "manual" ? 0 : -1}
          onClick={() => setFramework("manual")}
          onKeyDown={(e) => handleKeyDown(e, frameworks.length - 1)}
          className={`group w-full flex items-center justify-between p-3 px-4 rounded-xl border text-left transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
            framework === "manual"
              ? "bg-zinc-900/90 border-white/[0.24] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              : "bg-zinc-950/40 border-white/[0.05] hover:border-white/[0.12] hover:bg-zinc-900/30"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 text-zinc-400 group-hover:text-zinc-200 transition-colors">
              {renderIcon("manual")}
            </div>
            <div>
              <span
                className={`text-[13px] font-medium ${
                  framework === "manual" ? "text-white" : "text-zinc-300 group-hover:text-white"
                }`}
              >
                Manual setup
              </span>
              <span className="text-[11px] text-zinc-500 ml-2 hidden sm:inline">
                Custom React pipeline or unlisted framework
              </span>
            </div>
          </div>

          <div
            className={`transition-opacity duration-150 ${
              framework === "manual" ? "opacity-100 text-white" : "opacity-0"
            }`}
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2.2} />
          </div>
        </button>
      )}
    </div>
  )
}
