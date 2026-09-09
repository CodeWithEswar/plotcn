"use client"

import React from "react"

/**
 * Diagram 1: Area Magnitude Flow
 * Visualizes the dual role of Prism Area:
 * - Line Stroke: Communicates directional trend and observation slope
 * - Translucent Area: Communicates quantitative magnitude relative to the baseline
 * - Baseline: The structural reference anchor giving magnitude its meaning
 */
export function AreaMagnitudeFlow() {
  return (
    <figure
      role="region"
      aria-label="Area Magnitude and Baseline Architecture Diagram"
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
              AREA FOUNDATION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Magnitude & Baseline Semantics
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Stroke Communicates Direction; Filled Area Communicates Magnitude
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-blue-500" />
            <span>Stroke (Trend)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-blue-500/25 border border-blue-500/60" />
            <span>Fill (Magnitude)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-zinc-400" />
            <span>Baseline</span>
          </div>
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
          <defs>
            <linearGradient id="area-mag-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="40" y1="40" x2="820" y2="40" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="40" y1="90" x2="820" y2="90" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="40" y1="140" x2="820" y2="140" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          
          {/* Baseline Reference at y=190 */}
          <line x1="40" y1="190" x2="820" y2="190" stroke="#71717a" strokeWidth="1.5" />
          <text x="825" y="194" className="text-[10px] font-mono fill-zinc-400 font-semibold">
            y = 0 (Baseline)
          </text>

          {/* Area Polygon Fill */}
          <path
            d="M 60 190
               L 60 150
               C 120 140, 160 160, 220 120
               C 280 80, 340 100, 400 70
               C 460 40, 520 80, 580 60
               C 640 40, 700 90, 760 50
               L 760 190 Z"
            fill="url(#area-mag-fade)"
          />

          {/* Upper Stroke Path */}
          <path
            d="M 60 150
               C 120 140, 160 160, 220 120
               C 280 80, 340 100, 400 70
               C 460 40, 520 80, 580 60
               C 640 40, 700 90, 760 50"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Observation Markers */}
          <circle cx="60" cy="150" r="3.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
          <circle cx="220" cy="120" r="3.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
          <circle cx="400" cy="70" r="3.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
          <circle cx="580" cy="60" r="3.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
          <circle cx="760" cy="50" r="3.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />

          {/* Inspected Marker at x=400 */}
          <g>
            <line x1="400" y1="40" x2="400" y2="190" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
            <circle cx="400" cy="70" r="6.5" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="400" cy="70" r="3.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
          </g>

          {/* Dimension indicator: Magnitude height */}
          <g transform="translate(415, 75)">
            <line x1="0" y1="0" x2="0" y2="115" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="-3,5 0,0 3,5" fill="#38bdf8" />
            <polygon points="-3,110 0,115 3,110" fill="#38bdf8" />
            <rect x="10" y="45" width="130" height="24" rx="4" className="fill-zinc-900/90 stroke-sky-500/30" />
            <text x="75" y="61" className="text-[10px] font-mono fill-sky-300 font-medium text-anchor-middle">
              Magnitude relative to 0
            </text>
          </g>

          {/* Explanatory Callout Badges */}
          <g transform="translate(180, 35)">
            <rect x="0" y="0" width="145" height="24" rx="6" className="fill-zinc-900/90 stroke-blue-500/40" />
            <text x="72" y="16" className="text-[10px] font-mono fill-blue-300 font-medium text-anchor-middle">
              Quantitative Stroke Trend
            </text>
          </g>

          <g transform="translate(620, 130)">
            <rect x="0" y="0" width="150" height="24" rx="6" className="fill-zinc-900/90 stroke-blue-500/40" />
            <text x="75" y="16" className="text-[10px] font-mono fill-blue-300 font-medium text-anchor-middle">
              Filled Magnitude Envelope
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Callout */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Core Invariant: The baseline gives the area its analytical meaning.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Automatic domain strictly includes baseline to avoid visual distortion
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 2: Area Baseline Flow
 * Visualizes the 3 baseline modes and their domain implications:
 * A: baseline="zero" (absolute magnitude from zero)
 * B: baseline="domain-min" (focus on local variation without zero padding)
 * C: baseline={100} (magnitude relative to a specific target or quota)
 */
export function AreaBaselineFlow() {
  return (
    <figure
      role="region"
      aria-label="Area Baseline Modes Comparison Diagram"
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
              BASELINE TOPOLOGY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              3 Semantic Baseline Options
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            How Configured Baselines Shape Visual Magnitude & Domain Bounds
          </h4>
        </div>
      </div>

      {/* 3 Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Panel A: Zero Baseline */}
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">baseline="zero"</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Default
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Fills toward zero. Domain includes 0 even if observations are far above zero (e.g. 90–110).
            </p>
          </div>

          <div className="h-32 w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 200 90" className="w-full h-full" fill="none">
              <line x1="10" y1="80" x2="190" y2="80" stroke="#71717a" strokeWidth="1" />
              <text x="12" y="76" className="text-[8px] font-mono fill-zinc-500">y = 0</text>
              <path
                d="M 20 80 L 20 35 Q 70 20, 110 30 T 180 25 L 180 80 Z"
                fill="#3b82f6"
                fillOpacity="0.2"
              />
              <path
                d="M 20 35 Q 70 20, 110 30 T 180 25"
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
            </svg>
            <div className="text-[10px] font-mono text-emerald-400 text-center">
              Communicates total volume from zero
            </div>
          </div>
        </div>

        {/* Panel B: Domain-Min Baseline */}
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">baseline="domain-min"</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Variation
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Fills toward domain minimum. Does not force 0 in the scale; maximizes visual height of variation.
            </p>
          </div>

          <div className="h-32 w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 200 90" className="w-full h-full" fill="none">
              <line x1="10" y1="80" x2="190" y2="80" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              <text x="12" y="76" className="text-[8px] font-mono fill-sky-400">dataMin</text>
              <path
                d="M 20 80 L 20 50 Q 70 20, 110 60 T 180 30 L 180 80 Z"
                fill="#38bdf8"
                fillOpacity="0.2"
              />
              <path
                d="M 20 50 Q 70 20, 110 60 T 180 30"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
            </svg>
            <div className="text-[10px] font-mono text-sky-400 text-center">
              Emphasizes local fluctuations
            </div>
          </div>
        </div>

        {/* Panel C: Numeric Custom Baseline */}
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">baseline=&#123;100&#125;</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Reference
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Fills toward an explicit numerical benchmark or threshold. Domain safely encompasses the benchmark.
            </p>
          </div>

          <div className="h-32 w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 200 90" className="w-full h-full" fill="none">
              <line x1="10" y1="50" x2="190" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
              <text x="12" y="46" className="text-[8px] font-mono fill-purple-400">target = 100</text>
              <path
                d="M 20 50 L 20 20 Q 70 40, 110 25 T 180 15 L 180 50 Z"
                fill="#a855f7"
                fillOpacity="0.2"
              />
              <path
                d="M 20 20 Q 70 40, 110 25 T 180 15"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
            </svg>
            <div className="text-[10px] font-mono text-purple-400 text-center">
              Evaluates delta above benchmark
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

/**
 * Diagram 3: Stack Flow Composition Flow
 * Visualizes additive multi-series composition:
 * - Layer 1 (Web): bottom layer anchored to zero baseline
 * - Layer 2 (iOS): middle layer resting on Layer 1
 * - Layer 3 (Android): top layer resting on Layer 2
 * - Top Silhouette: exact sum of visible contributions
 * - Inspection Crosshair: slice showing individual contribution thickness and accumulated sum
 */
export function StackFlowCompositionFlow() {
  return (
    <figure
      role="region"
      aria-label="Stack Flow Multi-Series Composition Diagram"
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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              STACK COMPOSITION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Additive Multi-Series Model
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Layer Thickness = Contribution; Top Silhouette = Total Sum
          </h4>
        </div>
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#3b82f6] border border-blue-400/60" />
            <span>Web (Base)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#10b981] border border-emerald-400/60" />
            <span>iOS (Middle)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#f59e0b] border border-amber-400/60" />
            <span>Android (Top)</span>
          </div>
          <div className="flex items-center gap-1.5 text-white font-semibold">
            <span className="w-3.5 h-0.5 bg-white rounded-full" />
            <span>Σ Total Sum</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 270"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Grid Lines */}
          <line x1="50" y1="40" x2="810" y2="40" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="50" y1="90" x2="810" y2="90" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="50" y1="140" x2="810" y2="140" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="50" y1="190" x2="810" y2="190" className="stroke-white/[0.06]" strokeDasharray="4 4" />

          {/* Baseline at y=230 */}
          <line x1="50" y1="230" x2="810" y2="230" stroke="#71717a" strokeWidth="1.5" />
          <text x="815" y="234" className="text-[10px] font-mono fill-zinc-400 font-semibold">
            y = 0 (Baseline)
          </text>

          {/* Layer 1: Series A (Web) - Anchors to 0 (y=230) up to y1 */}
          {/* Points: (80, 180), (220, 170), (360, 160), (500, 150), (640, 140), (780, 130) */}
          <path
            d="M 80 230
               L 80 180
               C 150 176, 220 172, 360 160
               C 440 154, 520 148, 640 140
               C 700 136, 740 132, 780 130
               L 780 230 Z"
            fill="#3b82f6"
            fillOpacity="0.55"
          />
          {/* Boundary 1 */}
          <path
            d="M 80 180
               C 150 176, 220 172, 360 160
               C 440 154, 520 148, 640 140
               C 700 136, 740 132, 780 130"
            stroke="#3b82f6"
            strokeWidth="1.5"
          />

          {/* Layer 2: Series B (iOS) - Stacks on Layer 1 up to y2 */}
          {/* Upper Points: (80, 130), (220, 120), (360, 105), (500, 95), (640, 85), (780, 75) */}
          <path
            d="M 80 180
               C 150 176, 220 172, 360 160
               C 440 154, 520 148, 640 140
               C 700 136, 740 132, 780 130
               L 780 75
               C 740 80, 700 83, 640 85
               C 520 95, 440 102, 360 105
               C 220 120, 150 126, 80 130 Z"
            fill="#10b981"
            fillOpacity="0.55"
          />
          {/* Boundary 2 */}
          <path
            d="M 80 130
               C 150 126, 220 120, 360 105
               C 440 102, 520 95, 640 85
               C 700 83, 740 80, 780 75"
            stroke="#10b981"
            strokeWidth="1.5"
          />

          {/* Layer 3: Series C (Android) - Stacks on Layer 2 up to y3 (Top Silhouette) */}
          {/* Upper Points: (80, 80), (220, 70), (360, 55), (500, 48), (640, 42), (780, 36) */}
          <path
            d="M 80 130
               C 150 126, 220 120, 360 105
               C 440 102, 520 95, 640 85
               C 700 83, 740 80, 780 75
               L 780 36
               C 740 39, 700 41, 640 42
               C 520 48, 440 52, 360 55
               C 220 70, 150 76, 80 80 Z"
            fill="#f59e0b"
            fillOpacity="0.55"
          />

          {/* Top Silhouette Stroke (Total Sum Path) */}
          <path
            d="M 80 80
               C 150 76, 220 70, 360 55
               C 440 52, 520 48, 640 42
               C 700 41, 740 39, 780 36"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Inspected Vertical Slice at x = 450 */}
          <g>
            <line x1="450" y1="20" x2="450" y2="230" stroke="rgba(255, 255, 255, 0.4)" strokeDasharray="3 3" strokeWidth="1.5" />
            
            {/* Top sum pin */}
            <circle cx="450" cy="50" r="5" fill="#ffffff" stroke="#09090b" strokeWidth="2" />
            
            {/* Total Callout Card */}
            <g transform="translate(465, 30)">
              <rect x="0" y="0" width="160" height="28" rx="6" className="fill-zinc-900/95 stroke-white/20 shadow-lg" />
              <text x="12" y="18" className="text-[11px] font-mono font-bold fill-white">
                Total = 403 req/s
              </text>
            </g>

            {/* Thickness dimension bracket for Layer 3 (Android) */}
            <g transform="translate(458, 55)">
              <line x1="0" y1="0" x2="0" y2="44" stroke="#f59e0b" strokeWidth="1.5" />
              <polyline points="-3,5 0,0 3,5" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <polyline points="-3,39 0,44 3,39" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="8" y="26" className="text-[10px] font-mono fill-amber-300 font-semibold">
                Android: 131 (+32%)
              </text>
            </g>

            {/* Thickness dimension bracket for Layer 2 (iOS) */}
            <g transform="translate(458, 102)">
              <line x1="0" y1="0" x2="0" y2="48" stroke="#10b981" strokeWidth="1.5" />
              <polyline points="-3,5 0,0 3,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <polyline points="-3,43 0,48 3,43" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <text x="8" y="28" className="text-[10px] font-mono fill-emerald-300 font-semibold">
                iOS: 123 (+31%)
              </text>
            </g>

            {/* Thickness dimension bracket for Layer 1 (Web) */}
            <g transform="translate(458, 153)">
              <line x1="0" y1="0" x2="0" y2="74" stroke="#38bdf8" strokeWidth="1.5" />
              <polyline points="-3,5 0,0 3,5" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <polyline points="-3,69 0,74 3,69" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="8" y="42" className="text-[10px] font-mono fill-sky-300 font-semibold">
                Web: 149 (+37%)
              </text>
            </g>
          </g>

          {/* Time Domain Axis labels */}
          <text x="80" y="248" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">Jan</text>
          <text x="220" y="248" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">Feb</text>
          <text x="360" y="248" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">Mar</text>
          <text x="500" y="248" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">Apr</text>
          <text x="640" y="248" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">May</text>
          <text x="780" y="248" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">Jun</text>
        </svg>
      </div>

      {/* Footer Callout */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Additive Invariant: At every X, the top silhouette is the exact sum of all visible contributions.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Canonical series order determines stable bottom-to-top stacking
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 4: Stack Flow Missing Value Semantics
 * Visualizes the crucial difference between known zero and missing data:
 * - Panel A: Known Zero (0 != null) -> Stack remains complete, layer has 0 thickness
 * - Panel B: Missing (null) -> Stack breaks cleanly, total reported as Incomplete
 */
export function StackFlowMissingModelFlow() {
  return (
    <figure
      role="region"
      aria-label="Stack Flow Missing Value Policy Comparison"
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
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
              TRUTHFUL DATA CONTRACT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Zero vs Missing Distinction
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Known Zero Is Valid (0); Unavailable Data (null) Breaks the Stack
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {/* Panel A: Known Zero */}
        <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">Observation = 0</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Stack Complete
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Zero is a valid, recorded measurement. The series contributes 0 height; remaining layers stack seamlessly, and the total is valid.
            </p>
          </div>

          <div className="h-32 w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 240 90" className="w-full h-full" fill="none">
              <line x1="10" y1="80" x2="230" y2="80" stroke="#71717a" strokeWidth="1" />
              {/* Bottom Layer */}
              <path d="M 20 80 L 20 55 L 120 50 L 220 52 L 220 80 Z" fill="#3b82f6" fillOpacity="0.4" />
              {/* Middle Layer (Zero at x=120) */}
              <path d="M 20 55 L 20 35 L 120 50 L 220 32 L 220 52 L 120 50 Z" fill="#10b981" fillOpacity="0.4" />
              {/* Top Layer */}
              <path d="M 20 35 L 20 20 L 120 35 L 220 18 L 220 32 L 120 50 Z" fill="#f59e0b" fillOpacity="0.4" />
              <circle cx="120" cy="50" r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <text x="120" y="44" className="text-[8px] font-mono fill-emerald-300 font-bold text-anchor-middle">
                iOS = 0 (Complete)
              </text>
            </svg>
            <div className="text-[10px] font-mono text-emerald-400 text-center font-semibold">
              Total is computed & displayed truthfully
            </div>
          </div>
        </div>

        {/* Panel B: Missing Data */}
        <div className="rounded-xl border border-amber-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">Observation = null</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Incomplete Total Safeguard
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Under default 'gap' policy, missing data is not falsified into 0. The stack breaks cleanly, and tooltip reports 'Total: Incomplete'.
            </p>
          </div>

          <div className="h-32 w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 240 90" className="w-full h-full" fill="none">
              <line x1="10" y1="80" x2="230" y2="80" stroke="#71717a" strokeWidth="1" />
              {/* Left segment */}
              <path d="M 20 80 L 20 55 L 85 52 L 85 80 Z" fill="#3b82f6" fillOpacity="0.4" />
              <path d="M 20 55 L 20 35 L 85 32 L 85 52 Z" fill="#10b981" fillOpacity="0.4" />
              <path d="M 20 35 L 20 20 L 85 18 L 85 32 Z" fill="#f59e0b" fillOpacity="0.4" />

              {/* Break Gap at x=120 */}
              <line x1="120" y1="15" x2="120" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
              <text x="120" y="48" className="text-[8px] font-mono fill-amber-300 font-bold text-anchor-middle">
                iOS = null (Gap)
              </text>

              {/* Right segment */}
              <path d="M 155 80 L 155 52 L 220 52 L 220 80 Z" fill="#3b82f6" fillOpacity="0.4" />
              <path d="M 155 52 L 155 32 L 220 32 L 220 52 Z" fill="#10b981" fillOpacity="0.4" />
              <path d="M 155 32 L 155 18 L 220 18 L 220 32 Z" fill="#f59e0b" fillOpacity="0.4" />
            </svg>
            <div className="text-[10px] font-mono text-amber-400 text-center font-semibold">
              Total flagged as "Incomplete" (No deceptive subtotal)
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

/**
 * Diagram 5: Area Crossing Flow
 * Visualizes positive, negative, and baseline crossing semantics in Prism Area:
 * - Central horizontal zero baseline at y = 140
 * - Positive observations fill downward to the baseline
 * - Negative observations fill upward to the baseline
 * - Smooth continuous stroke without artificial zero-clamping
 */
export function AreaCrossingFlow() {
  return (
    <figure
      role="region"
      aria-label="Area Baseline Crossing Semantics Diagram"
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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
              BASELINE CROSSING
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Bi-Directional Magnitude
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Positive Fills Down to Zero; Negative Fills Up to Zero
          </h4>
        </div>
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-blue-500/30 border border-blue-500/60" />
            <span>Positive Magnitude (Down)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-sky-500/30 border border-sky-500/60" />
            <span>Negative Magnitude (Up)</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <span className="w-3.5 h-0.5 bg-zinc-300" />
            <span>y = 0 (Baseline)</span>
          </div>
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
          <defs>
            <linearGradient id="area-cross-pos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="area-cross-neg" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Reference Grid lines */}
          <line x1="50" y1="40" x2="810" y2="40" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="50" y1="90" x2="810" y2="90" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="50" y1="190" x2="810" y2="190" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="50" y1="230" x2="810" y2="230" className="stroke-white/[0.06]" strokeDasharray="4 4" />

          {/* Primary Baseline at y=140 */}
          <line x1="50" y1="140" x2="810" y2="140" stroke="#a1a1aa" strokeWidth="1.5" />
          <text x="815" y="144" className="text-[10px] font-mono fill-zinc-300 font-bold">
            y = 0 (Baseline)
          </text>

          {/* Positive Polygon: fills DOWN from curve to y=140 */}
          <path
            d="M 80 140
               C 130 140, 160 50, 240 50
               C 320 50, 370 80, 450 140
               Z"
            fill="url(#area-cross-pos)"
          />

          {/* Negative Polygon: fills UP from curve to y=140 */}
          <path
            d="M 450 140
               C 510 200, 580 225, 660 225
               C 720 225, 750 180, 790 140
               Z"
            fill="url(#area-cross-neg)"
          />

          {/* Continuous Trend Stroke */}
          <path
            d="M 80 140
               C 130 140, 160 50, 240 50
               C 320 50, 370 80, 450 140
               C 510 200, 580 225, 660 225
               C 720 225, 750 180, 790 140"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Baseline Crossing Point at x=450 */}
          <g>
            <circle cx="450" cy="140" r="5.5" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
            <g transform="translate(425, 110)">
              <rect x="-10" y="0" width="80" height="22" rx="4" className="fill-zinc-900/95 stroke-white/20" />
              <text x="30" y="15" className="text-[10px] font-mono fill-white font-semibold text-anchor-middle">
                y = 0 Crossing
              </text>
            </g>
          </g>

          {/* Peak Observation Marker & Dimension at x=240, y=50 */}
          <circle cx="240" cy="50" r="4.5" fill="#3b82f6" stroke="#09090b" strokeWidth="1.5" />
          <g transform="translate(250, 60)">
            <line x1="0" y1="0" x2="0" y2="78" stroke="#3b82f6" strokeWidth="1.5" />
            <polyline points="-3,5 0,0 3,5" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <polyline points="-3,73 0,78 3,73" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="8" y="42" className="text-[10px] font-mono fill-blue-300 font-semibold">
              +120 (Fills DOWN to 0)
            </text>
          </g>

          {/* Trough Observation Marker & Dimension at x=660, y=225 */}
          <circle cx="660" cy="225" r="4.5" fill="#38bdf8" stroke="#09090b" strokeWidth="1.5" />
          <g transform="translate(670, 145)">
            <line x1="0" y1="0" x2="0" y2="76" stroke="#38bdf8" strokeWidth="1.5" />
            <polyline points="-3,5 0,0 3,5" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <polyline points="-3,71 0,76 3,71" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="8" y="42" className="text-[10px] font-mono fill-sky-300 font-semibold">
              -80 (Fills UP to 0)
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Callout */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Truthful Invariant: Values are never artificially clamped with Math.max(0, v) or Math.abs(v).
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Semantically neutral color encoding preserves authentic directional meaning
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 6: Percent Stream Composition Flow
 * Visualizes 100% normalized composition across an ordered domain:
 * - Fixed Y domain strictly from 0% to 100%
 * - Layer thicknesses equal normalized shares: s(x) = rawValue(s,x) / total(x)
 * - Highlights magnitude invariance: 1,000 raw total vs 10,000 raw total produce identical 100% stacked geometry
 * - Total size is deliberately removed from geometry to focus purely on composition
 */
export function PercentStreamCompositionFlow() {
  return (
    <figure
      role="region"
      aria-label="Percent Stream 100% Normalized Composition Architecture Diagram"
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
              <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
              100% NORMALIZED COMPOSITION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Share-of-Total Model
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Geometry Represents Relative Shares; Total Magnitude Is Deliberately Removed
          </h4>
        </div>
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#3b82f6] border border-blue-400/60" />
            <span>Web</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#10b981] border border-emerald-400/60" />
            <span>iOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#f59e0b] border border-amber-400/60" />
            <span>Android</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <span className="w-3.5 h-0.5 bg-white/70 rounded-full" />
            <span>100% Ceiling</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 270"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Reference Percentage Grid */}
          <line x1="60" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
          <text x="50" y="44" className="text-[10px] font-mono fill-zinc-300 font-semibold text-anchor-end">100%</text>

          <line x1="60" y1="85" x2="800" y2="85" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <text x="50" y="89" className="text-[10px] font-mono fill-zinc-500 text-anchor-end">75%</text>

          <line x1="60" y1="130" x2="800" y2="130" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <text x="50" y="134" className="text-[10px] font-mono fill-zinc-500 text-anchor-end">50%</text>

          <line x1="60" y1="175" x2="800" y2="175" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <text x="50" y="179" className="text-[10px] font-mono fill-zinc-500 text-anchor-end">25%</text>

          {/* Baseline at 0% */}
          <line x1="60" y1="220" x2="800" y2="220" stroke="#71717a" strokeWidth="1.5" />
          <text x="50" y="224" className="text-[10px] font-mono fill-zinc-400 font-semibold text-anchor-end">0%</text>

          {/* Layer 1: Web (Bottom Layer from y=220 up to y1) */}
          {/* Points: Jan(90, 130 [50%]), Feb(230, 130 [50%]), Mar(370, 140 [44%]), Apr(510, 148 [40%]), May(650, 155 [36%]), Jun(770, 160 [33%]) */}
          <path
            d="M 90 220
               L 90 130
               C 160 130, 190 130, 230 130
               C 290 130, 320 136, 370 140
               C 430 144, 460 146, 510 148
               C 570 151, 600 153, 650 155
               C 700 157, 730 159, 770 160
               L 770 220 Z"
            fill="#3b82f6"
            fillOpacity="0.75"
          />
          <path
            d="M 90 130
               C 160 130, 190 130, 230 130
               C 290 130, 320 136, 370 140
               C 430 144, 460 146, 510 148
               C 570 151, 600 153, 650 155
               C 700 157, 730 159, 770 160"
            stroke="#3b82f6"
            strokeWidth="1.5"
          />

          {/* Layer 2: iOS (Middle Layer from y1 up to y2) */}
          {/* Upper Points: Jan(90, 76 [80%]), Feb(230, 76 [80%]), Mar(370, 80 [78%]), Apr(510, 83 [76%]), May(650, 87 [74%]), Jun(770, 90 [72%]) */}
          <path
            d="M 90 130
               C 160 130, 190 130, 230 130
               C 290 130, 320 136, 370 140
               C 430 144, 460 146, 510 148
               C 570 151, 600 153, 650 155
               C 700 157, 730 159, 770 160
               L 770 90
               C 730 88, 700 88, 650 87
               C 600 85, 570 84, 510 83
               C 460 82, 430 81, 370 80
               C 320 78, 290 76, 230 76
               C 190 76, 160 76, 90 76 Z"
            fill="#10b981"
            fillOpacity="0.75"
          />
          <path
            d="M 90 76
               C 160 76, 190 76, 230 76
               C 290 76, 320 78, 370 80
               C 430 81, 460 82, 510 83
               C 570 84, 600 85, 650 87
               C 700 88, 730 88, 770 90"
            stroke="#10b981"
            strokeWidth="1.5"
          />

          {/* Layer 3: Android (Top Layer from y2 up to 100% y=40) */}
          <path
            d="M 90 76
               C 160 76, 190 76, 230 76
               C 290 76, 320 78, 370 80
               C 430 81, 460 82, 510 83
               C 570 84, 600 85, 650 87
               C 700 88, 730 88, 770 90
               L 770 40
               L 90 40 Z"
            fill="#f59e0b"
            fillOpacity="0.75"
          />

          {/* Top 100% Ceiling Stroke */}
          <line x1="90" y1="40" x2="770" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

          {/* Observation Callout 1: January (Raw Total = 1,000) */}
          <g>
            <line x1="90" y1="30" x2="90" y2="220" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
            <circle cx="90" cy="40" r="4" fill="#ffffff" stroke="#09090b" strokeWidth="1.5" />
            <g transform="translate(100, 10)">
              <rect x="0" y="0" width="125" height="24" rx="5" className="fill-zinc-900/95 stroke-white/20 shadow-md" />
              <text x="62" y="16" className="text-[10px] font-mono fill-zinc-200 font-semibold text-anchor-middle">
                Jan: Total = 1,000
              </text>
            </g>
          </g>

          {/* Observation Callout 2: February (Raw Total = 10,000 -> 10x larger, identical geometry!) */}
          <g>
            <line x1="230" y1="30" x2="230" y2="220" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
            <circle cx="230" cy="40" r="4" fill="#ffffff" stroke="#09090b" strokeWidth="1.5" />
            <g transform="translate(240, 10)">
              <rect x="0" y="0" width="135" height="24" rx="5" className="fill-zinc-900/95 stroke-sky-400/40 shadow-md" />
              <text x="67" y="16" className="text-[10px] font-mono fill-sky-300 font-semibold text-anchor-middle">
                Feb: Total = 10,000 (10×)
              </text>
            </g>
          </g>

          {/* Invariance Equivalence Bracket between Jan & Feb */}
          <g transform="translate(160, 48)">
            <rect x="-40" y="0" width="160" height="22" rx="4" className="fill-zinc-950/90 stroke-amber-400/30" />
            <text x="40" y="15" className="text-[9px] font-mono fill-amber-300 font-semibold text-anchor-middle">
              Identical 50% / 30% / 20% Mix
            </text>
          </g>

          {/* Inspected Slice at x=510 (Apr) with dimension brackets */}
          <g>
            <line x1="510" y1="25" x2="510" y2="220" stroke="rgba(255,255,255,0.4)" strokeDasharray="3 3" strokeWidth="1.5" />
            <circle cx="510" cy="40" r="4.5" fill="#ffffff" stroke="#09090b" strokeWidth="2" />

            {/* Android Bracket: 40 -> 83 (24%) */}
            <g transform="translate(518, 42)">
              <line x1="0" y1="0" x2="0" y2="39" stroke="#f59e0b" strokeWidth="1.5" />
              <polyline points="-3,4 0,0 3,4" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <polyline points="-3,35 0,39 3,35" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="8" y="23" className="text-[10px] font-mono fill-amber-300 font-semibold">
                Android: 24.0%
              </text>
            </g>

            {/* iOS Bracket: 83 -> 148 (36%) */}
            <g transform="translate(518, 85)">
              <line x1="0" y1="0" x2="0" y2="61" stroke="#10b981" strokeWidth="1.5" />
              <polyline points="-3,4 0,0 3,4" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <polyline points="-3,57 0,61 3,57" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <text x="8" y="34" className="text-[10px] font-mono fill-emerald-300 font-semibold">
                iOS: 36.0%
              </text>
            </g>

            {/* Web Bracket: 148 -> 220 (40%) */}
            <g transform="translate(518, 150)">
              <line x1="0" y1="0" x2="0" y2="68" stroke="#38bdf8" strokeWidth="1.5" />
              <polyline points="-3,4 0,0 3,4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <polyline points="-3,64 0,68 3,64" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="8" y="38" className="text-[10px] font-mono fill-sky-300 font-semibold">
                Web: 40.0%
              </text>
            </g>
          </g>

          {/* Time Domain Labels */}
          <text x="90" y="238" className="text-[11px] font-mono fill-zinc-400 font-medium text-anchor-middle">Jan</text>
          <text x="230" y="238" className="text-[11px] font-mono fill-zinc-400 font-medium text-anchor-middle">Feb</text>
          <text x="370" y="238" className="text-[11px] font-mono fill-zinc-400 font-medium text-anchor-middle">Mar</text>
          <text x="510" y="238" className="text-[11px] font-mono fill-zinc-400 font-medium text-anchor-middle">Apr</text>
          <text x="650" y="238" className="text-[11px] font-mono fill-zinc-400 font-medium text-anchor-middle">May</text>
          <text x="770" y="238" className="text-[11px] font-mono fill-zinc-400 font-medium text-anchor-middle">Jun</text>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Analytical Invariant: Percent Stream deliberately removes total magnitude to focus on share evolution.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Y domain is strictly fixed to 0%–100% without arbitrary truncation
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 7: Percent Stream Re-Normalization Flow
 * Visualizes Model A: Visible-Series Normalization:
 * - Panel A: All 3 Series Visible (Web 50% + iOS 30% + Android 20% = 100%)
 * - Panel B: Android Toggled Off (Web re-normalizes to 62.5% + iOS re-normalizes to 37.5% = 100%)
 * - Shows that hiding a series changes the denominator while preserving stable color tokens!
 */
export function PercentStreamReNormalizationFlow() {
  return (
    <figure
      role="region"
      aria-label="Percent Stream Visible-Series Normalization Diagram"
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
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VISIBLE-SERIES RE-NORMALIZATION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Interactive Legend Semantics
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Toggling a Series Changes the Normalization Basis (Visible Total = 100%)
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {/* Panel A: All Series Visible */}
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">All 3 Series Visible</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Baseline Basis
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Denominator = 50 + 30 + 20 = 100. Each raw contribution maps directly to its initial share.
            </p>
          </div>

          <div className="h-44 w-full bg-zinc-950/70 rounded-lg border border-white/[0.04] p-3 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 240 120" className="w-full h-full" fill="none">
              {/* Reference Grid */}
              <line x1="20" y1="15" x2="220" y2="15" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
              <text x="14" y="18" className="text-[8px] font-mono fill-zinc-400 text-anchor-end">100%</text>

              <line x1="20" y1="105" x2="220" y2="105" stroke="#71717a" strokeWidth="1" />
              <text x="14" y="108" className="text-[8px] font-mono fill-zinc-500 text-anchor-end">0%</text>

              {/* Layer 1: Web (50%) -> y=105 to y=60 */}
              <rect x="30" y="60" width="180" height="45" fill="#3b82f6" fillOpacity="0.75" />
              <text x="120" y="86" className="text-[10px] font-mono fill-white font-bold text-anchor-middle">
                Web: 50.0% (raw 50)
              </text>

              {/* Layer 2: iOS (30%) -> y=60 to y=33 */}
              <rect x="30" y="33" width="180" height="27" fill="#10b981" fillOpacity="0.75" />
              <text x="120" y="50" className="text-[10px] font-mono fill-white font-bold text-anchor-middle">
                iOS: 30.0% (raw 30)
              </text>

              {/* Layer 3: Android (20%) -> y=33 to y=15 */}
              <rect x="30" y="15" width="180" height="18" fill="#f59e0b" fillOpacity="0.75" />
              <text x="120" y="27" className="text-[10px] font-mono fill-white font-bold text-anchor-middle">
                Android: 20.0% (raw 20)
              </text>
            </svg>
            <div className="text-[10px] font-mono text-zinc-400 text-center font-medium">
              Total Visible Sum = 100 · 100% Geometry
            </div>
          </div>
        </div>

        {/* Panel B: Android Toggled Off */}
        <div className="rounded-xl border border-sky-500/30 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-sky-400">Android Toggled Off</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Re-Normalized
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Denominator = 50 + 30 = 80. Remaining layers re-normalize to 100% without color shifts.
            </p>
          </div>

          <div className="h-44 w-full bg-zinc-950/70 rounded-lg border border-white/[0.04] p-3 flex flex-col justify-between relative overflow-hidden">
            <svg viewBox="0 0 240 120" className="w-full h-full" fill="none">
              {/* Reference Grid */}
              <line x1="20" y1="15" x2="220" y2="15" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
              <text x="14" y="18" className="text-[8px] font-mono fill-zinc-400 text-anchor-end">100%</text>

              <line x1="20" y1="105" x2="220" y2="105" stroke="#71717a" strokeWidth="1" />
              <text x="14" y="108" className="text-[8px] font-mono fill-zinc-500 text-anchor-end">0%</text>

              {/* Layer 1: Web (62.5%) -> y=105 to y=49 */}
              <rect x="30" y="49" width="180" height="56" fill="#3b82f6" fillOpacity="0.75" />
              <text x="120" y="80" className="text-[10px] font-mono fill-white font-bold text-anchor-middle">
                Web: 62.5% (raw 50)
              </text>

              {/* Layer 2: iOS (37.5%) -> y=49 to y=15 */}
              <rect x="30" y="15" width="180" height="34" fill="#10b981" fillOpacity="0.75" />
              <text x="120" y="35" className="text-[10px] font-mono fill-white font-bold text-anchor-middle">
                iOS: 37.5% (raw 30)
              </text>
            </svg>
            <div className="text-[10px] font-mono text-sky-400 text-center font-medium">
              Web & iOS fill 100% · Colors remain Chart-1 & Chart-2
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Core Rule: Hiding a series changes the visible denominator; it never reassigns color tokens.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Raw values remain intact; only derived percentage shares are recalculated
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 7: Range Area Envelope & Centerline Model
 * Visualizes the bounded area filling between lower(x) and upper(x),
 * with optional central signal line and truthful nearest-X inspection.
 */
export function RangeAreaEnvelopeFlow() {
  return (
    <figure
      role="region"
      aria-label="Range Area Envelope and Centerline Architecture"
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
              <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
              INTERVAL ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Bounded Envelope + Optional Centerline
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Range Area Fills Between Two Supplied Bounds (lower → upper)
          </h4>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-indigo-500/40 border border-indigo-400" />
            <span className="text-zinc-300">Bounded Range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-white rounded-full" />
            <span className="text-zinc-300">Centerline (optional)</span>
          </div>
        </div>
      </div>

      <div className="w-full relative z-10 overflow-x-auto">
        <svg viewBox="0 0 860 260" className="w-full min-w-[640px] h-auto overflow-visible select-none" fill="none">
          <defs>
            <linearGradient id="range-area-fill-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
            </linearGradient>
            <filter id="range-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Reference Grid lines */}
          <g className="opacity-20">
            <line x1="60" y1="40" x2="820" y2="40" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="60" y1="90" x2="820" y2="90" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="60" y1="140" x2="820" y2="140" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="60" y1="190" x2="820" y2="190" stroke="#71717a" strokeDasharray="3 3" />
          </g>

          {/* Y Axis Tick Labels */}
          <g className="text-[10px] font-mono fill-zinc-500 text-anchor-end">
            <text x="50" y="44">40 ms</text>
            <text x="50" y="94">30 ms</text>
            <text x="50" y="144">20 ms</text>
            <text x="50" y="194">10 ms</text>
          </g>

          {/* Bounded Range Polygon: lower(x) to upper(x) */}
          {/* Points: x=80: 170 to 110; x=220: 160 to 90; x=360: 140 to 60; x=500: 150 to 70; x=640: 130 to 50; x=780: 140 to 75 */}
          <path
            d="M 80 110 L 220 90 L 360 60 L 500 70 L 640 50 L 780 75 L 780 140 L 640 130 L 500 150 L 360 140 L 220 160 L 80 170 Z"
            fill="url(#range-area-fill-grad)"
          />

          {/* Upper Bound Stroke */}
          <path
            d="M 80 110 L 220 90 L 360 60 L 500 70 L 640 50 L 780 75"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Lower Bound Stroke */}
          <path
            d="M 80 170 L 220 160 L 360 140 L 500 150 L 640 130 L 780 140"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Centerline (e.g. median/average) */}
          <path
            d="M 80 140 L 220 125 L 360 100 L 500 110 L 640 90 L 780 105"
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity="0.95"
            filter="url(#range-glow)"
          />

          {/* Bound Semantic Labels */}
          <text x="785" y="72" className="text-[10px] font-mono fill-indigo-300 font-semibold">
            upperKey (Max)
          </text>
          <text x="785" y="105" className="text-[10px] font-mono fill-white font-semibold">
            valueKey (Median)
          </text>
          <text x="785" y="145" className="text-[10px] font-mono fill-indigo-300 font-semibold">
            lowerKey (Min)
          </text>

          {/* Active Observation Inspection Slice at x = 360 */}
          <g>
            <line x1="360" y1="25" x2="360" y2="215" stroke="var(--chart-crosshair, #71717a)" strokeDasharray="3 3" strokeWidth="1.5" />

            {/* Upper bound marker */}
            <circle cx="360" cy="60" r="4" fill="#818cf8" stroke="#09090b" strokeWidth="2" />

            {/* Centerline marker */}
            <circle cx="360" cy="100" r="5" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />

            {/* Lower bound marker */}
            <circle cx="360" cy="140" r="4" fill="#818cf8" stroke="#09090b" strokeWidth="2" />

            {/* Dimension bracket measuring interval thickness (140 - 60 = 80px -> 8ms) */}
            <g transform="translate(372, 60)">
              <line x1="0" y1="0" x2="0" y2="80" stroke="#818cf8" strokeWidth="1.5" />
              <polyline points="-3,5 0,0 3,5" fill="none" stroke="#818cf8" strokeWidth="1.5" />
              <polyline points="-3,75 0,80 3,75" fill="none" stroke="#818cf8" strokeWidth="1.5" />
              <text x="8" y="44" className="text-[10px] font-mono fill-indigo-300 font-bold">
                Span: 16 ms
              </text>
            </g>

            {/* Floating Tooltip card pinned above x = 360 */}
            <g transform="translate(235, 10)">
              <rect x="0" y="0" width="160" height="68" rx="6" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
              <text x="10" y="18" className="text-[10px] font-mono fill-zinc-400 font-semibold">
                12:00 UTC · Inspected
              </text>
              <text x="10" y="34" className="text-[11px] font-mono fill-indigo-300 font-bold">
                Range: 20 – 36 ms
              </text>
              <text x="10" y="48" className="text-[10px] font-mono fill-zinc-400">
                Min: 20 ms · Max: 36 ms
              </text>
              <text x="10" y="61" className="text-[10px] font-mono fill-white font-semibold">
                Median: 28 ms
              </text>
            </g>
          </g>

          {/* Time Domain Axis labels */}
          <text x="80" y="235" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">10:00</text>
          <text x="220" y="235" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">11:00</text>
          <text x="360" y="235" className="text-[11px] font-mono fill-indigo-300 font-bold text-anchor-middle">12:00</text>
          <text x="500" y="235" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">13:00</text>
          <text x="640" y="235" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">14:00</text>
          <text x="780" y="235" className="text-[11px] font-mono fill-zinc-500 font-medium text-anchor-middle">15:00</text>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Core Invariant: The band only fills between lower(x) and upper(x); zero is never an implicit baseline.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Centerline is independently supplied; never clamped or midpoint-derived
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 8: Range Area Truthful State Matrix
 * Visualizes the 4 distinct observation states:
 * 1. Valid Interval & Center: Band intact, center visible
 * 2. Missing Bound: Band gaps truthfully; centerline continues independently
 * 3. Missing Center: Band intact; centerline gaps
 * 4. Invalid Bound (lower > upper): Omitted band segment, flagged invalid (never swapped)
 */
export function RangeAreaValidityFlow() {
  return (
    <figure
      role="region"
      aria-label="Range Area Truthful State Matrix"
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
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
              INTERVAL VALIDITY MATRIX
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              No Data Fabrication
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Truthful Handling of Missing Bounds, Missing Centerlines, and Inverted Data
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* State 1: Fully Valid */}
        <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">1. Valid Interval</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Complete
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              lower ≤ upper and centerline present. Full bounded envelope with center marker.
            </p>
          </div>

          <div className="h-28 w-full bg-zinc-950/70 rounded-lg border border-white/[0.04] p-2 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 140 80" className="w-full h-full" fill="none">
              <rect x="20" y="20" width="100" height="40" rx="3" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.2" />
              <line x1="15" y1="40" x2="125" y2="40" stroke="#ffffff" strokeWidth="2" />
              <circle cx="70" cy="40" r="3" fill="#ffffff" stroke="#6366f1" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="mt-2 text-[10px] font-mono text-emerald-400 text-center font-medium">
            low: 18 · up: 26 · center: 22
          </div>
        </div>

        {/* State 2: Missing Bound */}
        <div className="rounded-xl border border-amber-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">2. Missing Bound</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Band Gaps
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              One or both bounds null. Band gaps cleanly; centerline continues independently.
            </p>
          </div>

          <div className="h-28 w-full bg-zinc-950/70 rounded-lg border border-white/[0.04] p-2 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 140 80" className="w-full h-full" fill="none">
              <rect x="15" y="20" width="35" height="40" rx="2" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.2" />
              <rect x="90" y="20" width="35" height="40" rx="2" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.2" />
              <line x1="15" y1="40" x2="125" y2="40" stroke="#ffffff" strokeWidth="2" strokeDasharray="none" />
              <circle cx="70" cy="40" r="3" fill="#ffffff" stroke="#6366f1" strokeWidth="1.5" />
              <text x="70" y="70" className="text-[8px] font-mono fill-amber-400 text-anchor-middle">gap in envelope</text>
            </svg>
          </div>
          <div className="mt-2 text-[10px] font-mono text-amber-400 text-center font-medium">
            low: null · up: 26 · center: 22
          </div>
        </div>

        {/* State 3: Missing Centerline */}
        <div className="rounded-xl border border-sky-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">3. Missing Center</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Center Gaps
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Centerline null while bounds valid. Band stays continuous; centerline gaps.
            </p>
          </div>

          <div className="h-28 w-full bg-zinc-950/70 rounded-lg border border-white/[0.04] p-2 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 140 80" className="w-full h-full" fill="none">
              <rect x="20" y="20" width="100" height="40" rx="3" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.2" />
              <line x1="15" y1="40" x2="45" y2="40" stroke="#ffffff" strokeWidth="2" />
              <line x1="95" y1="40" x2="125" y2="40" stroke="#ffffff" strokeWidth="2" />
              <text x="70" y="44" className="text-[8px] font-mono fill-zinc-500 text-anchor-middle">— gap —</text>
            </svg>
          </div>
          <div className="mt-2 text-[10px] font-mono text-sky-400 text-center font-medium">
            low: 18 · up: 26 · center: null
          </div>
        </div>

        {/* State 4: Invalid (low > up) */}
        <div className="rounded-xl border border-rose-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">4. Invalid (low &gt; up)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Never Swapped
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Inverted bounds omitted from band. Never silently swapped or rewritten.
            </p>
          </div>

          <div className="h-28 w-full bg-zinc-950/70 rounded-lg border border-white/[0.04] p-2 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 140 80" className="w-full h-full" fill="none">
              <rect x="15" y="20" width="35" height="40" rx="2" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.2" />
              <rect x="90" y="20" width="35" height="40" rx="2" fill="#6366f1" fillOpacity="0.3" stroke="#818cf8" strokeWidth="1.2" />
              <path d="M 60 30 L 80 50 M 80 30 L 60 50" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
              <text x="70" y="68" className="text-[8px] font-mono fill-rose-400 text-anchor-middle">invalid: low &gt; up</text>
            </svg>
          </div>
          <div className="mt-2 text-[10px] font-mono text-rose-400 text-center font-medium">
            low: 28 · up: 19 (omitted)
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Guaranteed Safety: Lower and upper bounds are never swapped; missing bounds never become zero.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Independent channel validation guarantees truthful reporting
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 9: Comparison Area Architecture
 * Visualizes Primary vs Reference overlapping areas:
 * - Both series start from the exact same baseline (y = 0).
 * - Reference (underneath): dashed boundary, quieter opacity (~0.14).
 * - Primary (on top): solid boundary, stronger opacity (0.28).
 * - Translucent overlap communicates co-presence and comparative magnitude.
 * - Nearest-X inspection shows primary, reference, and factual neutral delta.
 */
export function ComparisonAreaModelFlow() {
  return (
    <figure
      role="region"
      aria-label="Comparison Area Architecture Diagram"
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

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
              COMPARISON MODEL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Primary vs Reference Overlap
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Restrained Overlap Across Shared Baseline & Single Y-Scale
          </h4>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-blue-500" />
            <span className="text-zinc-200">Primary (Solid 2px)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 border-b-2 border-dashed border-zinc-400" />
            <span className="text-zinc-400">Reference (Dashed 1.5px)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-indigo-500/40 border border-indigo-400/60" />
            <span className="text-zinc-400">Overlap</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full relative z-10 overflow-x-auto">
        <svg viewBox="0 0 860 270" className="w-full min-w-[700px] h-auto overflow-visible select-none" fill="none">
          <defs>
            <linearGradient id="comp-prim-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.36" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="comp-ref-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#71717a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#71717a" stopOpacity="0.06" />
            </linearGradient>
            <filter id="comp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Reference Grid lines */}
          <g className="opacity-20">
            <line x1="70" y1="40" x2="810" y2="40" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="70" y1="90" x2="810" y2="90" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="70" y1="140" x2="810" y2="140" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="70" y1="190" x2="810" y2="190" stroke="#71717a" strokeDasharray="3 3" />
          </g>

          {/* Y Axis Tick Labels */}
          <g className="text-[10px] font-mono fill-zinc-500 text-anchor-end">
            <text x="60" y="44">$160k</text>
            <text x="60" y="94">$120k</text>
            <text x="60" y="144">$80k</text>
            <text x="60" y="194">$40k</text>
          </g>

          {/* Baseline Reference at y=220 */}
          <line x1="60" y1="220" x2="820" y2="220" stroke="#71717a" strokeWidth="1.5" />
          <text x="825" y="224" className="text-[10px] font-mono fill-zinc-400 font-semibold">
            y = 0 (Baseline)
          </text>

          {/* 1. Reference Area (Underneath) */}
          <path
            d="M 100 220
               L 100 145
               C 150 140, 170 137, 210 135
               C 250 133, 280 123, 320 120
               C 360 117, 390 108, 430 105
               C 470 102, 500 117, 540 115
               C 580 113, 610 98, 650 95
               C 690 92, 720 102, 760 100
               L 760 220 Z"
            fill="url(#comp-ref-fade)"
          />

          {/* 2. Primary Area (On Top) */}
          <path
            d="M 100 220
               L 100 165
               C 150 145, 170 130, 210 125
               C 250 120, 280 100, 320 95
               C 360 90, 390 83, 430 80
               C 470 77, 500 87, 540 85
               C 580 83, 610 63, 650 60
               C 690 57, 720 54, 760 52
               L 760 220 Z"
            fill="url(#comp-prim-fade)"
          />

          {/* Reference Boundary Stroke (Dashed, Quieter) */}
          <path
            d="M 100 145
               C 150 140, 170 137, 210 135
               C 250 133, 280 123, 320 120
               C 360 117, 390 108, 430 105
               C 470 102, 500 117, 540 115
               C 580 113, 610 98, 650 95
               C 690 92, 720 102, 760 100"
            stroke="#a1a1aa"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />

          {/* Primary Boundary Stroke (Solid, Dominant) */}
          <path
            d="M 100 165
               C 150 145, 170 130, 210 125
               C 250 120, 280 100, 320 95
               C 360 90, 390 83, 430 80
               C 470 77, 500 87, 540 85
               C 580 83, 610 63, 650 60
               C 690 57, 720 54, 760 52"
            stroke="#3b82f6"
            strokeWidth="2.2"
            filter="url(#comp-glow)"
          />

          {/* Domain X Axis Labels */}
          <g className="text-[11px] font-mono fill-zinc-400 text-anchor-middle">
            <text x="100" y="240">Jan</text>
            <text x="210" y="240">Feb</text>
            <text x="320" y="240">Mar</text>
            <text x="430" y="240" className="fill-white font-bold">Apr</text>
            <text x="540" y="240">May</text>
            <text x="650" y="240">Jun</text>
            <text x="760" y="240">Jul</text>
          </g>

          {/* Overlap Annotation Callout */}
          <g className="opacity-90">
            <line x1="280" y1="165" x2="315" y2="185" stroke="#818cf8" strokeWidth="1" strokeDasharray="2 2" />
            <rect x="230" y="145" width="100" height="22" rx="4" fill="#09090b" stroke="#818cf8" strokeWidth="1" />
            <text x="280" y="160" className="text-[9px] font-mono fill-indigo-300 text-anchor-middle font-medium">
              restrained overlap
            </text>
          </g>

          {/* Inspection Slice at x = 430 (Apr) */}
          <line x1="430" y1="40" x2="430" y2="220" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
          
          {/* Reference Active Marker */}
          <circle cx="430" cy="105" r="4.5" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="3 2" />
          
          {/* Primary Active Marker */}
          <circle cx="430" cy="80" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />

          {/* Inspection Tooltip Overlay at x = 430 */}
          <g transform="translate(442, 45)">
            <rect
              width="180"
              height="86"
              rx="8"
              fill="#09090b"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))"
            />
            <text x="12" y="18" className="text-[11px] font-mono fill-zinc-400 font-semibold">Apr 2026 (Locked)</text>
            
            {/* Primary Row */}
            <circle cx="16" cy="34" r="3.5" fill="#3b82f6" />
            <text x="26" y="37" className="text-[10px] font-mono fill-zinc-300">Current year</text>
            <text x="168" y="37" className="text-[10px] font-mono fill-white font-bold text-anchor-end">$142,000</text>
            
            {/* Reference Row */}
            <circle cx="16" cy="52" r="3.5" fill="#71717a" />
            <text x="26" y="55" className="text-[10px] font-mono fill-zinc-400">Previous year</text>
            <text x="168" y="55" className="text-[10px] font-mono fill-zinc-300 font-medium text-anchor-end">$126,000</text>

            <line x1="12" y1="63" x2="168" y2="63" stroke="rgba(255,255,255,0.08)" />

            {/* Delta Row */}
            <text x="12" y="76" className="text-[10px] font-mono fill-zinc-400">Difference (Δ)</text>
            <text x="168" y="76" className="text-[10px] font-mono fill-sky-400 font-bold text-anchor-end">+$16,000</text>
          </g>
        </svg>
      </div>

      {/* Footer Notes */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Truthful Comparison: Both areas measure individual magnitudes from baseline (y = 0); overlap communicates co-presence, not composition.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Non-color identity: Primary (solid 2px) vs Reference (dashed 1.5px)
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 10: Comparison vs Stacking
 * Contrasts Comparison Area (shared baseline overlap) against Stacked Area (additive composition)
 * to demonstrate why stacking is an anti-pattern for period-over-period comparison.
 */
export function ComparisonVsStackFlow() {
  return (
    <figure
      role="region"
      aria-label="Comparison Area vs Stacked Area Comparison"
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

      <div className="relative z-10 mb-6 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 font-semibold">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            CRITICAL DISTINCTION
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Comparison vs Additive Composition
          </span>
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Why Comparison Areas Must Overlap, Never Stack
        </h4>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Comparison Area (Truthful) */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">✓ Comparison Area (Correct)</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Shared Baseline (y = 0)
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4">
              Both series fill upward from zero. Visual height truthfully reflects independent period magnitudes ($140k vs $120k).
            </p>
          </div>

          <div className="h-44 w-full bg-zinc-950/80 rounded-lg border border-white/[0.06] p-3 flex flex-col justify-end relative">
            <svg viewBox="0 0 280 140" className="w-full h-full" fill="none">
              {/* Baseline */}
              <line x1="20" y1="120" x2="260" y2="120" stroke="#71717a" strokeWidth="1" />
              <text x="265" y="123" className="text-[8px] font-mono fill-zinc-500">y=0</text>

              {/* Reference Area: 0 to 80 (height 60) */}
              <path d="M 40 120 L 40 60 C 100 55, 180 65, 240 50 L 240 120 Z" fill="#71717a" fillOpacity="0.2" />
              <path d="M 40 60 C 100 55, 180 65, 240 50" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Primary Area: 0 to 45 (height 75) */}
              <path d="M 40 120 L 40 45 C 100 40, 180 48, 240 35 L 240 120 Z" fill="#3b82f6" fillOpacity="0.3" />
              <path d="M 40 45 C 100 40, 180 48, 240 35" stroke="#3b82f6" strokeWidth="2" />

              {/* Top Height Marker */}
              <line x1="20" y1="35" x2="240" y2="35" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x="15" y="38" className="text-[9px] font-mono fill-blue-400 text-anchor-end font-bold">$140k</text>

              <line x1="20" y1="50" x2="240" y2="50" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x="15" y="53" className="text-[9px] font-mono fill-zinc-400 text-anchor-end">$120k</text>

              <text x="140" y="85" className="text-[9px] font-mono fill-indigo-300 text-anchor-middle font-medium">
                overlap: $120k
              </text>
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
            <span>Scale Peak: $140k (Primary)</span>
            <span>Delta: +$20k</span>
          </div>
        </div>

        {/* Right: Stacked Area (Anti-pattern) */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-rose-400">✕ Stacked Area (Misleading)</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                Additive Stacking Anti-Pattern
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4">
              Primary sits on top of reference. Visual peak reaches $260k, creating the false illusion of a combined $260k revenue total.
            </p>
          </div>

          <div className="h-44 w-full bg-zinc-950/80 rounded-lg border border-white/[0.06] p-3 flex flex-col justify-end relative">
            <svg viewBox="0 0 280 140" className="w-full h-full" fill="none">
              {/* Baseline */}
              <line x1="20" y1="120" x2="260" y2="120" stroke="#71717a" strokeWidth="1" />
              <text x="265" y="123" className="text-[8px] font-mono fill-zinc-500">y=0</text>

              {/* Layer 1 (Previous): 0 to 60 */}
              <path d="M 40 120 L 40 75 C 100 70, 180 80, 240 65 L 240 120 Z" fill="#71717a" fillOpacity="0.25" />
              <text x="140" y="95" className="text-[9px] font-mono fill-zinc-400 text-anchor-middle">
                Previous ($120k)
              </text>

              {/* Layer 2 (Current stacked on top): 60 to 15 (height 60+75=135) */}
              <path d="M 40 75 L 40 20 C 100 15, 180 25, 240 10 L 240 65 C 180 80, 100 70, 40 75 Z" fill="#3b82f6" fillOpacity="0.4" />
              <path d="M 40 20 C 100 15, 180 25, 240 10" stroke="#3b82f6" strokeWidth="2" />
              <text x="140" y="42" className="text-[9px] font-mono fill-blue-300 text-anchor-middle font-medium">
                Current ($140k stacked)
              </text>

              {/* False Total Marker */}
              <line x1="20" y1="10" x2="240" y2="10" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
              <text x="15" y="13" className="text-[9px] font-mono fill-rose-400 text-anchor-end font-bold">$260k</text>
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-rose-400">
            <span>False Total: $260k (Sum)</span>
            <span className="underline">Misrepresents comparison</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Analytical Rule: When comparing two periods or cohorts, use Comparison Area overlap—never additive stacking.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Stacking alters the analytical question from comparison to composition
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 11: Gradient Depth Architecture
 * Visualizes the controlled semantic fade from the series boundary toward the chart surface:
 * - Signal Stroke (solid 2.5px): Crisp directional boundary
 * - Stop 0% (leading opacity 32%): Strongest series presence
 * - Stop 55% (transition opacity 14%): Smooth downward attenuation
 * - Stop 100% (surface reveal ~1.6%): Naturally reveals underlying chart surface
 * - Baseline Reference at y = 0
 */
export function GradientDepthModelFlow() {
  return (
    <figure
      role="region"
      aria-label="Gradient Depth Area Architecture Diagram"
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

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 font-semibold">
              <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
              DEPTH ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Semantic Fade-to-Surface
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Stroke Defines Trend; Controlled Opacity Fade Dissolves into Surface
          </h4>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-blue-500" />
            <span className="text-zinc-200">Signal Boundary (2px)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-gradient-to-b from-blue-500/50 to-transparent border border-blue-400/40" />
            <span className="text-zinc-400">Surface Fade (32% → 2%)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full relative z-10 overflow-x-auto">
        <svg viewBox="0 0 860 250" className="w-full min-w-[700px] h-auto overflow-visible select-none" fill="none">
          <defs>
            <linearGradient id="grad-depth-demo-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.36" />
              <stop offset="55%" stopColor="#3b82f6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.015" />
            </linearGradient>
            <filter id="grad-depth-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#3b82f6" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Reference Grid lines */}
          <g className="opacity-20">
            <line x1="70" y1="40" x2="810" y2="40" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="70" y1="90" x2="810" y2="90" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="70" y1="140" x2="810" y2="140" stroke="#71717a" strokeDasharray="3 3" />
            <line x1="70" y1="190" x2="810" y2="190" stroke="#71717a" strokeDasharray="3 3" />
          </g>

          {/* Y Axis Tick Labels */}
          <g className="text-[10px] font-mono fill-zinc-500 text-anchor-end">
            <text x="60" y="44">30k</text>
            <text x="60" y="94">20k</text>
            <text x="60" y="144">10k</text>
            <text x="60" y="194">0</text>
          </g>

          {/* Baseline Reference at y=190 */}
          <line x1="60" y1="190" x2="820" y2="190" stroke="#71717a" strokeWidth="1.5" />
          <text x="825" y="194" className="text-[10px] font-mono fill-zinc-400 font-semibold">
            y = 0 (Baseline)
          </text>

          {/* Fading Area Polygon Fill */}
          <path
            d="M 90 190
               L 90 145
               C 150 135, 180 120, 220 115
               C 260 110, 290 125, 330 118
               C 370 110, 410 75, 450 70
               C 490 65, 530 85, 570 80
               C 610 75, 650 50, 690 45
               C 730 40, 750 55, 770 50
               L 770 190 Z"
            fill="url(#grad-depth-demo-fade)"
          />

          {/* Signal Boundary Stroke */}
          <path
            d="M 90 145
               C 150 135, 180 120, 220 115
               C 260 110, 290 125, 330 118
               C 370 110, 410 75, 450 70
               C 490 65, 530 85, 570 80
               C 610 75, 650 50, 690 45
               C 730 40, 750 55, 770 50"
            stroke="#3b82f6"
            strokeWidth="2.2"
            filter="url(#grad-depth-glow)"
          />

          {/* Domain X Axis Labels */}
          <g className="text-[11px] font-mono fill-zinc-400 text-anchor-middle">
            <text x="90" y="215">May 01</text>
            <text x="220" y="215">May 05</text>
            <text x="330" y="215">May 10</text>
            <text x="450" y="215" className="fill-white font-bold">May 15</text>
            <text x="570" y="215">May 20</text>
            <text x="690" y="215">May 25</text>
            <text x="770" y="215">May 30</text>
          </g>

          {/* Opacity Scale Annotations on Right */}
          <g transform="translate(710, 60)">
            <line x1="0" y1="0" x2="10" y2="0" stroke="#3b82f6" strokeWidth="1" />
            <text x="14" y="3" className="text-[9px] font-mono fill-blue-400 font-bold">0% stop (32% opacity)</text>
            
            <line x1="0" y1="45" x2="10" y2="45" stroke="#60a5fa" strokeWidth="1" />
            <text x="14" y="48" className="text-[9px] font-mono fill-zinc-400">55% stop (14% opacity)</text>
            
            <line x1="0" y1="120" x2="10" y2="120" stroke="#71717a" strokeWidth="1" />
            <text x="14" y="123" className="text-[9px] font-mono fill-zinc-500 font-semibold">100% stop (~2% surface)</text>
          </g>

          {/* Inspection Slice at x = 450 (May 15) */}
          <line x1="450" y1="40" x2="450" y2="190" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="450" cy="70" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />

          {/* Inspection Tooltip Card */}
          <g transform="translate(462, 50)">
            <rect
              width="150"
              height="58"
              rx="8"
              fill="#09090b"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.6))"
            />
            <text x="10" y="18" className="text-[10px] font-mono fill-zinc-400 font-semibold">May 15 (Locked)</text>
            <circle cx="14" cy="36" r="3.5" fill="#3b82f6" />
            <text x="22" y="39" className="text-[10px] font-mono fill-zinc-300">API Requests</text>
            <text x="140" y="39" className="text-[10px] font-mono fill-white font-bold text-anchor-end">18,200</text>
          </g>
        </svg>
      </div>

      {/* Footer Notes */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Styling Principle: The gradient changes visual emphasis, not quantitative meaning. Fills dissolve into surface via opacity without baking hardcoded background colors.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          SSR-safe dynamic IDs prevent cross-chart gradient leakage
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 7: Baseline Area Model Diagram
 * Visualizes the factual classification of observations relative to an explicit baseline:
 * - value > baseline -> "above" (+deviation) -> aboveColor fill
 * - value === baseline -> "equal" (0 deviation) -> reference anchor
 * - value < baseline -> "below" (-deviation) -> belowColor fill
 */
export function BaselineAreaModelDiagram() {
  return (
    <figure
      role="region"
      aria-label="Baseline Area Classification Model Diagram"
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
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SEMANTIC MODEL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Component 017 · Baseline Area
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Factual Classification Around an Explicit Reference Baseline
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-blue-500/30 border border-blue-500/60" />
            <span>Above (deviation &gt; 0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-zinc-400" />
            <span>Baseline (ref = 75)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-emerald-500/30 border border-emerald-500/60" />
            <span>Below (deviation &lt; 0)</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 300"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="baseline-model-title baseline-model-desc"
        >
          <title id="baseline-model-title">Baseline Area classification model</title>
          <desc id="baseline-model-desc">
            Values above the configured baseline use the above treatment, values below use the below treatment, and exact values meet the baseline without additional deviation.
          </desc>

          <defs>
            <linearGradient id="above-region-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="below-region-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.38" />
            </linearGradient>
          </defs>

          {/* Reference Baseline Line at y=130 */}
          <line x1="60" y1="50" x2="800" y2="50" className="stroke-white/[0.06]" strokeDasharray="3 3" />
          <line x1="60" y1="90" x2="800" y2="90" className="stroke-white/[0.06]" strokeDasharray="3 3" />
          <line x1="60" y1="170" x2="800" y2="170" className="stroke-white/[0.06]" strokeDasharray="3 3" />
          <line x1="60" y1="210" x2="800" y2="210" className="stroke-white/[0.06]" strokeDasharray="3 3" />

          <line x1="60" y1="130" x2="800" y2="130" stroke="#71717a" strokeWidth="1.75" strokeDasharray="5 4" />
          <text x="806" y="134" className="text-[11px] font-mono fill-zinc-400 font-semibold">
            Baseline (y = 75)
          </text>

          {/* Upper Occupied Area (Above baseline) */}
          <path
            d="M 120 130
               L 120 130
               C 160 110, 200 65, 260 60
               C 320 55, 360 95, 410 130
               L 120 130 Z"
            fill="url(#above-region-grad)"
          />

          {/* Lower Occupied Area (Below baseline) */}
          <path
            d="M 410 130
               C 460 165, 500 205, 560 200
               C 620 195, 660 155, 710 130
               L 410 130 Z"
            fill="url(#below-region-grad)"
          />

          {/* Signal Curve Stroke crossing at (410, 130) and (710, 130) */}
          <path
            d="M 80 145
               C 100 138, 110 132, 120 130
               C 160 110, 200 65, 260 60
               C 320 55, 360 95, 410 130
               C 460 165, 500 205, 560 200
               C 620 195, 660 155, 710 130
               C 740 115, 760 95, 780 90"
            stroke="#3b82f6"
            strokeWidth="2.4"
          />

          {/* Highlight Observation 1: Above (x=260, y=60, value=89) */}
          <circle cx="260" cy="60" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          <line x1="260" y1="60" x2="260" y2="130" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
          <g transform="translate(270, 50)">
            <rect width="130" height="38" rx="6" fill="#09090b" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
            <text x="8" y="16" className="text-[10px] font-mono fill-zinc-300">Observation: 89%</text>
            <text x="8" y="29" className="text-[10px] font-mono fill-blue-400 font-bold">Deviation: +14% (Above)</text>
          </g>

          {/* Highlight Observation 2: Equal (x=410, y=130, value=75) */}
          <circle cx="410" cy="130" r="4.5" fill="#71717a" stroke="#ffffff" strokeWidth="2" />
          <g transform="translate(370, 95)">
            <rect width="125" height="24" rx="4" fill="#09090b" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="6" y="16" className="text-[10px] font-mono fill-zinc-300 font-semibold">Exact Baseline (0 dev)</text>
          </g>

          {/* Highlight Observation 3: Below (x=560, y=200, value=61) */}
          <circle cx="560" cy="200" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <line x1="560" y1="130" x2="560" y2="200" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
          <g transform="translate(570, 190)">
            <rect width="130" height="38" rx="6" fill="#09090b" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
            <text x="8" y="16" className="text-[10px] font-mono fill-zinc-300">Observation: 61%</text>
            <text x="8" y="29" className="text-[10px] font-mono fill-emerald-400 font-bold">Deviation: -14% (Below)</text>
          </g>

          {/* Bottom Analytical Notes */}
          <g transform="translate(60, 260)">
            <rect width="740" height="30" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x="16" y="19" className="text-[10px] font-mono fill-zinc-400">
              Formula: deviation = value - baseline · Above: deviation &gt; 0 · Equal: deviation === 0 · Below: deviation &lt; 0
            </text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Core Guarantee: Deviation is computed factually from the explicit reference. Colors indicate relative spatial position, never favorable/unfavorable business judgment.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Original values remain canonical
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 8: Baseline Area Crossing Diagram
 * Visualizes continuous curve crossing between two discrete observations:
 * - Crossing occurs at true interpolated baseline intersection point C
 * - Hard-stop segmentation aligns with baseline throughout the path
 * - No discrete color jumping by X index
 */
export function BaselineAreaCrossingDiagram() {
  return (
    <figure
      role="region"
      aria-label="Baseline Area Crossing Interpolation Diagram"
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
              <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
              CROSSING GEOMETRY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Continuous Y Segmentation
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Color Transitions Precisely at the Interpolated Baseline Intersection
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-zinc-400" />
            <span>Sample Nodes (A &amp; B)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400 animate-ping" />
            <span>Crossing Point (C)</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 280"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="baseline-crossing-title baseline-crossing-desc"
        >
          <title id="baseline-crossing-title">Baseline crossing interpolation diagram</title>
          <desc id="baseline-crossing-desc">
            Demonstrates that the boundary between aboveColor and belowColor occurs at the exact continuous Y intersection point C along the baseline, rather than switching abruptly at discrete sample indices.
          </desc>

          <defs>
            <linearGradient id="crossing-below-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.32" />
            </linearGradient>
            <linearGradient id="crossing-above-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Reference Baseline Line at y=140 */}
          <line x1="80" y1="140" x2="780" y2="140" stroke="#71717a" strokeWidth="1.75" strokeDasharray="5 4" />
          <text x="786" y="144" className="text-[11px] font-mono fill-zinc-400 font-semibold">
            Baseline Reference (y = 75)
          </text>

          {/* Segment Below Baseline (Left of C) */}
          <path
            d="M 180 200
               C 280 200, 360 170, 440 140
               L 180 140 Z"
            fill="url(#crossing-below-fill)"
          />

          {/* Segment Above Baseline (Right of C) */}
          <path
            d="M 440 140
               C 520 110, 600 70, 700 70
               L 700 140
               L 440 140 Z"
            fill="url(#crossing-above-fill)"
          />

          {/* Continuous Curve Stroke passing through (180, 200) -> (440, 140) -> (700, 70) */}
          <path
            d="M 180 200
               C 280 200, 360 170, 440 140
               C 520 110, 600 70, 700 70"
            stroke="#3b82f6"
            strokeWidth="2.5"
          />

          {/* Observation A (x=180, y=200, Below) */}
          <line x1="180" y1="140" x2="180" y2="240" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" />
          <circle cx="180" cy="200" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <text x="180" y="255" className="text-[11px] font-mono fill-zinc-400 text-anchor-middle">
            Sample A (May 14)
          </text>
          <text x="180" y="225" className="text-[10px] font-mono fill-emerald-400 font-bold text-anchor-middle">
            value = 65% (&lt; 75)
          </text>

          {/* Crossing Point C (x=440, y=140, Intersect) */}
          <circle cx="440" cy="140" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="440" cy="140" r="10" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
          <line x1="440" y1="40" x2="440" y2="140" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
          <g transform="translate(370, 40)">
            <rect width="140" height="34" rx="6" fill="#09090b" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
            <text x="10" y="15" className="text-[10px] font-mono fill-amber-400 font-bold">Intersection Point C</text>
            <text x="10" y="27" className="text-[9px] font-mono fill-zinc-300">Exact fill color boundary</text>
          </g>

          {/* Observation B (x=700, y=70, Above) */}
          <line x1="700" y1="70" x2="700" y2="240" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" />
          <circle cx="700" cy="70" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          <text x="700" y="255" className="text-[11px] font-mono fill-zinc-400 text-anchor-middle">
            Sample B (May 15)
          </text>
          <text x="700" y="55" className="text-[10px] font-mono fill-blue-400 font-bold text-anchor-middle">
            value = 87% (&gt; 75)
          </text>

          {/* Annotation Arrows */}
          <path d="M 290 175 Q 310 160 340 160" stroke="#10b981" strokeWidth="1.2" fill="none" markerEnd="url(#arrow)" />
          <text x="240" y="160" className="text-[10px] font-mono fill-emerald-300">belowColor region</text>

          <path d="M 590 105 Q 570 120 540 120" stroke="#3b82f6" strokeWidth="1.2" fill="none" />
          <text x="600" y="110" className="text-[10px] font-mono fill-blue-300">aboveColor region</text>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Rendering Guarantee: A baseline-aligned hard-stop SVG gradient colors geometry continuously by its vertical plot coordinate. Colors never toggle at discrete X columns.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Continuous Y-scale hard stop
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 9: Baseline Area Rendering Architecture
 * Visualizes the complete data flow:
 * Consumer Data -> Validation -> Safe Domain & Baseline Offset ->
 * Recharts LinearGradient -> Area Geometry & ReferenceLine -> Nearest-X Tooltip
 */
export function BaselineAreaArchitectureDiagram() {
  return (
    <figure
      role="region"
      aria-label="Baseline Area Rendering Architecture Flow Diagram"
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
              <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
              ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Rendering Pipeline
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Source-First Recharts SVG Rendering Pipeline
          </h4>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          O(1) Gradient · Zero Data Duplication
        </div>
      </div>

      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 860 340"
          className="w-full min-w-[760px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="baseline-arch-title baseline-arch-desc"
        >
          <title id="baseline-arch-title">Baseline Area rendering architecture</title>
          <desc id="baseline-arch-desc">
            Diagram illustrating the step-by-step pipeline from consumer data and required baseline to validation, safe domain calculation, hard-stop linearGradient generation, and synchronized inspection.
          </desc>

          {/* Pipeline Stage 1: Consumer Props */}
          <g transform="translate(40, 40)">
            <rect width="180" height="70" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="14" y="22" className="text-[11px] font-mono fill-white font-bold">1. Consumer Inputs</text>
            <text x="14" y="40" className="text-[10px] font-mono fill-zinc-400">data: readonly TData[]</text>
            <text x="14" y="55" className="text-[10px] font-mono fill-sky-400">baseline: number (req)</text>
          </g>

          <line x1="220" y1="75" x2="260" y2="75" stroke="#71717a" strokeWidth="1.5" />
          <polygon points="260,75 254,71 254,79" fill="#71717a" />

          {/* Pipeline Stage 2: Validation & Normalization */}
          <g transform="translate(260, 40)">
            <rect width="200" height="70" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="14" y="22" className="text-[11px] font-mono fill-white font-bold">2. Data Validation</text>
            <text x="14" y="40" className="text-[10px] font-mono fill-zinc-400">Finite baseline check</text>
            <text x="14" y="55" className="text-[10px] font-mono fill-emerald-400">Sanitize NaN/Infinity</text>
          </g>

          <line x1="460" y1="75" x2="500" y2="75" stroke="#71717a" strokeWidth="1.5" />
          <polygon points="500,75 494,71 494,79" fill="#71717a" />

          {/* Pipeline Stage 3: Domain & Gradient Offset */}
          <g transform="translate(500, 40)">
            <rect width="220" height="70" rx="8" fill="#09090b" stroke="rgba(59,130,246,0.3)" strokeWidth="1.2" />
            <text x="14" y="22" className="text-[11px] font-mono fill-blue-400 font-bold">3. Scale &amp; Gradient Offset</text>
            <text x="14" y="40" className="text-[10px] font-mono fill-zinc-400">domain = [min, max + pad]</text>
            <text x="14" y="55" className="text-[10px] font-mono fill-white font-semibold">offset = (max-base)/(max-min)</text>
          </g>

          {/* Downward Arrow to Stage 4 */}
          <line x1="610" y1="110" x2="610" y2="150" stroke="#71717a" strokeWidth="1.5" />
          <polygon points="610,150 606,144 614,144" fill="#71717a" />

          {/* Pipeline Stage 4: SVG Defs linearGradient */}
          <g transform="translate(500, 150)">
            <rect width="220" height="75" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="14" y="22" className="text-[11px] font-mono fill-white font-bold">4. SVG Hard-Stop Defs</text>
            <text x="14" y="40" className="text-[10px] font-mono fill-blue-400">0% .. offset% : aboveColor</text>
            <text x="14" y="55" className="text-[10px] font-mono fill-emerald-400">offset% .. 100% : belowColor</text>
          </g>

          {/* Left Arrow to Stage 5 */}
          <line x1="500" y1="187" x2="460" y2="187" stroke="#71717a" strokeWidth="1.5" />
          <polygon points="460,187 466,183 466,191" fill="#71717a" />

          {/* Pipeline Stage 5: Recharts Composition */}
          <g transform="translate(240, 150)">
            <rect width="220" height="75" rx="8" fill="#09090b" stroke="rgba(16,185,129,0.3)" strokeWidth="1.2" />
            <text x="14" y="22" className="text-[11px] font-mono fill-emerald-400 font-bold">5. Recharts Area Chart</text>
            <text x="14" y="40" className="text-[10px] font-mono fill-zinc-400">&lt;Area baseValue=&#123;baseline&#125; /&gt;</text>
            <text x="14" y="55" className="text-[10px] font-mono fill-white">&lt;ReferenceLine y=&#123;baseline&#125; /&gt;</text>
          </g>

          {/* Left Arrow to Stage 6 */}
          <line x1="240" y1="187" x2="200" y2="187" stroke="#71717a" strokeWidth="1.5" />
          <polygon points="200,187 206,183 206,191" fill="#71717a" />

          {/* Pipeline Stage 6: Nearest-X Interaction */}
          <g transform="translate(20, 150)">
            <rect width="180" height="75" rx="8" fill="#09090b" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" />
            <text x="14" y="22" className="text-[11px] font-mono fill-sky-400 font-bold">6. Inspection Layer</text>
            <text x="14" y="40" className="text-[10px] font-mono fill-zinc-300">value, baseline, deviation</text>
            <text x="14" y="55" className="text-[10px] font-mono fill-zinc-400">Lockable tooltip &amp; A11y</text>
          </g>

          {/* Bottom Callout Bar */}
          <g transform="translate(40, 260)">
            <rect width="780" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x="20" y="22" className="text-[11px] font-mono fill-zinc-300 font-semibold">
              Performance Invariant:
            </text>
            <text x="20" y="38" className="text-[10px] font-mono fill-zinc-400">
              Only 1 linearGradient is generated per chart instance. Crossings are continuous SVG geometry without cutting or modifying original consumer observation records.
            </text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Pure SVG Pipeline: Free from D3, Canvas, or WebGL dependencies. Directly compatible with React Server Components and Next.js Turbopack.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Registry Component: area-baseline
        </span>
      </div>
    </figure>
  )
}
