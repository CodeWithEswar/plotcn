"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { DocsArticleActions } from "./docs-article-actions"

// ============================================================================
// LIGHTWEIGHT SVG ICONS
// ============================================================================

function CheckmarkIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
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

function KeyboardIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M18 12h.01M8 16h8" />
    </svg>
  )
}

function EyeIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function VolumeIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function HandIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  )
}

function TableIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <path d="M12 3v18M3 9h18M3 15h18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  )
}

function SparklesIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
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
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  )
}

// ============================================================================
// 1. HERO COMPONENT
// ============================================================================

export function AccessibilityHero() {
  const tags = [
    { label: "Semantic HTML", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" },
    { label: "Keyboard", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20" },
    { label: "Screen Readers", color: "text-sky-400 border-sky-500/30 bg-sky-950/20" },
    { label: "Reduced Motion", color: "text-amber-400 border-amber-500/30 bg-amber-950/20" },
    { label: "Non-color Encoding", color: "text-purple-400 border-purple-500/30 bg-purple-950/20" },
    { label: "Accessible Data", color: "text-rose-400 border-rose-500/30 bg-rose-950/20" },
  ]

  return (
    <div className="relative mb-8 pb-8 border-b border-white/[0.08] space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Fundamentals / Accessibility
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs font-mono text-zinc-400">WCAG-Aware Engineering</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Accessibility
        </h1>

        <p className="text-lg sm:text-xl text-zinc-300 font-medium leading-relaxed max-w-2xl">
          Visualizations that communicate beyond the visual.
        </p>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
          Plotcn treats accessibility as part of the chart contract: meaningful labels, structured summaries,
          keyboard interaction, non-color encoding, reduced motion, and accessible data fallbacks.
        </p>
      </div>

      {/* Metadata tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {tags.map((t) => (
          <span
            key={t.label}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${t.color}`}
          >
            {t.label}
          </span>
        ))}
      </div>

      <DocsArticleActions rawContent="" slug="accessibility" />
    </div>
  )
}

// ============================================================================
// 2. ACCESSIBILITY MODEL (MULTI-MODAL DIAGRAM)
// ============================================================================

export function AccessibilityModel() {
  const [activePersona, setActivePersona] = useState<string>("screen-reader")

  const personas = [
    {
      id: "sighted",
      title: "Sighted Mouse User",
      icon: EyeIcon,
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30",
      activeBorder: "border-emerald-500 bg-emerald-950/20",
      description: "Direct visual inspection, fluid cursor hover states, OKLCH categorical palettes, and card boundaries.",
      paths: [
        { label: "Visual Marks", desc: "SVG lines, bars, and coordinate axes styled with WCAG 3:1 graphical contrast." },
        { label: "Hover Tooltips", desc: "Rich popovers displaying formatted numbers and dimensional details." },
        { label: "Card Shell", desc: "Visible section headings and contextual subtitles." },
      ],
    },
    {
      id: "keyboard",
      title: "Keyboard Only User",
      icon: KeyboardIcon,
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-950/30",
      activeBorder: "border-cyan-500 bg-cyan-950/20",
      description: "Navigates solely with Tab, Arrows, and Enter. Requires prominent focus rings and zero hover-only dependencies.",
      paths: [
        { label: "Focus Rings", desc: "Explicit 2px focus-visible outline with 2px offset on active marks." },
        { label: "Roving Tabindex", desc: "Arrow keys (← / →) sequentially step through data points without cluttering the global tab order." },
        { label: "Keyboard Tooltips", desc: "Popovers stay open on focus; dismissed immediately with Escape." },
      ],
    },
    {
      id: "screen-reader",
      title: "Screen Reader User",
      icon: VolumeIcon,
      accent: "text-sky-400 border-sky-500/30 bg-sky-950/30",
      activeBorder: "border-sky-500 bg-sky-950/20",
      description: "Consumes structured semantics via NVDA, VoiceOver, or JAWS. Relies on titles, descriptions, text summaries, and tables.",
      paths: [
        { label: "Accessible Name", desc: "Heading connected via aria-labelledby provides concise context." },
        { label: "Deterministic Summary", desc: "Natural-language text surfaces trend, peak, minimum, and overall delta." },
        { label: "Data Table Fallback", desc: "Semantic <table> alternative enables cell-by-cell row navigation." },
      ],
    },
    {
      id: "touch",
      title: "Touch / Mobile User",
      icon: HandIcon,
      accent: "text-amber-400 border-amber-500/30 bg-amber-950/30",
      activeBorder: "border-amber-500 bg-amber-950/20",
      description: "Interacts on small touchscreens. Needs minimum 44px hit targets and gestures that don't block page scrolling.",
      paths: [
        { label: "Generous Hit Targets", desc: "Invisible expanded stroke/target areas (min 44px) around SVG data points." },
        { label: "Tap to Inspect", desc: "Single tap reveals tooltip card; tap outside dismisses without pinch interference." },
        { label: "Horizontal Legends", desc: "Legends wrap or scroll cleanly without breaking viewport width." },
      ],
    },
    {
      id: "reduced-motion",
      title: "Reduced Motion User",
      icon: SparklesIcon,
      accent: "text-purple-400 border-purple-500/30 bg-purple-950/30",
      activeBorder: "border-purple-500 bg-purple-950/20",
      description: "Experiences vestibular discomfort or cognitive strain from movement. Requires instant visual resolution.",
      paths: [
        { label: "Instant Render", desc: "Bypasses line sweep, bar expansion, and force-directed bouncy animations." },
        { label: "Stable Visual State", desc: "Chart renders directly into final geometric coordinates." },
        { label: "Zero Disorientation", desc: "State updates cross-fade cleanly without geometric sliding." },
      ],
    },
  ]

  const current = personas.find((p) => p.id === activePersona) || personas[2]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="border-b border-white/[0.08] p-5 sm:p-6 bg-zinc-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-100 font-semibold">
                Multi-Modal Accessibility Model
              </h4>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl font-sans">
              One shared dataset rendered into multiple sensory and input paths. Every user consumes the same core insight.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full self-start sm:self-center">
            Universal Access
          </span>
        </div>

        {/* Persona Selector Tabs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
          {personas.map((p) => {
            const Icon = p.icon
            const isSelected = activePersona === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePersona(p.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-zinc-800 text-white shadow-sm border border-white/[0.12]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <Icon size={13} className={isSelected ? "text-emerald-400" : "text-zinc-400"} />
                <span className="truncate">{p.title.split(" ")[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Interactive Active Persona View */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${current.accent}`}>
              {current.title}
            </span>
            <span className="text-xs text-zinc-400 font-sans">Experience Pathway</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Path 1 of 5 active
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-2xl">
          {current.description}
        </p>

        {/* Pathway cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {current.paths.map((path, idx) => (
            <div
              key={path.label}
              className="rounded-xl border border-white/[0.06] bg-zinc-900/30 p-4 space-y-2 flex flex-col justify-between hover:border-white/[0.12] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  LAYER 0{idx + 1}
                </span>
                <h5 className="font-mono text-xs font-semibold text-zinc-100">
                  {path.label}
                </h5>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {path.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. CHART SUMMARY PREVIEW
// ============================================================================

export function ChartSummaryPreview() {
  const [viewMode, setViewMode] = useState<"visual" | "summary" | "speech">("visual")

  const dataPoints = [
    { month: "Jan", revenue: 42000, label: "$42K" },
    { month: "Feb", revenue: 47000, label: "$47K" },
    { month: "Mar", revenue: 51000, label: "$51K" },
    { month: "Apr", revenue: 58000, label: "$58K" },
    { month: "May", revenue: 67400, label: "$67.4K", isPeak: true },
    { month: "Jun", revenue: 61000, label: "$61K" },
  ]

  const maxVal = 70000

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            Text Summary Paradigm
          </h4>
          <p className="text-[11px] text-zinc-400 font-sans">
            Screen-reader users benefit far more from concise key insights than traversing 50 isolated SVG paths.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-white/[0.06] self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
              viewMode === "visual" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Chart View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("summary")}
            className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
              viewMode === "summary" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Summary Text
          </button>
          <button
            type="button"
            onClick={() => setViewMode("speech")}
            className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
              viewMode === "speech" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Screen Reader Simulation
          </button>
        </div>
      </div>

      {viewMode === "visual" && (
        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-zinc-200">
              Monthly Revenue (H1 2026)
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Peak: May ($67.4K)</span>
          </div>

          {/* Simple CSS Bar Visualization */}
          <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2 border-b border-white/[0.08]">
            {dataPoints.map((d) => {
              const heightPercent = Math.round((d.revenue / maxVal) * 100)
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-emerald-400 transition-colors">
                    {d.label}
                  </span>
                  <div className="w-full max-w-[36px] bg-zinc-800 rounded-t-sm relative overflow-hidden flex items-end" style={{ height: `${heightPercent}%` }}>
                    <div
                      className={`w-full h-full transition-all ${
                        d.isPeak ? "bg-emerald-400" : "bg-zinc-600 group-hover:bg-zinc-400"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-300 font-medium">
                    {d.month}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Connected Accessible Summary Box */}
          <div className="rounded-lg border border-white/[0.08] bg-zinc-950 p-3.5 space-y-1 font-mono text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-emerald-400">#summary:</span>
              <span className="text-zinc-300">
                Revenue expanded by 45.2% from $42,000 in January to $61,000 in June. The period reached a peak of $67,400 in May.
              </span>
            </div>
          </div>
        </div>
      )}

      {viewMode === "summary" && (
        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-5 space-y-3 font-mono text-xs text-zinc-300">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Deterministic Text Summary Extraction
          </div>
          <p className="font-sans leading-relaxed text-zinc-300 text-sm">
            "Line chart displaying monthly revenue from January through June 2026. Revenue grew overall by $19,000 (+45.2%), reaching a high of $67,400 in May and a low of $42,000 in January."
          </p>
          <div className="rounded-lg border border-white/[0.04] bg-zinc-950 p-3 space-y-1 text-[11px]">
            <span className="text-zinc-500 uppercase block">Deterministic fields surfaced:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-zinc-300 pt-1">
              <div>• Direction: <span className="text-emerald-400">Upward Growth</span></div>
              <div>• Peak: <span className="text-zinc-100">May ($67.4K)</span></div>
              <div>• Floor: <span className="text-zinc-100">Jan ($42.0K)</span></div>
              <div>• Delta: <span className="text-emerald-400">+45.2% ($19K)</span></div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "speech" && (
        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <VolumeIcon size={14} />
            <span className="font-semibold uppercase tracking-wider">Screen Reader Announcement Output</span>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-950/20 p-4 font-mono text-xs text-sky-200 leading-relaxed">
            "Monthly Revenue, graphic. Revenue increased overall from January to June. Period peak was $67,400 in May. Data table with 6 rows available."
          </div>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Assistive technology users hear this concise, synthesized summary immediately upon navigating to the chart section, without needing to manually inspect 6 separate coordinate points.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 4. ACCESSIBLE DATA DISCLOSURE
// ============================================================================

export function AccessibleDataDisclosure() {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedTable, setCopiedTable] = useState(false)

  const rows = [
    { month: "January 2026", revenue: "$42,000", margin: "24%", delta: "+12%" },
    { month: "February 2026", revenue: "$47,000", margin: "26%", delta: "+11%" },
    { month: "March 2026", revenue: "$51,000", margin: "25%", delta: "+8%" },
    { month: "April 2026", revenue: "$58,000", margin: "29%", delta: "+13%" },
    { month: "May 2026", revenue: "$67,400", margin: "32%", delta: "+16%" },
    { month: "June 2026", revenue: "$61,000", margin: "30%", delta: "-9%" },
  ]

  const handleCopyCsv = () => {
    const csv = [
      "Month,Revenue,Margin,Growth",
      ...rows.map((r) => `${r.month},${r.revenue.replace(/[$,]/g, "")},${r.margin},${r.delta}`),
    ].join("\n")
    navigator.clipboard.writeText(csv)
    setCopiedTable(true)
    setTimeout(() => setCopiedTable(false), 2000)
  }

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            Accessible Data Alternative
          </h4>
          <p className="text-[11px] text-zinc-400 font-sans">
            Provide a semantic data table disclosure so power users and screen readers can navigate exact numerical figures.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="accessible-data-table-preview"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 transition-colors self-start sm:self-center"
        >
          <TableIcon size={14} className="text-emerald-400" />
          <span>{isOpen ? "Hide Data Table" : "View Data Table"}</span>
          <span className="text-[10px] text-zinc-500 font-sans">({isOpen ? "Collapse" : "Expand"})</span>
        </button>
      </div>

      {isOpen && (
        <div id="accessible-data-table-preview" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">
              Structured Table Alternative (Single Data Source)
            </span>
            <button
              type="button"
              onClick={handleCopyCsv}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] transition-colors"
            >
              {copiedTable ? (
                <>
                  <CheckmarkIcon size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied CSV</span>
                </>
              ) : (
                <>
                  <CopyIcon size={12} />
                  <span>Copy as CSV</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <caption className="sr-only">Monthly revenue, profit margin, and period growth for H1 2026</caption>
              <thead className="border-b border-white/[0.08] bg-zinc-950/60 text-zinc-400 text-[11px]">
                <tr>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Month</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Revenue (USD)</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Gross Margin</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">MoM Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {rows.map((r) => (
                  <tr key={r.month} className="hover:bg-zinc-800/30 transition-colors">
                    <th scope="row" className="py-2 px-4 font-normal text-zinc-200">{r.month}</th>
                    <td className="py-2 px-4 font-mono">{r.revenue}</td>
                    <td className="py-2 px-4 font-mono text-zinc-400">{r.margin}</td>
                    <td className={`py-2 px-4 font-mono ${r.delta.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                      {r.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 5. KEYBOARD INTERACTION GUIDE
// ============================================================================

export function KeyboardInteractionGuide() {
  const [activeKey, setActiveKey] = useState<number>(2) // Index of active point

  const points = [
    { id: 0, label: "Jan", value: "$42,000" },
    { id: 1, label: "Feb", value: "$47,000" },
    { id: 2, label: "Mar", value: "$51,000" },
    { id: 3, label: "Apr", value: "$58,000" },
    { id: 4, label: "May", value: "$67,400" },
    { id: 5, label: "Jun", value: "$61,000" },
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveKey((prev) => (prev < points.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveKey((prev) => (prev > 0 ? prev - 1 : prev))
    }
  }

  const current = points[activeKey]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Keyboard Navigation Flow (Roving Tabindex)
        </h4>
        <span className="text-[11px] font-mono text-cyan-400">Interactive Model</span>
      </div>

      {/* Key Command Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-2.5 space-y-1">
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200 text-[10px]">
            Tab
          </kbd>
          <div className="text-[11px] text-zinc-300">Enter Chart</div>
          <p className="text-[10px] text-zinc-500 font-sans">Enters the chart component as a single tab stop.</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-2.5 space-y-1">
          <div className="flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200 text-[10px]">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200 text-[10px]">→</kbd>
          </div>
          <div className="text-[11px] text-zinc-300">Step Points</div>
          <p className="text-[10px] text-zinc-500 font-sans">Steps through data points sequentially.</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-2.5 space-y-1">
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200 text-[10px]">
            Enter / Space
          </kbd>
          <div className="text-[11px] text-zinc-300">Lock / Select</div>
          <p className="text-[10px] text-zinc-500 font-sans">Pins tooltip details or triggers drill-down.</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-2.5 space-y-1">
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200 text-[10px]">
            Escape
          </kbd>
          <div className="text-[11px] text-zinc-300">Dismiss</div>
          <p className="text-[10px] text-zinc-500 font-sans">Closes popovers and returns focus to canvas.</p>
        </div>
      </div>

      {/* Interactive Keyboard Playground */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Interactive keyboard visualization test canvas. Use Left and Right arrow keys to step between points."
        className="rounded-xl border border-white/[0.08] bg-zinc-900/30 p-4 space-y-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/80 focus:border-emerald-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>Click canvas or press Tab to focus • Use Arrow Keys</span>
          <span className="text-emerald-400 font-semibold">
            Point {activeKey + 1} of {points.length}
          </span>
        </div>

        {/* Visual Points Row */}
        <div className="flex items-center justify-between gap-2 pt-2 pb-1">
          {points.map((p) => {
            const isCurrent = p.id === activeKey
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveKey(p.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg border transition-all ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40 text-emerald-400"
                    : "border-white/[0.06] bg-zinc-900/50 text-zinc-400 hover:border-white/[0.15]"
                }`}
              >
                <span className="size-3 rounded-full border border-white/[0.2] flex items-center justify-center">
                  <span className={`size-1.5 rounded-full ${isCurrent ? "bg-emerald-400" : "bg-zinc-600"}`} />
                </span>
                <span className="text-[10px] font-mono font-medium">{p.label}</span>
                <span className="text-[10px] font-mono text-zinc-300">{p.value}</span>
              </button>
            )
          })}
        </div>

        {/* Live Status Announcement Region */}
        <div aria-live="polite" className="rounded-lg border border-white/[0.04] bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300 flex items-center gap-2">
          <span className="text-emerald-400">#live-announcement:</span>
          <span>
            {current.label} selected. Value: {current.value} ({activeKey + 1} of {points.length}).
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. NON-COLOR ENCODING PREVIEW
// ============================================================================

export function NonColorEncodingPreview() {
  const [isGrayscale, setIsGrayscale] = useState(false)

  const series = [
    {
      name: "Actual Revenue",
      color: "#10B981", // emerald
      grayColor: "#9CA3AF",
      marker: "● Circle",
      dash: "solid",
      stroke: "solid",
      strokeDasharray: "",
      desc: "Solid primary line with circular geometric vertex marks.",
    },
    {
      name: "Target Budget",
      color: "#06B6D4", // cyan
      grayColor: "#6B7280",
      marker: "■ Square",
      dash: "6 4 dashed",
      stroke: "dashed",
      strokeDasharray: "6 4",
      desc: "Dashed comparison line with square geometric vertex marks.",
    },
    {
      name: "Risk Forecast",
      color: "#F59E0B", // amber
      grayColor: "#4B5563",
      marker: "▲ Triangle",
      dash: "2 3 dotted",
      stroke: "dotted",
      strokeDasharray: "2 3",
      desc: "Dotted forecast line with triangular warning vertex marks.",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            Non-Color Visual Encoding
          </h4>
          <p className="text-[11px] text-zinc-400 font-sans">
            Never convey information by color hue alone. Pair colors with stroke patterns, markers, and direct labels.
          </p>
        </div>

        {/* Grayscale Simulator Toggle */}
        <button
          type="button"
          onClick={() => setIsGrayscale(!isGrayscale)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors self-start sm:self-center ${
            isGrayscale
              ? "border-amber-500/50 bg-amber-950/30 text-amber-400"
              : "border-white/[0.08] bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {isGrayscale ? "Disable Monochromacy Filter" : "Simulate Monochromacy / Grayscale"}
        </button>
      </div>

      {/* SVG Canvas Demonstrating 3 Independent Encodings */}
      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-5 space-y-4">
        <svg
          viewBox="0 0 600 160"
          className="w-full h-40 overflow-visible"
          aria-label="Demo comparison of three distinct series with unique stroke patterns and vertex shapes"
        >
          {/* Gridlines */}
          <line x1="40" y1="20" x2="560" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="40" y1="70" x2="560" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="40" y1="120" x2="560" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

          {/* Series 1: Solid + Circles */}
          <path
            d="M 50 110 L 150 90 L 250 70 L 350 45 L 450 35 L 550 25"
            fill="none"
            stroke={isGrayscale ? "#D1D5DB" : "#10B981"}
            strokeWidth="2.5"
          />
          {[
            [50, 110], [150, 90], [250, 70], [350, 45], [450, 35], [550, 25],
          ].map(([x, y], idx) => (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4.5"
              fill={isGrayscale ? "#D1D5DB" : "#10B981"}
              stroke="#09090B"
              strokeWidth="2"
            />
          ))}

          {/* Series 2: Dashed + Squares */}
          <path
            d="M 50 130 L 150 115 L 250 100 L 350 85 L 450 65 L 550 55"
            fill="none"
            stroke={isGrayscale ? "#9CA3AF" : "#06B6D4"}
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          {[
            [50, 130], [150, 115], [250, 100], [350, 85], [450, 65], [550, 55],
          ].map(([x, y], idx) => (
            <rect
              key={idx}
              x={x - 4}
              y={y - 4}
              width="8"
              height="8"
              fill={isGrayscale ? "#9CA3AF" : "#06B6D4"}
              stroke="#09090B"
              strokeWidth="2"
            />
          ))}

          {/* Series 3: Dotted + Triangles */}
          <path
            d="M 50 145 L 150 135 L 250 130 L 350 115 L 450 105 L 550 90"
            fill="none"
            stroke={isGrayscale ? "#6B7280" : "#F59E0B"}
            strokeWidth="2"
            strokeDasharray="2 3"
          />
          {[
            [50, 145], [150, 135], [250, 130], [350, 115], [450, 105], [550, 90],
          ].map(([x, y], idx) => (
            <polygon
              key={idx}
              points={`${x},${y - 5} ${x - 4.5},${y + 4} ${x + 4.5},${y + 4}`}
              fill={isGrayscale ? "#6B7280" : "#F59E0B"}
              stroke="#09090B"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Series Legend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs pt-2 border-t border-white/[0.04]">
          {series.map((s) => (
            <div key={s.name} className="rounded-lg border border-white/[0.06] bg-zinc-950 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200">{s.name}</span>
                <span className="text-[10px] text-zinc-400">{s.marker}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span className="size-2 rounded-full" style={{ backgroundColor: isGrayscale ? s.grayColor : s.color }} />
                <span>Stroke: {s.dash}</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. ACCESSIBILITY TEST MATRIX
// ============================================================================

export function AccessibilityTestMatrix() {
  const tests = [
    {
      category: "Naming & Labels",
      item: "Accessible Name & Description",
      method: "Screen Reader & DOM Inspection",
      requirement: "Mandatory for All Charts",
      procedure: "Inspect root SVG/section for aria-labelledby and aria-describedby pointing to valid, stable DOM IDs.",
    },
    {
      category: "Insights",
      item: "Natural-Language Data Summary",
      method: "Text / DOM Audit",
      requirement: "Mandatory for Key Charts",
      procedure: "Verify concise sentence surfacing overall direction, peak month/value, minimum, and delta percentage.",
    },
    {
      category: "Data Alternative",
      item: "Semantic Table Alternative",
      method: "Screen Reader Table Keys (T / Ctrl+Alt+Arrows)",
      requirement: "Recommended for Multi-series",
      procedure: "Confirm table contains matching numeric values from the single source array with scoped <th> cells.",
    },
    {
      category: "Keyboard",
      item: "Roving Tabindex Navigation",
      method: "Keyboard Only (Tab, ← / →, Enter, Esc)",
      requirement: "Mandatory for Interactive",
      procedure: "Ensure chart enters as 1 tab stop. Left/Right arrows move through data points with visible 2px outline.",
    },
    {
      category: "Visual Encoding",
      item: "Non-Color Data Distinction",
      method: "Grayscale / Monochrome Filter",
      requirement: "Mandatory for Multi-series",
      procedure: "Switch viewport to grayscale. Confirm series remain distinguishable via dash patterns, markers, and direct labels.",
    },
    {
      category: "Motion",
      item: "prefers-reduced-motion Support",
      method: "DevTools Emulation (Reduced Motion)",
      requirement: "Mandatory if Animated",
      procedure: "Emulate reduced motion. Chart must render directly into final coordinates without sweeping or bouncing.",
    },
    {
      category: "States",
      item: "Truthful Loading / Empty / Error",
      method: "Network Throttling & Mock Failure",
      requirement: "Mandatory for Async Charts",
      procedure: "Verify aria-busy during loading (no fake data), helpful error descriptions, and accessible retry buttons.",
    },
    {
      category: "Responsive Zoom",
      item: "400% Browser Zoom Inspection",
      method: "Browser Zoom at 400% (320px layout)",
      requirement: "Mandatory for Responsive",
      procedure: "Confirm content does not produce two-dimensional page scrolling; labels declutter gracefully.",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Plotcn Visualization Accessibility Verification Matrix
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Engineering QA Protocol</span>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/30 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <caption className="sr-only">Plotcn accessibility testing matrix across naming, keyboard, motion, and states</caption>
          <thead className="border-b border-white/[0.08] bg-zinc-950/80 text-zinc-400 text-[11px]">
            <tr>
              <th scope="col" className="py-2.5 px-4 font-semibold">Category</th>
              <th scope="col" className="py-2.5 px-4 font-semibold">Accessibility Check</th>
              <th scope="col" className="py-2.5 px-4 font-semibold">Audit Method</th>
              <th scope="col" className="py-2.5 px-4 font-semibold">Engineering Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-zinc-300">
            {tests.map((t) => (
              <tr key={t.item} className="hover:bg-zinc-800/20 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-zinc-400 text-[11px]">{t.category}</td>
                <td className="py-2.5 px-4">
                  <div className="text-zinc-100 font-medium">{t.item}</div>
                  <div className="text-[10px] text-zinc-500 font-sans mt-0.5">{t.procedure}</div>
                </td>
                <td className="py-2.5 px-4 text-zinc-400 text-[11px]">{t.method}</td>
                <td className="py-2.5 px-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    t.requirement.includes("Mandatory")
                      ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
                      : "text-cyan-400 border-cyan-500/30 bg-cyan-950/20"
                  }`}>
                    {t.requirement}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// 8. ACCESSIBILITY TROUBLESHOOTING / COMMON MISTAKES
// ============================================================================

export function AccessibilityTroubleshooting() {
  const mistakes = [
    {
      title: "aria-label Alone is Incomplete",
      problem: "Setting aria-label='Revenue Chart' and assuming the visualization is fully accessible.",
      why: "A screen-reader user still has zero awareness of the trend, the numbers, the peak month, or the underlying dataset.",
      fix: "Pair the title with an accessible description, a structured data summary, and a data table alternative.",
    },
    {
      title: "50 SVG Nodes as 50 Tab Stops",
      problem: "Making every path, circle, or bar element focusable with tabIndex={0}.",
      why: "Tabbing through 50 data points becomes exhausting and pollutes the global document tab sequence.",
      fix: "Enter the chart container as 1 tab stop, then use a roving tabindex (Arrow keys) to step through internal marks.",
    },
    {
      title: "Hover-Only Tooltip Metric Data",
      problem: "Exact coordinate values and percentages only appear upon mouse cursor hover.",
      why: "Keyboard users, voice-control users, and mobile touch users can never reach or inspect that data.",
      fix: "Expose identical details on keyboard focus, provide an accessible data table, or summarize directly in text.",
    },
    {
      title: "Color as Sole Data Distinction",
      problem: "Distinguishing three lines solely by green, blue, and orange hues.",
      why: "Color-blind users (~8% of males) and users in high-glare environments cannot tell which line is which.",
      fix: "Add geometric vertex markers (circle, square, triangle), distinct dash patterns, or direct line labels.",
    },
    {
      title: "Noisy Live Regions on Every Redraw",
      problem: "Placing an entire interactive chart inside aria-live='polite' or 'assertive'.",
      why: "Screen readers spam the user with continuous coordinate announcements on every cursor jitter or frame refresh.",
      fix: "Only announce meaningful, discrete state changes (e.g. 'Filter applied: 12 results' or 'May selected: $67,400').",
    },
    {
      title: "Focus Dropped on Chart Redraw",
      problem: "Re-rendering or swapping themes completely unmounts the chart and drops keyboard focus back to <body>.",
      why: "Disorients keyboard users and forces them to re-navigate the entire page to find their place.",
      fix: "Preserve logical focus state across renders, and avoid recreating outer DOM container nodes on resize.",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Common Visualization Accessibility Mistakes
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
// 9. ACCESSIBILITY WORKFLOW
// ============================================================================

export function AccessibilityWorkflow() {
  const steps = [
    { num: "01", title: "Define Core Meaning", desc: "Identify the primary insight or trend the chart is intended to communicate." },
    { num: "02", title: "Add Visible Title", desc: "Attach an explicit heading (<h2> or <h3>) with a stable, server-safe ID." },
    { num: "03", title: "Attach Description", desc: "Write a concise sentence specifying units, timeline, and scope via aria-describedby." },
    { num: "04", title: "Craft Data Summary", desc: "Surface directional trend, peak, floor, and total change in natural language." },
    { num: "05", title: "Add Table Alternative", desc: "Provide an accessible semantic table disclosure sharing the same underlying data array." },
    { num: "06", title: "Establish Keyboard Path", desc: "Configure 1 Tab stop into chart; roving Arrow keys (←/→) to inspect data points." },
    { num: "07", title: "Enforce Visible Focus", desc: "Style :focus-visible with a high-contrast 2px outline and 2px offset." },
    { num: "08", title: "Abolish Hover-Only", desc: "Ensure all metric tooltips can be triggered via keyboard focus and mobile tap." },
    { num: "09", title: "Check Non-Color Cues", desc: "Audit in grayscale: add distinct stroke dashes, geometric markers, and direct labels." },
    { num: "10", title: "Respect Reduced Motion", desc: "Bypass line sweeps and spring physics under prefers-reduced-motion: reduce." },
    { num: "11", title: "Validate Dynamic States", desc: "Audit truthful loading skeletons, informative empty states, and actionable retry errors." },
    { num: "12", title: "Perform Screen-Reader QA", desc: "Verify live readout using VoiceOver (macOS/iOS) or NVDA (Windows) before shipping." },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          12-Step Accessible Visualization Delivery Sequence
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Engineering Protocol</span>
      </div>

      {/* 12-step sequence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s) => (
          <div key={s.num} className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400">{s.num}</span>
            <div className="text-xs font-mono font-semibold text-zinc-100">{s.title}</div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Reusable Mental Model Contract Card */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-900/30 p-4 space-y-3 font-mono text-xs">
        <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider border-b border-white/[0.04] pb-2">
          The Plotcn Accessibility Contract
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-sans pt-1">
          <div className="rounded border border-white/[0.06] bg-zinc-950 p-3 space-y-1">
            <div className="font-mono text-emerald-400 text-xs font-semibold">Static Chart</div>
            <p className="text-[11px] text-zinc-400 font-sans">Accessible Name + Description + Text Summary</p>
          </div>
          <div className="rounded border border-white/[0.06] bg-zinc-950 p-3 space-y-1">
            <div className="font-mono text-cyan-400 text-xs font-semibold">Data-Rich Chart</div>
            <p className="text-[11px] text-zinc-400 font-sans">+ Semantic Data Table Alternative</p>
          </div>
          <div className="rounded border border-white/[0.06] bg-zinc-950 p-3 space-y-1">
            <div className="font-mono text-amber-400 text-xs font-semibold">Interactive Chart</div>
            <p className="text-[11px] text-zinc-400 font-sans">+ Roving Tabindex + Visible Focus + Touch</p>
          </div>
          <div className="rounded border border-white/[0.06] bg-zinc-950 p-3 space-y-1">
            <div className="font-mono text-purple-400 text-xs font-semibold">Animated Chart</div>
            <p className="text-[11px] text-zinc-400 font-sans">+ Instant Reduced Motion Fallback</p>
          </div>
        </div>
      </div>
    </div>
  )
}
