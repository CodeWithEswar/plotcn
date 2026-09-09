"use client"

import React from "react"

/**
 * Diagram 1: Deterministic Multi-Series Identity Flow
 * Shows how series identities (keys, colors, markers, legend items) remain fixed
 * even when series visibility changes. Hiding a series NEVER reassigns colors of remaining series.
 */
export function MultiSignalIdentityFlow() {
  return (
    <figure
      role="region"
      aria-label="Multi-Signal Line Deterministic Identity Flow Diagram"
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      {/* Background coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SVG FLOW ANIMATION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Deterministic Series Identity
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Stable Color Assignment Across Visibility Toggles
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" />
            <span>Web (--chart-1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>iOS (--chart-2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            <span>Android (--chart-3)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 300"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="multi-card-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="multi-card-hidden" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#27272a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0.6" />
            </linearGradient>
            <filter id="multi-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Step 1: Canonical Series Config */}
          <g transform="translate(20, 20)">
            <rect
              width="230"
              height="250"
              rx="12"
              className="fill-zinc-900/80 stroke-white/[0.12]"
              strokeWidth="1"
            />
            <rect
              x="12"
              y="12"
              width="206"
              height="28"
              rx="6"
              className="fill-zinc-800/60 stroke-white/[0.06]"
            />
            <text x="24" y="30" className="text-[11px] font-mono fill-zinc-300 font-semibold">
              Canonical Series Config
            </text>

            {/* Series item 0: Web */}
            <g transform="translate(14, 52)">
              <rect width="202" height="52" rx="8" className="fill-blue-500/10 stroke-blue-500/30" />
              <circle cx="16" cy="26" r="5" className="fill-blue-500" />
              <text x="30" y="22" className="text-[11px] font-semibold fill-white">
                series[0]: "web"
              </text>
              <text x="30" y="38" className="text-[9px] font-mono fill-blue-300">
                Token: --chart-1 (#3b82f6)
              </text>
            </g>

            {/* Series item 1: iOS */}
            <g transform="translate(14, 114)">
              <rect width="202" height="52" rx="8" className="fill-emerald-500/10 stroke-emerald-500/30" />
              <circle cx="16" cy="26" r="5" className="fill-emerald-500" />
              <text x="30" y="22" className="text-[11px] font-semibold fill-white">
                series[1]: "ios"
              </text>
              <text x="30" y="38" className="text-[9px] font-mono fill-emerald-300">
                Token: --chart-2 (#10b981)
              </text>
            </g>

            {/* Series item 2: Android */}
            <g transform="translate(14, 176)">
              <rect width="202" height="52" rx="8" className="fill-amber-500/10 stroke-amber-500/30" />
              <circle cx="16" cy="26" r="5" className="fill-amber-500" />
              <text x="30" y="22" className="text-[11px] font-semibold fill-white">
                series[2]: "android"
              </text>
              <text x="30" y="38" className="text-[9px] font-mono fill-amber-300">
                Token: --chart-3 (#f59e0b)
              </text>
            </g>
          </g>

          {/* Connector Arrows: Config to Interactive Legend */}
          <path
            d="M 250 80 L 300 80"
            className="stroke-blue-400/60"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <path
            d="M 250 145 L 300 145"
            className="stroke-emerald-400/60"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <path
            d="M 250 205 L 300 205"
            className="stroke-amber-400/60"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Step 2: Interactive Legend & Visibility State */}
          <g transform="translate(300, 20)">
            <rect
              width="240"
              height="250"
              rx="12"
              className="fill-zinc-900/80 stroke-white/[0.12]"
              strokeWidth="1"
            />
            <rect
              x="12"
              y="12"
              width="216"
              height="28"
              rx="6"
              className="fill-zinc-800/60 stroke-white/[0.06]"
            />
            <text x="24" y="30" className="text-[11px] font-mono fill-zinc-300 font-semibold">
              Interactive Legend Toggle
            </text>

            {/* Web Toggle: Visible */}
            <g transform="translate(14, 52)">
              <rect width="212" height="52" rx="8" className="fill-zinc-800/40 stroke-white/10" />
              <circle cx="16" cy="26" r="4" className="fill-blue-500" />
              <text x="30" y="23" className="text-[11px] font-semibold fill-zinc-200">
                Web
              </text>
              <text x="30" y="38" className="text-[9px] font-mono fill-emerald-400">
                ✓ visible [aria-pressed=true]
              </text>
            </g>

            {/* iOS Toggle: HIDDEN BY USER */}
            <g transform="translate(14, 114)">
              <rect width="212" height="52" rx="8" className="fill-rose-500/10 stroke-rose-500/40" />
              <circle cx="16" cy="26" r="4" className="fill-zinc-600" />
              <text x="30" y="23" className="text-[11px] font-semibold fill-zinc-400 line-through">
                iOS (Clicked to Hide)
              </text>
              <text x="30" y="38" className="text-[9px] font-mono fill-rose-400 font-medium">
                ✗ hidden [aria-pressed=false]
              </text>
            </g>

            {/* Android Toggle: Visible */}
            <g transform="translate(14, 176)">
              <rect width="212" height="52" rx="8" className="fill-zinc-800/40 stroke-white/10" />
              <circle cx="16" cy="26" r="4" className="fill-amber-500" />
              <text x="30" y="23" className="text-[11px] font-semibold fill-zinc-200">
                Android
              </text>
              <text x="30" y="38" className="text-[9px] font-mono fill-emerald-400">
                ✓ visible [aria-pressed=true]
              </text>
            </g>
          </g>

          {/* Connector Arrows: Legend to Render Output */}
          <path
            d="M 540 80 L 590 80"
            className="stroke-blue-400/60"
            strokeWidth="2"
          />
          {/* iOS is suppressed */}
          <path
            d="M 540 145 L 590 145"
            className="stroke-zinc-600 stroke-dasharray-[3,3]"
            strokeWidth="1.5"
          />
          <path
            d="M 540 205 L 590 205"
            className="stroke-amber-400/60"
            strokeWidth="2"
          />

          {/* Step 3: Resolved Render Identity */}
          <g transform="translate(590, 20)">
            <rect
              width="250"
              height="250"
              rx="12"
              className="fill-zinc-900/80 stroke-white/[0.12]"
              strokeWidth="1"
            />
            <rect
              x="12"
              y="12"
              width="226"
              height="28"
              rx="6"
              className="fill-zinc-800/60 stroke-white/[0.06]"
            />
            <text x="24" y="30" className="text-[11px] font-mono fill-zinc-300 font-semibold">
              Truthful Rendered Curves
            </text>

            {/* Rendered Web: Unchanged */}
            <g transform="translate(14, 52)">
              <rect width="222" height="52" rx="8" className="fill-blue-500/10 stroke-blue-500/30" />
              <path d="M 16 32 Q 40 18, 70 24 T 120 16" className="stroke-blue-500" strokeWidth="2.5" fill="none" />
              <text x="130" y="24" className="text-[10px] font-semibold fill-white">
                Web keeps --chart-1
              </text>
              <text x="130" y="38" className="text-[9px] font-mono fill-zinc-400">
                Index 0 stroke intact
              </text>
            </g>

            {/* iOS: Suppressed from SVG & Tooltip */}
            <g transform="translate(14, 114)">
              <rect width="222" height="52" rx="8" className="fill-zinc-900/60 stroke-dashed stroke-zinc-700" />
              <text x="16" y="24" className="text-[10px] font-semibold fill-zinc-500">
                iOS completely removed
              </text>
              <text x="16" y="38" className="text-[9px] font-mono fill-zinc-600">
                Excluded from Y domain & tooltip
              </text>
            </g>

            {/* Android: STABLE IDENTITY GUARANTEE */}
            <g transform="translate(14, 176)">
              <rect width="222" height="52" rx="8" className="fill-amber-500/10 stroke-amber-500/30" />
              <path d="M 16 34 Q 40 28, 70 18 T 120 22" className="stroke-amber-500" strokeWidth="2.5" fill="none" />
              <text x="130" y="24" className="text-[10px] font-semibold fill-amber-300 font-bold">
                Android KEEPS --chart-3
              </text>
              <text x="130" y="38" className="text-[9px] font-mono fill-amber-400/90 font-medium">
                NEVER shifts to --chart-2!
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Footer Callout */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Identity Guarantee: Original series index governs palette token assignment.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Hidden series do not displace peer colors
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 2: Multi-Signal Inspection Flow
 * Visualizes shared nearest-X inspection across multiple peer series:
 * - Shared vertical crosshair
 * - Synchronized tooltip preserving canonical series ordering
 * - Independent handling of missing values (null != 0)
 */
export function MultiSignalInspectionFlow() {
  return (
    <figure
      role="region"
      aria-label="Multi-Signal Line Inspection Flow Diagram"
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      {/* Background coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
              SYNCHRONIZED INSPECTION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Nearest-X Crosshair & Shared Tooltip
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Shared Observation Scrubbing with Independent Missing Values
          </h4>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 260"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cartesian Plot Area */}
          <g transform="translate(40, 20)">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="480" y2="40" className="stroke-white/[0.06]" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="480" y2="90" className="stroke-white/[0.06]" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="480" y2="140" className="stroke-white/[0.06]" strokeDasharray="4 4" />
            <line x1="0" y1="190" x2="480" y2="190" className="stroke-white/[0.12]" />

            {/* X-axis ticks */}
            <text x="40" y="210" className="text-[10px] font-mono fill-zinc-500 text-anchor-middle">Jan</text>
            <text x="160" y="210" className="text-[10px] font-mono fill-zinc-500 text-anchor-middle">Feb</text>
            <text x="280" y="210" className="text-[10px] font-mono fill-sky-400 font-bold text-anchor-middle">Mar (Active X)</text>
            <text x="400" y="210" className="text-[10px] font-mono fill-zinc-500 text-anchor-middle">Apr</text>

            {/* Signal 1: Web (Continuous) */}
            <path
              d="M 40 150 L 160 125 L 280 85 L 400 95"
              className="stroke-blue-500"
              strokeWidth="2.5"
              fill="none"
            />

            {/* Signal 2: iOS (Missing gap at Mar!) */}
            <path
              d="M 40 170 L 160 155"
              className="stroke-emerald-500"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Gap across Mar */}
            <line x1="160" y1="155" x2="400" y2="115" className="stroke-emerald-500/20 stroke-dasharray-[2,4]" strokeWidth="1.5" />
            <path
              d="M 400 115 L 440 100"
              className="stroke-emerald-500"
              strokeWidth="2.5"
              fill="none"
            />

            {/* Signal 3: Android (Continuous) */}
            <path
              d="M 40 160 L 160 140 L 280 110 L 400 120"
              className="stroke-amber-500"
              strokeWidth="2.5"
              fill="none"
            />

            {/* SHARED VERTICAL CROSSHAIR AT X = 280 (Mar) */}
            <line
              x1="280"
              y1="20"
              x2="280"
              y2="190"
              className="stroke-white/40"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Active Marker 1: Web (Valid datum at Mar: 154) */}
            <circle cx="280" cy="85" r="5" className="fill-blue-500 stroke-zinc-950" strokeWidth="2" />

            {/* Active Marker 2: iOS (MISSING at Mar -> NO DOT FABRICATED!) */}
            <circle cx="280" cy="135" r="4" className="fill-none stroke-rose-500/80 stroke-dasharray-[2,2]" strokeWidth="1.5" />
            <text x="290" y="139" className="text-[9px] font-mono fill-rose-400">Missing at Mar</text>

            {/* Active Marker 3: Android (Valid datum at Mar: 145) */}
            <circle cx="280" cy="110" r="5" className="fill-amber-500 stroke-zinc-950" strokeWidth="2" />
          </g>

          {/* Pointer scrub indicator */}
          <g transform="translate(305, 30)">
            <rect width="18" height="18" rx="4" className="fill-white/10 stroke-white/20" />
            <path d="M 4 4 L 14 14 M 14 4 L 4 14" className="stroke-white/60" strokeWidth="1.5" />
          </g>

          {/* Synchronized Shared Tooltip */}
          <g transform="translate(560, 25)">
            <rect
              width="260"
              height="200"
              rx="12"
              className="fill-zinc-900/95 stroke-white/[0.16]"
              strokeWidth="1"
            />
            {/* Tooltip Header */}
            <rect x="12" y="12" width="236" height="26" rx="6" className="fill-white/[0.04]" />
            <text x="24" y="29" className="text-[11px] font-mono fill-zinc-200 font-semibold">
              Observation: March 2026
            </text>

            {/* Row 1: Web (Canonical 0) */}
            <g transform="translate(14, 48)">
              <rect width="232" height="38" rx="6" className="fill-zinc-800/30" />
              <rect x="10" y="12" width="14" height="14" rx="3" className="fill-blue-500" />
              <text x="32" y="22" className="text-[11px] font-medium fill-white">
                Web
              </text>
              <text x="32" y="32" className="text-[9px] font-mono fill-zinc-400">
                Primary web client
              </text>
              <text x="218" y="24" className="text-[12px] font-mono font-bold fill-white text-anchor-end">
                154,000
              </text>
            </g>

            {/* Row 2: iOS (Canonical 1: MISSING -> Explicit '—') */}
            <g transform="translate(14, 94)">
              <rect width="232" height="38" rx="6" className="fill-rose-500/[0.06] stroke-rose-500/20" />
              <rect x="10" y="12" width="14" height="14" rx="3" className="fill-emerald-500/40" />
              <text x="32" y="22" className="text-[11px] font-medium fill-zinc-400">
                iOS
              </text>
              <text x="32" y="32" className="text-[9px] font-mono fill-rose-400">
                No recorded observation
              </text>
              <text x="218" y="24" className="text-[12px] font-mono font-bold fill-zinc-500 text-anchor-end">
                —
              </text>
            </g>

            {/* Row 3: Android (Canonical 2) */}
            <g transform="translate(14, 140)">
              <rect width="232" height="38" rx="6" className="fill-zinc-800/30" />
              <rect x="10" y="12" width="14" height="14" rx="3" className="fill-amber-500" />
              <text x="32" y="22" className="text-[11px] font-medium fill-white">
                Android
              </text>
              <text x="32" y="32" className="text-[9px] font-mono fill-zinc-400">
                Google Play release
              </text>
              <text x="218" y="24" className="text-[12px] font-mono font-bold fill-white text-anchor-end">
                145,000
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Footer Callout */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Truthful Inspection: Missing values render as "—" rather than coercing to zero.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Canonical series order preserved in tooltip
        </span>
      </div>
    </figure>
  )
}
