"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Bullet Anatomy SVG                                             */
/* -------------------------------------------------------------------------- */

export function BulletAnatomyDiagram() {
  const titleId = "bullet-anatomy-title"
  const descId = "bullet-anatomy-desc"

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
              STRUCTURAL ANATOMY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Component Elements
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Bullet Chart Anatomy: Category, Measure, Target Marker & Context Ranges
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Anatomy of a Bullet Bar scorecard row showing discrete category label on the left, optional background qualitative bands, solid actual measure bar, prominent target marker rule, and shared quantitative axis scale.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 260"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Bullet Bars Anatomy Diagram</title>
          <desc>Diagram highlighting category label, actual bar, target marker rule, qualitative bands, and shared scale.</desc>

          {/* Background Grid */}
          <line x1="200" y1="40" x2="200" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="360" y1="40" x2="360" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="520" y1="40" x2="520" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="680" y1="40" x2="680" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="820" y1="40" x2="820" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

          {/* Qualitative Background Bands */}
          <rect x="200" y="80" width="220" height="40" fill="rgba(255,255,255,0.05)" rx="3" />
          <rect x="420" y="80" width="260" height="40" fill="rgba(255,255,255,0.09)" rx="3" />
          <rect x="680" y="80" width="140" height="40" fill="rgba(255,255,255,0.14)" rx="3" />

          {/* Category Label */}
          <text x="180" y="105" textAnchor="end" fill="#f4f4f5" fontSize="13" fontWeight="600">
            Auth API Availability
          </text>
          <text x="180" y="122" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">
            Core Service
          </text>

          {/* Actual Measure Bar */}
          <rect x="200" y="88" width="480" height="24" fill="#10b981" rx="4" />
          <text x="690" y="105" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="700">
            99.95%
          </text>

          {/* Target Marker Rule */}
          <line x1="620" y1="74" x2="620" y2="126" stroke="#09090b" strokeWidth="4" strokeLinecap="round" />
          <line x1="620" y1="74" x2="620" y2="126" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />

          {/* Quantitative X-Axis Scale */}
          <line x1="200" y1="140" x2="820" y2="140" stroke="#52525b" strokeWidth="1" />
          <text x="200" y="158" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">99.70%</text>
          <text x="360" y="158" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">99.80%</text>
          <text x="520" y="158" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">99.90%</text>
          <text x="680" y="158" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">100.0%</text>
          <text x="820" y="158" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">100.1%</text>

          {/* Callout Annotations */}
          {/* 1. Category */}
          <line x1="120" y1="65" x2="120" y2="85" stroke="#71717a" strokeWidth="1" />
          <text x="120" y="55" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">1. Category Key</text>

          {/* 2. Actual Bar */}
          <line x1="440" y1="60" x2="440" y2="86" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          <text x="440" y="52" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">2. Actual Measure Bar</text>

          {/* 3. Target Marker */}
          <line x1="620" y1="130" x2="620" y2="195" stroke="#fafafa" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="560" y="195" width="120" height="22" rx="4" fill="#27272a" stroke="#52525b" strokeWidth="1" />
          <text x="620" y="210" textAnchor="middle" fill="#fafafa" fontSize="10" fontFamily="monospace" fontWeight="600">
            3. Target: 99.90%
          </text>

          {/* 4. Qualitative Bands */}
          <text x="310" y="210" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
            4. Qualitative Bands (Context)
          </text>
          <line x1="310" y1="198" x2="310" y2="125" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Below / Equal / Above Target SVG                               */
/* -------------------------------------------------------------------------- */

export function BelowEqualAboveTargetDiagram() {
  const titleId = "below-equal-above-title"
  const descId = "below-equal-above-desc"

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
              POSITIONAL RELATIONSHIPS
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Three Spatial States
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Positional Truth: Below Target, Equal Target, Above Target
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Three scorecard rows illustrating the three factual spatial states: actual value falling short of the target line, actual value matching the target line exactly with visible marker, and actual value extending past the target line without artificial clipping.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 260"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Below, Equal, and Above Target States</title>
          <desc>Diagram showing actual bar shorter than target, equal to target, and continuing past target.</desc>

          {/* Row 1: Below Target */}
          <text x="170" y="60" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">
            Search API (Below)
          </text>
          <rect x="190" y="44" width="280" height="24" fill="#3b82f6" rx="3" />
          <line x1="390" y1="36" x2="390" y2="76" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="520" y="46" width="160" height="20" rx="3" fill="rgba(245, 158, 11, 0.1)" stroke="rgba(245, 158, 11, 0.25)" />
          <text x="600" y="60" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="600">
            Delta: −22 (Below)
          </text>

          {/* Row 2: Equal Target */}
          <text x="170" y="125" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">
            Checkout API (On Target)
          </text>
          <rect x="190" y="109" width="360" height="24" fill="#3b82f6" rx="3" />
          {/* Target marker lands exactly on edge */}
          <line x1="550" y1="101" x2="550" y2="141" stroke="#09090b" strokeWidth="4" />
          <line x1="550" y1="101" x2="550" y2="141" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="600" y="111" width="160" height="20" rx="3" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.25)" />
          <text x="680" y="125" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="600">
            Delta: 0 (On Target)
          </text>

          {/* Row 3: Above Target */}
          <text x="170" y="190" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">
            Profiles API (Above)
          </text>
          <rect x="190" y="174" width="460" height="24" fill="#3b82f6" rx="3" />
          {/* Target marker is crossed and continues */}
          <line x1="360" y1="166" x2="360" y2="206" stroke="#09090b" strokeWidth="4" />
          <line x1="360" y1="166" x2="360" y2="206" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="680" y="176" width="160" height="20" rx="3" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.25)" />
          <text x="760" y="190" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="600">
            Delta: +25 (Above)
          </text>

          {/* Baseline Indicator */}
          <line x1="190" y1="30" x2="190" y2="220" stroke="#71717a" strokeWidth="1.5" />
          <text x="190" y="238" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
            0 Baseline
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Per-Category Target Marker SVG                                 */
/* -------------------------------------------------------------------------- */

