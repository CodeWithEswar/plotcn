"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Bar Magnitude Model & Common Zero Baseline                      */
/* -------------------------------------------------------------------------- */

export function SignalBarsMagnitudeDiagram() {
  const titleId = "signal-bars-magnitude-title"
  const descId = "signal-bars-magnitude-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
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
              <span className="size-1.5 rounded-full bg-emerald-400" />
              ANALYTICAL BASELINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Truthful Ratio Encoding
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Bar Magnitude Model: Zero Baseline vs. Truncated Axis
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Zero-Anchored (Truthful)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-400" />
            <span>Truncated Baseline (Distorted)</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison diagram illustrating why bar charts require a common zero baseline. On the left, bars start at zero, correctly representing 80 as twice the magnitude of 40. On the right, a truncated baseline starting at 35 distorts visual ratios, making 80 appear nine times taller than 40.
      </p>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 280"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs */}
          <defs>
            <linearGradient id="sb-green-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="sb-red-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Left Panel: Truthful Zero-Anchored Baseline */}
          <g transform="translate(20, 10)">
            <rect x="0" y="0" width="370" height="250" rx="12" fill="#18181b" fillOpacity="0.4" stroke="#27272a" strokeWidth="1" />
            
            {/* Panel Header */}
            <rect x="16" y="16" width="24" height="24" rx="6" fill="#065f46" fillOpacity="0.4" />
            <text x="28" y="32" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">✓</text>
            <text x="48" y="28" fill="#f4f4f5" fontSize="13" fontWeight="600">Zero Baseline (Canonical SignalBars)</text>
            <text x="48" y="42" fill="#71717a" fontSize="10">Bar length directly proportional to quantitative value</text>

            {/* Grid Lines */}
            <line x1="60" y1="80" x2="340" y2="80" stroke="#3f3f46" strokeDasharray="3 3" strokeOpacity="0.5" />
            <text x="52" y="83" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">80</text>

            <line x1="60" y1="130" x2="340" y2="130" stroke="#3f3f46" strokeDasharray="3 3" strokeOpacity="0.5" />
            <text x="52" y="133" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">40</text>

            {/* Baseline 0 */}
            <line x1="60" y1="180" x2="340" y2="180" stroke="#38bdf8" strokeWidth="2" />
            <text x="52" y="183" textAnchor="end" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">0</text>
            <text x="345" y="183" fill="#38bdf8" fontSize="9" fontWeight="600" fontFamily="monospace">BASELINE</text>

            {/* Bar 1: Value 40 */}
            <rect x="110" y="130" width="48" height="50" rx="4" fill="url(#sb-green-bar)" />
            <text x="134" y="122" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">40</text>
            <text x="134" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="11">Region A</text>

            {/* Bar 2: Value 80 */}
            <rect x="220" y="80" width="48" height="100" rx="4" fill="url(#sb-green-bar)" />
            <text x="244" y="72" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">80</text>
            <text x="244" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="11">Region B</text>

            {/* Proportional callout */}
            <rect x="100" y="218" width="180" height="22" rx="4" fill="#065f46" fillOpacity="0.2" stroke="#059669" strokeOpacity="0.3" />
            <text x="190" y="233" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="500">Visual ratio: 2.0x = Real ratio 2.0x</text>
          </g>

          {/* Right Panel: Misleading Truncated Baseline */}
          <g transform="translate(420, 10)">
            <rect x="0" y="0" width="370" height="250" rx="12" fill="#18181b" fillOpacity="0.4" stroke="#27272a" strokeWidth="1" />
            
            {/* Panel Header */}
            <rect x="16" y="16" width="24" height="24" rx="6" fill="#991b1b" fillOpacity="0.4" />
            <text x="28" y="32" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">✕</text>
            <text x="48" y="28" fill="#f4f4f5" fontSize="13" fontWeight="600">Truncated Baseline (Disallowed)</text>
            <text x="48" y="42" fill="#71717a" fontSize="10">Baseline cut off at 35 visually exaggerates differences</text>

            {/* Grid Lines */}
            <line x1="60" y1="80" x2="340" y2="80" stroke="#3f3f46" strokeDasharray="3 3" strokeOpacity="0.5" />
            <text x="52" y="83" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">80</text>

            <line x1="60" y1="130" x2="340" y2="130" stroke="#3f3f46" strokeDasharray="3 3" strokeOpacity="0.5" />
            <text x="52" y="133" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">40</text>

            {/* Fake Baseline 35 */}
            <line x1="60" y1="180" x2="340" y2="180" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="52" y="183" textAnchor="end" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="monospace">35</text>
            <text x="345" y="183" fill="#ef4444" fontSize="9" fontWeight="600" fontFamily="monospace">TRUNCATED</text>

            {/* Bar 1: Height = 40 - 35 = 5px */}
            <rect x="110" y="168" width="48" height="12" rx="2" fill="url(#sb-red-bar)" />
            <text x="134" y="160" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">40</text>
            <text x="134" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="11">Region A</text>

            {/* Bar 2: Height = 80 - 35 = 45px */}
            <rect x="220" y="72" width="48" height="108" rx="4" fill="url(#sb-red-bar)" />
            <text x="244" y="64" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">80</text>
            <text x="244" y="200" textAnchor="middle" fill="#a1a1aa" fontSize="11">Region B</text>

            {/* Distorted callout */}
            <rect x="90" y="218" width="200" height="22" rx="4" fill="#7f1d1d" fillOpacity="0.2" stroke="#dc2626" strokeOpacity="0.3" />
            <text x="190" y="233" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="500">Visual ratio: 9.0x vs. Real ratio 2.0x</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Category Band / Hit Region Model                               */
