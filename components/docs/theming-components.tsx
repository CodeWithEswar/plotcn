"use client"

import React, { useState } from "react"
import Link from "next/link"

// ============================================================================
// LIGHTWEIGHT SVG ICONS
// ============================================================================

function CheckmarkCircleIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function TickIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

function CopyIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function ArrowRightIcon({ size = 13, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function SunIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

// ============================================================================
// 1. THEMING HERO
// ============================================================================

export function ThemingHero() {
  const [copied, setCopied] = useState(false)
  const sampleSnippet = `var(--chart-1, oklch(0.87 0 0))`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tags = [
    "CSS Variables",
    "Tailwind",
    "Dark Mode",
    "Engine Adapters",
    "Accessible Color",
    "Source-owned",
  ]

  return (
    <div className="mb-10 space-y-6">
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/docs/introduction" className="hover:text-zinc-300 transition-colors">
          Docs
        </Link>
        <span>/</span>
        <span className="text-zinc-400">Fundamentals</span>
        <span>/</span>
        <span className="text-white">Theming</span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Theming
          </h1>
          <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono font-medium text-zinc-400">
            Fundamentals
          </span>
        </div>
        <p className="text-base sm:text-lg text-zinc-300 font-medium">
          One visual language across every engine.
        </p>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
          Plotcn uses semantic CSS variables and small engine adapters so Recharts, D3.js, and Google Charts belong to the same application without pretending to share the same rendering API.
        </p>
      </div>

      {/* Compact Metadata Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1 text-[11px] font-mono text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quick-Start Token Callout */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-3.5 sm:p-4 shadow-sm space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-white/[0.04]">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <CheckmarkCircleIcon size={13} className="text-emerald-400 shrink-0" />
            <span>Semantic Chart Token Bridge</span>
          </span>
          <span className="text-zinc-500 hidden sm:inline">oklch luminance calibrated</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <code className="text-emerald-300 overflow-x-auto whitespace-nowrap py-1">
            {sampleSnippet}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-zinc-900/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-white/[0.2] hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Copy sample token"
          >
            {copied ? (
              <>
                <TickIcon size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon size={11} className="text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. THEME SYSTEM PREVIEW (Signature Visual)
// ============================================================================

export function ThemeSystemPreview() {
  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Plotcn Visual Hierarchy & Token Translation
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">Single Source of Truth</span>
      </div>

      {/* 3-Tier Architecture Pipeline */}
      <div className="space-y-4 font-mono text-xs">
        {/* Tier 1: Application Theme */}
        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-white/[0.04] pb-1.5">
            <span className="font-semibold text-zinc-200">1. Application Semantic Tokens (shadcn / Tailwind)</span>
            <span className="text-zinc-500 font-sans text-[10px]">globals.css</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            {["--background", "--foreground", "--card", "--border", "--muted", "--primary"].map((t) => (
              <span key={t} className="rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Downward Connector */}
        <div className="flex justify-center -my-2 text-zinc-600">
          <span>↓</span>
        </div>

        {/* Tier 2: Plotcn Chart Tokens */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 border-b border-emerald-500/20 pb-1.5">
            <span className="font-semibold">2. Plotcn Chart Semantic Roles</span>
            <span className="text-emerald-400 font-sans text-[10px]">Unified Contract</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-[11px]">
            <div className="rounded border border-white/[0.06] bg-zinc-900/60 p-2 text-center">
              <span className="text-zinc-400 block text-[10px]">Surface</span>
              <span className="text-zinc-200 font-semibold text-[11px]">--card</span>
            </div>
            <div className="rounded border border-white/[0.06] bg-zinc-900/60 p-2 text-center">
              <span className="text-zinc-400 block text-[10px]">Gridlines</span>
              <span className="text-zinc-200 font-semibold text-[11px]">--border</span>
            </div>
            <div className="rounded border border-white/[0.06] bg-zinc-900/60 p-2 text-center">
              <span className="text-zinc-400 block text-[10px]">Axis Text</span>
              <span className="text-zinc-200 font-semibold text-[11px]">--muted</span>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/30 p-2 text-center">
              <span className="text-emerald-400 block text-[10px]">Series 1</span>
              <span className="text-emerald-200 font-semibold text-[11px]">--chart-1</span>
            </div>
            <div className="rounded border border-white/[0.06] bg-zinc-900/60 p-2 text-center">
              <span className="text-zinc-400 block text-[10px]">Series 2</span>
              <span className="text-zinc-200 font-semibold text-[11px]">--chart-2</span>
            </div>
            <div className="rounded border border-white/[0.06] bg-zinc-900/60 p-2 text-center">
              <span className="text-zinc-400 block text-[10px]">Tooltips</span>
              <span className="text-zinc-200 font-semibold text-[11px]">--popover</span>
            </div>
          </div>
        </div>

        {/* Downward Connector */}
        <div className="flex justify-center -my-2 text-zinc-600">
          <span>↓</span>
        </div>

        {/* Tier 3: Engine Adapters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-3.5 space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Recharts Adapter</div>
            <div className="text-zinc-200 font-semibold text-xs">Direct CSS Variables</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Consumes <code className="text-zinc-300 font-mono">var(--chart-1)</code> directly on SVG <code className="text-zinc-300 font-mono">stroke</code> and <code className="text-zinc-300 font-mono">fill</code> props.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-3.5 space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">D3.js Adapter</div>
            <div className="text-zinc-200 font-semibold text-xs">React SVG + Scale Bridge</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Passes CSS tokens to React JSX paths or interpolates RGB values in math scales.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-3.5 space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Google Charts Adapter</div>
            <div className="text-zinc-200 font-semibold text-xs">Typed Options Mapper</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Translates active CSS theme into strongly-typed Google Chart JavaScript options.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. CHART TOKEN EXPLORER
// ============================================================================

export function ChartTokenExplorer() {
  const tokens = [
    {
      name: "--chart-1",
      hex: "#f4f4f5",
      oklch: "oklch(0.87 0 0)",
      role: "Primary data series / leading metric line",
      category: "Categorical Series",
      bgClass: "bg-zinc-100",
    },
    {
      name: "--chart-2",
      hex: "#a1a1aa",
      oklch: "oklch(0.556 0 0)",
      role: "Secondary comparison series / previous period",
      category: "Categorical Series",
      bgClass: "bg-zinc-400",
    },
    {
      name: "--chart-3",
      hex: "#71717a",
      oklch: "oklch(0.439 0 0)",
      role: "Tertiary metric / forecast boundary",
      category: "Categorical Series",
      bgClass: "bg-zinc-500",
    },
    {
      name: "--chart-4",
      hex: "#52525b",
      oklch: "oklch(0.371 0 0)",
      role: "Supporting series / minor category fill",
      category: "Categorical Series",
      bgClass: "bg-zinc-600",
    },
    {
      name: "--chart-5",
      hex: "#3f3f46",
      oklch: "oklch(0.269 0 0)",
      role: "Baseline / subtle contextual series",
      category: "Categorical Series",
      bgClass: "bg-zinc-700",
    },
    {
      name: "--border",
      hex: "rgba(255,255,255,0.1)",
      oklch: "oklch(1 0 0 / 10%)",
      role: "Cartesian gridlines and chart outer borders",
      category: "Structure & Surface",
      bgClass: "bg-zinc-800 border border-white/20",
    },
    {
      name: "--muted-foreground",
      hex: "#a1a1aa",
      oklch: "oklch(0.708 0 0)",
      role: "XAxis & YAxis tick labels, units, and timestamps",
      category: "Structure & Surface",
      bgClass: "bg-zinc-400",
    },
    {
      name: "--popover",
      hex: "#18181b",
      oklch: "oklch(0.205 0 0)",
      role: "Floating tooltip surface and legend badges",
      category: "Overlays & Tooltips",
      bgClass: "bg-zinc-900 border border-white/20",
    },
    {
      name: "--chart-positive",
      hex: "#34d399",
      oklch: "oklch(0.75 0.18 155)",
      role: "Positive trend, profit, or target exceeded",
      category: "Semantic Status",
      bgClass: "bg-emerald-400",
    },
    {
      name: "--chart-negative",
      hex: "#f87171",
      oklch: "oklch(0.65 0.22 25)",
      role: "Negative trend, deficit, or critical threshold",
      category: "Semantic Status",
      bgClass: "bg-rose-400",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Plotcn Theme Token Registry
        </h4>
        <span className="text-[11px] font-mono text-zinc-400">app/globals.css</span>
      </div>

      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
        These standard tokens are calibrated with consistent perceptual lightness across dark and light palettes. They can be inspected, copied, or overridden globally or locally.
      </p>

      {/* Desktop / Tablet Table, Mobile Stack */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[600px] divide-y divide-white/[0.04] font-mono text-xs">
          <div className="grid grid-cols-12 gap-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <div className="col-span-4">Token Name</div>
            <div className="col-span-2">Swatch</div>
            <div className="col-span-3">Value (OKLCH)</div>
            <div className="col-span-3">Semantic Role</div>
          </div>

          {tokens.map((t) => (
            <div key={t.name} className="grid grid-cols-12 gap-3 py-2.5 items-center hover:bg-white/[0.02] transition-colors">
              <div className="col-span-4 flex items-center gap-2">
                <code className="text-emerald-300 font-semibold text-xs">{t.name}</code>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className={`h-4 w-8 rounded-md shrink-0 ${t.bgClass}`} />
                <span className="text-[10px] text-zinc-500 hidden sm:inline">{t.hex}</span>
              </div>
              <div className="col-span-3 text-[11px] text-zinc-400 truncate">
                {t.oklch}
              </div>
              <div className="col-span-3 text-[11px] font-sans text-zinc-300">
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. SERIES COLOR GUIDE
// ============================================================================

export function SeriesColorGuide() {
  return (
    <div className="my-8 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Data Encoding Color Models
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Perceptual Semantics</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
        {/* Model 1: Categorical */}
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs font-semibold text-zinc-200">Categorical</span>
            <span className="text-[10px] text-zinc-500 uppercase">Independent</span>
          </div>
          <div className="flex items-center gap-1.5 py-1">
            <span className="h-5 flex-1 rounded bg-zinc-100" title="--chart-1" />
            <span className="h-5 flex-1 rounded bg-zinc-400" title="--chart-2" />
            <span className="h-5 flex-1 rounded bg-zinc-500" title="--chart-3" />
            <span className="h-5 flex-1 rounded bg-zinc-600" title="--chart-4" />
            <span className="h-5 flex-1 rounded bg-zinc-700" title="--chart-5" />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Use when data represents distinct, qualitative categories (e.g. Products, Regions, Marketing Channels). No intrinsic numerical ordering.
          </p>
        </div>

        {/* Model 2: Sequential */}
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs font-semibold text-zinc-200">Sequential</span>
            <span className="text-[10px] text-zinc-500 uppercase">Magnitude</span>
          </div>
          <div className="h-5 rounded w-full bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-100" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Use when data progresses continuously from low to high magnitude (e.g. Heatmaps, Population Density, Choropleth GeoCharts).
          </p>
        </div>

        {/* Model 3: Diverging */}
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs font-semibold text-zinc-200">Diverging</span>
            <span className="text-[10px] text-zinc-500 uppercase">Two-Sided</span>
          </div>
          <div className="h-5 rounded w-full bg-gradient-to-r from-rose-500 via-zinc-800 to-emerald-500" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Use when data has a meaningful neutral zero or baseline point (e.g. Profit vs. Loss, Budget Variance, Temperature Deviation).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. TOOLTIP & LEGEND PREVIEW
// ============================================================================

export function TooltipLegendPreview() {
  return (
    <div className="my-8 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Standardized Tooltip & Legend Layout
        </h4>
        <span className="text-[11px] font-mono text-zinc-400">Consistent Popover Anatomy</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tooltip Demonstration */}
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Overlay Tooltip Box
          </div>
          <div className="inline-block rounded-lg border border-white/[0.1] bg-zinc-900 p-3 shadow-xl space-y-1.5 font-mono text-xs">
            <div className="text-[11px] text-zinc-400 pb-1 border-b border-white/[0.06] flex items-center justify-between">
              <span>May 2026</span>
              <span className="text-zinc-500 text-[10px]">Active Period</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-100" />
                <span className="text-zinc-300 font-sans text-xs">Current Revenue:</span>
              </div>
              <span className="font-semibold text-white">$18,400</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-500" />
                <span className="text-zinc-400 font-sans text-xs">Previous Period:</span>
              </div>
              <span className="text-zinc-400">$15,200</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Standardizes font sizing (11-12px), hairline borders (<code className="text-zinc-300 font-mono">--border</code>), compact spacing, and tabular numeric alignment.
          </p>
        </div>

        {/* Legend Demonstration */}
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Inline Chart Legend
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-white/[0.06] bg-zinc-900/80 p-3 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-100" />
              <span className="text-zinc-200">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
              <span className="text-zinc-400">Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-600" />
              <span className="text-zinc-500">Target</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Legends use small, high-contrast series pills that remain fully keyboard focusable and ARIA-attributed if interactive.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. THEME MODE PREVIEW (Light vs Dark Side-by-Side)
// ============================================================================

export function ThemeModePreview() {
  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Side-by-Side Surface & Token Comparison
        </h4>
        <span className="text-[11px] font-mono text-zinc-400">Zero Flicker Transition</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Light Mode Preview */}
        <div className="rounded-xl border border-zinc-300 bg-white p-4 space-y-3 text-zinc-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
              <SunIcon size={14} className="text-amber-500" />
              <span>Light Mode (:root)</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">oklch(1 0 0)</span>
          </div>

          {/* Miniature Mock Graphic */}
          <div className="h-28 rounded-lg border border-zinc-200 bg-zinc-50 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-zinc-500">
              <span>Metric Activity</span>
              <span className="font-semibold text-zinc-800">$24,500</span>
            </div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              <span className="w-full h-6 rounded bg-zinc-300" />
              <span className="w-full h-9 rounded bg-zinc-400" />
              <span className="w-full h-8 rounded bg-zinc-600" />
              <span className="w-full h-12 rounded bg-zinc-900" />
              <span className="w-full h-10 rounded bg-zinc-700" />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-400 border-t border-zinc-200 pt-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>

          <div className="text-[11px] font-sans text-zinc-600 space-y-0.5">
            <div><strong className="font-mono text-zinc-800">Background:</strong> Clean crisp white (#ffffff)</div>
            <div><strong className="font-mono text-zinc-800">Gridlines:</strong> Muted grey 10% alpha</div>
            <div><strong className="font-mono text-zinc-800">Series 1:</strong> Deep titanium / black for maximum contrast</div>
          </div>
        </div>

        {/* Dark Mode Preview */}
        <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-4 space-y-3 text-white shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <MoonIcon size={14} className="text-zinc-400" />
              <span>Dark Mode (.dark)</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">oklch(0.145 0 0)</span>
          </div>

          {/* Miniature Mock Graphic */}
          <div className="h-28 rounded-lg border border-white/[0.06] bg-zinc-900/60 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>Metric Activity</span>
              <span className="font-semibold text-white">$24,500</span>
            </div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              <span className="w-full h-6 rounded bg-zinc-700" />
              <span className="w-full h-9 rounded bg-zinc-600" />
              <span className="w-full h-8 rounded bg-zinc-400" />
              <span className="w-full h-12 rounded bg-zinc-100" />
              <span className="w-full h-10 rounded bg-zinc-300" />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 border-t border-white/[0.06] pt-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>

          <div className="text-[11px] font-sans text-zinc-400 space-y-0.5">
            <div><strong className="font-mono text-zinc-200">Background:</strong> Deep zinc (#09090b)</div>
            <div><strong className="font-mono text-zinc-200">Gridlines:</strong> Subtle white 6% alpha</div>
            <div><strong className="font-mono text-zinc-200">Series 1:</strong> Crisp white (#f4f4f5) for maximum contrast</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. GOOGLE THEME ADAPTER FLOW
// ============================================================================

export function GoogleThemeAdapterFlow() {
  const steps = [
    { title: "1. CSS Variables", code: "var(--chart-1)", desc: "Defined in globals.css as modern OKLCH tokens" },
    { title: "2. Theme Resolver", code: "getGoogleChartTheme()", desc: "Maps active theme into typed Google configuration" },
    { title: "3. Typed Options", code: "{ colors: ['#f4f4f5', ...], hAxis: {...} }", desc: "Passed to chart constructor" },
    { title: "4. Canvas Render", code: "chart.draw(dataTable, options)", desc: "Google CDN paints with matching aesthetic" },
  ]

  return (
    <div className="my-8 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs uppercase tracking-wider text-zinc-200 font-semibold">
          Google Charts Translation Architecture
        </h4>
        <span className="text-[11px] text-emerald-400">Zero Fragile DOM Hacking</span>
      </div>

      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
        Because Google Charts renders inside an isolated iframe or external SVG container, it does not inherit application CSS variables automatically. Plotcn bridges this gap using <code className="text-zinc-200 font-mono">lib/google-charts/theme.ts</code>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {steps.map((s) => (
          <div key={s.title} className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 space-y-1.5">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">{s.title}</div>
            <div className="text-zinc-200 font-semibold text-[11px] truncate">{s.code}</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 8. THEME ACCESSIBILITY CHECKLIST
// ============================================================================

export function ThemeAccessibilityChecklist() {
  const checks = [
    { label: "Axis Tick Labels", status: "Checked", detail: "Meets 4.5:1 text contrast against --background in both light and dark modes." },
    { label: "Gridline Subordination", status: "Checked", detail: "Stays within 10-20% opacity to prevent visual clutter or competition with data marks." },
    { label: "Series Differentiation", status: "Checked", detail: "Provides secondary encoding (stroke dashes, dot shapes, or direct labels) alongside color." },
    { label: "Focus Ring Indicator", status: "Checked", detail: "Interactive chart elements carry visible outline using var(--ring) on keyboard tab." },
    { label: "Tooltip Legibility", status: "Checked", detail: "Rendered with high-contrast font and explicit solid background on var(--popover)." },
    { label: "Motion Preference", status: "Checked", detail: "Respects prefers-reduced-motion by disabling animations during theme switches." },
  ]

  return (
    <div className="my-8 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Theme Contrast & Accessibility Verification
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">WCAG Compliant</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-xs">
        {checks.map((c) => (
          <div key={c.label} className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 space-y-1">
            <div className="font-mono text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <CheckmarkCircleIcon size={13} className="text-emerald-400 shrink-0" />
              <span>{c.label}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 9. THEMING TROUBLESHOOTING (Common Mistakes)
// ============================================================================

export function ThemingTroubleshooting() {
  const mistakes = [
    {
      title: "Hardcoding Hex Colors in Components",
      problem: "Every chart file contains '#18181b', '#71717a', etc. Changes require editing dozens of files.",
      why: "Circumvents the centralized design system.",
      fix: "Replace hex literals with CSS tokens like 'var(--chart-1)' or 'currentColor'.",
    },
    {
      title: "Using One Palette for All Data Types",
      problem: "Categorical series, heatmaps, and profit/loss graphs all reuse the same five unrelated colors.",
      why: "Conflates qualitative identity with quantitative magnitude.",
      fix: "Use sequential scales for continuous data and diverging scales for positive/negative variance.",
    },
    {
      title: "Engine Default Styles Leak In",
      problem: "Recharts looks on-brand, but Google Charts looks like a stock blue-and-red Google demo.",
      why: "Google Charts requires an explicit options theme adapter.",
      fix: "Wrap Google charts with getGoogleChartTheme() from '@/lib/google-charts'.",
    },
    {
      title: "Overpowering Grid Contrast",
      problem: "Dark, thick gridlines dominate the chart and make thin lines or small points hard to distinguish.",
      why: "Grid is drawn with high contrast instead of subtle alpha.",
      fix: "Lower grid opacity to 6-12% using 'rgba(255, 255, 255, 0.06)' or 'var(--border)'.",
    },
    {
      title: "Confusing Series Identity with Status",
      problem: "Green is assigned to 'Product Series B', confusing users who interpret green as 'Healthy / Success'.",
      why: "Mixing decorative categorical colors with semantic indicator tokens.",
      fix: "Reserve green and red for semantic indicators. Use neutral zinc tones for series identity.",
    },
    {
      title: "Inconsistent Tooltip Appearance",
      problem: "Recharts renders custom HTML tooltips while D3 renders browser title tags or disparate boxes.",
      why: "Lack of a shared tooltip styling convention.",
      fix: "Standardize tooltip markup to reuse the application's '--popover' and '--border' tokens.",
    },
    {
      title: "Inline Theme Logic in Every Component",
      problem: "Every chart component imports 'useTheme' and runs manual color branching.",
      why: "Unnecessary JavaScript overhead and hydration mismatch risk.",
      fix: "Let CSS variables handle theme switching natively. Only adapt in JS when strictly necessary.",
    },
    {
      title: "Global Overwrites That Break UI",
      problem: "Overriding '--chart-1' accidentally changes unrelated button or sidebar styles.",
      why: "Chart tokens were incorrectly mapped to global brand tokens.",
      fix: "Keep chart tokens scoped to '--chart-1' through '--chart-5' rather than overriding '--primary'.",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Common Theming Pitfalls & Architectural Solutions
        </h4>
        <span className="text-[11px] font-mono text-rose-400">Diagnostic Checklist</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
        {mistakes.map((m) => (
          <div
            key={m.title}
            className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-2.5 transition-colors hover:border-white/[0.12]"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <h5 className="font-mono text-xs font-semibold text-zinc-100 uppercase tracking-wider">
                {m.title}
              </h5>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              <span className="text-zinc-500 font-mono mr-1">PROBLEM:</span>
              {m.problem}
            </p>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              <span className="text-zinc-500 font-mono mr-1">WHY:</span>
              {m.why}
            </p>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-2.5 font-mono text-[11px] text-zinc-300">
              <span className="text-emerald-400 font-semibold mr-1">FIX:</span>
              <span className="font-sans">{m.fix}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 10. THEMING WORKFLOW
// ============================================================================

export function ThemingWorkflow() {
  const steps = [
    { num: "01", title: "Audit App Tokens", desc: "Inspect existing --background, --foreground, and --border tokens in globals.css" },
    { num: "02", title: "Reuse Core Tokens", desc: "Inherit application surface and text colors before adding custom variables" },
    { num: "03", title: "Define Chart Tokens", desc: "Set calibrated --chart-1 through --chart-5 for series in OKLCH" },
    { num: "04", title: "Configure Dark Mode", desc: "Provide high-contrast values under both :root and .dark selectors" },
    { num: "05", title: "Map to Recharts", desc: "Pass CSS variables directly to stroke and fill props on chart marks" },
    { num: "06", title: "Map to D3.js", desc: "Consume tokens in React SVG or resolve computed RGB values for scales" },
    { num: "07", title: "Map to Google Charts", desc: "Pass typed theme object from lib/google-charts/theme.ts" },
    { num: "08", title: "Standardize Tooltips", desc: "Style overlay popovers to match application popover tokens" },
    { num: "09", title: "Audit Contrast", desc: "Verify 4.5:1 text contrast and ensure colors are not the sole encoding" },
    { num: "10", title: "Ship Cohesive UI", desc: "Commit tokens to version control with zero manual chart repainting" },
  ]

  const responsibility = [
    { concern: "Background & Card Surfaces", method: "CSS Variable", detail: "Inherits --background and --card natively." },
    { concern: "Series Line / Bar Colors", method: "CSS Variable + Engine", detail: "Read from --chart-1..5 across all visualizers." },
    { concern: "Cartesian Gridlines", method: "CSS Variable", detail: "Mapped to --border or 6-10% subtle alpha." },
    { concern: "Axis Typography & Ticks", method: "CSS Variable", detail: "Inherits app font family and --muted-foreground." },
    { concern: "Tooltips & Legend Layout", method: "Shared Convention", detail: "Popovers styled with --popover and subtle borders." },
    { concern: "Geometry & Math Scales", method: "Local Source", detail: "Calculated in component (viewBox, scaleLinear, etc.)." },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          10-Step Theming Implementation Sequence
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Design System Workflow</span>
      </div>

      {/* 10-step sequence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((s) => (
          <div key={s.num} className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400">{s.num}</span>
            <div className="text-xs font-mono font-semibold text-zinc-100">{s.title}</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Theme Responsibility Matrix */}
      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/30 p-4 space-y-3 font-mono text-xs">
        <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider border-b border-white/[0.04] pb-2">
          Theme Responsibility Matrix
        </div>
        <div className="space-y-2 font-sans">
          {responsibility.map((r) => (
            <div key={r.concern} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs border-b border-white/[0.02] pb-1.5 last:border-0">
              <div className="text-zinc-300 font-mono">
                <span className="text-emerald-400 mr-2 font-semibold">[{r.method}]</span>
                {r.concern}
              </div>
              <span className="text-zinc-400 text-[11px]">{r.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 11. CUSTOMIZATION ESCALATION HIERARCHY (INTERACTIVE COMPONENT)
// ============================================================================

export function CustomizationHierarchy() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [copiedLevel, setCopiedLevel] = useState<number | null>(null)

  const levels = [
    {
      level: 1,
      tag: "Level 01",
      title: "Application Tokens",
      target: "app/globals.css",
      scope: "Global App Scope",
      scopeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
      accentBorder: "hover:border-emerald-500/40 data-[active=true]:border-emerald-500",
      accentBg: "data-[active=true]:bg-emerald-950/20",
      badge: "Default (90% of cases)",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      summary: "Set once in globals.css; all charts inherit theme surfaces, text, and borders automatically.",
      detail:
        "Theme the application, not every chart independently. Plotcn charts automatically inherit standard shadcn/ui variables (--background, --foreground, --card, --border). Updating your primary brand or card surface synchronizes every chart in your application with zero visual drift.",
      code: `/* app/globals.css */
:root {
  --background: oklch(0.14 0 0);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.18 0 0);
  --border: oklch(0.24 0 0);
}`,
      escalateWhen: "Escalate to Level 2 when you need to configure multi-series visualization hues (lines, bars, areas).",
    },
    {
      level: 2,
      tag: "Level 02",
      title: "Plotcn Chart Tokens",
      target: "app/globals.css (:root & .dark)",
      scope: "All Visualizations",
      scopeColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
      accentBorder: "hover:border-cyan-500/40 data-[active=true]:border-cyan-500",
      accentBg: "data-[active=true]:bg-cyan-950/20",
      badge: "Series Palette (8% of cases)",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      summary: "Calibrate --chart-1 through --chart-5 in OKLCH to define your product's visualization identity.",
      detail:
        "Define categorical series colors calibrated for perceptual uniformity. Recharts, D3.js, and Google Charts adapters read these tokens directly. Both light and dark modes toggle cleanly without touching individual chart components.",
      code: `/* app/globals.css */
:root {
  --chart-1: oklch(0.68 0.19 145); /* Primary metric */
  --chart-2: oklch(0.72 0.17 210); /* Comparison series */
  --chart-3: oklch(0.65 0.18 280); /* Secondary series */
  --chart-4: oklch(0.78 0.16 75);  /* Accent series */
  --chart-5: oklch(0.60 0.22 25);  /* Warning / critical */
}`,
      escalateWhen: "Escalate to Level 3 when a single chart widget needs a contextual status color (e.g. positive gain vs loss).",
    },
    {
      level: 3,
      tag: "Level 03",
      title: "Scoped Overrides",
      target: "Parent Container style={{ ... }}",
      scope: "Single Widget Instance",
      scopeColor: "text-amber-400 bg-amber-950/40 border-amber-500/30",
      accentBorder: "hover:border-amber-500/40 data-[active=true]:border-amber-500",
      accentBg: "data-[active=true]:bg-amber-950/20",
      badge: "Contextual (2% of cases)",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      summary: "Inject CSS variable overrides onto a parent card or wrapper to localize visual exceptions.",
      detail:
        "When an isolated card represents financial profit (emerald) or loss (rose), override the CSS token on the parent wrapper. Child chart components inherit the scoped variable automatically without modifying the underlying component source.",
      code: `// components/dashboard/kpi-card.tsx
export function GainKpiCard({ data }: { data: MetricDatum[] }) {
  return (
    <div
      className="rounded-xl border border-border p-6"
      style={{
        "--chart-1": "oklch(0.75 0.18 155)", // Scoped emerald gain
      } as React.CSSProperties}
    >
      <PlotLineChart data={data} />
    </div>
  )
}`,
      escalateWhen: "Escalate to Level 4 only when you need custom SVG defs, gradient masks, or non-standard chart geometry.",
    },
    {
      level: 4,
      tag: "Level 04",
      title: "Local Source Edits",
      target: "components/charts/plot-line-chart.tsx",
      scope: "100% Owned Source File",
      scopeColor: "text-purple-400 bg-purple-950/40 border-purple-500/30",
      accentBorder: "hover:border-purple-500/40 data-[active=true]:border-purple-500",
      accentBg: "data-[active=true]:bg-purple-950/20",
      badge: "Deep Customization (<1%)",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      summary: "Edit the installed component file directly to customize SVG markup, math, gradients, and animations.",
      detail:
        "Because Plotcn distributes raw TypeScript source files into your repository rather than an immutable npm package, you have full ownership. You can add bespoke SVG filters, canvas particle engines, or custom D3 math formulas whenever design requirements demand it.",
      code: `// components/charts/plot-line-chart.tsx
<defs>
  <linearGradient id="bespokeAreaGlow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.7} />
    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
  </linearGradient>
</defs>`,
      escalateWhen: "You are already at the highest level of customization. All component code is fully owned in your repository.",
    },
  ]

  const active = levels.find((l) => l.level === selectedLevel) || levels[0]

  const handleCopy = (codeText: string, levelNum: number) => {
    navigator.clipboard.writeText(codeText)
    setCopiedLevel(levelNum)
    setTimeout(() => setCopiedLevel(null), 2000)
  }

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="border-b border-white/[0.08] p-5 sm:p-6 bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-100 font-semibold">
                Customization Escalation Hierarchy
              </h4>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              Follow the principle of progressive specificity: solve styling with tokens first before reaching for inline styles or source modifications.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-300 self-start sm:self-center">
            <span className="text-emerald-400">Broadest Scope</span>
            <span className="text-zinc-600">→</span>
            <span className="text-purple-400">Source Code</span>
          </div>
        </div>

        {/* Visual Escalation Ladder Bar */}
        <div className="mt-5 grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
          {levels.map((lvl) => (
            <button
              key={lvl.level}
              type="button"
              onClick={() => setSelectedLevel(lvl.level)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all ${
                selectedLevel === lvl.level
                  ? "bg-zinc-800 text-white shadow-sm border border-white/[0.12]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              <span className="text-[10px] font-mono font-bold tracking-wider opacity-70">
                {lvl.tag}
              </span>
              <span className="text-xs font-medium truncate max-w-full hidden sm:inline">
                {lvl.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 Interactive Level Cards */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.level
            return (
              <div
                key={lvl.level}
                onClick={() => setSelectedLevel(lvl.level)}
                data-active={isSelected}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-emerald-500/60 bg-zinc-900/60 ring-1 ring-emerald-500/20 shadow-md"
                    : "border-white/[0.06] bg-zinc-900/30 hover:border-white/[0.15] hover:bg-zinc-900/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center size-5 rounded-md text-[10px] font-mono font-bold ${
                        isSelected
                          ? "bg-emerald-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      0{lvl.level}
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-100">
                      {lvl.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${lvl.scopeColor}`}
                  >
                    {lvl.scope}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
                  <span className="text-zinc-600">TARGET:</span>
                  <code className="text-zinc-200 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/[0.06] truncate">
                    {lvl.target}
                  </code>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {lvl.summary}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
                  <span className={`px-1.5 py-0.5 rounded border ${lvl.badgeColor}`}>
                    {lvl.badge}
                  </span>
                  <span
                    className={`transition-colors ${
                      isSelected ? "text-emerald-400 font-semibold" : "text-zinc-500"
                    }`}
                  >
                    {isSelected ? "Active View" : "Click to view →"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Level Deep Dive Panel */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-semibold text-zinc-200">
                {active.tag}: {active.title} Implementation
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(active.code, active.level)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors self-start sm:self-center"
            >
              {copiedLevel === active.level ? (
                <>
                  <TickIcon size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon size={12} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {active.detail}
          </p>

          {/* Code preview */}
          <div className="rounded-lg border border-white/[0.06] bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto selection:bg-zinc-800">
            <pre className="!m-0 !p-0 leading-relaxed whitespace-pre">
              <code>{active.code}</code>
            </pre>
          </div>

          {/* Escalation Recommendation Banner */}
          <div className="rounded-lg border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5 text-xs">
            <ArrowRightIcon size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-zinc-400">
              <span className="font-mono font-semibold text-zinc-200 mr-1.5">
                ESCALATION RULE:
              </span>
              <span>{active.escalateWhen}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 12. THEMING PIPELINE FLOW
// ============================================================================

export function ThemingPipelineFlow() {
  const stages = [
    {
      step: "01",
      name: "App Semantic Tokens",
      tech: "shadcn / Tailwind",
      vars: ["--background", "--foreground", "--border", "--card"],
      role: "Surface & Structural Baseline",
      accent: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
    },
    {
      step: "02",
      name: "Plotcn Chart Tokens",
      tech: "globals.css (OKLCH)",
      vars: ["--chart-1", "--chart-2", "--chart-3..5"],
      role: "Categorical Visualization Identity",
      accent: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
    },
    {
      step: "03",
      name: "Engine Token Adapters",
      tech: "lib/google-charts & utils",
      vars: ["theme-adapter", "recharts-stroke", "d3-scales"],
      role: "Translates CSS Vars to Engine Contracts",
      accent: "text-amber-400 border-amber-500/20 bg-amber-950/20",
    },
    {
      step: "04",
      name: "Multi-Engine Outputs",
      tech: "Recharts • D3.js • Google Charts",
      vars: ["SVG Paths", "HTML Tooltips", "Canvas Marks"],
      role: "Rendered Pixel-Perfect Charts",
      accent: "text-purple-400 border-purple-500/20 bg-purple-950/20",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Unified Theming Pipeline
        </h4>
        <span className="text-[11px] font-mono text-cyan-400">Architecture Flow</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage, idx) => (
          <div
            key={stage.step}
            className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 flex flex-col justify-between space-y-3 relative group hover:border-white/[0.12] transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-500">
                  STAGE {stage.step}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${stage.accent}`}>
                  {stage.tech}
                </span>
              </div>
              <h5 className="font-mono text-xs font-semibold text-zinc-100">
                {stage.name}
              </h5>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                {stage.role}
              </p>
            </div>

            <div className="rounded-lg border border-white/[0.04] bg-zinc-950/80 p-2 space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                Carried Variables:
              </span>
              <div className="flex flex-wrap gap-1">
                {stage.vars.map((v) => (
                  <span
                    key={v}
                    className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/[0.06]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Right arrow connector for desktop */}
            {idx < stages.length - 1 && (
              <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 size-4 rounded-full bg-zinc-900 border border-white/[0.1] items-center justify-center text-zinc-400">
                <ArrowRightIcon size={10} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 13. REUSE RULE GRID
// ============================================================================

export function ReuseRuleGrid() {
  const rules = [
    {
      role: "Application Surface",
      source: "Reuse Host Token",
      token: "var(--background) / var(--card)",
      desc: "Chart cards and canvas backgrounds inherit host container surfaces naturally without explicit repainting.",
      tag: "100% Shared",
      tagColor: "text-emerald-400 bg-emerald-950/30 border-emerald-500/20",
    },
    {
      role: "Cartesian Gridlines",
      source: "Reuse Host Token",
      token: "var(--border) or subtle alpha",
      desc: "Horizontal and vertical guide lines match host separator borders at a restrained 6–10% opacity.",
      tag: "Structural",
      tagColor: "text-zinc-400 bg-zinc-900 border-zinc-700/40",
    },
    {
      role: "Axis Tick Labels",
      source: "Reuse Host Token",
      token: "var(--muted-foreground)",
      desc: "Timestamps, dollar units, and category ticks inherit secondary label typography and muted contrast.",
      tag: "Typography",
      tagColor: "text-cyan-400 bg-cyan-950/30 border-cyan-500/20",
    },
    {
      role: "Primary Data Series",
      source: "Declare Dedicated Token",
      token: "var(--chart-1)",
      desc: "Series marks require dedicated OKLCH categorical tokens to maintain visual punch and WCAG contrast.",
      tag: "Dedicated",
      tagColor: "text-amber-400 bg-amber-950/30 border-amber-500/20",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          The "Reuse Before Extend" Mapping Matrix
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Zero Design Drift</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rules.map((r) => (
          <div
            key={r.role}
            className="rounded-xl border border-white/[0.06] bg-zinc-900/30 p-4 flex flex-col justify-between space-y-3 hover:border-white/[0.12] transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-100">
                  {r.role}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${r.tagColor}`}>
                  {r.tag}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                {r.desc}
              </p>
            </div>

            <div className="rounded-lg border border-white/[0.04] bg-zinc-950 p-2 space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                Target Token:
              </span>
              <code className="text-[11px] font-mono text-emerald-400 block truncate">
                {r.token}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 14. VISUAL CONTRAST HIERARCHY
// ============================================================================

export function VisualContrastHierarchy() {
  const tiers = [
    {
      tier: "Tier 1",
      role: "Data Marks (Lines, Bars, Dots)",
      contrast: "100% Contrast",
      roleDesc: "Primary visual focus. Uncompromised saturation and highest contrast against background surface.",
      barWidth: "w-full",
      barBg: "bg-emerald-400",
      textColor: "text-emerald-400",
    },
    {
      tier: "Tier 2",
      role: "Axis Labels & Timestamps",
      contrast: "65–80% Contrast",
      roleDesc: "Secondary scanning context. Readable when inspected, but steps back to avoid overpowering data peaks.",
      barWidth: "w-3/4",
      barBg: "bg-zinc-400",
      textColor: "text-zinc-300",
    },
    {
      tier: "Tier 3",
      role: "Cartesian Gridlines",
      contrast: "6–12% Contrast",
      roleDesc: "Tertiary orientation aids. Must remain quiet; if gridlines are noticed first, the chart is over-emphasized.",
      barWidth: "w-1/4",
      barBg: "bg-zinc-600",
      textColor: "text-zinc-500",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Visual Contrast Hierarchy
        </h4>
        <span className="text-[11px] font-mono text-zinc-400">Readability Discipline</span>
      </div>

      <div className="space-y-3">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-zinc-500">
                  {t.tier}
                </span>
                <span className="font-mono text-xs font-semibold text-zinc-100">
                  {t.role}
                </span>
              </div>
              <span className={`text-xs font-mono font-semibold ${t.textColor}`}>
                {t.contrast}
              </span>
            </div>

            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${t.barBg} ${t.barWidth}`} />
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              {t.roleDesc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

