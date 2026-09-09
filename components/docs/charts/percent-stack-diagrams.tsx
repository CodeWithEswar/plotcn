"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Normalization Pipeline & Lifecycle                             */
/* -------------------------------------------------------------------------- */

export function NormalizationPipelineDiagram() {
  const titleId = "norm-pipeline-title"
  const descId = "norm-pipeline-desc"

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
              NORMALIZATION PIPELINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Raw Additive &rarr; 100% Geometry
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Deterministic Normalization Pipeline: From Raw Values to 100% Shares
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Data flow diagram showing input records validating non-negative numbers, filtering visible series, computing the visible raw total, deriving exact proportional shares, and rendering a normalized 100% stack.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 300"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <defs>
            <marker id="pipe-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill="#71717a" />
            </marker>
          </defs>

          {/* Step 1: Raw Additive Input */}
          <g transform="translate(20, 40)">
            <rect width="150" height="180" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <rect width="150" height="32" rx="10" fill="#27272a" />
            <text x="75" y="21" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="700" fontFamily="monospace">1. RAW INPUT</text>
            <text x="75" y="65" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="600">Additive Data</text>
            <text x="75" y="85" textAnchor="middle" fill="#a1a1aa" fontSize="10">Monthly: 60</text>
            <text x="75" y="102" textAnchor="middle" fill="#a1a1aa" fontSize="10">Annual: 30</text>
            <text x="75" y="119" textAnchor="middle" fill="#a1a1aa" fontSize="10">Enterprise: 10</text>
            <rect x="20" y="140" width="110" height="24" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
            <text x="75" y="156" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="600" fontFamily="monospace">Readonly Data</text>
          </g>

          <line x1="175" y1="130" x2="205" y2="130" stroke="#71717a" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

          {/* Step 2: Validate & Visibility */}
          <g transform="translate(210, 40)">
            <rect width="150" height="180" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <rect width="150" height="32" rx="10" fill="#27272a" />
            <text x="75" y="21" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700" fontFamily="monospace">2. VALIDATE</text>
            <text x="75" y="65" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="600">Contract Check</text>
            <text x="75" y="85" textAnchor="middle" fill="#a1a1aa" fontSize="10">Non-negative &ge; 0</text>
            <text x="75" y="102" textAnchor="middle" fill="#a1a1aa" fontSize="10">Filter visible series</text>
            <text x="75" y="119" textAnchor="middle" fill="#a1a1aa" fontSize="10">Missing policy</text>
            <rect x="20" y="140" width="110" height="24" rx="6" fill="#0284c7" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1" />
            <text x="75" y="156" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="600" fontFamily="monospace">Strict V1 Check</text>
          </g>

          <line x1="365" y1="130" x2="395" y2="130" stroke="#71717a" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

          {/* Step 3: Raw Total Denominator */}
          <g transform="translate(400, 40)">
            <rect width="150" height="180" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <rect width="150" height="32" rx="10" fill="#27272a" />
            <text x="75" y="21" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700" fontFamily="monospace">3. RAW TOTAL</text>
            <text x="75" y="65" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="600">Sum Visible</text>
            <text x="75" y="85" textAnchor="middle" fill="#a1a1aa" fontSize="10">&Sigma; Visible = 100</text>
            <text x="75" y="105" textAnchor="middle" fill="#fbbf24" fontSize="10">Denominator</text>
            <text x="75" y="125" textAnchor="middle" fill="#ef4444" fontSize="9">If total = 0 &rarr; null</text>
            <rect x="20" y="140" width="110" height="24" rx="6" fill="#f59e0b" fillOpacity="0.15" stroke="#fbbf24" strokeWidth="1" />
            <text x="75" y="156" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600" fontFamily="monospace">Dynamic Sum</text>
          </g>

          <line x1="555" y1="130" x2="585" y2="130" stroke="#71717a" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

          {/* Step 4: Proportional Shares */}
          <g transform="translate(590, 40)">
            <rect width="150" height="180" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <rect width="150" height="32" rx="10" fill="#27272a" />
            <text x="75" y="21" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700" fontFamily="monospace">4. DERIVE SHARES</text>
            <text x="75" y="65" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="600">v / visibleTotal</text>
            <text x="75" y="85" textAnchor="middle" fill="#a1a1aa" fontSize="10">60 / 100 &rarr; 60%</text>
            <text x="75" y="102" textAnchor="middle" fill="#a1a1aa" fontSize="10">30 / 100 &rarr; 30%</text>
            <text x="75" y="119" textAnchor="middle" fill="#a1a1aa" fontSize="10">10 / 100 &rarr; 10%</text>
            <rect x="20" y="140" width="110" height="24" rx="6" fill="#8b5cf6" fillOpacity="0.15" stroke="#a78bfa" strokeWidth="1" />
            <text x="75" y="156" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="600" fontFamily="monospace">Exact Ratios</text>
          </g>

          <line x1="745" y1="130" x2="775" y2="130" stroke="#71717a" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

          {/* Step 5: 100% Stacked Bar */}
          <g transform="translate(780, 40)">
            <rect width="120" height="180" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <rect width="120" height="32" rx="10" fill="#10b981" fillOpacity="0.2" />
            <text x="60" y="21" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="monospace">5. 100% STACK</text>
            {/* Visual Mini Bar */}
            <rect x="42" y="55" width="36" height="42" rx="4" fill="#0284c7" />
            <rect x="42" y="97" width="36" height="30" fill="#10b981" />
            <rect x="42" y="127" width="36" height="18" rx="0" fill="#f59e0b" />
            <text x="60" y="78" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">60%</text>
            <text x="60" y="114" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">30%</text>
            <text x="60" y="139" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700">10%</text>
            <text x="60" y="165" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="600">Fixed 0-100%</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Absolute Stack vs Percent Stack                                */
/* -------------------------------------------------------------------------- */

export function AbsoluteStackVsPercentStackDiagram() {
  const titleId = "abs-vs-pct-title"
  const descId = "abs-vs-pct-desc"

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
              ANALYTICAL DIFFERENCE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Component 022 vs Component 023
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Stack Ledger Bars (Absolute) vs Percent Stack Bars (100% Normalized)
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison diagram illustrating how Stack Ledger Bars encodes total category magnitude via varying bar heights, while Percent Stack Bars normalizes every category to 100% height to compare composition alone.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 320"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Left Panel: Stack Ledger Bars */}
          <g transform="translate(20, 20)">
            <rect width="420" height="270" rx="12" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="25" y="35" fill="#f43f5e" fontSize="12" fontWeight="700" fontFamily="monospace">022 STACK LEDGER (ABSOLUTE)</text>
            <text x="25" y="55" fill="#a1a1aa" fontSize="11">Total magnitude encoded by total stack height</text>

            {/* Baseline */}
            <line x1="50" y1="230" x2="380" y2="230" stroke="#3f3f46" strokeWidth="1.5" />

            {/* Cat 1: Total = 100 */}
            <rect x="100" y="195" width="55" height="35" fill="#f59e0b" />
            <rect x="100" y="145" width="55" height="50" fill="#10b981" />
            <rect x="100" y="95" width="55" height="50" rx="4" fill="#0284c7" />
            <text x="127" y="248" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Starter</text>
            <text x="127" y="85" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="monospace">100</text>

            {/* Cat 2: Total = 200 (Twice as high!) */}
            <rect x="250" y="160" width="55" height="70" fill="#f59e0b" />
            <rect x="250" y="60" width="55" height="100" fill="#10b981" />
            <rect x="250" y="0" width="55" height="60" rx="4" fill="#0284c7" />
            <text x="277" y="248" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Growth</text>
            <text x="277" y="-10" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="monospace">200</text>

            <rect x="50" y="210" width="12" height="12" fill="none" />
            <text x="25" y="268" fill="#71717a" fontSize="10">Second bar is twice as tall because 200 &gt; 100.</text>
          </g>

          {/* Right Panel: Percent Stack Bars */}
          <g transform="translate(480, 20)">
            <rect width="420" height="270" rx="12" fill="#18181b" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="25" y="35" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">023 PERCENT STACK (100% NORMALIZED)</text>
            <text x="25" y="55" fill="#a1a1aa" fontSize="11">Total magnitude discarded; composition compared at 100%</text>

            {/* Top 100% reference line */}
            <line x1="50" y1="95" x2="380" y2="95" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="390" y="99" fill="#10b981" fontSize="9" fontFamily="monospace">100%</text>

            {/* Baseline */}
            <line x1="50" y1="230" x2="380" y2="230" stroke="#3f3f46" strokeWidth="1.5" />

            {/* Cat 1: 50% / 30% / 20% */}
            <rect x="100" y="203" width="55" height="27" fill="#f59e0b" />
            <rect x="100" y="162" width="55" height="41" fill="#10b981" />
            <rect x="100" y="95" width="55" height="67" rx="4" fill="#0284c7" />
            <text x="127" y="248" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Starter</text>
            <text x="127" y="85" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700" fontFamily="monospace">100%</text>

            {/* Cat 2: 50% / 30% / 20% (Equal height!) */}
            <rect x="250" y="203" width="55" height="27" fill="#f59e0b" />
            <rect x="250" y="162" width="55" height="41" fill="#10b981" />
            <rect x="250" y="95" width="55" height="67" rx="4" fill="#0284c7" />
            <text x="277" y="248" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Growth</text>
            <text x="277" y="85" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700" fontFamily="monospace">100%</text>

            <text x="25" y="268" fill="#10b981" fontSize="10" fontWeight="500">Both bars reach 100%. Total magnitude difference is intentionally eliminated.</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Composition vs Magnitude Loss                                  */
/* -------------------------------------------------------------------------- */

export function CompositionVsMagnitudeLossDiagram() {
  const titleId = "mag-loss-title"
  const descId = "mag-loss-desc"

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
              MAGNITUDE-LOSS RULE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              100x Volume Difference &rarr; Identical Geometry
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            The Magnitude-Loss Principle: Equal Visual Heights Discard Total Scale
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Explanatory diagram showing Category A with raw total 100 and Category B with raw total 10,000 having identical 50/30/20 normalized visual stacks, proving that Percent Stack Bars conveys composition rather than absolute volume.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Top 100% Boundary */}
          <line x1="60" y1="50" x2="860" y2="50" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <text x="870" y="54" fill="#a1a1aa" fontSize="10" fontFamily="monospace">100%</text>

          {/* Baseline */}
          <line x1="60" y1="210" x2="860" y2="210" stroke="#3f3f46" strokeWidth="1.5" />

          {/* Category A: Raw Total = 100 */}
          <g transform="translate(180, 0)">
            <rect x="0" y="178" width="80" height="32" fill="#f59e0b" />
            <rect x="0" y="130" width="80" height="48" fill="#10b981" />
            <rect x="0" y="50" width="80" height="80" rx="6" fill="#0284c7" />
            <text x="40" y="100" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">50%</text>
            <text x="40" y="160" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">30%</text>
            <text x="40" y="198" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">20%</text>

            <text x="40" y="232" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">Category A</text>
            <text x="40" y="250" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600" fontFamily="monospace">Raw Total: 100</text>
          </g>

          {/* Equal Sign in the middle */}
          <g transform="translate(435, 120)">
            <circle cx="25" cy="10" r="24" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
            <text x="25" y="18" textAnchor="middle" fill="#fbbf24" fontSize="22" fontWeight="800">=</text>
            <text x="25" y="50" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="600">IDENTICAL</text>
            <text x="25" y="64" textAnchor="middle" fill="#71717a" fontSize="9">GEOMETRY</text>
          </g>

          {/* Category B: Raw Total = 10,000 (100x bigger!) */}
          <g transform="translate(620, 0)">
            <rect x="0" y="178" width="80" height="32" fill="#f59e0b" />
            <rect x="0" y="130" width="80" height="48" fill="#10b981" />
            <rect x="0" y="50" width="80" height="80" rx="6" fill="#0284c7" />
            <text x="40" y="100" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">50%</text>
            <text x="40" y="160" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">30%</text>
            <text x="40" y="198" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">20%</text>

            <text x="40" y="232" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">Category B</text>
            <text x="40" y="250" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="600" fontFamily="monospace">Raw Total: 10,000 (100&times;)</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Raw Value vs Derived Share                                     */
/* -------------------------------------------------------------------------- */

export function RawValueVsDerivedShareDiagram() {
  const titleId = "raw-share-title"
  const descId = "raw-share-desc"

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
              DUAL-TIER DATA
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Canonical Truth &rarr; Derived Representation
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Raw Measurement vs Derived Proportional Share
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Architecture diagram showing that caller raw measurements are preserved as canonical source data in tooltips and accessibility, while normalized percentages are derived at runtime for SVG bar heights.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 260"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Source Data Box */}
          <g transform="translate(40, 40)">
            <rect width="250" height="180" rx="10" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="20" y="30" fill="#60a5fa" fontSize="12" fontWeight="700" fontFamily="monospace">CANONICAL RAW MEASURE</text>
            <text x="20" y="55" fill="#e4e4e7" fontSize="11" fontWeight="600">Actual caller measurement:</text>
            <text x="20" y="80" fill="#a1a1aa" fontSize="11">&bull; Preserved in tooltips</text>
            <text x="20" y="100" fill="#a1a1aa" fontSize="11">&bull; Reported in screen reader tables</text>
            <text x="20" y="120" fill="#a1a1aa" fontSize="11">&bull; Re-calculated on series hide</text>
            <rect x="20" y="140" width="210" height="26" rx="6" fill="#1e3a8a" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1" />
            <text x="125" y="157" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="600" fontFamily="monospace">Monthly = 620 users</text>
          </g>

          {/* Derivation Flow Arrow */}
          <g transform="translate(320, 110)">
            <path d="M 0 20 L 100 20" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="100,15 110,20 100,25" fill="#a1a1aa" />
            <text x="55" y="12" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily="monospace">&divide; Visible Total</text>
            <text x="55" y="38" textAnchor="middle" fill="#a1a1aa" fontSize="9">&times; 100%</text>
          </g>

          {/* Derived Share Box */}
          <g transform="translate(460, 40)">
            <rect width="250" height="180" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="20" y="30" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">DERIVED PERCENT SHARE</text>
            <text x="20" y="55" fill="#e4e4e7" fontSize="11" fontWeight="600">Runtime normalized ratio:</text>
            <text x="20" y="80" fill="#a1a1aa" fontSize="11">&bull; Controls SVG geometry</text>
            <text x="20" y="100" fill="#a1a1aa" fontSize="11">&bull; Always sums to 100%</text>
            <text x="20" y="120" fill="#a1a1aa" fontSize="11">&bull; Independent display rounding</text>
            <rect x="20" y="140" width="210" height="26" rx="6" fill="#064e3b" fillOpacity="0.4" stroke="#10b981" strokeWidth="1" />
            <text x="125" y="157" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="600" fontFamily="monospace">Share = 62.0% of whole</text>
          </g>

          {/* Mini Stack Representation */}
          <g transform="translate(750, 40)">
            <rect width="130" height="180" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="65" y="30" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="700">Visual Output</text>
            <rect x="45" y="50" width="40" height="70" rx="4" fill="#0284c7" />
            <rect x="45" y="120" width="40" height="42" fill="#10b981" />
            <text x="65" y="90" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">62%</text>
            <text x="65" y="145" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">38%</text>
            <text x="65" y="178" textAnchor="middle" fill="#a1a1aa" fontSize="9">Sum = 100%</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 5: Zero-Total Semantics                                           */
/* -------------------------------------------------------------------------- */

export function ZeroTotalSemanticsDiagram() {
  const titleId = "zero-total-title"
  const descId = "zero-total-desc"

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
              TRUTHFUL ZERO TOTAL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              No Fabricated Equal Shares
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Zero-Total Category Semantics: Undefined Share vs False Invention
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison showing correct Plotcn behavior when all contributors are zero (0+0+0): the composition is flagged unavailable and no bar is drawn, preventing the visual deception of inventing 33.3% equal shares.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Left Panel: Plotcn Correct Truthful Behavior */}
          <g transform="translate(30, 20)">
            <rect width="410" height="240" rx="12" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="25" y="32" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">&check; PLOTCN TRUTHFUL ZERO TOTAL</text>
            <text x="25" y="52" fill="#a1a1aa" fontSize="11">Input: A=0, B=0, C=0 &rarr; Raw Total = 0</text>

            <line x1="40" y1="180" x2="370" y2="180" stroke="#3f3f46" strokeWidth="1.5" />
            {/* Category Band preserved, but NO BAR drawn */}
            <rect x="150" y="70" width="70" height="110" rx="6" fill="#27272a" fillOpacity="0.4" stroke="#52525b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="185" y="115" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontWeight="600">No Stack</text>
            <text x="185" y="132" textAnchor="middle" fill="#71717a" fontSize="9">Total = 0</text>
            <text x="185" y="146" textAnchor="middle" fill="#71717a" fontSize="9">Share Undefined</text>

            <text x="185" y="202" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Jan (Total: 0)</text>
            <text x="25" y="222" fill="#10b981" fontSize="10">Correct: 0/0 is undefined. No fake 100% bar is rendered.</text>
          </g>

          {/* Right Panel: Bad / Naive Implementation */}
          <g transform="translate(480, 20)">
            <rect width="410" height="240" rx="12" fill="#18181b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="25" y="32" fill="#ef4444" fontSize="12" fontWeight="700" fontFamily="monospace">&cross; HARMFUL INVENTED SHARES</text>
            <text x="25" y="52" fill="#a1a1aa" fontSize="11">Deceptive fallback dividing by zero</text>

            <line x1="40" y1="180" x2="370" y2="180" stroke="#3f3f46" strokeWidth="1.5" />
            {/* Fake 33.3% shares */}
            <rect x="150" y="70" width="70" height="36" rx="4" fill="#0284c7" opacity="0.6" />
            <rect x="150" y="106" width="70" height="37" fill="#10b981" opacity="0.6" />
            <rect x="150" y="143" width="70" height="37" fill="#f59e0b" opacity="0.6" />
            <text x="185" y="92" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="700">33.3% (?)</text>
            <text x="185" y="128" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="700">33.3% (?)</text>
            <text x="185" y="165" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="700">33.3% (?)</text>

            <text x="185" y="202" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="600">Jan (Fake 100%)</text>
            <text x="25" y="222" fill="#f87171" fontSize="10">False: Zero contributors do not each own one third.</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 6: Missing vs Zero vs Hidden                                      */
/* -------------------------------------------------------------------------- */

export function PercentStackMissingVsZeroVsHiddenDiagram() {
  const titleId = "tri-state-title"
  const descId = "tri-state-desc"

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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-cyan-400" />
              THREE DISTINCT STATES
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Zero &ne; Missing &ne; Hidden
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Categorical State Disambiguation: Zero, Missing, and Hidden Contributor
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        State matrix diagram showing Zero as a known 0 contribution, Missing as an unavailable measurement causing incomplete composition by default, and Hidden as a user-initiated exclusion that renormalizes the visible total.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 270"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Card 1: Zero Value */}
          <g transform="translate(30, 20)">
            <rect width="260" height="230" rx="10" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
            <rect width="260" height="34" rx="10" fill="#1e3a8a" fillOpacity="0.4" />
            <text x="130" y="22" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="700" fontFamily="monospace">1. ZERO VALUE (val = 0)</text>
            <text x="20" y="65" fill="#e4e4e7" fontSize="11" fontWeight="600">Measurement is known and 0:</text>
            <text x="20" y="88" fill="#a1a1aa" fontSize="10">&bull; Contributes 0 to raw total</text>
            <text x="20" y="106" fill="#a1a1aa" fontSize="10">&bull; Share is 0.0% of whole</text>
            <text x="20" y="124" fill="#a1a1aa" fontSize="10">&bull; Zero-height visible segment</text>
            <text x="20" y="142" fill="#a1a1aa" fontSize="10">&bull; Retained in legend &amp; tooltip</text>
            <rect x="20" y="170" width="220" height="36" rx="6" fill="#27272a" />
            <text x="130" y="192" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">Valid Composition &check;</text>
          </g>

          {/* Card 2: Missing Value */}
          <g transform="translate(330, 20)">
            <rect width="260" height="230" rx="10" fill="#18181b" stroke="#f59e0b" strokeWidth="1.5" />
            <rect width="260" height="34" rx="10" fill="#78350f" fillOpacity="0.4" />
            <text x="130" y="22" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700" fontFamily="monospace">2. MISSING (val = null)</text>
            <text x="20" y="65" fill="#e4e4e7" fontSize="11" fontWeight="600">Measurement is unavailable:</text>
            <text x="20" y="88" fill="#a1a1aa" fontSize="10">&bull; Cannot compute honest total</text>
            <text x="20" y="106" fill="#a1a1aa" fontSize="10">&bull; Category marked &quot;incomplete&quot;</text>
            <text x="20" y="124" fill="#a1a1aa" fontSize="10">&bull; Bar geometry omitted by default</text>
            <text x="20" y="142" fill="#a1a1aa" fontSize="10">&bull; Explicit &quot;zero&quot; policy opt-in</text>
            <rect x="20" y="170" width="220" height="36" rx="6" fill="#27272a" />
            <text x="130" y="192" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Composition Incomplete &times;</text>
          </g>

          {/* Card 3: Hidden Series */}
          <g transform="translate(630, 20)">
            <rect width="260" height="230" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <rect width="260" height="34" rx="10" fill="#064e3b" fillOpacity="0.4" />
            <text x="130" y="22" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="700" fontFamily="monospace">3. HIDDEN (user toggle)</text>
            <text x="20" y="65" fill="#e4e4e7" fontSize="11" fontWeight="600">Removed from denominator:</text>
            <text x="20" y="88" fill="#a1a1aa" fontSize="10">&bull; Excluded from visible sum</text>
            <text x="20" y="106" fill="#a1a1aa" fontSize="10">&bull; Remaining series renormalize</text>
            <text x="20" y="124" fill="#a1a1aa" fontSize="10">&bull; Visible shares sum to 100%</text>
            <text x="20" y="142" fill="#a1a1aa" fontSize="10">&bull; Color tokens never shift</text>
            <rect x="20" y="170" width="220" height="36" rx="6" fill="#27272a" />
            <text x="130" y="192" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">Renormalized to 100% &check;</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 7: Legend Renormalization                                         */
/* -------------------------------------------------------------------------- */

export function LegendRenormalizationDiagram() {
  const titleId = "legend-renorm-title"
  const descId = "legend-renorm-desc"

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
              DENOMINATOR SHIFT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Visibility Changes the Denominator
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Legend Renormalization: Hiding Series Recalculates Proportions to 100%
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Step diagram showing Category with A=50, B=30, C=20 totaling 100 with shares 50%, 30%, 20%. When C is hidden, the visible total becomes 80 and the remaining contributors renormalize to 62.5% and 37.5%, keeping the stack at 100%.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 300"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Before State */}
          <g transform="translate(60, 30)">
            <rect width="320" height="240" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="20" y="30" fill="#38bdf8" fontSize="12" fontWeight="700" fontFamily="monospace">ALL 3 SERIES VISIBLE</text>
            <text x="20" y="50" fill="#a1a1aa" fontSize="10">Raw Total: 50 + 30 + 20 = 100</text>

            {/* Stack bar */}
            <rect x="220" y="60" width="50" height="32" rx="4" fill="#f59e0b" />
            <rect x="220" y="92" width="50" height="48" fill="#10b981" />
            <rect x="220" y="140" width="50" height="80" fill="#0284c7" />

            <text x="20" y="85" fill="#f59e0b" fontSize="11" fontWeight="600">&bull; Enterprise: 20 (20%)</text>
            <text x="20" y="115" fill="#10b981" fontSize="11" fontWeight="600">&bull; Annual: 30 (30%)</text>
            <text x="20" y="145" fill="#0284c7" fontSize="11" fontWeight="600">&bull; Monthly: 50 (50%)</text>

            <rect x="20" y="190" width="180" height="26" rx="4" fill="#27272a" />
            <text x="110" y="207" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="600">Sum = Exactly 100%</text>
          </g>

          {/* Center Action Arrow */}
          <g transform="translate(415, 120)">
            <path d="M 0 20 L 70 20" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="70,15 80,20 70,25" fill="#f43f5e" />
            <text x="40" y="12" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="700" fontFamily="monospace">Hide C</text>
            <text x="40" y="38" textAnchor="middle" fill="#a1a1aa" fontSize="9">Remove 20</text>
          </g>

          {/* After State */}
          <g transform="translate(530, 30)">
            <rect width="330" height="240" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="20" y="30" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">SERIES C EXCLUDED</text>
            <text x="20" y="50" fill="#a1a1aa" fontSize="10">Visible Total: 50 + 30 = 80 (New Denominator!)</text>

            {/* Renormalized stack bar */}
            <rect x="230" y="60" width="50" height="60" rx="4" fill="#10b981" />
            <rect x="230" y="120" width="50" height="100" fill="#0284c7" />

            <text x="20" y="85" fill="#71717a" fontSize="11" textDecoration="line-through">&bull; Enterprise: Hidden</text>
            <text x="20" y="115" fill="#10b981" fontSize="11" fontWeight="600">&bull; Annual: 30 / 80 &rarr; 37.5%</text>
            <text x="20" y="145" fill="#0284c7" fontSize="11" fontWeight="600">&bull; Monthly: 50 / 80 &rarr; 62.5%</text>

            <rect x="20" y="190" width="190" height="26" rx="4" fill="#064e3b" fillOpacity="0.4" stroke="#10b981" strokeWidth="1" />
            <text x="115" y="207" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">Renormalized: 62.5 + 37.5 = 100%</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 8: Stable Stack Order                                             */
/* -------------------------------------------------------------------------- */

export function PercentStackStableStackOrderDiagram() {
  const titleId = "stack-order-title"
  const descId = "stack-order-desc"

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
              SPATIAL COGNITION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Consistent Layer Identity
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Stable Stack Order: Canonical Series Hierarchy vs Harmful Dynamic Sorting
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison showing why Plotcn maintains the same series stacking order across all categories (Series A on bottom, B in middle, C on top) instead of sorting dynamically by share, which causes eye-tracking confusion.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Left: Plotcn Stable Hierarchy */}
          <g transform="translate(30, 20)">
            <rect width="410" height="240" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="25" y="32" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">&check; STABLE STACK ORDER (CANONICAL)</text>
            <text x="25" y="52" fill="#a1a1aa" fontSize="10">Position A &rarr; B &rarr; C fixed across all categories</text>

            {/* Cat 1 */}
            <rect x="70" y="70" width="55" height="40" rx="4" fill="#0284c7" />
            <rect x="70" y="110" width="55" height="50" fill="#10b981" />
            <rect x="70" y="160" width="55" height="40" fill="#f59e0b" />
            <text x="97" y="215" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Cat 1</text>

            {/* Cat 2 */}
            <rect x="180" y="70" width="55" height="70" rx="4" fill="#0284c7" />
            <rect x="180" y="140" width="55" height="30" fill="#10b981" />
            <rect x="180" y="170" width="55" height="30" fill="#f59e0b" />
            <text x="207" y="215" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Cat 2</text>

            {/* Cat 3 */}
            <rect x="290" y="70" width="55" height="20" rx="4" fill="#0284c7" />
            <rect x="290" y="90" width="55" height="30" fill="#10b981" />
            <rect x="290" y="120" width="55" height="80" fill="#f59e0b" />
            <text x="317" y="215" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Cat 3</text>

            <text x="25" y="235" fill="#10b981" fontSize="10">User glances across: Blue is always on top, Yellow on bottom.</text>
          </g>

          {/* Right: Harmful Dynamic Sorting */}
          <g transform="translate(480, 20)">
            <rect width="410" height="240" rx="10" fill="#18181b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="25" y="32" fill="#ef4444" fontSize="12" fontWeight="700" fontFamily="monospace">&cross; HARMFUL DYNAMIC REORDERING</text>
            <text x="25" y="52" fill="#a1a1aa" fontSize="10">Layers re-sorted per category by size</text>

            {/* Cat 1: Sorted B, A, C */}
            <rect x="70" y="70" width="55" height="50" rx="4" fill="#10b981" />
            <rect x="70" y="120" width="55" height="40" fill="#0284c7" />
            <rect x="70" y="160" width="55" height="40" fill="#f59e0b" />
            <text x="97" y="215" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Cat 1</text>

            {/* Cat 2: Sorted A, B, C */}
            <rect x="180" y="70" width="55" height="70" rx="4" fill="#0284c7" />
            <rect x="180" y="140" width="55" height="30" fill="#10b981" />
            <rect x="180" y="170" width="55" height="30" fill="#f59e0b" />
            <text x="207" y="215" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Cat 2</text>

            {/* Cat 3: Sorted C, B, A (Jumbled!) */}
            <rect x="290" y="70" width="55" height="80" rx="4" fill="#f59e0b" />
            <rect x="290" y="150" width="55" height="30" fill="#10b981" />
            <rect x="290" y="180" width="55" height="20" fill="#0284c7" />
            <text x="317" y="215" textAnchor="middle" fill="#e4e4e7" fontSize="11" fontWeight="600">Cat 3</text>

            <text x="25" y="235" fill="#f87171" fontSize="10">Eye tracking broken: colors jump positions across categories.</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 9: Category + Segment Hit Regions                                 */
/* -------------------------------------------------------------------------- */

export function PercentStackHitRegionsDiagram() {
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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-teal-400" />
              INTERACTION ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Forgiving Category Band + Exact Segment Target
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Dual-Tier Hit Testing: Broad Category Band with Tiny-Segment Protection
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Hit region diagram showing full 44px vertical category strip that activates the tooltip upon hover, protecting tiny segments from being untargetable on touch or pointer devices.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 260"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Baseline */}
          <line x1="60" y1="200" x2="860" y2="200" stroke="#3f3f46" strokeWidth="1.5" />

          {/* Broad Category Band (Forgiving Hit Zone) */}
          <rect x="260" y="30" width="160" height="170" rx="8" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="340" y="48" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="700" fontFamily="monospace">44px+ Category Band Hit Target</text>

          {/* Actual 100% Stacked Bar */}
          <g transform="translate(310, 60)">
            <rect x="0" y="0" width="60" height="85" rx="4" fill="#0284c7" />
            <rect x="0" y="85" width="60" height="45" fill="#10b981" />
            {/* Tiny Segment: e.g. 2% */}
            <rect x="0" y="130" width="60" height="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <text x="30" y="45" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">60%</text>
            <text x="30" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">38%</text>
            <text x="75" y="138" fill="#fbbf24" fontSize="10" fontWeight="700">&larr; 2% Tiny Segment</text>
          </g>

          <text x="340" y="222" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="600">Category: Enterprise</text>

          {/* Explanation Callout on right */}
          <g transform="translate(520, 50)">
            <rect width="320" height="140" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="20" y="30" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="monospace">TOUCH &amp; POINTER SAFETY</text>
            <text x="20" y="55" fill="#e4e4e7" fontSize="11">&bull; Hovering anywhere in band activates tooltip</text>
            <text x="20" y="75" fill="#a1a1aa" fontSize="11">&bull; Tiny 2% segment is never missed</text>
            <text x="20" y="95" fill="#a1a1aa" fontSize="11">&bull; No segment geometry inflation (stays truthful)</text>
            <text x="20" y="115" fill="#a1a1aa" fontSize="11">&bull; Legend provides complementary activation</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 10: Vertical vs Horizontal Orientation                            */
/* -------------------------------------------------------------------------- */

export function PercentStackOrientationDiagram() {
  const titleId = "orient-title"
  const descId = "orient-desc"

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
              LAYOUT FLEXIBILITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Vertical (Columns) vs Horizontal (Rows)
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Vertical vs Horizontal Orientation: First-Class Label Readability
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Layout diagram illustrating vertical layout suitable for concise categories along X, versus horizontal layout where bars grow rightward along Y to accommodate long enterprise labels without clipping.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Left: Vertical Layout */}
          <g transform="translate(30, 20)">
            <rect width="410" height="240" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="25" y="32" fill="#38bdf8" fontSize="12" fontWeight="700" fontFamily="monospace">LAYOUT = &quot;VERTICAL&quot; (DEFAULT)</text>
            <text x="25" y="52" fill="#a1a1aa" fontSize="10">Categories on X &bull; Stacks grow upward to 100%</text>

            <line x1="40" y1="180" x2="370" y2="180" stroke="#3f3f46" strokeWidth="1.5" />
            {/* Bar 1 */}
            <rect x="80" y="80" width="45" height="40" rx="4" fill="#0284c7" />
            <rect x="80" y="120" width="45" height="60" fill="#10b981" />
            <text x="102" y="198" textAnchor="middle" fill="#e4e4e7" fontSize="10">Jan</text>

            {/* Bar 2 */}
            <rect x="180" y="80" width="45" height="60" rx="4" fill="#0284c7" />
            <rect x="180" y="140" width="45" height="40" fill="#10b981" />
            <text x="202" y="198" textAnchor="middle" fill="#e4e4e7" fontSize="10">Feb</text>

            {/* Bar 3 */}
            <rect x="280" y="80" width="45" height="30" rx="4" fill="#0284c7" />
            <rect x="280" y="110" width="45" height="70" fill="#10b981" />
            <text x="302" y="198" textAnchor="middle" fill="#e4e4e7" fontSize="10">Mar</text>

            <text x="25" y="224" fill="#71717a" fontSize="10">Ideal for dates, short codes, and quarters.</text>
          </g>

          {/* Right: Horizontal Layout */}
          <g transform="translate(480, 20)">
            <rect width="410" height="240" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <text x="25" y="32" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">LAYOUT = &quot;HORIZONTAL&quot;</text>
            <text x="25" y="52" fill="#a1a1aa" fontSize="10">Categories on Y &bull; Stacks grow rightward to 100%</text>

            <line x1="140" y1="65" x2="140" y2="200" stroke="#3f3f46" strokeWidth="1.5" />

            {/* Row 1 */}
            <text x="130" y="95" textAnchor="end" fill="#e4e4e7" fontSize="9">Enterprise Tier</text>
            <rect x="145" y="80" width="120" height="22" fill="#10b981" />
            <rect x="265" y="80" width="90" height="22" rx="4" fill="#0284c7" />

            {/* Row 2 */}
            <text x="130" y="135" textAnchor="end" fill="#e4e4e7" fontSize="9">Mid-Market</text>
            <rect x="145" y="120" width="90" height="22" fill="#10b981" />
            <rect x="235" y="120" width="120" height="22" rx="4" fill="#0284c7" />

            {/* Row 3 */}
            <text x="130" y="175" textAnchor="end" fill="#e4e4e7" fontSize="9">Public Sector</text>
            <rect x="145" y="160" width="150" height="22" fill="#10b981" />
            <rect x="295" y="160" width="60" height="22" rx="4" fill="#0284c7" />

            <text x="25" y="224" fill="#10b981" fontSize="10">Unclipped, full text labels for lengthy corporate names.</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 11: Rendering Architecture Flow                                   */
/* -------------------------------------------------------------------------- */

export function PercentStackRenderingArchitectureDiagram() {
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
              SYSTEM ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Complete Component Dataflow
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            PercentStackBars Rendering Architecture: Pipeline, Subsystems &amp; Accessibility
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Architecture diagram showing props entering normalization pipeline, state resolution, fixed 0-100 Recharts coordinate system, dual hit-testing, and accessible live region output.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 340"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Top Layer: Caller Input */}
          <g transform="translate(60, 20)">
            <rect width="800" height="50" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <text x="400" y="32" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
              Consumer Props: data (readonly), categoryKey, series, layout, missingValuePolicy
            </text>
          </g>

          <line x1="460" y1="70" x2="460" y2="100" stroke="#71717a" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

          {/* Middle Layer: Normalization & State Engine */}
          <g transform="translate(60, 100)">
            <rect width="800" height="90" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
            <rect width="800" height="24" rx="8" fill="#10b981" fillOpacity="0.15" />
            <text x="400" y="17" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="monospace">
              PURE DETERMINISTIC NORMALIZATION ENGINE
            </text>

            <g transform="translate(30, 36)">
              <rect width="160" height="40" rx="6" fill="#27272a" />
              <text x="80" y="25" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="600">Non-negative Check</text>
            </g>

            <g transform="translate(220, 36)">
              <rect width="160" height="40" rx="6" fill="#27272a" />
              <text x="80" y="25" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="600">Missing Policy Router</text>
            </g>

            <g transform="translate(410, 36)">
              <rect width="160" height="40" rx="6" fill="#27272a" />
              <text x="80" y="25" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="600">Visible Raw Total</text>
            </g>

            <g transform="translate(600, 36)">
              <rect width="160" height="40" rx="6" fill="#27272a" />
              <text x="80" y="25" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="600">0&ndash;100% Proportions</text>
            </g>
          </g>

          <line x1="460" y1="190" x2="460" y2="220" stroke="#71717a" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

          {/* Bottom Layer: Rendering & Presentation */}
          <g transform="translate(60, 220)">
            <rect width="800" height="95" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
            <rect width="800" height="24" rx="8" fill="#1e3a8a" fillOpacity="0.2" />
            <text x="400" y="17" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="700" fontFamily="monospace">
              PRESENTATION &amp; ACCESSIBILITY SUBSYSTEMS
            </text>

            <g transform="translate(25, 38)">
              <rect width="170" height="44" rx="6" fill="#27272a" />
              <text x="85" y="20" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Recharts BarChart</text>
              <text x="85" y="34" textAnchor="middle" fill="#a1a1aa" fontSize="9">Fixed [0, 100] Domain</text>
            </g>

            <g transform="translate(220, 38)">
              <rect width="170" height="44" rx="6" fill="#27272a" />
              <text x="85" y="20" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Custom Outer Corner</text>
              <text x="85" y="34" textAnchor="middle" fill="#a1a1aa" fontSize="9">StackedBarShape</text>
            </g>

            <g transform="translate(415, 38)">
              <rect width="170" height="44" rx="6" fill="#27272a" />
              <text x="85" y="20" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">Synchronized Tooltip</text>
              <text x="85" y="34" textAnchor="middle" fill="#a1a1aa" fontSize="9">Raw Value + Derived Share</text>
            </g>

            <g transform="translate(610, 38)">
              <rect width="165" height="44" rx="6" fill="#27272a" />
              <text x="82" y="20" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">A11y Table &amp; Live</text>
              <text x="82" y="34" textAnchor="middle" fill="#a1a1aa" fontSize="9">Zero/Missing Narration</text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  )
}