/* -------------------------------------------------------------------------- */

export function SignalBarsCategoryBandDiagram() {
  const titleId = "signal-bars-band-title"
  const descId = "signal-bars-band-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-sky-400" />
              HIT-TESTING ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Geometry vs. Target
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Category Band & Expanded Touch Hit Region
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" />
            <span>Visible Rectangle (14px)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-400/40 border border-sky-400" />
            <span>Active Band Target (44px+)</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing how a category band provides a 44px or wider touch/pointer target even when the visible bar rectangle is narrow, allowing effortless inspection without missing the target or blocking vertical scrolling.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 260"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Baseline */}
          <line x1="40" y1="190" x2="780" y2="190" stroke="#3f3f46" strokeWidth="1.5" />
          <text x="35" y="194" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

          {/* Category 1: North */}
          <g transform="translate(60, 20)">
            <rect x="0" y="0" width="150" height="170" rx="8" fill="#38bdf8" fillOpacity="0.04" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
            <text x="75" y="16" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">BAND 1 (150px)</text>
            
            {/* Bar */}
            <rect x="63" y="50" width="24" height="120" rx="3" fill="#3b82f6" />
            <text x="75" y="42" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">128k</text>
            <text x="75" y="195" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="500">North</text>
          </g>

          {/* Category 2: South (Active / Hovered) */}
          <g transform="translate(240, 20)">
            {/* Expanded Active Category Band */}
            <rect x="0" y="0" width="150" height="170" rx="8" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="75" y="16" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600" fontFamily="monospace">ACTIVE CATEGORY BAND</text>
            
            {/* Bar */}
            <rect x="63" y="70" width="24" height="100" rx="3" fill="#60a5fa" stroke="#93c5fd" strokeWidth="1" />
            <text x="75" y="62" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="monospace">104k</text>
            <text x="75" y="195" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">South</text>

            {/* Pointer indicator */}
            <g transform="translate(100, 95)">
              <circle cx="0" cy="0" r="14" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <text x="22" y="4" fill="#38bdf8" fontSize="10" fontWeight="600">Pointer / Tap</text>
              <text x="22" y="16" fill="#94a3b8" fontSize="9">Hits band, not just bar</text>
            </g>
          </g>

          {/* Category 3: East */}
          <g transform="translate(420, 20)">
            <rect x="0" y="0" width="150" height="170" rx="8" fill="#38bdf8" fillOpacity="0.04" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
            <text x="75" y="16" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">BAND 3 (150px)</text>
            
            {/* Bar */}
            <rect x="63" y="90" width="24" height="80" rx="3" fill="#3b82f6" />
            <text x="75" y="82" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">87k</text>
            <text x="75" y="195" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="500">East</text>
          </g>

          {/* Category 4: West */}
          <g transform="translate(600, 20)">
            <rect x="0" y="0" width="150" height="170" rx="8" fill="#38bdf8" fillOpacity="0.04" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
            <text x="75" y="16" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">BAND 4 (150px)</text>
            
            {/* Bar */}
            <rect x="63" y="35" width="24" height="135" rx="3" fill="#3b82f6" />
            <text x="75" y="27" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600" fontFamily="monospace">145k</text>
            <text x="75" y="195" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="500">West</text>
          </g>

          {/* Bottom Annotation */}
          <g transform="translate(180, 232)">
            <rect x="0" y="0" width="460" height="24" rx="6" fill="#18181b" stroke="#27272a" />
            <text x="230" y="16" textAnchor="middle" fill="#a1a1aa" fontSize="11">
              Touch targets use forgiving category bands (44px+) • Preserves vertical page scroll
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Grouped Bar Identity & Stable Ordering Model                   */
/* -------------------------------------------------------------------------- */

export function SignalBarsGroupedIdentityDiagram() {
  const titleId = "signal-bars-grouped-title"
  const descId = "signal-bars-grouped-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-violet-400" />
              GROUPED PEER CONTRACT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Stable Ordering & Scale
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Grouped Peer Series: Stable Order & Shared Scale
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" />
            <span>Series 1: Web</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Series 2: Mobile</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing grouped peer series within discrete categories. Series order remains fixed across categories without dynamic reordering by value, and all series share the exact same quantitative scale.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 270"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Baseline */}
          <line x1="60" y1="190" x2="760" y2="190" stroke="#3f3f46" strokeWidth="1.5" />
          <text x="50" y="194" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

          {/* Group 1: North */}
          <g transform="translate(100, 20)">
            <rect x="0" y="0" width="160" height="170" rx="8" fill="#27272a" fillOpacity="0.25" stroke="#3f3f46" strokeDasharray="3 3" />
            <text x="80" y="16" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Order: Web → Mobile</text>
            
            {/* Web: 128k */}
            <rect x="42" y="45" width="32" height="125" rx="3" fill="#3b82f6" />
            <text x="58" y="38" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">128k</text>

            {/* Mobile: 94k */}
            <rect x="86" y="78" width="32" height="92" rx="3" fill="#10b981" />
            <text x="102" y="71" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">94k</text>

            <text x="80" y="195" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="500">North</text>
          </g>

          {/* Group 2: South (Mobile > Web, order preserved) */}
          <g transform="translate(330, 20)">
            <rect x="0" y="0" width="160" height="170" rx="8" fill="#27272a" fillOpacity="0.25" stroke="#3f3f46" strokeDasharray="3 3" />
            <text x="80" y="16" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Order: Web → Mobile</text>
            
            {/* Web: 104k */}
            <rect x="42" y="68" width="32" height="102" rx="3" fill="#3b82f6" />
            <text x="58" y="61" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">104k</text>

            {/* Mobile: 121k */}
            <rect x="86" y="51" width="32" height="119" rx="3" fill="#10b981" />
            <text x="102" y="44" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">121k</text>

            <text x="80" y="195" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="500">South</text>

            {/* Invariant callout */}
            <g transform="translate(10, 110)">
              <rect x="0" y="0" width="140" height="20" rx="4" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
              <text x="70" y="14" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="600">Mobile &gt; Web: No Sorting</text>
            </g>
          </g>

          {/* Group 3: East */}
          <g transform="translate(560, 20)">
            <rect x="0" y="0" width="160" height="170" rx="8" fill="#27272a" fillOpacity="0.25" stroke="#3f3f46" strokeDasharray="3 3" />
            <text x="80" y="16" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Order: Web → Mobile</text>
            
            {/* Web: 87k */}
            <rect x="42" y="85" width="32" height="85" rx="3" fill="#3b82f6" />
            <text x="58" y="78" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">87k</text>

            {/* Mobile: 70k */}
            <rect x="86" y="102" width="32" height="68" rx="3" fill="#10b981" />
            <text x="102" y="95" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">70k</text>

            <text x="80" y="195" textAnchor="middle" fill="#a1a1aa" fontSize="12" fontWeight="500">East</text>
          </g>

          {/* Rule note */}
          <g transform="translate(160, 235)">
            <rect x="0" y="0" width="500" height="24" rx="6" fill="#18181b" stroke="#27272a" />
            <text x="250" y="16" textAnchor="middle" fill="#a1a1aa" fontSize="11">
              Never reordered by value • Shared quantitative Y scale • Additive composition uses StackFlow
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Signed Zero-Baseline Model                                     */
/* -------------------------------------------------------------------------- */

export function SignalBarsSignedZeroDiagram() {
  const titleId = "signal-bars-signed-title"
  const descId = "signal-bars-signed-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-amber-400" />
              SIGNED QUANTITATIVE EXTENSION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Bi-directional Baseline
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Signed Values: Common Baseline & Grounded Geometry
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Positive (+Y)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-400" />
            <span>Negative (-Y)</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Illustration of signed bar growth. Positive bars extend upward from the zero baseline, and negative bars extend downward from the same baseline. Outer corners are subtly rounded, but the zero-facing edge remains flat and grounded.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 260"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Positive zone background */}
          <rect x="80" y="20" width="680" height="100" fill="#059669" fillOpacity="0.04" />
          <text x="740" y="40" textAnchor="end" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="600">+Y (GROWTH)</text>

          {/* Negative zone background */}
          <rect x="80" y="120" width="680" height="100" fill="#dc2626" fillOpacity="0.04" />
          <text x="740" y="210" textAnchor="end" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="600">-Y (CONTRACTION)</text>

          {/* Central Zero Baseline */}
          <line x1="60" y1="120" x2="760" y2="120" stroke="#f4f4f5" strokeWidth="2" />
          <text x="50" y="124" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="bold" fontFamily="monospace">0</text>
          <text x="770" y="124" fill="#a1a1aa" fontSize="10" fontWeight="600" fontFamily="monospace">ZERO BASELINE</text>

          {/* Category 1: North (+42) */}
          <g transform="translate(130, 0)">
            <rect x="0" y="45" width="48" height="75" rx="4" fill="#34d399" />
            <path d="M0,120 L48,120" stroke="#065f46" strokeWidth="1" /> {/* Sharp baseline edge */}
            <text x="24" y="38" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">+42%</text>
            <text x="24" y="140" textAnchor="middle" fill="#a1a1aa" fontSize="11">North</text>
            <text x="24" y="20" textAnchor="middle" fill="#71717a" fontSize="9">Round top</text>
          </g>

          {/* Category 2: South (-18) */}
          <g transform="translate(290, 0)">
            <rect x="0" y="120" width="48" height="42" rx="4" fill="#f87171" />
            <path d="M0,120 L48,120" stroke="#7f1d1d" strokeWidth="1" /> {/* Sharp baseline edge */}
            <text x="24" y="176" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">-18%</text>
            <text x="24" y="105" textAnchor="middle" fill="#a1a1aa" fontSize="11">South</text>
            <text x="24" y="195" textAnchor="middle" fill="#71717a" fontSize="9">Round bottom</text>
          </g>

          {/* Category 3: East (+27) */}
          <g transform="translate(450, 0)">
            <rect x="0" y="68" width="48" height="52" rx="4" fill="#34d399" />
            <path d="M0,120 L48,120" stroke="#065f46" strokeWidth="1" />
            <text x="24" y="60" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">+27%</text>
            <text x="24" y="140" textAnchor="middle" fill="#a1a1aa" fontSize="11">East</text>
          </g>

          {/* Category 4: West (-31) */}
          <g transform="translate(610, 0)">
            <rect x="0" y="120" width="48" height="65" rx="4" fill="#f87171" />
            <path d="M0,120 L48,120" stroke="#7f1d1d" strokeWidth="1" />
            <text x="24" y="200" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">-31%</text>
            <text x="24" y="105" textAnchor="middle" fill="#a1a1aa" fontSize="11">West</text>
          </g>

          {/* Bottom callout */}
          <g transform="translate(180, 228)">
            <rect x="0" y="0" width="460" height="24" rx="6" fill="#18181b" stroke="#27272a" />
            <text x="230" y="16" textAnchor="middle" fill="#a1a1aa" fontSize="11">
              Zero-facing baseline edges remain flat • Never take absolute value • Preserve signed direction
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 5: Rendering Architecture Pipeline                                */
/* -------------------------------------------------------------------------- */

export function SignalBarsArchitectureDiagram() {
  const titleId = "signal-bars-arch-title"
  const descId = "signal-bars-arch-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-indigo-400" />
              SYSTEM ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Data to SVG Pipeline
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            SignalBars Rendering Pipeline & Interaction Flow
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0">
          <span className="size-2 rounded-full bg-indigo-500" />
          <span>Idiomatic Recharts SVG</span>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Architecture diagram showing data normalization, band and quantitative domain computation, Recharts BarChart composition, and category-centric event routing to tooltip, highlight, and accessible live regions.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 270"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Node 1: Raw Categorical Data */}
          <g transform="translate(20, 30)">
            <rect x="0" y="0" width="130" height="90" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <rect x="10" y="10" width="20" height="20" rx="4" fill="#3b82f6" fillOpacity="0.2" />
            <text x="20" y="24" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">D</text>
            <text x="36" y="24" fill="#f4f4f5" fontSize="11" fontWeight="600">Caller Data</text>
            <text x="12" y="48" fill="#a1a1aa" fontSize="10">readonly TData[]</text>
            <text x="12" y="62" fill="#71717a" fontSize="9">Preserves order</text>
            <text x="12" y="76" fill="#71717a" fontSize="9">No auto-ranking</text>
          </g>

          {/* Arrow 1 */}
          <path d="M150,75 L180,75" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Node 2: Data Normalization */}
          <g transform="translate(180, 20)">
            <rect x="0" y="0" width="150" height="110" rx="8" fill="#18181b" stroke="#6366f1" strokeWidth="1.5" />
            <text x="12" y="24" fill="#818cf8" fontSize="11" fontWeight="600">Normalization</text>
            <text x="12" y="44" fill="#a1a1aa" fontSize="10">• Missing stays null</text>
            <text x="12" y="58" fill="#a1a1aa" fontSize="10">• Sanitizes NaN/Inf</text>
            <text x="12" y="72" fill="#a1a1aa" fontSize="10">• Zero is valid 0</text>
            <text x="12" y="86" fill="#a1a1aa" fontSize="10">• Warns on dupes</text>
            <text x="12" y="100" fill="#71717a" fontSize="9">Immutable records</text>
          </g>

          {/* Arrow 2 */}
          <path d="M330,75 L360,75" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 3: Scale & Domain Setup */}
          <g transform="translate(360, 20)">
            <rect x="0" y="0" width="150" height="110" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <text x="12" y="24" fill="#f4f4f5" fontSize="11" fontWeight="600">Scale Resolution</text>
            <text x="12" y="44" fill="#38bdf8" fontSize="10" fontWeight="500">Band Scale:</text>
            <text x="12" y="58" fill="#a1a1aa" fontSize="9">Discrete categories</text>
            <text x="12" y="74" fill="#34d399" fontSize="10" fontWeight="500">Quantitative Scale:</text>
            <text x="12" y="88" fill="#a1a1aa" fontSize="9">Anchored at zero [0, max]</text>
            <text x="12" y="100" fill="#a1a1aa" fontSize="9">Signed [min, max]</text>
          </g>

          {/* Split arrow to SVG & Bands */}
          <path d="M510,75 L540,75" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 4: Recharts SVG Rendering */}
          <g transform="translate(540, 20)">
            <rect x="0" y="0" width="250" height="110" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="12" y="24" fill="#34d399" fontSize="11" fontWeight="600">Recharts SVG Renderer</text>
            <text x="12" y="44" fill="#a1a1aa" fontSize="10">&lt;BarChart layout=&#34;horizontal&#34;&gt;</text>
            <text x="12" y="58" fill="#a1a1aa" fontSize="10">  &lt;XAxis dataKey=&#34;__category&#34; /&gt;</text>
            <text x="12" y="72" fill="#a1a1aa" fontSize="10">  &lt;YAxis domain=&#34;[0, max]&#34; /&gt;</text>
            <text x="12" y="86" fill="#a1a1aa" fontSize="10">  &lt;ReferenceLine y=&#34;0&#34; /&gt;</text>
            <text x="12" y="100" fill="#a1a1aa" fontSize="10">  &lt;Bar radius=&#34;[4,4,0,0]&#34; /&gt;</text>
          </g>

          {/* Interaction Flow Downward */}
          <path d="M255,130 L255,160 L360,160" stroke="#71717a" strokeWidth="1.5" />
          <path d="M665,130 L665,160 L540,160" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 5: Category Hit Testing */}
          <g transform="translate(360, 145)">
            <rect x="0" y="0" width="180" height="95" rx="8" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="12" y="22" fill="#38bdf8" fontSize="11" fontWeight="600">Category Interaction Band</text>
            <text x="12" y="38" fill="#a1a1aa" fontSize="9">Pointer hover / touch tap (44px+)</text>
            <text x="12" y="52" fill="#a1a1aa" fontSize="9">Arrow keys category traversal</text>
            <text x="12" y="68" fill="#f4f4f5" fontSize="10" fontWeight="500">Active Category Resolved:</text>
            <text x="12" y="84" fill="#818cf8" fontSize="10" fontFamily="monospace">activeCategoryIndex</text>
          </g>

          {/* Outgoing to Tooltip & Live Regions */}
          <g transform="translate(570, 145)">
            <rect x="0" y="0" width="220" height="95" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <text x="12" y="22" fill="#f4f4f5" fontSize="11" fontWeight="600">Synchronized Presentation</text>
            <text x="12" y="42" fill="#a1a1aa" fontSize="10">• Tooltip: all peer series</text>
            <text x="12" y="58" fill="#a1a1aa" fontSize="10">• Band highlight: subtle tint</text>
            <text x="12" y="74" fill="#a1a1aa" fontSize="10">• Live region: polite announcement</text>
            <text x="12" y="90" fill="#a1a1aa" fontSize="10">• Structured data: &lt;table&gt; alternative</text>
          </g>

          <path d="M540,192 L570,192" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      </div>
    </figure>
  )
}
