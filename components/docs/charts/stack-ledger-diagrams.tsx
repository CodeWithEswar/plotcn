"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Stack Composition Model & Additive Totals                      */
/* -------------------------------------------------------------------------- */

export function StackCompositionModelDiagram() {
  const titleId = "stack-model-title"
  const descId = "stack-model-desc"

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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              COMPOSITION MODEL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Segment Thickness & Outer Extent
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Additive Composition: Parts Assembled into a Truthful Whole
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-blue-500" />
            <span>Compute</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-emerald-500" />
            <span>Storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-purple-500" />
            <span>Network</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Stack Ledger Bars composition model diagram showing three additive contributors (Compute, Storage, Network) forming one category stack. Segment thickness encodes contributor magnitude while the outer stack extent encodes the total sum of 100.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 300"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sm-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="sm-emerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="sm-purple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="120" y1="50" x2="760" y2="50" stroke="#27272a" strokeDasharray="3 3" />
          <text x="108" y="54" textAnchor="end" fill="#71717a" fontSize="11" fontFamily="monospace">100</text>

          <line x1="120" y1="110" x2="760" y2="110" stroke="#27272a" strokeDasharray="3 3" />
          <text x="108" y="114" textAnchor="end" fill="#71717a" fontSize="11" fontFamily="monospace">75</text>

          <line x1="120" y1="170" x2="760" y2="170" stroke="#27272a" strokeDasharray="3 3" />
          <text x="108" y="174" textAnchor="end" fill="#71717a" fontSize="11" fontFamily="monospace">50</text>

          <line x1="120" y1="230" x2="760" y2="230" stroke="#27272a" strokeDasharray="3 3" />
          <text x="108" y="234" textAnchor="end" fill="#71717a" fontSize="11" fontFamily="monospace">25</text>

          {/* Zero baseline */}
          <line x1="120" y1="250" x2="760" y2="250" stroke="#52525b" strokeWidth="1.5" />
          <text x="108" y="254" textAnchor="end" fill="#a1a1aa" fontSize="11" fontFamily="monospace" fontWeight="bold">0</text>

          {/* Stack geometry */}
          {/* Segment 1: Compute (45) from 250 to 142 (height 108) */}
          <rect x="220" y="142" width="100" height="108" fill="url(#sm-blue)" stroke="#09090b" strokeWidth="1" />
          {/* Segment 2: Storage (30) from 142 to 70 (height 72) */}
          <rect x="220" y="70" width="100" height="72" fill="url(#sm-emerald)" stroke="#09090b" strokeWidth="1" />
          {/* Segment 3: Network (25) from 70 to 50 (height 20) with rounded top corners */}
          <path d="M 220 70 L 220 54 A 4 4 0 0 1 224 50 L 316 50 A 4 4 0 0 1 320 54 L 320 70 Z" fill="url(#sm-purple)" stroke="#09090b" strokeWidth="1" />

          {/* Stack Labels on bar */}
          <text x="270" y="63" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">25</text>
          <text x="270" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">30</text>
          <text x="270" y="200" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">45</text>

          {/* Category Axis Label */}
          <text x="270" y="272" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="600">Q1</text>

          {/* Callout Annotations on Right */}
          {/* Total Extent Indicator */}
          <line x1="330" y1="50" x2="420" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="420" cy="50" r="3" fill="#38bdf8" />
          <text x="432" y="46" fill="#38bdf8" fontSize="12" fontWeight="bold">Outer Stack Extent = Total (100)</text>
          <text x="432" y="60" fill="#a1a1aa" fontSize="11">Total magnitude directly readable along Y-axis scale</text>

          {/* Contributor Callouts */}
          <line x1="322" y1="60" x2="380" y2="60" stroke="#a855f7" strokeWidth="1" />
          <text x="390" y="64" fill="#d8b4fe" fontSize="11" fontWeight="500">Network: 25 (top segment owns outer corner radius)</text>

          <line x1="322" y1="106" x2="380" y2="106" stroke="#10b981" strokeWidth="1" />
          <text x="390" y="110" fill="#6ee7b7" fontSize="11" fontWeight="500">Storage: 30 (segment thickness encodes contribution)</text>

          <line x1="322" y1="196" x2="380" y2="196" stroke="#3b82f6" strokeWidth="1" />
          <text x="390" y="200" fill="#93c5fd" fontSize="11" fontWeight="500">Compute: 45 (grounded firmly at zero baseline)</text>

          {/* Math Ledger Card */}
          <g transform="translate(580, 130)">
            <rect x="0" y="0" width="220" height="110" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1" />
            <text x="16" y="24" fill="#a1a1aa" fontSize="10" fontFamily="monospace" letterSpacing="0.05em">LEDGER ACCOUNTING</text>
            <text x="16" y="44" fill="#93c5fd" fontSize="11" fontFamily="monospace">Compute   :  45</text>
            <text x="16" y="62" fill="#6ee7b7" fontSize="11" fontFamily="monospace">Storage   :  30</text>
            <text x="16" y="80" fill="#d8b4fe" fontSize="11" fontFamily="monospace">Network   :  25</text>
            <line x1="16" y1="88" x2="204" y2="88" stroke="#3f3f46" strokeWidth="1" />
            <text x="16" y="102" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">Total     : 100</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Grouped vs Stacked Bar Comparison                              */
/* -------------------------------------------------------------------------- */

export function GroupedVsStackedDiagram() {
  const titleId = "grouped-vs-stacked-title"
  const descId = "grouped-vs-stacked-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-sky-400" />
              ANALYTICAL INTENT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Peer Comparison vs. Additive Composition
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Grouped Bars (021) vs. Stacked Ledger Bars (022)
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison between Grouped Compare Bars and Stack Ledger Bars. Grouped bars place peer measures side-by-side from a common baseline to answer how peers compare. Stack Ledger bars assemble additive contributors into one column to communicate whole-part composition and category total.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 280"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Panel: Grouped Compare */}
          <g transform="translate(20, 10)">
            <rect x="0" y="0" width="380" height="250" rx="12" fill="#18181b" fillOpacity="0.4" stroke="#27272a" strokeWidth="1" />
            
            <rect x="16" y="16" width="20" height="20" rx="4" fill="#38bdf8" fillOpacity="0.2" />
            <text x="26" y="30" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">021</text>
            <text x="44" y="27" fill="#f4f4f5" fontSize="13" fontWeight="600">Group Compare Bars</text>
            <text x="44" y="41" fill="#a1a1aa" fontSize="10">Question: “How do peer measures compare?”</text>

            {/* Baseline */}
            <line x1="40" y1="200" x2="340" y2="200" stroke="#52525b" strokeWidth="1.5" />
            <text x="32" y="204" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

            {/* Side-by-side bars */}
            <rect x="80" y="80" width="32" height="120" rx="3" fill="#3b82f6" />
            <text x="96" y="74" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">60</text>

            <rect x="116" y="120" width="32" height="80" rx="3" fill="#10b981" />
            <text x="132" y="114" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">40</text>

            <rect x="152" y="150" width="32" height="50" rx="3" fill="#a855f7" />
            <text x="168" y="144" textAnchor="middle" fill="#d8b4fe" fontSize="10" fontFamily="monospace">25</text>

            <text x="132" y="222" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="500">Category Alpha</text>

            {/* Core insight badge */}
            <rect x="40" y="234" width="300" height="1" fill="#27272a" />
            <text x="190" y="244" textAnchor="middle" fill="#71717a" fontSize="10">All bars share zero baseline; direct visual comparison</text>
          </g>

          {/* Right Panel: Stack Ledger */}
          <g transform="translate(440, 10)">
            <rect x="0" y="0" width="380" height="250" rx="12" fill="#18181b" fillOpacity="0.4" stroke="#065f46" strokeWidth="1" strokeOpacity="0.4" />
            
            <rect x="16" y="16" width="20" height="20" rx="4" fill="#10b981" fillOpacity="0.2" />
            <text x="26" y="30" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">022</text>
            <text x="44" y="27" fill="#f4f4f5" fontSize="13" fontWeight="600">Stack Ledger Bars</text>
            <text x="44" y="41" fill="#a1a1aa" fontSize="10">Question: “How do additive parts compose the total?”</text>

            {/* Baseline */}
            <line x1="40" y1="200" x2="340" y2="200" stroke="#52525b" strokeWidth="1.5" />
            <text x="32" y="204" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

            {/* Stacked single bar */}
            {/* Segment 1: 60 */}
            <rect x="130" y="104" width="56" height="96" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            {/* Segment 2: 40 */}
            <rect x="130" y="40" width="56" height="64" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            {/* Segment 3: 25 */}
            <path d="M 130 40 L 130 4 A 4 4 0 0 1 134 0 L 182 0 A 4 4 0 0 1 186 4 L 186 40 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" transform="translate(0, 0)" />

            {/* Total annotation */}
            <line x1="190" y1="0" x2="240" y2="0" stroke="#10b981" strokeDasharray="3 3" />
            <text x="248" y="4" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">Total = 125</text>

            <text x="158" y="222" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="500">Category Alpha</text>

            <rect x="40" y="234" width="300" height="1" fill="#27272a" />
            <text x="190" y="244" textAnchor="middle" fill="#34d399" fontSize="10">Segments compose one whole; outer edge encodes total</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Additive Data Contract Validation                              */
/* -------------------------------------------------------------------------- */

export function AdditiveDataContractDiagram() {
  const titleId = "additive-contract-title"
  const descId = "additive-contract-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-amber-400" />
              DATA SAFETY CONTRACT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Summability Invariant
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            The Additive Contract: Meaningful Sums vs. Incompatible Metrics
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Additive contract diagram showing that Stack Ledger Bars requires mutually exclusive and summable metrics such as Compute, Storage, and Network costs. Non-additive metrics such as Revenue, Conversion Rate, and Latency must never be stacked because their sum is mathematically meaningless.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 260"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Valid side */}
          <g transform="translate(20, 10)">
            <rect x="0" y="0" width="380" height="230" rx="12" fill="#18181b" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.5" />
            <rect x="16" y="16" width="24" height="24" rx="6" fill="#065f46" fillOpacity="0.4" />
            <text x="28" y="32" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">✓</text>
            <text x="48" y="28" fill="#f4f4f5" fontSize="13" fontWeight="600">Valid Additive Composition</text>
            <text x="48" y="42" fill="#71717a" fontSize="10">Shared quantitative unit and mutually exclusive parts</text>

            <g transform="translate(24, 65)">
              <rect x="0" y="0" width="332" height="32" rx="6" fill="#27272a" fillOpacity="0.6" />
              <text x="12" y="20" fill="#93c5fd" fontSize="11" fontFamily="monospace">Compute Cost</text>
              <text x="320" y="20" textAnchor="end" fill="#f4f4f5" fontSize="11" fontFamily="monospace">$48,000</text>
            </g>

            <g transform="translate(24, 103)">
              <rect x="0" y="0" width="332" height="32" rx="6" fill="#27272a" fillOpacity="0.6" />
              <text x="12" y="20" fill="#6ee7b7" fontSize="11" fontFamily="monospace">Storage Cost</text>
              <text x="320" y="20" textAnchor="end" fill="#f4f4f5" fontSize="11" fontFamily="monospace">$31,000</text>
            </g>

            <g transform="translate(24, 141)">
              <rect x="0" y="0" width="332" height="32" rx="6" fill="#27272a" fillOpacity="0.6" />
              <text x="12" y="20" fill="#d8b4fe" fontSize="11" fontFamily="monospace">Network Cost</text>
              <text x="320" y="20" textAnchor="end" fill="#f4f4f5" fontSize="11" fontFamily="monospace">$21,000</text>
            </g>

            <line x1="24" y1="184" x2="356" y2="184" stroke="#3f3f46" />
            <text x="24" y="204" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">SUM: $100,000 Total Infrastructure Cost</text>
            <text x="24" y="218" fill="#71717a" fontSize="10">Total represents real physical whole</text>
          </g>

          {/* Invalid side */}
          <g transform="translate(440, 10)">
            <rect x="0" y="0" width="380" height="230" rx="12" fill="#18181b" stroke="#dc2626" strokeWidth="1.5" strokeOpacity="0.5" />
            <rect x="16" y="16" width="24" height="24" rx="6" fill="#7f1d1d" fillOpacity="0.4" />
            <text x="28" y="32" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="bold">✕</text>
            <text x="48" y="28" fill="#f4f4f5" fontSize="13" fontWeight="600">Invalid: Incompatible Dimensions</text>
            <text x="48" y="42" fill="#71717a" fontSize="10">Differing units, rates, or overlapping domains</text>

            <g transform="translate(24, 65)">
              <rect x="0" y="0" width="332" height="32" rx="6" fill="#27272a" fillOpacity="0.6" />
              <text x="12" y="20" fill="#fca5a5" fontSize="11" fontFamily="monospace">Monthly Revenue</text>
              <text x="320" y="20" textAnchor="end" fill="#f4f4f5" fontSize="11" fontFamily="monospace">$40,000</text>
            </g>

            <g transform="translate(24, 103)">
              <rect x="0" y="0" width="332" height="32" rx="6" fill="#27272a" fillOpacity="0.6" />
              <text x="12" y="20" fill="#fca5a5" fontSize="11" fontFamily="monospace">Conversion Rate</text>
              <text x="320" y="20" textAnchor="end" fill="#f4f4f5" fontSize="11" fontFamily="monospace">30%</text>
            </g>

            <g transform="translate(24, 141)">
              <rect x="0" y="0" width="332" height="32" rx="6" fill="#27272a" fillOpacity="0.6" />
              <text x="12" y="20" fill="#fca5a5" fontSize="11" fontFamily="monospace">API Latency</text>
              <text x="320" y="20" textAnchor="end" fill="#f4f4f5" fontSize="11" fontFamily="monospace">20ms</text>
            </g>

            <line x1="24" y1="184" x2="356" y2="184" stroke="#3f3f46" />
            <text x="24" y="204" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">SUM: $40,000 + 30% + 20ms = Nonsense</text>
            <text x="24" y="218" fill="#71717a" fontSize="10">Do not stack rates, percentages, or dissimilar units</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Stable Stack Order & Semantic Identity                         */
/* -------------------------------------------------------------------------- */

export function StableStackOrderDiagram() {
  const titleId = "stable-stack-order-title"
  const descId = "stable-stack-order-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-indigo-400" />
              SERIES INVARIANCE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              No Magnitude Reordering
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Stable Stack Order: Series Configuration Governs Stacking
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing three categories Q1, Q2, and Q3 with changing contributor magnitudes. Across all categories, Compute is at the bottom, Storage in the middle, and Network on top. The chart never dynamically reorders segments by magnitude.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 260"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Baseline */}
          <line x1="80" y1="210" x2="760" y2="210" stroke="#52525b" strokeWidth="1.5" />
          <text x="70" y="214" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

          {/* Q1: Compute 50, Storage 30, Network 20 */}
          <g transform="translate(140, 0)">
            {/* Compute 50 -> 100px */}
            <rect x="0" y="110" width="70" height="100" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="165" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Compute 50</text>
            {/* Storage 30 -> 60px */}
            <rect x="0" y="50" width="70" height="60" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="85" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Storage 30</text>
            {/* Network 20 -> 40px */}
            <path d="M 0 50 L 0 14 A 4 4 0 0 1 4 10 L 66 10 A 4 4 0 0 1 70 14 L 70 50 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="35" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Net 20</text>

            <text x="35" y="230" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600">{"Q1 (Compute > Storage > Net)"}</text>
          </g>

          {/* Q2: Compute 20, Storage 60, Network 30 */}
          <g transform="translate(380, 0)">
            {/* Compute 20 -> 40px (still at bottom!) */}
            <rect x="0" y="170" width="70" height="40" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="195" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Compute 20</text>
            {/* Storage 60 -> 120px */}
            <rect x="0" y="50" width="70" height="120" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="115" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Storage 60</text>
            {/* Network 30 -> 60px */}
            <path d="M 0 50 L 0 -6 A 4 4 0 0 1 4 -10 L 66 -10 A 4 4 0 0 1 70 -6 L 70 50 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="25" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Net 30</text>

            <text x="35" y="230" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600">Q2 (Storage is largest)</text>
          </g>

          {/* Q3: Compute 35, Storage 25, Network 40 */}
          <g transform="translate(620, 0)">
            {/* Compute 35 -> 70px */}
            <rect x="0" y="140" width="70" height="70" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="180" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Compute 35</text>
            {/* Storage 25 -> 50px */}
            <rect x="0" y="90" width="70" height="50" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="120" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Storage 25</text>
            {/* Network 40 -> 80px */}
            <path d="M 0 90 L 0 14 A 4 4 0 0 1 4 10 L 66 10 A 4 4 0 0 1 70 14 L 70 90 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />
            <text x="35" y="55" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Net 40</text>

            <text x="35" y="230" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="600">Q3 (Network is largest)</text>
          </g>

          {/* Invariant callout */}
          <text x="420" y="252" textAnchor="middle" fill="#818cf8" fontSize="11" fontFamily="monospace">
            Stack Order = [Compute → Storage → Network] across ALL categories. Never reordered by magnitude.
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 5: Missing vs. Zero vs. Hidden 3-Panel Breakdown                  */
/* -------------------------------------------------------------------------- */

export function MissingVsZeroVsHiddenDiagram() {
  const titleId = "mzh-title"
  const descId = "mzh-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-rose-400" />
              SEMANTIC TRIAD
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Three Fundamental States
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Missing vs. Zero vs. Hidden: Three Distinct Analytical Realities
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Three panel diagram contrasting Zero, Missing, and Hidden states. Zero represents a measured value of 0 and valid total. Missing represents expected data that is unrecorded, invalidating the total. Hidden represents an available contributor intentionally excluded by the user, updating the visible total.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 240"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Panel 1: Zero */}
          <g transform="translate(10, 10)">
            <rect x="0" y="0" width="260" height="210" rx="10" fill="#18181b" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.5" />
            <rect x="14" y="14" width="20" height="20" rx="4" fill="#3b82f6" fillOpacity="0.2" />
            <text x="24" y="28" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">0</text>
            <text x="42" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">Zero Value</text>

            <g transform="translate(14, 48)">
              <text x="0" y="14" fill="#a1a1aa" fontSize="11">• Configured: <tspan fill="#60a5fa">Yes</tspan></text>
              <text x="0" y="32" fill="#a1a1aa" fontSize="11">• Measured: <tspan fill="#60a5fa">0 (real measurement)</tspan></text>
              <text x="0" y="50" fill="#a1a1aa" fontSize="11">• Contribution: <tspan fill="#60a5fa">Zero thickness</tspan></text>
              <text x="0" y="68" fill="#a1a1aa" fontSize="11">• Category Total: <tspan fill="#34d399">Valid (sum includes 0)</tspan></text>
              <text x="0" y="86" fill="#a1a1aa" fontSize="11">• Tooltip: <tspan fill="#ffffff">$0</tspan></text>
              <line x1="0" y1="102" x2="232" y2="102" stroke="#27272a" />
              <text x="0" y="120" fill="#71717a" fontSize="10">Valid observation with zero magnitude</text>
            </g>
          </g>

          {/* Panel 2: Missing */}
          <g transform="translate(290, 10)">
            <rect x="0" y="0" width="260" height="210" rx="10" fill="#18181b" stroke="#f43f5e" strokeWidth="1.2" strokeOpacity="0.5" />
            <rect x="14" y="14" width="20" height="20" rx="4" fill="#f43f5e" fillOpacity="0.2" />
            <text x="24" y="28" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="bold">?</text>
            <text x="42" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">Missing Value</text>

            <g transform="translate(14, 48)">
              <text x="0" y="14" fill="#a1a1aa" fontSize="11">• Configured: <tspan fill="#fb7185">Yes</tspan></text>
              <text x="0" y="32" fill="#a1a1aa" fontSize="11">• Measured: <tspan fill="#fb7185">null / undefined / NaN</tspan></text>
              <text x="0" y="50" fill="#a1a1aa" fontSize="11">• Contribution: <tspan fill="#fb7185">Unknown</tspan></text>
              <text x="0" y="68" fill="#a1a1aa" fontSize="11">• Category Total: <tspan fill="#fb7185">Unavailable</tspan></text>
              <text x="0" y="86" fill="#a1a1aa" fontSize="11">• Tooltip: <tspan fill="#ffffff">Unavailable</tspan></text>
              <line x1="0" y1="102" x2="232" y2="102" stroke="#27272a" />
              <text x="0" y="120" fill="#fb7185" fontSize="10">Must never silently coerce to 0</text>
            </g>
          </g>

          {/* Panel 3: Hidden */}
          <g transform="translate(570, 10)">
            <rect x="0" y="0" width="260" height="210" rx="10" fill="#18181b" stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.5" />
            <rect x="14" y="14" width="20" height="20" rx="4" fill="#a855f7" fillOpacity="0.2" />
            <text x="24" y="28" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">⊘</text>
            <text x="42" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">Hidden Contributor</text>

            <g transform="translate(14, 48)">
              <text x="0" y="14" fill="#a1a1aa" fontSize="11">• Configured: <tspan fill="#c084fc">Yes</tspan></text>
              <text x="0" y="32" fill="#a1a1aa" fontSize="11">• Measured: <tspan fill="#c084fc">Available</tspan></text>
              <text x="0" y="50" fill="#a1a1aa" fontSize="11">• Exclusion: <tspan fill="#c084fc">User toggle via legend</tspan></text>
              <text x="0" y="68" fill="#a1a1aa" fontSize="11">• Category Total: <tspan fill="#c084fc">Visible total updates</tspan></text>
              <text x="0" y="86" fill="#a1a1aa" fontSize="11">• Colors: <tspan fill="#34d399">Preserved strictly</tspan></text>
              <line x1="0" y1="102" x2="232" y2="102" stroke="#27272a" />
              <text x="0" y="120" fill="#c084fc" fontSize="10">Recomposes stack without changing identity</text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 6: Complete vs Incomplete Composition                             */
/* -------------------------------------------------------------------------- */

export function CompleteVsIncompleteCompositionDiagram() {
  const titleId = "complete-incomplete-title"
  const descId = "complete-incomplete-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              GEOMETRIC INTEGRITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Truthful Missing Geometry
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Complete vs. Incomplete Composition: Preventing Visual Deception
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing Q1 complete, Q2 with missing contributor Storage, and Q3 complete. Under default policy, Q2 stack geometry is omitted rather than rendering a shorter deceptive bar, while the category band remains inspectable and tooltips report incomplete composition.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 260"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Baseline */}
          <line x1="80" y1="200" x2="760" y2="200" stroke="#52525b" strokeWidth="1.5" />
          <text x="70" y="204" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

          {/* Q1: Complete Stack */}
          <g transform="translate(140, 0)">
            <rect x="0" y="110" width="70" height="90" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            <rect x="0" y="60" width="70" height="50" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            <path d="M 0 60 L 0 24 A 4 4 0 0 1 4 20 L 66 20 A 4 4 0 0 1 70 24 L 70 60 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />
            
            <text x="35" y="14" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">90</text>
            <text x="35" y="222" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="600">Q1</text>
            <text x="35" y="238" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">Complete</text>
          </g>

          {/* Q2: Incomplete Stack (Omitted Geometry) */}
          <g transform="translate(380, 0)">
            {/* Category Band Highlight Zone */}
            <rect x="-15" y="20" width="100" height="180" rx="6" fill="#f43f5e" fillOpacity="0.06" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" />
            
            {/* Omitted geometry placeholder */}
            <rect x="25" y="95" width="20" height="20" rx="4" fill="#f43f5e" fillOpacity="0.2" />
            <text x="35" y="109" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="bold">✕</text>
            
            <text x="35" y="130" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="600">Stack Omitted</text>
            <text x="35" y="144" textAnchor="middle" fill="#a1a1aa" fontSize="9">Storage is Missing</text>
            <text x="35" y="158" textAnchor="middle" fill="#71717a" fontSize="9">Band Still Inspectable</text>

            <text x="35" y="14" textAnchor="middle" fill="#fb7185" fontSize="11" fontFamily="monospace">Unavailable</text>
            <text x="35" y="222" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="600">Q2</text>
            <text x="35" y="238" textAnchor="middle" fill="#fb7185" fontSize="10" fontFamily="monospace">Incomplete</text>
          </g>

          {/* Q3: Complete Stack */}
          <g transform="translate(620, 0)">
            <rect x="0" y="100" width="70" height="100" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            <rect x="0" y="45" width="70" height="55" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            <path d="M 0 45 L 0 14 A 4 4 0 0 1 4 10 L 66 10 A 4 4 0 0 1 70 14 L 70 45 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />

            <text x="35" y="4" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">110</text>
            <text x="35" y="222" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="600">Q3</text>
            <text x="35" y="238" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">Complete</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 7: Legend Visibility & Visible Totals                             */
/* -------------------------------------------------------------------------- */

export function LegendVisibilityDiagram() {
  const titleId = "legend-vis-title"
  const descId = "legend-vis-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-purple-400" />
              INTERACTIVE VISIBILITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Composition Recomputation
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Legend Visibility: Outer Extent Recomputes as Visible Total
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Legend visibility diagram showing how hiding Network contributor changes the stack height from 100 to 80. The outer extent now encodes Visible Total 80, Storage becomes the top segment and receives the outer corner radius, while colors and identities remain stable.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 260"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left: All Series Visible */}
          <g transform="translate(40, 10)">
            <rect x="0" y="0" width="340" height="230" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1" />
            <text x="20" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">All 3 Contributors Visible</text>
            <text x="20" y="42" fill="#71717a" fontSize="10">Network: On • Storage: On • Compute: On</text>

            {/* Baseline */}
            <line x1="30" y1="180" x2="310" y2="180" stroke="#52525b" strokeWidth="1.5" />
            <text x="24" y="184" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

            {/* Stack */}
            <rect x="130" y="100" width="60" height="80" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            <rect x="130" y="60" width="60" height="40" fill="#10b981" stroke="#09090b" strokeWidth="1" />
            <path d="M 130 60 L 130 34 A 4 4 0 0 1 134 30 L 186 30 A 4 4 0 0 1 190 34 L 190 60 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />

            <line x1="195" y1="30" x2="250" y2="30" stroke="#a855f7" strokeDasharray="3 3" />
            <text x="256" y="34" fill="#d8b4fe" fontSize="11" fontFamily="monospace" fontWeight="bold">Total: 100</text>

            <text x="160" y="200" textAnchor="middle" fill="#f4f4f5" fontSize="11">Q1 Stack</text>
          </g>

          {/* Arrow */}
          <g transform="translate(400, 110)">
            <path d="M 0 10 L 30 10 M 24 4 L 30 10 L 24 16" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="15" y="0" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace">Hide Network</text>
          </g>

          {/* Right: Network Hidden */}
          <g transform="translate(460, 10)">
            <rect x="0" y="0" width="340" height="230" rx="10" fill="#18181b" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
            <text x="20" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">Network Contributor Hidden</text>
            <text x="20" y="42" fill="#c084fc" fontSize="10">Network: Off • Storage: On • Compute: On</text>

            {/* Baseline */}
            <line x1="30" y1="180" x2="310" y2="180" stroke="#52525b" strokeWidth="1.5" />
            <text x="24" y="184" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

            {/* Stack */}
            <rect x="130" y="100" width="60" height="80" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
            {/* Storage now owns the outer radius! */}
            <path d="M 130 100 L 130 64 A 4 4 0 0 1 134 60 L 186 60 A 4 4 0 0 1 190 64 L 190 100 Z" fill="#10b981" stroke="#09090b" strokeWidth="1" />

            <line x1="195" y1="60" x2="250" y2="60" stroke="#10b981" strokeDasharray="3 3" />
            <text x="256" y="64" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontWeight="bold">Visible: 80</text>

            <text x="160" y="200" textAnchor="middle" fill="#f4f4f5" fontSize="11">Q1 Recomposed</text>
            <text x="160" y="218" textAnchor="middle" fill="#71717a" fontSize="10">Storage receives top radius; colors preserved</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 8: Category & Segment Hit Regions                                 */
/* -------------------------------------------------------------------------- */

export function CategorySegmentHitRegionsDiagram() {
  const titleId = "hit-regions-title"
  const descId = "hit-regions-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-sky-400" />
              HIT TESTING ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Forgiving Category Band + Segment Focus
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Two-Tier Hit Testing: Category Band Target with Contributor Identity
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Hit testing diagram showing a broad 56px category band hit target enabling forgiving touch and pointer inspection, combined with fine-grained segment detection for emphasizing individual series rows in the tooltip.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 260"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background area */}
          <line x1="80" y1="210" x2="760" y2="210" stroke="#52525b" strokeWidth="1.5" />
          <text x="70" y="214" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>

          {/* Broad Category Band (44px+) */}
          <rect x="240" y="20" width="140" height="190" rx="8" fill="#38bdf8" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* The Stack inside */}
          <rect x="275" y="130" width="70" height="80" fill="#3b82f6" stroke="#09090b" strokeWidth="1" />
          <rect x="275" y="75" width="70" height="55" fill="#10b981" stroke="#09090b" strokeWidth="1" />
          <path d="M 275 75 L 275 44 A 4 4 0 0 1 279 40 L 341 40 A 4 4 0 0 1 345 44 L 345 75 Z" fill="#a855f7" stroke="#09090b" strokeWidth="1" />

          {/* Callouts */}
          <g transform="translate(420, 45)">
            <rect x="0" y="0" width="340" height="150" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1" />
            <text x="16" y="24" fill="#38bdf8" fontSize="12" fontWeight="600">Tier 1: Category Band Target (Forgiving)</text>
            <text x="16" y="42" fill="#a1a1aa" fontSize="11">• Broad vertical slot (140px) captures any pointer/touch</text>
            <text x="16" y="58" fill="#a1a1aa" fontSize="11">• Never requires pixel-hunting on slim or tiny contributors</text>
            <text x="16" y="74" fill="#a1a1aa" fontSize="11">• Instantly triggers complete category composition card</text>

            <line x1="16" y1="88" x2="324" y2="88" stroke="#27272a" />
            <text x="16" y="106" fill="#c084fc" fontSize="12" fontWeight="600">Tier 2: Segment Precise Target (Optional)</text>
            <text x="16" y="124" fill="#a1a1aa" fontSize="11">• Exact rectangle hover highlights specific contributor row</text>
            <text x="16" y="140" fill="#a1a1aa" fontSize="11">• Propagates to legend item and tooltip marker</text>
          </g>

          <text x="310" y="235" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="600">Active Category Band</text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 9: Vertical vs Horizontal Orientation                             */
/* -------------------------------------------------------------------------- */

export function VerticalVsHorizontalOrientationDiagram() {
  const titleId = "orientation-title"
  const descId = "orientation-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-teal-400" />
              RESPONSIVE LAYOUT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Concise vs. Lengthy Categorical Labels
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Vertical vs. Horizontal Orientation: Tailored to Label Footprint
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Layout diagram illustrating vertical and horizontal orientations. Vertical layout is best for concise category labels like quarters and months. Horizontal layout provides ample space for long enterprise category labels without cramped diagonal typography.
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 260"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical Panel */}
          <g transform="translate(20, 10)">
            <rect x="0" y="0" width="380" height="230" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1" />
            <text x="20" y="26" fill="#f4f4f5" fontSize="12" fontWeight="600">Vertical Layout (Default)</text>
            <text x="20" y="40" fill="#71717a" fontSize="10">Best for compact labels: Q1, Q2, Jan, Feb</text>

            <line x1="40" y1="180" x2="340" y2="180" stroke="#52525b" strokeWidth="1" />

            {/* Stack 1 */}
            <rect x="90" y="120" width="40" height="60" fill="#3b82f6" />
            <rect x="90" y="80" width="40" height="40" fill="#10b981" />
            <path d="M 90 80 L 90 63 A 3 3 0 0 1 93 60 L 127 60 A 3 3 0 0 1 130 63 L 130 80 Z" fill="#a855f7" />
            <text x="110" y="196" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Q1</text>

            {/* Stack 2 */}
            <rect x="170" y="100" width="40" height="80" fill="#3b82f6" />
            <rect x="170" y="65" width="40" height="35" fill="#10b981" />
            <path d="M 170 65 L 170 48 A 3 3 0 0 1 173 45 L 207 45 A 3 3 0 0 1 210 48 L 210 65 Z" fill="#a855f7" />
            <text x="190" y="196" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Q2</text>

            {/* Stack 3 */}
            <rect x="250" y="110" width="40" height="70" fill="#3b82f6" />
            <rect x="250" y="70" width="40" height="40" fill="#10b981" />
            <path d="M 250 70 L 250 53 A 3 3 0 0 1 253 50 L 287 50 A 3 3 0 0 1 290 53 L 290 70 Z" fill="#a855f7" />
            <text x="270" y="196" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Q3</text>
          </g>

          {/* Horizontal Panel */}
          <g transform="translate(440, 10)">
            <rect x="0" y="0" width="380" height="230" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1" />
            <text x="20" y="26" fill="#f4f4f5" fontSize="12" fontWeight="600">{"Horizontal Layout (layout=\"horizontal\")"}</text>
            <text x="20" y="40" fill="#71717a" fontSize="10">Best for lengthy enterprise department & squad names</text>

            <line x1="140" y1="55" x2="140" y2="200" stroke="#52525b" strokeWidth="1" />

            {/* Row 1: Infrastructure */}
            <text x="130" y="85" textAnchor="end" fill="#a1a1aa" fontSize="10">Infrastructure Ops</text>
            <rect x="140" y="72" width="80" height="20" fill="#3b82f6" />
            <rect x="220" y="72" width="50" height="20" fill="#10b981" />
            <path d="M 270 72 L 297 72 A 3 3 0 0 1 300 75 L 300 89 A 3 3 0 0 1 297 92 L 270 92 Z" fill="#a855f7" />

            {/* Row 2: Customer Success */}
            <text x="130" y="130" textAnchor="end" fill="#a1a1aa" fontSize="10">Customer Success</text>
            <rect x="140" y="117" width="60" height="20" fill="#3b82f6" />
            <rect x="200" y="117" width="40" height="20" fill="#10b981" />
            <path d="M 240 117 L 267 117 A 3 3 0 0 1 270 120 L 270 134 A 3 3 0 0 1 267 137 L 240 137 Z" fill="#a855f7" />

            {/* Row 3: Product Engineering */}
            <text x="130" y="175" textAnchor="end" fill="#a1a1aa" fontSize="10">Product Engineering</text>
            <rect x="140" y="162" width="100" height="20" fill="#3b82f6" />
            <rect x="240" y="162" width="60" height="20" fill="#10b981" />
            <path d="M 300 162 L 327 162 A 3 3 0 0 1 330 165 L 330 179 A 3 3 0 0 1 327 182 L 300 182 Z" fill="#a855f7" />
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 10: Rendering Architecture Pipeline Flow                          */
/* -------------------------------------------------------------------------- */

export function RenderingArchitectureFlowDiagram() {
  const titleId = "arch-flow-title"
  const descId = "arch-flow-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md @container"
    >
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              SYSTEM PIPELINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Data Flow & Coordinate Lifecycle
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Rendering Architecture: From Raw Records to Additive SVG Stacks
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Architecture pipeline flowchart showing data entering from Consumer Data, through Series Contract Resolution, Validation and Missing Policy, Stable Color Mapping, Visible Contributors Filtering, Valid Totals Calculation, Quantitative Domain Resolution, Recharts Stacked Bars with stackId ledger, Hit Testing, and Output Surfaces (Tooltip, Legend, Screen Reader Table).
      </p>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 840 380"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Node 1: Consumer Data */}
          <g transform="translate(30, 30)">
            <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <text x="80" y="26" textAnchor="middle" fill="#f4f4f5" fontSize="12" fontWeight="600">Consumer Data</text>
            <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">readonly TData[]</text>
          </g>

          <path d="M 190 60 L 230 60" stroke="#52525b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 2: Series Contract */}
          <g transform="translate(230, 30)">
            <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="85" y="26" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">Series Contract</text>
            <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">NumericKeyOf&lt;TData&gt;</text>
          </g>

          <path d="M 400 60 L 440 60" stroke="#52525b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 3: Validation & Sign Model */}
          <g transform="translate(440, 30)">
            <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="1" />
            <text x="85" y="26" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="600">V1 Validation</text>
            <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Finite & Value ≥ 0</text>
          </g>

          <path d="M 610 60 L 650 60" stroke="#52525b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 4: Missing Policy */}
          <g transform="translate(650, 30)">
            <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#f43f5e" strokeWidth="1" />
            <text x="80" y="26" textAnchor="middle" fill="#fb7185" fontSize="12" fontWeight="600">Missing Policy</text>
            <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">{"\"incomplete\" | \"zero\""}</text>
          </g>

          {/* Vertical Down */}
          <path d="M 730 90 L 730 140" stroke="#52525b" strokeWidth="1.5" />

          {/* Row 2: Mid-pipeline */}
          {/* Node 5: Stable Contributor Colors */}
          <g transform="translate(650, 140)">
            <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#a855f7" strokeWidth="1" />
            <text x="80" y="26" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">Stable Identity</text>
            <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Fixed Colors & Order</text>
          </g>

          <path d="M 650 170 L 610 170" stroke="#52525b" strokeWidth="1.5" />

          {/* Node 6: Visible Contributors */}
          <g transform="translate(440, 140)">
            <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#a855f7" strokeWidth="1" />
            <text x="85" y="26" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">Visible Filtering</text>
            <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Interactive Legend</text>
          </g>

          <path d="M 440 170 L 400 170" stroke="#52525b" strokeWidth="1.5" />

          {/* Node 7: Valid Totals */}
          <g transform="translate(230, 140)">
            <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#34d399" strokeWidth="1" />
            <text x="85" y="26" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="600">Totals Calculation</text>
            <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Visible Sum / Omit</text>
          </g>

          <path d="M 230 170 L 190 170" stroke="#52525b" strokeWidth="1.5" />

          {/* Node 8: Domain Resolver */}
          <g transform="translate(30, 140)">
            <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="80" y="26" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">Domain Resolver</text>
            <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">[0, MaxTotal + 8%]</text>
          </g>

          {/* Vertical Down to Execution */}
          <path d="M 110 200 L 110 250" stroke="#52525b" strokeWidth="1.5" />

          {/* Row 3: Recharts & Output */}
          {/* Node 9: Recharts Stacked Bars */}
          <g transform="translate(30, 250)">
            <rect x="0" y="0" width="370" height="90" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="185" y="28" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="600">Recharts Cartesian Stacked Bars</text>
            <text x="185" y="48" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontFamily="monospace">{'stackId="ledger" • radius on outer visible'}</text>
            <text x="185" y="68" textAnchor="middle" fill="#71717a" fontSize="10">XAxis, YAxis, CartesianGrid, ReferenceLine (0)</text>
          </g>

          <path d="M 400 295 L 440 295" stroke="#52525b" strokeWidth="1.5" />

          {/* Node 10: Interaction & Outputs */}
          <g transform="translate(440, 250)">
            <rect x="0" y="0" width="370" height="90" rx="10" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="185" y="26" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="600">Inspection & Accessibility Surfaces</text>
            <text x="185" y="46" textAnchor="middle" fill="#f4f4f5" fontSize="11">Synchronized Tooltip with Total / Visible Total</text>
            <text x="185" y="64" textAnchor="middle" fill="#a1a1aa" fontSize="10">Single Tab Stop • Pan-Y Touch • Offscreen HTML Table</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}
