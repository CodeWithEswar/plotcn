"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Ranking Pipeline & Transformation Lifecycle                   */
/* -------------------------------------------------------------------------- */

export function RankingPipelineDiagram() {
  const titleId = "rank-pipeline-title"
  const descId = "rank-pipeline-desc"

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
              RANKING PIPELINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Immutable · Deterministic · Ordered
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Deterministic Ranking Pipeline: From Raw Records to Ordered Geometry
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Data flow diagram showing input records validating finite numeric measures, attaching original indices, sorting stably by value, optionally slicing top-N rows, and rendering horizontal bars with ordinal rank numbers.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 340"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Defs: Gradients and Markers */}
          <defs>
            <marker
              id="pipe-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#71717a" />
            </marker>
            <linearGradient id="pipe-card-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Step 1: Input Data */}
          <g transform="translate(30, 40)">
            <rect
              width="150"
              height="240"
              rx="12"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1.5"
            />
            <rect width="150" height="36" rx="12" fill="#27272a" opacity="0.6" />
            <text x="16" y="24" className="text-[11px] font-mono font-semibold fill-zinc-300">
              1. CONSUMER DATA
            </text>

            <g transform="translate(14, 54)">
              <rect width="122" height="36" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="10" y="18" className="text-[11px] font-medium fill-zinc-300">A: $80k</text>
              <text x="10" y="30" className="text-[9px] font-mono fill-zinc-500">orig index: 0</text>
            </g>

            <g transform="translate(14, 100)">
              <rect width="122" height="36" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="10" y="18" className="text-[11px] font-medium fill-zinc-300">B: $120k</text>
              <text x="10" y="30" className="text-[9px] font-mono fill-zinc-500">orig index: 1</text>
            </g>

            <g transform="translate(14, 146)">
              <rect width="122" height="36" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="10" y="18" className="text-[11px] font-medium fill-zinc-300">C: $100k</text>
              <text x="10" y="30" className="text-[9px] font-mono fill-zinc-500">orig index: 2</text>
            </g>

            <g transform="translate(14, 192)">
              <rect width="122" height="36" rx="6" fill="#09090b" stroke="#ef4444" strokeOpacity="0.3" strokeDasharray="3 3" />
              <text x="10" y="18" className="text-[11px] font-medium fill-red-400">D: null</text>
              <text x="10" y="30" className="text-[9px] font-mono fill-red-400/70">unavailable</text>
            </g>
          </g>

          {/* Connector 1 -> 2 */}
          <line x1="180" y1="160" x2="225" y2="160" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 2: Validation & Index Attachment */}
          <g transform="translate(230, 70)">
            <rect
              width="170"
              height="180"
              rx="12"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1.5"
            />
            <rect width="170" height="36" rx="12" fill="#27272a" opacity="0.6" />
            <text x="16" y="24" className="text-[11px] font-mono font-semibold fill-zinc-300">
              2. VALIDATION
            </text>

            <text x="16" y="65" className="text-[11px] font-medium fill-zinc-300">
              Extract finite numbers:
            </text>
            <text x="16" y="85" className="text-[10px] font-mono fill-emerald-400">
              ✓ Rankable: 3 items
            </text>
            <text x="16" y="105" className="text-[10px] font-mono fill-red-400">
              ✗ Unavailable: 1 item
            </text>

            <path d="M 16 125 L 154 125" stroke="#27272a" strokeWidth="1" />
            <text x="16" y="145" className="text-[10px] font-mono fill-zinc-400">
              Caller array is never
            </text>
            <text x="16" y="160" className="text-[10px] font-mono font-semibold fill-amber-400">
              mutated or sorted in-place
            </text>
          </g>

          {/* Connector 2 -> 3 */}
          <line x1="400" y1="160" x2="445" y2="160" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 3: Stable Sorting */}
          <g transform="translate(450, 40)">
            <rect
              width="180"
              height="240"
              rx="12"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1.5"
            />
            <rect width="180" height="36" rx="12" fill="#27272a" opacity="0.6" />
            <text x="16" y="24" className="text-[11px] font-mono font-semibold fill-zinc-300">
              3. STABLE SORT
            </text>

            <g transform="translate(14, 54)">
              <rect width="152" height="42" rx="6" fill="#09090b" stroke="#3b82f6" strokeOpacity="0.4" />
              <text x="10" y="18" className="text-[10px] font-mono font-bold fill-blue-400">#1 B · $120k</text>
              <text x="10" y="32" className="text-[9px] font-mono fill-zinc-500">Highest value (desc)</text>
            </g>

            <g transform="translate(14, 106)">
              <rect width="152" height="42" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="10" y="18" className="text-[10px] font-mono font-bold fill-zinc-300">#2 C · $100k</text>
              <text x="10" y="32" className="text-[9px] font-mono fill-zinc-500">Middle rank</text>
            </g>

            <g transform="translate(14, 158)">
              <rect width="152" height="42" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="10" y="18" className="text-[10px] font-mono font-bold fill-zinc-300">#3 A · $80k</text>
              <text x="10" y="32" className="text-[9px] font-mono fill-zinc-500">Lowest rank</text>
            </g>

            <text x="14" y="222" className="text-[9px] font-mono fill-zinc-400">
              Ties use origIndex tiebreaker
            </text>
          </g>

          {/* Connector 3 -> 4 */}
          <line x1="630" y1="160" x2="675" y2="160" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#pipe-arrow)" />

          {/* Step 4: Final Horizontal Geometry */}
          <g transform="translate(680, 40)">
            <rect
              width="210"
              height="240"
              rx="12"
              fill="url(#pipe-card-glow)"
              stroke="#3b82f6"
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />
            <rect width="210" height="36" rx="12" fill="#27272a" opacity="0.6" />
            <text x="16" y="24" className="text-[11px] font-mono font-semibold fill-blue-300">
              4. RANKED BARS
            </text>

            {/* Row 1 */}
            <g transform="translate(14, 58)">
              <text x="0" y="16" className="text-[11px] font-mono font-bold fill-zinc-400">#1</text>
              <text x="22" y="16" className="text-[11px] font-medium fill-zinc-200">B</text>
              <rect x="38" y="4" width="105" height="16" rx="3" fill="#3b82f6" />
              <text x="148" y="16" className="text-[10px] font-mono fill-zinc-300">120k</text>
            </g>

            {/* Row 2 */}
            <g transform="translate(14, 102)">
              <text x="0" y="16" className="text-[11px] font-mono font-bold fill-zinc-400">#2</text>
              <text x="22" y="16" className="text-[11px] font-medium fill-zinc-200">C</text>
              <rect x="38" y="4" width="85" height="16" rx="3" fill="#3b82f6" />
              <text x="128" y="16" className="text-[10px] font-mono fill-zinc-300">100k</text>
            </g>

            {/* Row 3 */}
            <g transform="translate(14, 146)">
              <text x="0" y="16" className="text-[11px] font-mono font-bold fill-zinc-400">#3</text>
              <text x="22" y="16" className="text-[11px] font-medium fill-zinc-200">A</text>
              <rect x="38" y="4" width="65" height="16" rx="3" fill="#3b82f6" />
              <text x="108" y="16" className="text-[10px] font-mono fill-zinc-300">80k</text>
            </g>

            {/* Summary badge */}
            <g transform="translate(14, 196)">
              <rect width="182" height="26" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="10" y="17" className="text-[10px] font-mono fill-zinc-400">
                Context: 3 ranked · 1 unavailable
              </text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Top-N Semantics & Truthful Omission Disclosure                 */
