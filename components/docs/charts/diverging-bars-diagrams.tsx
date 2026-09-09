"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Diverging Model SVG                                            */
/* -------------------------------------------------------------------------- */

export function DivergingModelDiagram() {
  const titleId = "diverging-model-title"
  const descId = "diverging-model-desc"

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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-blue-400" />
              ANALYTICAL MODEL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Signed Categorical Deviation
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            The Diverging Bar Model: Direction by Side, Magnitude by Length
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Analytical model of Diverging Bars showing values compared to an explicit baseline where position relative to the reference encodes direction (above, on, below) and bar length encodes deviation magnitude.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 280"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Diverging Bars Analytical Model</title>
          <desc>Diagram showing position relative to neutral baseline indicating direction and bar length representing deviation.</desc>

          {/* Background gridlines */}
          <line x1="160" y1="30" x2="160" y2="230" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="290" y1="30" x2="290" y2="230" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="550" y1="30" x2="550" y2="230" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="680" y1="30" x2="680" y2="230" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

          {/* Central Neutral Baseline Spine */}
          <line x1="420" y1="20" x2="420" y2="240" stroke="#3b82f6" strokeWidth="2.5" />
          <rect x="360" y="8" width="120" height="20" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
          <text x="420" y="22" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace" fontWeight="600">
            NEUTRAL REFERENCE (0)
          </text>

          {/* Category A: Positive / Above (+45) */}
          <text x="140" y="65" textAnchor="end" fill="#d4d4d8" fontSize="12" fontWeight="500">Region East</text>
          <path d="M 420,50 H 570 Q 574,50 574,54 V 76 Q 574,80 570,80 H 420 Z" fill="#3b82f6" opacity="0.85" />
          <text x="585" y="68" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">+45 (Above)</text>

          {/* Category B: Negative / Below (-30) */}
          <text x="140" y="115" textAnchor="end" fill="#d4d4d8" fontSize="12" fontWeight="500">Region West</text>
          <path d="M 324,100 H 420 V 130 H 324 Q 320,130 320,126 V 104 Q 320,100 324,100 Z" fill="#f97316" opacity="0.85" />
          <text x="310" y="118" textAnchor="end" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="600">−30 (Below)</text>

          {/* Category C: Exactly On Reference (0) */}
          <text x="140" y="165" textAnchor="end" fill="#d4d4d8" fontSize="12" fontWeight="500">Region Central</text>
          <circle cx="420" cy="165" r="5" fill="#a1a1aa" stroke="#ffffff" strokeWidth="1.5" />
          <text x="435" y="168" fill="#a1a1aa" fontSize="11" fontFamily="monospace" fontWeight="600">0 (On Reference)</text>

          {/* Category D: Positive (+20) */}
          <text x="140" y="215" textAnchor="end" fill="#d4d4d8" fontSize="12" fontWeight="500">Region North</text>
          <path d="M 420,200 H 490 Q 494,200 494,204 V 226 Q 494,230 490,230 H 420 Z" fill="#3b82f6" opacity="0.85" />
          <text x="505" y="218" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">+20 (Above)</text>

          {/* Bottom axis explanation */}
          <text x="250" y="265" textAnchor="middle" fill="#fdba74" fontSize="11" fontFamily="monospace">
            &larr; Extends Left: Below Reference
          </text>
          <text x="590" y="265" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="monospace">
            Extends Right: Above Reference &rarr;
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Raw Value vs Deviation SVG                                     */
/* -------------------------------------------------------------------------- */

export function RawValueVsDeviationDiagram() {
  const titleId = "raw-vs-dev-title"
  const descId = "raw-vs-dev-desc"

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
              MATHEMATICAL TRUTH
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Canonical Derivation
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Raw Consumer Value vs Derived Deviation: deviation = value - baseline
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Step-by-step diagram illustrating how input raw values are preserved untouched while deviation is derived by subtracting the baseline, showing that raw sign does not dictate direction.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 880 260"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Raw Value vs Deviation Derivation</title>
          <desc>Diagram showing calculation of deviation across positive and negative baselines.</desc>

          {/* Example 1: Positive Baseline (100) */}
          <g transform="translate(40, 20)">
            <rect x="0" y="0" width="380" height="200" rx="12" fill="#18181b" stroke="rgba(255,255,255,0.08)" />
            <text x="20" y="32" fill="#93c5fd" fontSize="12" fontFamily="monospace" fontWeight="600">
              EXAMPLE 1: Non-Zero Target (Baseline = 100)
            </text>

            <rect x="20" y="50" width="100" height="40" rx="6" fill="#27272a" />
            <text x="70" y="68" textAnchor="middle" fill="#a1a1aa" fontSize="10">Raw Value</text>
            <text x="70" y="83" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="monospace">80</text>

            <text x="140" y="75" textAnchor="middle" fill="#a1a1aa" fontSize="16">&minus;</text>

            <rect x="160" y="50" width="100" height="40" rx="6" fill="#27272a" />
            <text x="210" y="68" textAnchor="middle" fill="#a1a1aa" fontSize="10">Baseline</text>
            <text x="210" y="83" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="monospace">100</text>

            <text x="280" y="75" textAnchor="middle" fill="#a1a1aa" fontSize="16">=</text>

            <rect x="300" y="50" width="60" height="40" rx="6" fill="#f97316" fillOpacity="0.2" stroke="#f97316" />
            <text x="330" y="75" textAnchor="middle" fill="#fdba74" fontSize="14" fontWeight="700" fontFamily="monospace">&minus;20</text>

            <text x="20" y="125" fill="#e4e4e7" fontSize="11" fontWeight="500">
              Observation: <span className="text-amber-400 font-bold">Below Reference</span>
            </text>
            <text x="20" y="145" fill="#a1a1aa" fontSize="10">
              &bull; Raw value (+80) is positive, but sits 20 units below target.
            </text>
            <text x="20" y="165" fill="#a1a1aa" fontSize="10">
              &bull; Never classify direction using raw sign alone!
            </text>
          </g>

          {/* Example 2: Negative Baseline (-100) */}
          <g transform="translate(460, 20)">
            <rect x="0" y="0" width="380" height="200" rx="12" fill="#18181b" stroke="rgba(255,255,255,0.08)" />
            <text x="20" y="32" fill="#93c5fd" fontSize="12" fontFamily="monospace" fontWeight="600">
              EXAMPLE 2: Negative Baseline (Baseline = &minus;100)
            </text>

            <rect x="20" y="50" width="100" height="40" rx="6" fill="#27272a" />
            <text x="70" y="68" textAnchor="middle" fill="#a1a1aa" fontSize="10">Raw Value</text>
            <text x="70" y="83" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="monospace">&minus;80</text>

            <text x="140" y="75" textAnchor="middle" fill="#a1a1aa" fontSize="16">&minus;</text>

            <rect x="160" y="50" width="100" height="40" rx="6" fill="#27272a" />
            <text x="210" y="68" textAnchor="middle" fill="#a1a1aa" fontSize="10">Baseline</text>
            <text x="210" y="83" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="monospace">&minus;100</text>

            <text x="280" y="75" textAnchor="middle" fill="#a1a1aa" fontSize="16">=</text>

            <rect x="300" y="50" width="60" height="40" rx="6" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
            <text x="330" y="75" textAnchor="middle" fill="#93c5fd" fontSize="14" fontWeight="700" fontFamily="monospace">+20</text>

            <text x="20" y="125" fill="#e4e4e7" fontSize="11" fontWeight="500">
              Observation: <span className="text-blue-400 font-bold">Above Reference</span>
            </text>
            <text x="20" y="145" fill="#a1a1aa" fontSize="10">
              &bull; Raw value (&minus;80) is negative, but sits 20 units above reference.
            </text>
            <text x="20" y="165" fill="#a1a1aa" fontSize="10">
              &bull; True position: &minus;80 &minus; (&minus;100) = +20 (Above).
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Zero Baseline SVG                                              */
/* -------------------------------------------------------------------------- */

export function ZeroBaselineDiagram() {
  const titleId = "zero-baseline-title"
  const descId = "zero-baseline-desc"

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
              CANONICAL DEFAULT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Zero Neutral Spine
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Canonical Zero Baseline: Natural Positive and Negative Divergence
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Visualization of a zero baseline where values diverge around zero with symmetrical quantitative axis extents.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 800 220"
          className="w-full min-w-[640px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Zero Baseline Divergence</title>
          <desc>Bars extending symmetrically left and right around a zero reference spine.</desc>

          <line x1="400" y1="20" x2="400" y2="180" stroke="#71717a" strokeWidth="2" />
          <text x="400" y="15" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="monospace" fontWeight="600">0 (Zero Baseline)</text>

          {/* Row 1 */}
          <text x="220" y="55" textAnchor="end" fill="#e4e4e7" fontSize="12">Q1 Variance</text>
          <rect x="400" y="40" width="140" height="24" rx="3" fill="#3b82f6" />
          <text x="550" y="57" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">+14%</text>

          {/* Row 2 */}
          <text x="220" y="95" textAnchor="end" fill="#e4e4e7" fontSize="12">Q2 Variance</text>
          <rect x="310" y="80" width="90" height="24" rx="3" fill="#f97316" />
          <text x="300" y="97" textAnchor="end" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="600">−9%</text>

          {/* Row 3 */}
          <text x="220" y="135" textAnchor="end" fill="#e4e4e7" fontSize="12">Q3 Variance</text>
          <rect x="400" y="120" width="80" height="24" rx="3" fill="#3b82f6" />
          <text x="490" y="137" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">+8%</text>

          {/* Bottom axis */}
          <line x1="160" y1="180" x2="640" y2="180" stroke="#3f3f46" strokeWidth="1" />
          <text x="160" y="200" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">−20%</text>
          <text x="280" y="200" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">−10%</text>
          <text x="400" y="200" textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="monospace" fontWeight="600">0%</text>
          <text x="520" y="200" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">+10%</text>
          <text x="640" y="200" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">+20%</text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Non-Zero Reference SVG                                         */
/* -------------------------------------------------------------------------- */

export function NonZeroReferenceDiagram() {
  const titleId = "nonzero-ref-title"
  const descId = "nonzero-ref-desc"

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
              EXPLICIT BASELINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Target / SLA Centering
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Non-Zero Reference Baseline: Centering Geometry in Deviation Space
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing an API latency dataset with target SLA of 250ms where deviations are centered around 0 in rendered geometry.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 840 240"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Non-Zero Baseline Centering</title>
          <desc>Raw values compared against a 250ms target baseline rendering in zero-centered deviation space.</desc>

          {/* Central Baseline */}
          <line x1="420" y1="20" x2="420" y2="190" stroke="#6366f1" strokeWidth="2.5" />
          <rect x="340" y="10" width="160" height="22" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
          <text x="420" y="25" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontFamily="monospace" fontWeight="600">
            TARGET · 250 ms (0 dev)
          </text>

          {/* Service Auth: 210 ms -> -40 ms */}
          <text x="210" y="65" textAnchor="end" fill="#e4e4e7" fontSize="12">Auth (210ms)</text>
          <rect x="340" y="50" width="80" height="24" rx="3" fill="#f97316" />
          <text x="330" y="67" textAnchor="end" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="600">&minus;40 ms</text>

          {/* Service Search: 290 ms -> +40 ms */}
          <text x="210" y="105" textAnchor="end" fill="#e4e4e7" fontSize="12">Search (290ms)</text>
          <rect x="420" y="90" width="80" height="24" rx="3" fill="#3b82f6" />
          <text x="510" y="107" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">+40 ms</text>

          {/* Service Billing: 250 ms -> 0 ms */}
          <text x="210" y="145" textAnchor="end" fill="#e4e4e7" fontSize="12">Billing (250ms)</text>
          <circle cx="420" cy="152" r="5" fill="#a1a1aa" stroke="#ffffff" strokeWidth="1.5" />
          <text x="435" y="156" fill="#a1a1aa" fontSize="11" fontFamily="monospace" fontWeight="600">0 ms (On Target)</text>

          {/* Quantitative deviation axis */}
          <line x1="180" y1="190" x2="660" y2="190" stroke="#3f3f46" strokeWidth="1" />
          <text x="180" y="210" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">&minus;100 ms</text>
          <text x="300" y="210" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">&minus;50 ms</text>
          <text x="420" y="210" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontFamily="monospace" fontWeight="600">0 ms</text>
          <text x="540" y="210" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">+50 ms</text>
          <text x="660" y="210" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">+100 ms</text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 5: Negative Reference Example SVG                                 */
/* -------------------------------------------------------------------------- */

export function NegativeReferenceDiagram() {
  const titleId = "neg-ref-title"
  const descId = "neg-ref-desc"

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
              EDGE CASE VERIFICATION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Negative Reference Baseline
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Negative Baseline Reference: -80 is Above -100 Reference Baseline
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Demonstration showing how values are compared with a negative baseline (-100), where -80 produces a positive deviation (+20) and sits above the reference line.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 820 220"
          className="w-full min-w-[660px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Negative Reference Baseline</title>
          <desc>Deviation math and geometry when baseline is -100.</desc>

          <line x1="410" y1="20" x2="410" y2="180" stroke="#eab308" strokeWidth="2.5" />
          <rect x="310" y="8" width="200" height="22" rx="4" fill="#422006" stroke="#eab308" strokeWidth="1" />
          <text x="410" y="23" textAnchor="middle" fill="#fef08a" fontSize="10" fontFamily="monospace" fontWeight="600">
            REFERENCE · &minus;100 (0 dev)
          </text>

          {/* Obs A: -80 -> +20 */}
          <text x="210" y="65" textAnchor="end" fill="#e4e4e7" fontSize="12">Sensor A (&minus;80)</text>
          <rect x="410" y="50" width="80" height="24" rx="3" fill="#3b82f6" />
          <text x="500" y="67" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">+20 (Above Reference)</text>

          {/* Obs B: -120 -> -20 */}
          <text x="210" y="110" textAnchor="end" fill="#e4e4e7" fontSize="12">Sensor B (&minus;120)</text>
          <rect x="330" y="95" width="80" height="24" rx="3" fill="#f97316" />
          <text x="320" y="112" textAnchor="end" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="600">&minus;20 (Below Reference)</text>

          {/* Obs C: -100 -> 0 */}
          <text x="210" y="155" textAnchor="end" fill="#e4e4e7" fontSize="12">Sensor C (&minus;100)</text>
          <circle cx="410" cy="155" r="5" fill="#a1a1aa" stroke="#ffffff" strokeWidth="1.5" />
          <text x="425" y="159" fill="#a1a1aa" fontSize="11" fontFamily="monospace" fontWeight="600">0 (On Reference)</text>

          <line x1="200" y1="180" x2="620" y2="180" stroke="#3f3f46" strokeWidth="1" />
          <text x="210" y="200" fill="#71717a" fontSize="10" fontFamily="monospace">&minus;50 dev</text>
          <text x="410" y="200" textAnchor="middle" fill="#fef08a" fontSize="10" fontFamily="monospace" fontWeight="600">0 dev</text>
          <text x="610" y="200" textAnchor="end" fill="#71717a" fontSize="10" fontFamily="monospace">+50 dev</text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 6: Symmetric Domain SVG                                           */
/* -------------------------------------------------------------------------- */

export function SymmetricDomainDiagram() {
  const titleId = "symm-domain-title"
  const descId = "symm-domain-desc"

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
              PROPORTIONAL INTEGRITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Visual Comparability
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Symmetric Domain: Why Equal Geometric Lengths Must Represent Equal Magnitudes
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Visual comparison between an asymmetric domain and Plotcn symmetric domain, showing how asymmetric extents distort perception of magnitude across the baseline.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 260"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Symmetric vs Asymmetric Domain</title>
          <desc>Diagram showing magnitude distortion on asymmetric domains versus visual truth on symmetric domains.</desc>

          {/* Top: Asymmetric Domain (Misleading) */}
          <g transform="translate(40, 20)">
            <rect x="0" y="0" width="780" height="95" rx="8" fill="#18181b" stroke="rgba(255,255,255,0.06)" />
            <text x="20" y="24" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="600">
              ASYMMETRIC EXTENT: [&minus;20, +80] &mdash; MISLEADING VISUAL COMPARISON
            </text>

            <line x1="200" y1="35" x2="200" y2="85" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
            <text x="200" y="32" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">0</text>

            {/* -20 bar looks huge because negative span is only 20 */}
            <rect x="80" y="45" width="120" height="18" fill="#f97316" rx="2" />
            <text x="70" y="58" textAnchor="end" fill="#fdba74" fontSize="10" fontFamily="monospace">&minus;20 (120px)</text>

            {/* +80 bar is only 300px, so 120px / 300px ratio is distorted! */}
            <rect x="200" y="45" width="300" height="18" fill="#3b82f6" rx="2" />
            <text x="510" y="58" fill="#93c5fd" fontSize="10" fontFamily="monospace">+80 (300px)</text>

            <text x="640" y="60" fill="#f87171" fontSize="10">
              &minus;20 appears 40% as long as +80!
            </text>
          </g>

          {/* Bottom: Plotcn Symmetric Domain (Truthful) */}
          <g transform="translate(40, 135)">
            <rect x="0" y="0" width="780" height="95" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1" />
            <text x="20" y="24" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="600">
              PLOTCN SYMMETRIC EXTENT: [&minus;80, +80] &mdash; TRUTHFUL PROPORTIONAL COMPARISON
            </text>

            <line x1="390" y1="35" x2="390" y2="85" stroke="#3b82f6" strokeWidth="2" />
            <text x="390" y="32" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">0</text>

            {/* -20 bar is exactly 1/4 the length of +80 */}
            <rect x="315" y="45" width="75" height="18" fill="#f97316" rx="2" />
            <text x="305" y="58" textAnchor="end" fill="#fdba74" fontSize="10" fontFamily="monospace">&minus;20 (75px)</text>

            {/* +80 bar is exactly 4x the length of -20 */}
            <rect x="390" y="45" width="300" height="18" fill="#3b82f6" rx="2" />
            <text x="700" y="58" fill="#93c5fd" fontSize="10" fontFamily="monospace">+80 (300px)</text>

            <text x="20" y="80" fill="#a1a1aa" fontSize="10">
              Equal geometric distance from baseline = Equal deviation magnitude. Truthful at a glance.
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 7: Above / Below / On Reference SVG                               */
/* -------------------------------------------------------------------------- */

export function AboveBelowOnReferenceDiagram() {
  const titleId = "above-below-title"
  const descId = "above-below-desc"

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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-violet-400" />
              POSITIONAL SEMANTICS
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Three Distinct States
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Above Reference, Below Reference, and On Reference States
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Three semantic cards explaining above reference, on reference, and below reference states and their visual representation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/20 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-blue-500" />
            <span className="font-semibold text-blue-400 text-sm">Above Reference</span>
          </div>
          <p className="text-xs text-zinc-300 font-mono">deviation &gt; 0</p>
          <p className="text-xs text-zinc-400">
            Observation strictly exceeds the baseline. Bar extends outward into positive/right region with outer rounded cap.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-700/50 bg-zinc-900/40 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-zinc-400 border border-white" />
            <span className="font-semibold text-zinc-200 text-sm">On Reference</span>
          </div>
          <p className="text-xs text-zinc-300 font-mono">deviation = 0</p>
          <p className="text-xs text-zinc-400">
            Observation exactly matches reference. Rendered as a neutral baseline tick mark without artificial bar length.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-amber-500" />
            <span className="font-semibold text-amber-400 text-sm">Below Reference</span>
          </div>
          <p className="text-xs text-zinc-300 font-mono">deviation &lt; 0</p>
          <p className="text-xs text-zinc-400">
            Observation falls below the baseline. Bar extends outward into negative/left region with outer rounded cap.
          </p>
        </div>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 8: Missing vs On Reference SVG                                    */
/* -------------------------------------------------------------------------- */

export function MissingVsOnReferenceDiagram() {
  const titleId = "missing-vs-on-title"
  const descId = "missing-vs-on-desc"

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
              DATA SAFETY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Zero Deviation vs Missing
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Missing Value vs On Reference: Never Conflate Unavailable Data with Zero
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Side-by-side comparison showing that known zero deviation sits on the baseline with a tick mark, whereas missing or null data renders no bar and states unavailable in tooltips.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-white/[0.08] bg-zinc-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
            <span className="font-semibold text-zinc-100 text-sm">ON REFERENCE</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 font-semibold">
              VALID OBSERVATION
            </span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2 font-mono">
            <li>&bull; rawValue: <span className="text-white font-bold">100</span></li>
            <li>&bull; baseline: <span className="text-white font-bold">100</span></li>
            <li>&bull; deviation: <span className="text-white font-bold">0</span></li>
            <li>&bull; position: <span className="text-zinc-400">"equal"</span></li>
          </ul>
          <p className="mt-3 text-xs text-zinc-400">
            A real, finite metric was measured and exactly equals the baseline. Rendered with neutral tick mark.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/[0.08] bg-zinc-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
            <span className="font-semibold text-zinc-100 text-sm">MISSING / NULL</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
              UNAVAILABLE
            </span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2 font-mono">
            <li>&bull; rawValue: <span className="text-rose-400 font-bold">null / undefined</span></li>
            <li>&bull; baseline: <span className="text-white font-bold">100</span></li>
            <li>&bull; deviation: <span className="text-rose-400 font-bold">null</span></li>
            <li>&bull; position: <span className="text-rose-400">"unavailable"</span></li>
          </ul>
          <p className="mt-3 text-xs text-zinc-400">
            No observation recorded. Plotcn never substitutes 0. Category remains keyboard inspectable, displaying "Unavailable".
          </p>
        </div>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 9: Direction Is Not Judgment SVG                                  */
/* -------------------------------------------------------------------------- */

export function DirectionNotJudgmentDiagram() {
  const titleId = "direction-not-judgment-title"
  const descId = "direction-not-judgment-desc"

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
              DESIGN INTEGRITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Neutral Color &amp; Language
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Direction Is Position, Not Moral Judgment
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Callout showing that above reference is not automatically good and below is not automatically bad, warning against default red/green coloring.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 840 200"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Direction Is Not Judgment</title>
          <desc>Visual explanation showing why positive deviation does not imply good performance.</desc>

          {/* Metric A: Revenue (Above is desirable) */}
          <g transform="translate(40, 20)">
            <rect x="0" y="0" width="360" height="150" rx="10" fill="#18181b" stroke="rgba(255,255,255,0.08)" />
            <text x="20" y="30" fill="#93c5fd" fontSize="12" fontWeight="600">Metric A: Revenue vs Target</text>
            <text x="20" y="55" fill="#e4e4e7" fontSize="11">Above Reference (+15%):</text>
            <text x="170" y="55" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="600">Higher Revenue</text>
            <text x="20" y="75" fill="#e4e4e7" fontSize="11">Below Reference (&minus;10%):</text>
            <text x="170" y="75" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="600">Lower Revenue</text>
            <text x="20" y="115" fill="#71717a" fontSize="10" fontStyle="italic">
              Here, above reference may be desirable.
            </text>
          </g>

          {/* Metric B: API Latency (Below is desirable!) */}
          <g transform="translate(440, 20)">
            <rect x="0" y="0" width="360" height="150" rx="10" fill="#18181b" stroke="rgba(255,255,255,0.08)" />
            <text x="20" y="30" fill="#fdba74" fontSize="12" fontWeight="600">Metric B: API Latency vs SLA Target</text>
            <text x="20" y="55" fill="#e4e4e7" fontSize="11">Above Reference (+60ms):</text>
            <text x="180" y="55" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="600">Slower (Degraded)</text>
            <text x="20" y="75" fill="#e4e4e7" fontSize="11">Below Reference (&minus;40ms):</text>
            <text x="180" y="75" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="600">Faster (Better)</text>
            <text x="20" y="115" fill="#71717a" fontSize="10" fontStyle="italic">
              Here, below reference is the desirable outcome!
            </text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 10: Horizontal vs Vertical Orientation SVG                        */
/* -------------------------------------------------------------------------- */

export function DivergingOrientationDiagram() {
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
              LAYOUT STRATEGY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Horizontal &amp; Vertical
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Orientation Layouts: Horizontal Left/Right vs Vertical Above/Below
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Side-by-side diagrams of horizontal diverging layout (bars extending left and right from vertical baseline) versus vertical layout (bars rising and falling from horizontal baseline).
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 860 260"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Horizontal vs Vertical Orientation</title>
          <desc>Comparison of horizontal and vertical DivergingBars layout.</desc>

          {/* Left: Horizontal Layout */}
          <g transform="translate(30, 20)">
            <rect x="0" y="0" width="380" height="210" rx="10" fill="#18181b" stroke="rgba(255,255,255,0.08)" />
            <text x="20" y="28" fill="#ffffff" fontSize="12" fontWeight="600">Horizontal (Default)</text>
            <text x="20" y="44" fill="#a1a1aa" fontSize="10">Categories on Y, Left/Right Divergence</text>

            <line x1="200" y1="60" x2="200" y2="180" stroke="#3b82f6" strokeWidth="2" />
            <text x="200" y="56" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">Reference</text>

            {/* Bars */}
            <rect x="130" y="70" width="70" height="16" rx="2" fill="#f97316" />
            <text x="120" y="82" textAnchor="end" fill="#71717a" fontSize="9">Cat A</text>

            <rect x="200" y="100" width="110" height="16" rx="2" fill="#3b82f6" />
            <text x="120" y="112" textAnchor="end" fill="#71717a" fontSize="9">Cat B</text>

            <circle cx="200" cy="138" r="3" fill="#a1a1aa" />
            <text x="120" y="142" textAnchor="end" fill="#71717a" fontSize="9">Cat C</text>

            <rect x="160" y="155" width="40" height="16" rx="2" fill="#f97316" />
            <text x="120" y="167" textAnchor="end" fill="#71717a" fontSize="9">Cat D</text>
          </g>

          {/* Right: Vertical Layout */}
          <g transform="translate(450, 20)">
            <rect x="0" y="0" width="380" height="210" rx="10" fill="#18181b" stroke="rgba(255,255,255,0.08)" />
            <text x="20" y="28" fill="#ffffff" fontSize="12" fontWeight="600">Vertical Layout</text>
            <text x="20" y="44" fill="#a1a1aa" fontSize="10">Categories on X, Up/Down Divergence</text>

            <line x1="40" y1="120" x2="340" y2="120" stroke="#3b82f6" strokeWidth="2" />
            <text x="345" y="123" fill="#93c5fd" fontSize="9" fontFamily="monospace">Ref</text>

            {/* Cat A: Below */}
            <rect x="70" y="120" width="24" height="45" rx="2" fill="#f97316" />
            <text x="82" y="180" textAnchor="middle" fill="#71717a" fontSize="9">Cat A</text>

            {/* Cat B: Above */}
            <rect x="140" y="65" width="24" height="55" rx="2" fill="#3b82f6" />
            <text x="152" y="180" textAnchor="middle" fill="#71717a" fontSize="9">Cat B</text>

            {/* Cat C: Zero */}
            <circle cx="222" cy="120" r="3" fill="#a1a1aa" />
            <text x="222" y="180" textAnchor="middle" fill="#71717a" fontSize="9">Cat C</text>

            {/* Cat D: Above */}
            <rect x="280" y="85" width="24" height="35" rx="2" fill="#3b82f6" />
            <text x="292" y="180" textAnchor="middle" fill="#71717a" fontSize="9">Cat D</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 11: Category Hit Region SVG                                       */
/* -------------------------------------------------------------------------- */

export function CategoryHitRegionDiagram() {
  const titleId = "hit-region-title"
  const descId = "hit-region-desc"

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
              INTERACTION ERGONOMICS
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Touch &amp; Cursor Safety
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Category Band Hit Testing: Forgiving Interaction for Zero and Tiny Bars
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Illustration showing that the interaction surface spans the full category band height and width, enabling easy targeting of tiny or zero-magnitude values on mobile and touch devices.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 820 220"
          className="w-full min-w-[660px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Category Band Hit Regions</title>
          <desc>Diagram contrasting small bar geometry with the expansive category interaction band.</desc>

          {/* Full Category Band */}
          <rect x="60" y="40" width="700" height="70" rx="8" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeDasharray="4 4" />
          <text x="80" y="60" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">
            CATEGORY INTERACTION BAND (44px+ TOUCH HIT REGION)
          </text>

          {/* Baseline */}
          <line x1="410" y1="30" x2="410" y2="190" stroke="#71717a" strokeWidth="2" />
          <text x="410" y="25" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Baseline</text>

          {/* Tiny visible bar (+0.05) */}
          <rect x="410" y="70" width="6" height="24" rx="2" fill="#3b82f6" />
          <text x="424" y="86" fill="#93c5fd" fontSize="11" fontFamily="monospace">+0.05 (Tiny Bar)</text>

          <text x="80" y="95" fill="#a1a1aa" fontSize="10">
            Pointer anywhere inside this generous band activates the category tooltip.
          </text>
          <text x="80" y="160" fill="#e4e4e7" fontSize="11">
            &bull; No need to pinpoint tiny 6px bar geometry with a finger.
          </text>
          <text x="80" y="180" fill="#e4e4e7" fontSize="11">
            &bull; Zero deviation bars are easily tapped and inspected.
          </text>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 12: Data Update Crossing Baseline SVG                             */
/* -------------------------------------------------------------------------- */

export function DataUpdateCrossingBaselineDiagram() {
  const titleId = "crossing-title"
  const descId = "crossing-desc"

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
              ANIMATION SAFETY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              No Baseline Overshoot
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Baseline Crossing Animation: Contraction and Expansion Without Teleportation
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Step-by-step animation lifecycle showing a bar transitioning from positive (+20) to negative (-10) by contracting toward the baseline and expanding into negative space.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 840 200"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Baseline Crossing Animation</title>
          <desc>Visual explanation of compliant baseline crossing animation.</desc>

          {/* Baseline */}
          <line x1="420" y1="20" x2="420" y2="180" stroke="#71717a" strokeWidth="2" />
          <text x="420" y="15" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">Baseline (0)</text>

          {/* Phase 1: +20 */}
          <g transform="translate(0, 40)">
            <text x="180" y="18" textAnchor="end" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="600">
              State 1: +20
            </text>
            <rect x="420" y="5" width="120" height="20" rx="3" fill="#3b82f6" />
          </g>

          {/* Phase 2: Contracts to 0 */}
          <g transform="translate(0, 85)">
            <text x="180" y="18" textAnchor="end" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
              Transition: Contracts &rarr; 0
            </text>
            <circle cx="420" cy="15" r="4" fill="#a1a1aa" />
          </g>

          {/* Phase 3: Expands to -10 */}
          <g transform="translate(0, 130)">
            <text x="180" y="18" textAnchor="end" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="600">
              State 2: &minus;10
            </text>
            <rect x="360" y="5" width="60" height="20" rx="3" fill="#f97316" />
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 13: Rendering Architecture SVG                                    */
/* -------------------------------------------------------------------------- */

export function DivergingArchitectureFlowDiagram() {
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
              End-to-End Architecture
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            DivergingBars Rendering Pipeline: From Raw Observations to Directional SVG
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        System architecture diagram detailing consumer records input, validation of finite baseline, deviation derivation, classification, symmetric domain calculation, and Recharts SVG rendering.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 300"
          className="w-full min-w-[720px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          <title>Diverging Bars Architecture Flow</title>
          <desc>Pipeline showing data normalization, deviation math, symmetric domaining, and Recharts rendering.</desc>

          {/* Node 1: Consumer Data */}
          <rect x="20" y="100" width="130" height="70" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="85" y="130" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">Consumer Data</text>
          <text x="85" y="148" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">readonly TData[]</text>

          <line x1="150" y1="135" x2="190" y2="135" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 2: Validate Baseline */}
          <rect x="190" y="100" width="140" height="70" rx="8" fill="#18181b" stroke="rgba(255,255,255,0.1)" />
          <text x="260" y="125" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">Validate Baseline</text>
          <text x="260" y="142" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">Number.isFinite</text>
          <text x="260" y="156" textAnchor="middle" fill="#71717a" fontSize="8">Reject NaN/Infinity</text>

          <line x1="330" y1="135" x2="370" y2="135" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 3: Deviation Derivation */}
          <rect x="370" y="100" width="150" height="70" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="445" y="125" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">Deviation Derivation</text>
          <text x="445" y="142" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">dev = val &minus; baseline</text>
          <text x="445" y="156" textAnchor="middle" fill="#71717a" fontSize="8">above / on / below</text>

          <line x1="520" y1="135" x2="560" y2="135" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 4: Symmetric Domain */}
          <rect x="560" y="100" width="150" height="70" rx="8" fill="#18181b" stroke="rgba(255,255,255,0.1)" />
          <text x="635" y="125" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">Symmetric Domain</text>
          <text x="635" y="142" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">[-niceMax, +niceMax]</text>
          <text x="635" y="156" textAnchor="middle" fill="#71717a" fontSize="8">Equal side distances</text>

          <line x1="710" y1="135" x2="750" y2="135" stroke="#71717a" strokeWidth="1.5" />

          {/* Node 5: SVG Rendering */}
          <rect x="750" y="100" width="150" height="70" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
          <text x="825" y="125" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="600">Recharts SVG Bar</text>
          <text x="825" y="142" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">Custom Shape Caps</text>
          <text x="825" y="156" textAnchor="middle" fill="#71717a" fontSize="8">Band Hit Testing</text>
        </svg>
      </div>
    </figure>
  )
}
