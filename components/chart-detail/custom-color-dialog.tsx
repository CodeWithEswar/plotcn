"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02Icon,
  ColorsIcon,
  DropperIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme"

export interface CustomColorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentColor: string
  onApplyColor: (color: string) => void
}

export const PRESET_PALETTES = [
  { name: "Zinc (Default)", hex: "#f4f4f5", category: "Monochrome" },
  { name: "Zinc Muted", hex: "#a1a1aa", category: "Monochrome" },
  { name: "Zinc Dark", hex: "#71717a", category: "Monochrome" },
  { name: "Emerald", hex: "#10b981", category: "Classic" },
  { name: "Mint", hex: "#34d399", category: "Classic" },
  { name: "Teal", hex: "#14b8a6", category: "Modern" },
  { name: "Cyan", hex: "#06b6d4", category: "Modern" },
  { name: "Sky", hex: "#0ea5e9", category: "Classic" },
  { name: "Blue", hex: "#3b82f6", category: "Vibrant" },
  { name: "Indigo", hex: "#6366f1", category: "Vibrant" },
  { name: "Purple", hex: "#8b5cf6", category: "Classic" },
  { name: "Fuchsia", hex: "#d946ef", category: "Vibrant" },
  { name: "Rose", hex: "#f43f5e", category: "Accent" },
  { name: "Coral", hex: "#fb7185", category: "Accent" },
  { name: "Amber", hex: "#f59e0b", category: "Accent" },
]

/**
 * Color math utilities: HSV <-> RGB <-> HEX
 */
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let clean = hex.replace(/^#/, "")
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("")
  }
  const r = parseInt(clean.slice(0, 2), 16) / 255 || 0
  const g = parseInt(clean.slice(2, 4), 16) / 255 || 0
  const b = parseInt(clean.slice(4, 6), 16) / 255 || 0

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