export function PerCategoryTargetMarkerDiagram() {
  const titleId = "per-cat-target-title"
  const descId = "per-cat-target-desc"

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
              REFERENCE GEOMETRY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Row-Specific Rules
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Per-Category Target Markers vs Global Reference Lines
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison contrasting a global reference line which spans every row at an identical value versus row-local target markers which position independently at each record&apos;s specific target.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Per-Category Target Marker Architecture</title>
          <desc>Visual showing independent target markers at varying positions across rows.</desc>

          {/* Category A */}
          <text x="140" y="65" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">Region North</text>
          <rect x="160" y="50" width="380" height="22" fill="#6366f1" rx="3" />
          <line x1="480" y1="42" x2="480" y2="80" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <text x="500" y="65" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Target: $480k</text>

          {/* Category B */}
          <text x="140" y="115" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">Region South</text>
          <rect x="160" y="100" width="260" height="22" fill="#6366f1" rx="3" />
          <line x1="320" y1="92" x2="320" y2="130" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <text x="340" y="115" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Target: $320k</text>

          {/* Category C */}
          <text x="140" y="165" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">Region East</text>
          <rect x="160" y="150" width="440" height="22" fill="#6366f1" rx="3" />
          <line x1="560" y1="142" x2="560" y2="180" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <text x="580" y="165" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Target: $560k</text>

          {/* Explanatory Callout */}
          <path d="M 680 70 L 680 150" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="700" y="105" fill="#e4e4e7" fontSize="11" fontWeight="600">
            Each target marker sits at its
          </text>
          <text x="700" y="122" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
            own independent coordinate
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Shared Quantitative Scale SVG                                  */
/* -------------------------------------------------------------------------- */

export function BulletSharedScaleDiagram() {
  const titleId = "shared-scale-title"
  const descId = "shared-scale-desc"

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
              SCALE INVARIANT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Direct Visual Comparability
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Shared Quantitative Scale: Equal Measures Produce Equal Bar Lengths
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Demonstration showing two services with identical actual values having exactly equal bar pixel lengths, while their targets differ.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Shared Scale Invariant</title>
          <desc>Diagram showing identical actual bar lengths for equal values under one shared scale.</desc>

          {/* Shared scale lines */}
          <line x1="180" y1="30" x2="180" y2="170" stroke="#71717a" strokeWidth="1.5" />
          <line x1="500" y1="30" x2="500" y2="170" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
          <text x="500" y="24" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
            Actual = 80 units
          </text>

          {/* Row A */}
          <text x="160" y="65" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">Service Alpha</text>
          <rect x="180" y="50" width="320" height="22" fill="#14b8a6" rx="3" />
          <line x1="620" y1="42" x2="620" y2="80" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <text x="635" y="65" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Target: 100</text>

          {/* Row B */}
          <text x="160" y="125" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">Service Beta</text>
          <rect x="180" y="110" width="320" height="22" fill="#14b8a6" rx="3" />
          <line x1="420" y1="102" x2="420" y2="140" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <text x="435" y="125" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Target: 60</text>

          {/* Scale Legend Bar */}
          <line x1="180" y1="170" x2="780" y2="170" stroke="#52525b" strokeWidth="1" />
          <text x="180" y="190" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">0</text>
          <text x="500" y="190" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">80</text>
          <text x="780" y="190" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">120</text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 5: Actual Target Delta SVG                                        */
/* -------------------------------------------------------------------------- */

export function ActualTargetDeltaDiagram() {
  const titleId = "actual-target-delta-title"
  const descId = "actual-target-delta-desc"

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
              ARITHMETIC DELTA
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Mathematical Derivation
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Target Delta = Actual − Target: Pure Arithmetic, Not Moral Judgment
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Calculation flow demonstrating delta derived as actual minus target with neutral interpretation regardless of sign.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Delta Arithmetic Flow</title>
          <desc>Diagram showing calculation from raw actual and target to signed delta and position label.</desc>

          {/* Step 1: Input observations */}
          <rect x="50" y="60" width="180" height="90" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="140" y="88" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace" className="uppercase">
            Input Measures
          </text>
          <text x="140" y="112" textAnchor="middle" fill="#fafafa" fontSize="13" fontWeight="600">
            Actual: 82 · Target: 100
          </text>

          {/* Arrow 1 */}
          <path d="M 240 105 L 290 105" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Step 2: Formula */}
          <rect x="300" y="60" width="220" height="90" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="410" y="88" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace" className="uppercase">
            Arithmetic Delta
          </text>
          <text x="410" y="112" textAnchor="middle" fill="#f59e0b" fontSize="14" fontFamily="monospace" fontWeight="700">
            82 − 100 = −18
          </text>

          {/* Arrow 2 */}
          <path d="M 530 105 L 580 105" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Step 3: Factual Classification */}
          <rect x="590" y="60" width="220" height="90" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="700" y="88" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace" className="uppercase">
            Positional State
          </text>
          <text x="700" y="112" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="600">
            Below Target (−18)
          </text>
          <text x="700" y="132" textAnchor="middle" fill="#71717a" fontSize="10">
            Factual spatial status
          </text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#71717a" />
            </marker>
          </defs>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 6: Missing Actual vs Missing Target SVG                           */
/* -------------------------------------------------------------------------- */

export function MissingActualVsTargetDiagram() {
  const titleId = "missing-actual-target-title"
  const descId = "missing-actual-target-desc"

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
              DATA RESILIENCE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Truthful Incomplete States
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Missing Actual vs Missing Target: Truthful Representation Without Guesswork
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Two-panel diagram showing that when actual is missing, the target marker still renders clearly, and when target is missing, the actual bar renders without fabricated target markers.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Missing Actual vs Missing Target</title>
          <desc>Diagram showing behavior when either actual or target is missing.</desc>

          {/* Panel 1: Missing Actual */}
          <rect x="40" y="30" width="370" height="160" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="60" y="55" fill="#f43f5e" fontSize="11" fontFamily="monospace" fontWeight="600">
            Case A: Actual = null · Target = 100
          </text>
          <line x1="80" y1="110" x2="360" y2="110" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
          {/* Target rule still renders */}
          <line x1="280" y1="90" x2="280" y2="130" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />
          <text x="280" y="150" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
            Target Marker at 100
          </text>
          <text x="60" y="175" fill="#71717a" fontSize="10">
            No fake zero bar. Delta is Unavailable.
          </text>

          {/* Panel 2: Missing Target */}
          <rect x="450" y="30" width="370" height="160" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="470" y="55" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="600">
            Case B: Actual = 80 · Target = null
          </text>
          {/* Actual bar still renders */}
          <rect x="470" y="98" width="220" height="24" fill="#0284c7" rx="3" />
          <text x="470" y="150" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
            Actual Bar at 80
          </text>
          <text x="470" y="175" fill="#71717a" fontSize="10">
            No fabricated target rule. Delta is Unavailable.
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 7: Zero Target SVG                                                */
/* -------------------------------------------------------------------------- */

export function ZeroTargetDiagram() {
  const titleId = "zero-target-title"
  const descId = "zero-target-desc"

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
              BOUNDARY INTEGRITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Zero Reference Safety
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Zero Target Safety: Target = 0 Without Division by Zero
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Demonstration showing that target equals zero places the target rule directly at the baseline and computes delta without division by zero errors.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 200"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Zero Target Handling</title>
          <desc>Diagram illustrating Target = 0 aligning on the zero axis.</desc>

          {/* Zero Axis Line */}
          <line x1="240" y1="30" x2="240" y2="150" stroke="#71717a" strokeWidth="1.5" />
          <text x="240" y="170" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
            0 Axis Baseline
          </text>

          {/* Row */}
          <text x="220" y="85" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">
            Error Budget Variance
          </text>
          <rect x="240" y="70" width="220" height="24" fill="#10b981" rx="3" />
          {/* Target rule at zero */}
          <line x1="240" y1="60" x2="240" y2="104" stroke="#fafafa" strokeWidth="3" strokeLinecap="round" />

          {/* Annotations */}
          <rect x="520" y="60" width="280" height="70" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="540" y="85" fill="#fafafa" fontSize="12" fontWeight="600">
            Actual = 4 · Target = 0
          </text>
          <text x="540" y="105" fill="#34d399" fontSize="11" fontFamily="monospace">
            Delta = 4 − 0 = +4 (Above Target)
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 8: Row Hit Region SVG                                             */
/* -------------------------------------------------------------------------- */

export function RowHitRegionDiagram() {
  const titleId = "row-hit-region-title"
  const descId = "row-hit-region-desc"

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
              INTERACTION GEOMETRY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              44px Touch Targets
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Full Row Hit Testing: Effortless Scrubbing Even for Zero or Missing Actuals
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Illustration showing that the interactive hit target encompasses the entire row band (44px height) rather than requiring exact hover over thin bars or target rules.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 200"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Row Hit Target Geometry</title>
          <desc>Diagram showing entire 44px height band interactive for each row.</desc>

          {/* Full Interactive Hit Box */}
          <rect x="180" y="40" width="600" height="56" rx="8" fill="rgba(6, 182, 212, 0.08)" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="160" y="73" textAnchor="end" fill="#f4f4f5" fontSize="12" fontWeight="500">
            Auth API
          </text>
          <rect x="200" y="58" width="360" height="20" fill="#0284c7" rx="3" />
          <line x1="480" y1="50" x2="480" y2="86" stroke="#fafafa" strokeWidth="2.5" strokeLinecap="round" />

          {/* Annotation for Hit Region */}
          <text x="660" y="73" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="600">
            Full 56px Hit Band
          </text>
          <text x="380" y="140" textAnchor="middle" fill="#a1a1aa" fontSize="11">
            Hovering anywhere in the row band activates tooltip & inspection. No pixel hunting required.
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 9: Responsive Row Recomposition SVG                               */
/* -------------------------------------------------------------------------- */

export function ResponsiveRowRecompositionDiagram() {
  const titleId = "responsive-recomposition-title"
  const descId = "responsive-recomposition-desc"

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
              RESPONSIVE RECOMPOSITION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Fluid Container Adaptation
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Desktop vs Compact Layout: Target Markers Never Disappear
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison showing spacious desktop scorecard layout with full category labels and inline callouts versus compact mobile layout which adjusts padding while strictly preserving the actual bar and target marker.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Responsive Recomposition</title>
          <desc>Visual showing wide desktop row vs compact mobile row preservation.</desc>

          {/* Desktop Panel */}
          <rect x="40" y="30" width="460" height="150" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="60" y="55" fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="600">
            Spacious Desktop (≥ 640px)
          </text>
          <text x="140" y="105" textAnchor="end" fill="#f4f4f5" fontSize="11" fontWeight="500">
            Search API
          </text>
          <rect x="150" y="92" width="220" height="20" fill="#a855f7" rx="3" />
          <line x1="320" y1="84" x2="320" y2="120" stroke="#fafafa" strokeWidth="2.5" />
          <text x="380" y="106" fill="#f4f4f5" fontSize="10" fontFamily="monospace">99.82%</text>

          {/* Mobile Panel */}
          <rect x="530" y="30" width="290" height="150" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="550" y="55" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="600">
            Compact Mobile (320px–440px)
          </text>
          <text x="550" y="90" fill="#f4f4f5" fontSize="10" fontWeight="500">
            Search API
          </text>
          <rect x="550" y="100" width="160" height="18" fill="#a855f7" rx="3" />
          <line x1="680" y1="94" x2="680" y2="124" stroke="#fafafa" strokeWidth="2.5" />
          <text x="720" y="113" fill="#f4f4f5" fontSize="9" fontFamily="monospace">99.8%</text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 10: Bullet Rendering Architecture SVG                             */
/* -------------------------------------------------------------------------- */

export function BulletRenderingArchitectureDiagram() {
  const titleId = "rendering-arch-title"
  const descId = "rendering-arch-desc"

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
              Data Processing Pipeline
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Bullet Bars Architecture: From Caller Records to Accessible SVG Mark
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        End-to-end rendering pipeline showing consumer records passing through finite number validation, arithmetic delta calculation, shared quantitative domain derivation, Recharts Cartesian layout, layered SVG shapes, and accessibility dispatch.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 300"
          className="w-full min-w-[720px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Bullet Bars Rendering Architecture</title>
          <desc>Pipeline: Consumer data, validation, delta calculation, shared domain, Recharts BarChart, layered SVG, tooltip and table.</desc>

          {/* Nodes */}
          {/* 1. Consumer Data */}
          <rect x="40" y="30" width="160" height="60" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="120" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">INPUT</text>
          <text x="120" y="73" textAnchor="middle" fill="#fafafa" fontSize="12" fontWeight="600">Consumer Records</text>

          {/* 2. Validation & Delta */}
          <rect x="250" y="30" width="180" height="60" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="340" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">VALIDATION & DELTA</text>
          <text x="340" y="73" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">delta = actual − target</text>

          {/* 3. Shared Domain */}
          <rect x="480" y="30" width="160" height="60" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="560" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">SCALE DOMAIN</text>
          <text x="560" y="73" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">[0, max(actual, target)]</text>

          {/* 4. Recharts Canvas */}
          <rect x="690" y="30" width="130" height="60" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <text x="755" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">RECHARTS</text>
          <text x="755" y="73" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="600">BarChart (horiz)</text>

          {/* Connecting Arrows Row 1 */}
          <line x1="200" y1="60" x2="250" y2="60" stroke="#71717a" strokeWidth="1.5" />
          <line x1="430" y1="60" x2="480" y2="60" stroke="#71717a" strokeWidth="1.5" />
          <line x1="640" y1="60" x2="690" y2="60" stroke="#71717a" strokeWidth="1.5" />

          {/* Vertical Down */}
          <line x1="755" y1="90" x2="755" y2="140" stroke="#71717a" strokeWidth="1.5" />

          {/* Layer Split */}
          <rect x="180" y="140" width="500" height="60" rx="8" fill="#1e1e24" stroke="#52525b" strokeWidth="1" />
          <text x="430" y="163" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">COMPOSITE SVG GEOMETRY</text>
          <text x="430" y="183" textAnchor="middle" fill="#fafafa" fontSize="12" fontWeight="600">
            Qualitative Bands → Actual Bar → Target Rule Marker → Value Label
          </text>
          <line x1="755" y1="170" x2="680" y2="170" stroke="#71717a" strokeWidth="1.5" />

          {/* Row 3 Outputs */}
          <line x1="430" y1="200" x2="430" y2="230" stroke="#71717a" strokeWidth="1.5" />
          <line x1="260" y1="230" x2="600" y2="230" stroke="#71717a" strokeWidth="1.5" />
          <line x1="260" y1="230" x2="260" y2="250" stroke="#71717a" strokeWidth="1.5" />
          <line x1="600" y1="230" x2="600" y2="250" stroke="#71717a" strokeWidth="1.5" />

          {/* Output 1: Tooltip */}
          <rect x="170" y="250" width="180" height="40" rx="6" fill="#18181b" stroke="#3f3f46" />
          <text x="260" y="275" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">
            Auto-Adjusting Tooltip
          </text>

          {/* Output 2: A11y Table */}
          <rect x="510" y="250" width="180" height="40" rx="6" fill="#18181b" stroke="#3f3f46" />
          <text x="600" y="275" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace">
            Offscreen A11y Table
          </text>
        </svg>
      </div>
    </figure>
  )
}
