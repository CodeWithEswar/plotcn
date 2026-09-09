"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  RefreshIcon,
  ColorsIcon,
  ArrowDown01Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import {
  type ChartColorRoleDef,
  CURATED_COLOR_GROUPS,
  THEME_CHART_TOKENS,
  isValidColor,
  calculateContrastRatio,
  resolveDisplayHex,
} from "@/lib/charts/chart-colors"
import { cn } from "@/lib/utils"

export interface ChartColorControlProps {
  role: ChartColorRoleDef
  value?: string
  onChange: (color: string) => void
  onReset?: () => void
  className?: string
  compact?: boolean
}

export function ChartColorControl({
  role,
  value,
  onChange,
  onReset,
  className,
  compact = false,
}: ChartColorControlProps) {
  const [open, setOpen] = React.useState(false)
  const isDefault = !value || value === "theme" || value === role.defaultToken
  const activeValue = value || role.defaultToken

  // Resolved hex for preview display
  const displayHex = React.useMemo(() => {
    return resolveDisplayHex(activeValue, role.defaultToken, true)
  }, [activeValue, role.defaultToken])

  // Custom hex input local state
  const [customHex, setCustomHex] = React.useState(() => {
    return activeValue.startsWith("#") ? activeValue : displayHex
  })
  const [inputError, setInputError] = React.useState<string | null>(null)

  // Update input text when value changes externally
  React.useEffect(() => {
    if (activeValue.startsWith("#")) {
      setCustomHex(activeValue)
      setInputError(null)
    }
  }, [activeValue])

  // Contrast against dark background (#09090b)
  const contrastRatio = React.useMemo(() => {
    return calculateContrastRatio(displayHex, "#09090b")
  }, [displayHex])
  const isLowContrast = contrastRatio < 3.0
  const isHighContrast = contrastRatio >= 4.5

  const handleApplyHex = (hex: string) => {
    let clean = hex.trim()
    if (!clean.startsWith("#") && !clean.startsWith("var(")) {
      clean = `#${clean}`
    }
    if (isValidColor(clean)) {
      setInputError(null)
      onChange(clean)
    } else {
      setInputError("Use #RRGGBB or var(--chart-*)")
    }
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      onChange(role.defaultToken)
    }
  }

  return (
    <>
      {/* Trigger Button: Responsive, matching height of toolbar items */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${role.label} color: ${isDefault ? "Theme Default" : activeValue}`}
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-zinc-950/80 px-2 text-xs font-mono transition-all hover:border-white/25 hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-emerald-500/50 cursor-pointer outline-none select-none text-zinc-200",
          compact
            ? "h-7 sm:h-8 w-auto"
            : "h-8 sm:h-9 w-full min-w-[160px] justify-between px-2.5",
          className
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Swatch Circle */}
          <span
            className="size-3.5 shrink-0 rounded-full border border-white/25 shadow-xs transition-transform group-hover:scale-110"
            style={{ backgroundColor: displayHex }}
          />
          <span className="text-xs font-medium text-zinc-200 truncate max-w-[75px] sm:max-w-[105px]">
            {role.label}
          </span>
          <span className="text-[11px] font-mono text-zinc-400 truncate hidden xs:inline">
            {displayHex}
          </span>
        </div>

        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={12}
          className="text-zinc-400 transition-transform group-hover:text-zinc-200 shrink-0"
        />
      </button>

      {/* Horizontal, Professional, Fully Responsive Color Customization Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[calc(100%-1.5rem)] sm:w-[780px] md:w-[860px] lg:w-[920px] max-w-[920px] max-h-[92vh] sm:max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden bg-zinc-950 border border-white/[0.14] text-white rounded-2xl shadow-2xl backdrop-blur-2xl ring-1 ring-white/[0.06]"
          style={{
            width: "min(920px, calc(100vw - 2rem))",
            maxWidth: "min(920px, calc(100vw - 2rem))",
          }}
        >
          {/* Header */}
          <DialogHeader className="shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08] bg-zinc-950/95 backdrop-blur-md pr-12 text-left space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <HugeiconsIcon icon={ColorsIcon} size={16} />
              </span>
              <DialogTitle className="text-base sm:text-lg font-semibold font-sans text-zinc-100 tracking-tight">
                {role.label} Color Configuration
              </DialogTitle>
              {isDefault ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
                  Theme Default
                </span>
              ) : (
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-sky-400 border border-sky-500/20">
                  Custom Override
                </span>
              )}
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans leading-relaxed max-w-2xl">
              {role.description} Selected color updates the live preview, code generator, and variants immediately.
            </DialogDescription>
          </DialogHeader>

          {/* Body: Horizontal 2-Column Grid on Desktop, Clean Scroll on Mobile */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-0 scrollbar-thin">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Active Preview, WCAG Metric & Custom Input (5 cols) */}
              <div className="sm:col-span-5 space-y-4">
                {/* Active Preview Card */}
                <div className="rounded-xl border border-white/[0.1] bg-black/40 p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    <span>Active Preview</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {isDefault ? "Inherited" : "Overridden"}
                    </span>
                  </div>

                  {/* Large Swatch Block with Mini Visualization */}
                  <div
                    className="w-full h-24 rounded-lg border border-white/20 relative overflow-hidden shadow-inner flex flex-col justify-between p-3 transition-colors duration-200"
                    style={{ backgroundColor: displayHex }}
                  >
                    {/* Subtle Mini SVG wave demonstrating stroke */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                      <svg viewBox="0 0 160 40" className="w-full h-full stroke-white fill-none" strokeWidth="2.5">
                        <path d="M0,25 Q40,5 80,22 T160,15" />
                      </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        Swatch
                      </span>
                    </div>

                    <div className="relative z-10 bg-black/75 backdrop-blur-md rounded-md px-2.5 py-1 flex items-center justify-between border border-white/15">
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {displayHex.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-300 truncate max-w-[120px]">
                        {isDefault ? role.defaultToken : "Custom"}
                      </span>
                    </div>
                  </div>

                  {/* Contrast Metric Banner */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-900/80 border border-white/[0.06]">
                    <div className="text-[11px] text-zinc-300 font-sans">
                      Dark contrast:
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold border",
                          isLowContrast
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        )}
                      >
                        {isLowContrast && <HugeiconsIcon icon={AlertCircleIcon} size={11} />}
                        {isHighContrast && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} />}
                        {contrastRatio.toFixed(1)}:1
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {isLowContrast ? "Low" : isHighContrast ? "AAA" : "AA"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Hex & Eyedropper Input */}
                <div className="rounded-xl border border-white/[0.1] bg-black/40 p-4 space-y-2.5 shadow-inner">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Custom Hex or CSS Color
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        value={customHex}
                        onChange={(e) => {
                          setCustomHex(e.target.value)
                          handleApplyHex(e.target.value)
                        }}
                        placeholder="#3b82f6 or var(--chart-1)"
                        className="h-9 font-mono text-xs pl-3 pr-2 bg-zinc-950 border-white/20 text-white placeholder:text-zinc-600 focus-visible:border-emerald-400"
                      />
                    </div>

                    {/* Native system color picker button */}
                    <label
                      className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Open visual color picker"
                    >
                      <HugeiconsIcon icon={ColorsIcon} size={16} />
                      <input
                        type="color"
                        value={displayHex.startsWith("#") ? displayHex : "#3b82f6"}
                        onChange={(e) => {
                          setCustomHex(e.target.value)
                          onChange(e.target.value)
                        }}
                        className="sr-only"
                        aria-label="Pick custom color"
                      />
                    </label>
                  </div>

                  {inputError && (
                    <p className="text-[10px] font-mono text-rose-400 leading-tight">
                      {inputError}
                    </p>
                  )}
                </div>

                {/* Quick Reset Action */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full h-8 text-xs font-mono text-zinc-300 hover:text-white border-white/10 hover:bg-white/[0.06] justify-center gap-1.5 cursor-pointer"
                >
                  <HugeiconsIcon icon={RefreshIcon} size={13} />
                  <span>Reset to {role.defaultToken}</span>
                </Button>
              </div>

              {/* RIGHT COLUMN: Theme Tokens & Curated Palettes (7 cols) */}
              <div className="sm:col-span-7 space-y-4">
                {/* 1. Plotcn Theme Tokens */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Plotcn Theme Tokens
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      CSS Variables
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Theme tokens">
                    {THEME_CHART_TOKENS.map((token) => {
                      const isSelected = activeValue === token.value
                      return (
                        <button
                          key={token.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={token.label}
                          onClick={() => onChange(token.value)}
                          className={cn(
                            "flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer h-10",
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500 text-white font-medium shadow-xs"
                              : "border-white/[0.08] bg-zinc-900/60 hover:bg-zinc-900 hover:border-white/20 text-zinc-300"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="size-3.5 shrink-0 rounded-full border border-white/20 shadow-xs"
                              style={{ backgroundColor: token.hex }}
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-xs text-zinc-200 truncate">
                                {token.label}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-400 truncate">
                                {token.value}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <HugeiconsIcon icon={Tick02Icon} size={14} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Curated Swatch Palettes */}
                <div className="space-y-3.5 pt-1">
                  {CURATED_COLOR_GROUPS.slice(1).map((group) => (
                    <div key={group.name} className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        {group.name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.presets.map((preset) => {
                          const isSelected = activeValue.toLowerCase() === preset.value.toLowerCase()
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              aria-label={`${preset.label} (${preset.value})`}
                              onClick={() => onChange(preset.value)}
                              className={cn(
                                "group relative size-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center p-0 outline-none focus-visible:ring-2 focus-visible:ring-white",
                                isSelected
                                  ? "border-white ring-2 ring-emerald-400 scale-110 shadow-md"
                                  : "border-white/15 hover:border-white/40 hover:scale-105"
                              )}
                              style={{ backgroundColor: preset.hex }}
                              title={`${preset.label} (${preset.hex})`}
                            >
                              {isSelected && (
                                <HugeiconsIcon
                                  icon={Tick02Icon}
                                  size={13}
                                  className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                                />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Done / Close Button */}
          <div className="shrink-0 px-5 py-3.5 sm:px-6 border-t border-white/[0.08] bg-zinc-950 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              Press ESC or click outside to dismiss
            </span>
            <div className="flex items-center gap-2 ml-auto">
              {!isDefault && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs font-mono text-zinc-400 hover:text-white h-8 px-3 cursor-pointer"
                >
                  Reset
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => setOpen(false)}
                className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs h-8 px-4 rounded-lg cursor-pointer shadow-sm transition-all"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