function hsvToHex(h: number, s: number, v: number): string {
  const sNorm = s / 100
  const vNorm = v / 100
  const i = Math.floor((h / 60) % 6)
  const f = h / 60 - i
  const p = vNorm * (1 - sNorm)
  const q = vNorm * (1 - f * sNorm)
  const t = vNorm * (1 - (1 - f) * sNorm)

  let r = 0
  let g = 0
  let b = 0
  switch (i) {
    case 0:
      r = vNorm
      g = t
      b = p
      break
    case 1:
      r = q
      g = vNorm
      b = p
      break
    case 2:
      r = p
      g = vNorm
      b = t
      break
    case 3:
      r = p
      g = q
      b = vNorm
      break
    case 4:
      r = t
      g = p
      b = vNorm
      break
    case 5:
      r = vNorm
      g = p
      b = q
      break
  }

  const toHex = (n: number) => {
    const val = Math.round(n * 255)
    return Math.max(0, Math.min(255, val)).toString(16).padStart(2, "0")
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase()
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace(/^#/, "")
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("")
  }
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase()
}

export function CustomColorDialog({
  open,
  onOpenChange,
  currentColor,
  onApplyColor,
}: CustomColorDialogProps) {
  const initialHex = currentColor.startsWith("#") ? currentColor : "#10b981"
  const [selectedHex, setSelectedHex] = useState(initialHex)
  const [customInput, setCustomInput] = useState(initialHex)
  const [hsv, setHsv] = useState(() => hexToHsv(initialHex))
  const [colorMode, setColorMode] = useState<"hex" | "rgb">("hex")

  const satValRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Sync state if currentColor prop changes
  useEffect(() => {
    if (open) {
      const hex = currentColor.startsWith("#") ? currentColor : "#10b981"
      setSelectedHex(hex)
      setCustomInput(hex)
      setHsv(hexToHsv(hex))
    }
  }, [open, currentColor])

  const activePreset = useMemo(
    () => PRESET_PALETTES.find((c) => c.hex.toLowerCase() === selectedHex.toLowerCase()),
    [selectedHex]
  )

  const rgb = useMemo(() => hexToRgb(selectedHex), [selectedHex])

  const handleSelectHex = (hex: string) => {
    setSelectedHex(hex)
    setCustomInput(hex)
    setHsv(hexToHsv(hex))
  }

  // 2D Saturation / Value dragging
  const updateSatValFromEvent = (clientX: number, clientY: number) => {
    const el = satValRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top))
    const s = Math.round((x / rect.width) * 100)
    const v = Math.round((1 - y / rect.height) * 100)

    setHsv((prev) => {
      const next = { ...prev, s, v }
      const hex = hsvToHex(next.h, next.s, next.v)
      setSelectedHex(hex)
      setCustomInput(hex)
      return next
    })
  }

  const handleSatValMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    updateSatValFromEvent(e.clientX, e.clientY)

    const onMouseMove = (ev: MouseEvent) => {
      ev.preventDefault()
      updateSatValFromEvent(ev.clientX, ev.clientY)
    }
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const handleSatValTouch = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updateSatValFromEvent(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  // Hue slider dragging
  const updateHueFromEvent = (clientX: number) => {
    const el = hueRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    const h = Math.round((x / rect.width) * 360) % 360

    setHsv((prev) => {
      const next = { ...prev, h }
      const hex = hsvToHex(next.h, next.s, next.v)
      setSelectedHex(hex)
      setCustomInput(hex)
      return next
    })
  }

  const handleHueMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    updateHueFromEvent(e.clientX)

    const onMouseMove = (ev: MouseEvent) => {
      ev.preventDefault()
      updateHueFromEvent(ev.clientX)
    }
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const handleHueTouch = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updateHueFromEvent(e.touches[0].clientX)
    }
  }

  // Eyedropper API (Native browser eyedropper)
  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        // @ts-expect-error - EyeDropper is a modern Web API supported in Chromium/Edge
        const eyeDropper = new window.EyeDropper()
        const result = await eyeDropper.open()
        if (result?.sRGBHex) {
          handleSelectHex(result.sRGBHex)
        }
      } catch {
        // User canceled
      }
    }
  }

  // RGB numerical input handlers
  const handleRgbChange = (channel: "r" | "g" | "b", valStr: string) => {
    const num = parseInt(valStr, 10)
    const val = isNaN(num) ? 0 : Math.max(0, Math.min(255, num))
    const newRgb = { ...rgb, [channel]: val }
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setSelectedHex(hex)
    setCustomInput(hex)
    setHsv(hexToHsv(hex))
  }

  const handleApply = () => {
    onApplyColor(selectedHex)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-1.5rem)] sm:w-[780px] md:w-[860px] lg:w-[900px] max-w-[900px] max-h-[90dvh] sm:max-h-[85dvh] flex flex-col p-0 gap-0 overflow-hidden bg-card border border-border text-card-foreground rounded-2xl shadow-2xl [&_[data-slot=dialog-close]]:text-muted-foreground hover:[&_[data-slot=dialog-close]]:text-foreground hover:[&_[data-slot=dialog-close]]:bg-muted [&_[data-slot=dialog-close]]:top-4 sm:[&_[data-slot=dialog-close]]:top-5 [&_[data-slot=dialog-close]]:right-4 sm:[&_[data-slot=dialog-close]]:right-5"
        style={{
          width: "min(900px, calc(100vw - 2rem))",
          maxWidth: "min(900px, calc(100vw - 2rem))",
        }}
      >
        {/* Pinned Dialog Header */}
        <DialogHeader className="shrink-0 px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-4 border-b border-border bg-card/90 backdrop-blur-sm pr-12 space-y-1 text-left">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <HugeiconsIcon icon={ColorsIcon} size={18} />
            </span>
            <DialogTitle className="text-base sm:text-lg font-semibold font-sans text-foreground tracking-tight">
              Customize Component Color
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground font-sans leading-relaxed">
            Interactive visual color laboratory. Drag across the spectrum, pick with the eyedropper, or select designer presets.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:p-6 space-y-5 scrollbar-thin">
          {/* Widescreen 2-Column Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Customized In-Theme Visual Color Picker (5 cols) */}
            <div className="md:col-span-5 space-y-3.5">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-3 shadow-xs">
                {/* 1. 2D Saturation / Value Gradient Canvas */}
                <div
                  ref={satValRef}
                  onMouseDown={handleSatValMouseDown}
                  onTouchStart={handleSatValTouch}
                  onTouchMove={handleSatValTouch}
                  className="w-full h-32 sm:h-36 rounded-lg border border-border/80 relative overflow-hidden cursor-crosshair select-none shadow-inner touch-none"
                style={{
                  backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                }}
              >
                {/* Horizontal White gradient (Saturation: Left = 0% sat, Right = 100% sat) */}
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                {/* Vertical Black gradient (Value/Brightness: Top = 100% val, Bottom = 0% val) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />

                {/* Reticle / Thumb Pointer */}
                <div
                  className="absolute size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_6px_rgba(0,0,0,0.9)] pointer-events-none"
                  style={{
                    left: `${Math.max(0, Math.min(100, hsv.s))}%`,
                    top: `${Math.max(0, Math.min(100, 100 - hsv.v))}%`,
                    backgroundColor: selectedHex,
                  }}
                />
              </div>

              {/* 2. Middle Controls: Eyedropper + Live Swatch + Rainbow Hue Slider */}
              <div className="flex items-center gap-2.5">
                {/* Eyedropper button */}
                <button
                  type="button"
                  onClick={handleEyeDropper}
                  title="Pick color from screen"
                  aria-label="Pick color from screen"
                  className="size-8 rounded-lg border border-input bg-background hover:bg-muted flex items-center justify-center text-foreground transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <HugeiconsIcon icon={DropperIcon} size={15} />
                </button>

                {/* Live Swatch Circle */}
                <div
                  className="size-7 rounded-full border-2 border-border/80 shadow-xs shrink-0 transition-colors"
                  style={{ backgroundColor: selectedHex }}
                  title={`Current: ${selectedHex.toUpperCase()}`}
                />

                {/* Rainbow Hue Slider */}
                <div
                  ref={hueRef}
                  onMouseDown={handleHueMouseDown}
                  onTouchStart={handleHueTouch}
                  onTouchMove={handleHueTouch}
                  className="flex-1 h-3.5 rounded-full relative cursor-pointer select-none shadow-inner touch-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4.5 rounded-full border-2 border-white shadow-[0_0_5px_rgba(0,0,0,0.8)] pointer-events-none"
                    style={{
                      left: `${Math.max(0, Math.min(100, (hsv.h / 360) * 100))}%`,
                      backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                    }}
                  />
                </div>
              </div>

              {/* 3. Format Switcher & Inputs (HEX vs RGB) */}
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {colorMode === "hex" ? "HEX Coordinate" : "RGB Channels"}
                  </span>
                  <div className="flex items-center rounded-md border border-border bg-muted/60 p-0.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setColorMode("hex")}
                      className={cn(
                        "px-2 py-0.5 rounded transition-colors cursor-pointer",
                        colorMode === "hex"
                          ? "bg-background text-foreground font-medium shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      HEX
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode("rgb")}
                      className={cn(
                        "px-2 py-0.5 rounded transition-colors cursor-pointer",
                        colorMode === "rgb"
                          ? "bg-background text-foreground font-medium shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      RGB
                    </button>
                  </div>
                </div>

                {colorMode === "hex" ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                      #
                    </span>
                    <input
                      type="text"
                      value={customInput.replace(/^#/, "")}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6)
                        const full = `#${raw}`
                        setCustomInput(full)
                        if (raw.length === 6 || raw.length === 3) {
                          handleSelectHex(full)
                        }
                      }}
                      placeholder="10B981"
                      maxLength={6}
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-input bg-background font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500/50 uppercase"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min={0}
                        max={255}
                        value={rgb.r}
                        onChange={(e) => handleRgbChange("r", e.target.value)}
                        className="w-full text-center px-2 py-1.5 rounded-lg border border-input bg-background font-mono text-xs text-foreground focus:border-emerald-500/50 outline-none"
                      />
                      <span className="text-[10px] font-mono text-muted-foreground mt-1 uppercase font-semibold">
                        R
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min={0}
                        max={255}
                        value={rgb.g}
                        onChange={(e) => handleRgbChange("g", e.target.value)}
                        className="w-full text-center px-2 py-1.5 rounded-lg border border-input bg-background font-mono text-xs text-foreground focus:border-emerald-500/50 outline-none"
                      />
                      <span className="text-[10px] font-mono text-muted-foreground mt-1 uppercase font-semibold">
                        G
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        min={0}
                        max={255}
                        value={rgb.b}
                        onChange={(e) => handleRgbChange("b", e.target.value)}
                        className="w-full text-center px-2 py-1.5 rounded-lg border border-input bg-background font-mono text-xs text-foreground focus:border-emerald-500/50 outline-none"
                      />
                      <span className="text-[10px] font-mono text-muted-foreground mt-1 uppercase font-semibold">
                        B
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Palette Shortcuts */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-[10px] text-muted-foreground">Quick:</span>
              {["#f4f4f5", "#10b981", "#0ea5e9", "#8b5cf6"].map((hex) => {
                const label =
                  hex === "#f4f4f5"
                    ? "Zinc"
                    : hex === "#10b981"
                      ? "Emerald"
                      : hex === "#0ea5e9"
                        ? "Sky"
                        : "Purple"
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleSelectHex(hex)}
                    className={cn(
                      "px-2.5 py-1 rounded-md border text-[11px] transition-colors cursor-pointer",
                      selectedHex.toLowerCase() === hex.toLowerCase()
                        ? "border-primary/40 bg-primary/10 text-foreground font-medium shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Curated Visual Spectrum (7 cols) */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Curated Visual Spectrum
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{PRESET_PALETTES.length} Presets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_PALETTES.map((color) => {
                const active = selectedHex.toLowerCase() === color.hex.toLowerCase()
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleSelectHex(color.hex)}
                    className={cn(
                      "flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer group text-left min-h-[44px]",
                      active
                        ? "border-foreground bg-muted shadow-md ring-1 ring-border"
                        : "border-border bg-card hover:bg-muted/80 hover:border-muted-foreground/30"
                    )}
                  >
                    <div
                      className="size-6 rounded-full border border-border/80 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                    >
                      {active && (
                        <HugeiconsIcon icon={Tick02Icon} size={12} className="text-white drop-shadow" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono font-medium text-foreground group-hover:text-foreground truncate">
                        {color.name}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase truncate">
                        {color.hex}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Dialog Footer Actions */}
      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-3.5 sm:px-6 border-t border-border bg-card">
        <div className="text-xs font-mono text-muted-foreground flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full border border-border/80 shrink-0" style={{ backgroundColor: selectedHex }} />
            <span className="text-[11px] text-muted-foreground uppercase font-mono">Coordinate:</span>
            <span className="text-foreground font-semibold uppercase">{selectedHex}</span>
          </div>
          {activePreset && (
            <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground text-[10px]">
              {activePreset.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-mono text-foreground transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 sm:flex-initial px-4 py-2 sm:py-1.5 rounded-lg border border-border bg-primary hover:bg-primary/90 text-xs font-mono font-medium text-primary-foreground transition-colors shadow-xs cursor-pointer text-center"
          >
            Apply Color
          </button>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  )
}