/* -------------------------------------------------------------------------- */

export function TopNSemanticsDiagram() {
  const titleId = "topn-semantics-title"
  const descId = "topn-semantics-desc"

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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-blue-400" />
              TOP-N SLICING
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Truthful Omission Context
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Top-N Semantics: Displaying a Focused Subset Without Erasing Reality
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison diagram illustrating a full ranked set of 8 items sliced by topN=5. The top 5 items are prominently rendered as active bars, while items 6 through 8 are disclosed as omitted rather than denied.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 320"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Panel 1: Full Ranked Universe (8 items) */}
          <g transform="translate(30, 20)">
            <rect
              width="400"
              height="270"
              rx="12"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1.5"
            />
            <text x="20" y="32" className="text-xs font-mono font-semibold uppercase fill-zinc-400">
              Full Ranked Universe (8 Categories)
            </text>

            {[
              { rank: "#1", label: "Enterprise Platform", val: 240, w: 180, active: true },
              { rank: "#2", label: "Professional Services", val: 210, w: 155, active: true },
              { rank: "#3", label: "Data Infrastructure", val: 190, w: 135, active: true },
              { rank: "#4", label: "Security Suite", val: 160, w: 110, active: true },
              { rank: "#5", label: "Core Cloud Compute", val: 130, w: 90, active: true },
              { rank: "#6", label: "Customer Operations", val: 95, w: 65, active: false },
              { rank: "#7", label: "Partner Integrations", val: 70, w: 48, active: false },
              { rank: "#8", label: "Legacy Storage", val: 40, w: 26, active: false },
            ].map((row, idx) => (
              <g key={row.rank} transform={`translate(20, ${52 + idx * 26})`}>
                <text x="0" y="14" className={`text-[10px] font-mono ${row.active ? "fill-blue-400 font-bold" : "fill-zinc-500"}`}>
                  {row.rank}
                </text>
                <text x="24" y="14" className={`text-[11px] ${row.active ? "fill-zinc-200" : "fill-zinc-500"}`}>
                  {row.label}
                </text>
                <rect
                  x="180"
                  y="4"
                  width={row.w}
                  height="12"
                  rx="2"
                  fill={row.active ? "#3b82f6" : "#3f3f46"}
                  opacity={row.active ? 1 : 0.4}
                />
              </g>
            ))}
          </g>

          {/* Slicing Bracket / Action in the middle */}
          <g transform="translate(445, 120)">
            <path
              d="M 10 0 L 25 25 L 10 50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text x="-5" y="-15" textAnchor="middle" className="text-[10px] font-mono font-bold fill-blue-400">
              topN = 5
            </text>
            <text x="-5" y="70" textAnchor="middle" className="text-[9px] font-mono fill-zinc-500">
              slice(0, 5)
            </text>
          </g>

          {/* Panel 2: Rendered Output with Truthful Disclosure */}
          <g transform="translate(490, 20)">
            <rect
              width="400"
              height="270"
              rx="12"
              fill="#18181b"
              stroke="#3b82f6"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            <text x="20" y="32" className="text-xs font-mono font-semibold uppercase fill-blue-400">
              Visible Output (Top 5 of 8)
            </text>

            {[
              { rank: "#1", label: "Enterprise Platform", val: "$240k", w: 180 },
              { rank: "#2", label: "Professional Services", val: "$210k", w: 155 },
              { rank: "#3", label: "Data Infrastructure", val: "$190k", w: 135 },
              { rank: "#4", label: "Security Suite", val: "$160k", w: 110 },
              { rank: "#5", label: "Core Cloud Compute", val: "$130k", w: 90 },
            ].map((row, idx) => (
              <g key={row.rank} transform={`translate(20, ${54 + idx * 34})`}>
                <text x="0" y="16" className="text-[11px] font-mono font-bold fill-blue-400">
                  {row.rank}
                </text>
                <text x="26" y="16" className="text-[11px] font-medium fill-zinc-200">
                  {row.label}
                </text>
                <rect x="180" y="4" width={row.w} height="16" rx="3" fill="#3b82f6" />
                <text x={188 + row.w} y="16" className="text-[10px] font-mono fill-zinc-300">
                  {row.val}
                </text>
              </g>
            ))}

            {/* Omission Context Banner */}
            <g transform="translate(20, 226)">
              <rect width="360" height="28" rx="6" fill="#27272a" opacity="0.6" />
              <circle cx="16" cy="14" r="4" fill="#f59e0b" />
              <text x="28" y="18" className="text-[10px] font-mono fill-zinc-300">
                Disclosed: 3 categories omitted from visual ranking
              </text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Tie-Stability Guarantee (Preserving Input Order)              */
/* -------------------------------------------------------------------------- */

export function TieStabilityDiagram() {
  const titleId = "tie-stability-title"
  const descId = "tie-stability-desc"

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
              TIE-STABILITY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Original Index Tiebreaker
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Deterministic Ties: Preserving Caller Order Without Arbitrary Shuffling
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Technical diagram showing that when two records share identical quantitative values, their relative ordering in the ranked output strictly preserves their original caller input index.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Defs */}
          <defs>
            <marker
              id="tie-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Left: Input Array */}
          <g transform="translate(40, 30)">
            <rect width="360" height="210" rx="12" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="20" y="32" className="text-xs font-mono font-semibold uppercase fill-zinc-400">
              Input Array (Caller Sequence)
            </text>

            <g transform="translate(20, 52)">
              <rect width="320" height="42" rx="6" fill="#09090b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="14" y="22" className="text-xs font-semibold fill-amber-300">Alpha: 100 req/s</text>
              <text x="14" y="34" className="text-[9px] font-mono fill-zinc-500">originalIndex = 0 (Encountered first)</text>
            </g>

            <g transform="translate(20, 102)">
              <rect width="320" height="42" rx="6" fill="#09090b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="14" y="22" className="text-xs font-semibold fill-amber-300">Beta: 100 req/s</text>
              <text x="14" y="34" className="text-[9px] font-mono fill-zinc-500">originalIndex = 1 (Encountered second)</text>
            </g>

            <g transform="translate(20, 152)">
              <rect width="320" height="42" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="14" y="22" className="text-xs font-medium fill-zinc-300">Gamma: 90 req/s</text>
              <text x="14" y="34" className="text-[9px] font-mono fill-zinc-500">originalIndex = 2</text>
            </g>
          </g>

          {/* Connecting Arrows */}
          <path
            d="M 380 102 C 450 102, 470 102, 510 102"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#tie-arrow)"
          />
          <path
            d="M 380 152 C 450 152, 470 152, 510 152"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#tie-arrow)"
          />

          {/* Right: Stable Ranked Output */}
          <g transform="translate(520, 30)">
            <rect width="360" height="210" rx="12" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="20" y="32" className="text-xs font-mono font-semibold uppercase fill-emerald-400">
              Stable Ranked Output (Descending)
            </text>

            <g transform="translate(20, 52)">
              <rect width="320" height="42" rx="6" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
              <text x="12" y="22" className="text-xs font-mono font-bold fill-emerald-400">#1</text>
              <text x="36" y="22" className="text-xs font-semibold fill-zinc-100">Alpha — 100 req/s</text>
              <text x="36" y="34" className="text-[9px] font-mono fill-emerald-400/70">Preserved as #1 via originalIndex = 0</text>
            </g>

            <g transform="translate(20, 102)">
              <rect width="320" height="42" rx="6" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
              <text x="12" y="22" className="text-xs font-mono font-bold fill-emerald-400">#2</text>
              <text x="36" y="22" className="text-xs font-semibold fill-zinc-100">Beta — 100 req/s</text>
              <text x="36" y="34" className="text-[9px] font-mono fill-emerald-400/70">Preserved as #2 via originalIndex = 1</text>
            </g>

            <g transform="translate(20, 152)">
              <rect width="320" height="42" rx="6" fill="#09090b" stroke="#27272a" />
              <text x="12" y="22" className="text-xs font-mono font-bold fill-zinc-400">#3</text>
              <text x="36" y="22" className="text-xs font-medium fill-zinc-300">Gamma — 90 req/s</text>
              <text x="36" y="34" className="text-[9px] font-mono fill-zinc-500">originalIndex = 2</text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Horizontal Row Anatomy & Forgiving Hit Regions                 */
/* -------------------------------------------------------------------------- */

export function HorizontalRowHitRegionDiagram() {
  const titleId = "row-hit-title"
  const descId = "row-hit-desc"

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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-purple-400" />
              INTERACTION ANATOMY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Row Hit Region vs. Bar Geometry
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Horizontal Row Hit Testing: Full-Band Activation Without Distorting Data
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Anatomical diagram decomposing a ranked horizontal row into rank gutter, category label, quantitative bar, value label, and forgiving 44px interaction band.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* The Active Row Container (44px hit region) */}
          <g transform="translate(40, 40)">
            {/* Expanded Hit Region Box */}
            <rect
              width="840"
              height="80"
              rx="10"
              fill="#27272a"
              fillOpacity="0.4"
              stroke="#8b5cf6"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text x="20" y="24" className="text-[10px] font-mono font-semibold uppercase fill-purple-400">
              Forgiving 44px+ Interaction Band (Pointer & Touch Target)
            </text>

            {/* Row Components */}
            <g transform="translate(20, 36)">
              {/* 1. Rank Gutter */}
              <rect width="36" height="28" rx="4" fill="#09090b" stroke="#3f3f46" />
              <text x="18" y="18" textAnchor="middle" className="text-xs font-mono font-bold fill-zinc-200">
                #1
              </text>

              {/* 2. Long Category Label */}
              <text x="50" y="18" className="text-xs font-semibold fill-zinc-100">
                Enterprise Customer Success Operations Platform
              </text>

              {/* 3. Bar Plot */}
              <rect x="420" y="4" width="260" height="20" rx="4" fill="#3b82f6" />

              {/* 4. Value Label */}
              <text x="690" y="18" className="text-xs font-mono font-bold fill-zinc-200">
                $184,200
              </text>
            </g>
          </g>

          {/* Callout Annotations */}
          <g transform="translate(40, 160)">
            {/* Callout 1: Rank */}
            <g transform="translate(20, 0)">
              <line x1="18" y1="-30" x2="18" y2="10" stroke="#71717a" strokeWidth="1" />
              <circle cx="18" cy="10" r="3" fill="#71717a" />
              <text x="18" y="30" textAnchor="middle" className="text-[10px] font-mono fill-zinc-400">
                1. Fixed Rank Gutter
              </text>
            </g>

            {/* Callout 2: Long Label */}
            <g transform="translate(200, 0)">
              <line x1="20" y1="-30" x2="20" y2="10" stroke="#71717a" strokeWidth="1" />
              <circle cx="20" cy="10" r="3" fill="#71717a" />
              <text x="20" y="30" textAnchor="middle" className="text-[10px] font-mono fill-zinc-400">
                2. Unclipped Category Label
              </text>
            </g>

            {/* Callout 3: Truthful Bar */}
            <g transform="translate(560, 0)">
              <line x1="20" y1="-30" x2="20" y2="10" stroke="#71717a" strokeWidth="1" />
              <circle cx="20" cy="10" r="3" fill="#71717a" />
              <text x="20" y="30" textAnchor="middle" className="text-[10px] font-mono fill-zinc-400">
                3. Truthful Quantitative Geometry
              </text>
            </g>

            {/* Callout 4: Value */}
            <g transform="translate(740, 0)">
              <line x1="20" y1="-30" x2="20" y2="10" stroke="#71717a" strokeWidth="1" />
              <circle cx="20" cy="10" r="3" fill="#71717a" />
              <text x="20" y="30" textAnchor="middle" className="text-[10px] font-mono fill-zinc-400">
                4. End Value Label
              </text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 5: Rendering Architecture Flow Diagram                           */
/* -------------------------------------------------------------------------- */

export function RankBarsArchitectureFlowDiagram() {
  const titleId = "rank-arch-title"
  const descId = "rank-arch-desc"

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
              RENDERING ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Component Lifecycle & Reactive State Flow
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Complete Rank Bars Lifecycle & Dual-Tier Accessibility Architecture
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Architecture flow diagram detailing data validation, stable numeric sort, top-N limit, Recharts BarChart composition, row-level interaction handling, and dual-tier accessibility with screen reader tables.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox="0 0 920 380"
          className="w-full min-w-[700px] h-auto text-zinc-200 select-none font-sans"
          aria-hidden="true"
        >
          {/* Defs */}
          <defs>
            <marker
              id="arch-flow-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#71717a" />
            </marker>
          </defs>

          {/* Row 1: Data & Validation */}
          <g transform="translate(60, 30)">
            <rect width="220" height="64" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-zinc-300">CONSUMER DATA</text>
            <text x="16" y="44" className="text-[10px] font-mono fill-zinc-500">Readonly records · categoryKey + series</text>
          </g>

          <line x1="280" y1="62" x2="350" y2="62" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arch-flow-arrow)" />

          <g transform="translate(350, 30)">
            <rect width="220" height="64" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-zinc-300">VALIDATION & ISOLATION</text>
            <text x="16" y="44" className="text-[10px] font-mono fill-emerald-400">Finite numbers separated from null/NaN</text>
          </g>

          <line x1="570" y1="62" x2="640" y2="62" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arch-flow-arrow)" />

          <g transform="translate(640, 30)">
            <rect width="220" height="64" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-blue-400">STABLE NUMERIC SORT</text>
            <text x="16" y="44" className="text-[10px] font-mono fill-zinc-400">desc/asc · tiebreak: originalIndex</text>
          </g>

          {/* Row 2: Projection & Scale */}
          <line x1="750" y1="94" x2="750" y2="140" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arch-flow-arrow)" />

          <g transform="translate(640, 140)">
            <rect width="220" height="64" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-zinc-300">TOP-N SLICE & DOMAIN</text>
            <text x="16" y="44" className="text-[10px] font-mono fill-zinc-400">Slice top N · Zero-inclusive domain</text>
          </g>

          <line x1="640" y1="172" x2="570" y2="172" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arch-flow-arrow)" />

          <g transform="translate(350, 140)">
            <rect width="220" height="64" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-zinc-300">RECHARTS BAR CHART</text>
            <text x="16" y="44" className="text-[10px] font-mono fill-zinc-400">layout="vertical" · Custom Y-Axis tick</text>
          </g>

          <line x1="350" y1="172" x2="280" y2="172" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arch-flow-arrow)" />

          <g transform="translate(60, 140)">
            <rect width="220" height="64" rx="8" fill="#18181b" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-purple-400">ROW HIT TESTING LAYER</text>
            <text x="16" y="44" className="text-[10px] font-mono fill-zinc-400">Pointer move + touch + Up/Down keys</text>
          </g>

          {/* Row 3: Output Channels */}
          <line x1="170" y1="204" x2="170" y2="250" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arch-flow-arrow)" />

          <g transform="translate(60, 250)">
            <rect width="240" height="90" rx="8" fill="#09090b" stroke="#27272a" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-emerald-400">SYNCHRONIZED TOOLTIP</text>
            <text x="16" y="46" className="text-[10px] font-mono fill-zinc-300">#Rank · Category Title</text>
            <text x="16" y="62" className="text-[10px] font-mono fill-zinc-400">Series Measure: Exact Formatted Value</text>
            <text x="16" y="78" className="text-[10px] font-mono fill-zinc-500">Omission context: X of Y displayed</text>
          </g>

          <g transform="translate(340, 250)">
            <rect width="240" height="90" rx="8" fill="#09090b" stroke="#27272a" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-blue-400">INTERACTIVE ROW HIGHLIGHT</text>
            <text x="16" y="46" className="text-[10px] font-mono fill-zinc-300">Active selectionColor border</text>
            <text x="16" y="62" className="text-[10px] font-mono fill-zinc-400">Bold Y-axis rank numeral</text>
            <text x="16" y="78" className="text-[10px] font-mono fill-zinc-500">Unchanged bar geometry</text>
          </g>

          <g transform="translate(620, 250)">
            <rect width="240" height="90" rx="8" fill="#09090b" stroke="#27272a" />
            <text x="16" y="26" className="text-xs font-mono font-bold fill-purple-400">ACCESSIBILITY SHELL</text>
            <text x="16" y="46" className="text-[10px] font-mono fill-zinc-300">Offscreen HTML &lt;table&gt;</text>
            <text x="16" y="62" className="text-[10px] font-mono fill-zinc-400">Polite ARIA live announcements</text>
            <text x="16" y="78" className="text-[10px] font-mono fill-zinc-500">1 tab stop · Up/Down navigation</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}
