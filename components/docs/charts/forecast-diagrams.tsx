"use client"

import React from "react"

/**
 * Diagram 1: Forecast Model Flow
 * Visualizes the 3 distinct semantic roles:
 * - Observed Actual History (Solid line, definite facts)
 * - Transition Handoff
 * - Predicted Forecast Trajectory (Dashed line, epistemic future)
 * - Forecast Uncertainty Envelope (Translucent band between lower & upper bounds)
 */
export function ForecastModelFlow() {
  return (
    <figure
      role="region"
      aria-label="Forecast Line Semantic Model Flow Diagram"
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
              EPISTEMIC SEPARATION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Observed vs. Predicted Architecture
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Observed History Transitioning into Predicted Future with Uncertainty
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-blue-500" />
            <span>Actual (Solid)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width={14} height={4} className="overflow-visible" aria-hidden="true">
              <line x1={0} y1={2} x2={14} y2={2} stroke="#10b981" strokeWidth={2} strokeDasharray="3 2" />
            </svg>
            <span>Forecast (Dashed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-emerald-500/25 border border-emerald-500/60" />
            <span>Range Band</span>
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
            <linearGradient id="forecast-band-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="40" y1="40" x2="820" y2="40" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="40" y1="90" x2="820" y2="90" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="40" y1="140" x2="820" y2="140" className="stroke-white/[0.06]" strokeDasharray="4 4" />
          <line x1="40" y1="190" x2="820" y2="190" className="stroke-white/[0.12]" />

          {/* Phase Separation Shading */}
          {/* Phase 1: Observed History */}
          <rect x="40" y="20" width="380" height="170" className="fill-blue-500/[0.02]" />
          <text x="50" y="35" className="text-[10px] font-mono fill-blue-400/80 uppercase font-semibold tracking-wider">
            Phase 1: Observed History (Definite Facts)
          </text>

          {/* Phase 2: Predicted Future */}
          <rect x="420" y="20" width="400" height="170" className="fill-emerald-500/[0.02]" />
          <text x="430" y="35" className="text-[10px] font-mono fill-emerald-400/80 uppercase font-semibold tracking-wider">
            Phase 2: Forecast Horizon (Prediction & Uncertainty)
          </text>

          {/* Transition Divider Line */}
          <line
            x1="420"
            y1="20"
            x2="420"
            y2="190"
            className="stroke-white/30"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <g transform="translate(420, 202)">
            <rect x="-42" y="-1" width="84" height="18" rx="4" className="fill-zinc-800 border border-white/10" />
            <text x="0" y="12" className="text-[9px] font-mono fill-zinc-300 font-bold text-anchor-middle">
              Apr (Transition)
            </text>
          </g>

          {/* X-axis ticks */}
          <text x="90" y="210" className="text-[10px] font-mono fill-zinc-500 text-anchor-middle">Jan</text>
          <text x="200" y="210" className="text-[10px] font-mono fill-zinc-500 text-anchor-middle">Feb</text>
          <text x="310" y="210" className="text-[10px] font-mono fill-zinc-500 text-anchor-middle">Mar</text>
          <text x="530" y="210" className="text-[10px] font-mono fill-zinc-400 text-anchor-middle">May</text>
          <text x="640" y="210" className="text-[10px] font-mono fill-zinc-400 text-anchor-middle">Jun</text>
          <text x="750" y="210" className="text-[10px] font-mono fill-zinc-400 text-anchor-middle">Jul</text>

          {/* 1. CONFIDENCE AREA (420px to 750px) */}
          <path
            d="M 420 110 L 530 85 L 640 65 L 750 45 L 750 155 L 640 145 L 530 135 L 420 110 Z"
            fill="url(#forecast-band-fill)"
            className="stroke-emerald-500/30"
            strokeWidth="1"
          />

          {/* 2. ACTUAL SOLID LINE (90px -> 420px) */}
          <path
            d="M 90 160 L 200 140 L 310 125 L 420 110"
            className="stroke-blue-500"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Actual Historical Dots */}
          <circle cx="90" cy="160" r="4.5" className="fill-blue-500 stroke-zinc-950" strokeWidth="2" />
          <circle cx="200" cy="140" r="4.5" className="fill-blue-500 stroke-zinc-950" strokeWidth="2" />
          <circle cx="310" cy="125" r="4.5" className="fill-blue-500 stroke-zinc-950" strokeWidth="2" />

          {/* 3. FORECAST DASHED LINE (420px -> 750px) */}
          <path
            d="M 420 110 L 530 100 L 640 92 L 750 82"
            className="stroke-emerald-500"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            fill="none"
          />

          {/* Forecast Dots */}
          <circle cx="530" cy="100" r="4.5" className="fill-emerald-500 stroke-zinc-950" strokeWidth="2" />
          <circle cx="640" cy="92" r="4.5" className="fill-emerald-500 stroke-zinc-950" strokeWidth="2" />
          <circle cx="750" cy="82" r="4.5" className="fill-emerald-500 stroke-zinc-950" strokeWidth="2" />

          {/* TRANSITION BRIDGE MARKER (420px, 110px) */}
          <circle cx="420" cy="110" r="8" className="fill-none stroke-emerald-400" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="420" cy="110" r="4.5" className="fill-blue-500 stroke-zinc-950" strokeWidth="1.5" />

          {/* Callout Labels */}
          <g transform="translate(180, 80)">
            <rect x="0" y="0" width="96" height="24" rx="6" className="fill-zinc-900/90 stroke-blue-500/40" />
            <text x="48" y="16" className="text-[10px] font-mono fill-blue-300 font-medium text-anchor-middle">
              Solid Actual Line
            </text>
          </g>

          <g transform="translate(560, 48)">
            <rect x="0" y="0" width="130" height="24" rx="6" className="fill-zinc-900/90 stroke-emerald-500/40" />
            <text x="65" y="16" className="text-[10px] font-mono fill-emerald-300 font-medium text-anchor-middle">
              Uncertainty Band [L, U]
            </text>
          </g>

          <g transform="translate(570, 118)">
            <rect x="0" y="0" width="120" height="24" rx="6" className="fill-zinc-900/90 stroke-emerald-500/40" />
            <text x="60" y="16" className="text-[10px] font-mono fill-emerald-300 font-medium text-anchor-middle">
              Dashed Forecast Line
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Callout */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-zinc-300 font-medium">
            Truthful Principle: Observed data is solid; predicted trajectory is dashed.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Confidence area renders only where valid bounds exist
        </span>
      </div>
    </figure>
  )
}

/**
 * Diagram 2: Forecast Transition Flow
 * Visualizes the 3 transition boundary topologies:
 * A: Shared Bridge Observation (continuous handoff)
 * B: Discontinuous Separation (history ends, gap before forecast starts)
 * C: Overlapping Actual & Forecast (backtesting/evaluation timeline)
 */
export function ForecastTransitionFlow() {
  return (
    <figure
      role="region"
      aria-label="Forecast Line Transition Topologies Diagram"
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
              BOUNDARY SEMANTICS
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Transition Topologies
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            How Plotcn Truthfully Resolves the Forecast Transition Boundary
          </h4>
        </div>
      </div>

      {/* 3 Transition Columns */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario A: Shared Bridge */}
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-white">Model A: Shared Bridge</span>
              <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                Continuous
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              The final actual observation shares the exact coordinate and value with the first forecast observation.
            </p>
          </div>
          {/* Mini SVG Diagram */}
          <div className="w-full bg-zinc-950/80 rounded-lg p-2 border border-white/[0.04]">
            <svg viewBox="0 0 220 80" className="w-full h-auto" fill="none">
              <line x1="10" y1="55" x2="90" y2="35" stroke="#3b82f6" strokeWidth="2.5" />
              <line x1="90" y1="35" x2="200" y2="20" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 3" />
              <circle cx="10" cy="55" r="3.5" fill="#3b82f6" />
              <circle cx="50" cy="45" r="3.5" fill="#3b82f6" />
              {/* Bridge point */}
              <circle cx="90" cy="35" r="6" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx="90" cy="35" r="3.5" fill="#3b82f6" />
              <circle cx="145" cy="28" r="3.5" fill="#10b981" />
              <circle cx="200" cy="20" r="3.5" fill="#10b981" />
              <text x="90" y="70" className="text-[9px] font-mono fill-zinc-400 text-anchor-middle">Mar (Bridge)</text>
            </svg>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 border-t border-white/[0.04] pt-2">
            ✓ Seamless visual handoff without fabricating data.
          </div>
        </div>

        {/* Scenario B: Discontinuous Gap */}
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-white">Model B: Separate Gap</span>
              <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">
                Discontinuous
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Actual history ends at Mar, and forecast begins at Apr with no shared bridge point.
            </p>
          </div>
          {/* Mini SVG Diagram */}
          <div className="w-full bg-zinc-950/80 rounded-lg p-2 border border-white/[0.04]">
            <svg viewBox="0 0 220 80" className="w-full h-auto" fill="none">
              <line x1="10" y1="55" x2="80" y2="40" stroke="#3b82f6" strokeWidth="2.5" />
              <line x1="130" y1="28" x2="200" y2="18" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 3" />
              <circle cx="10" cy="55" r="3.5" fill="#3b82f6" />
              <circle cx="80" cy="40" r="3.5" fill="#3b82f6" />
              {/* Gap annotation */}
              <line x1="80" y1="40" x2="130" y2="28" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="130" cy="28" r="3.5" fill="#10b981" />
              <circle cx="200" cy="18" r="3.5" fill="#10b981" />
              <text x="105" y="70" className="text-[9px] font-mono fill-amber-400 text-anchor-middle">Honest Gap</text>
            </svg>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 border-t border-white/[0.04] pt-2">
            ✓ Honest separation; never secretly bridges missing data.
          </div>
        </div>

        {/* Scenario C: Overlapping Actual & Forecast */}
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-white">Model C: Overlap Period</span>
              <span className="text-[10px] font-mono text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/10">
                Evaluation
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Both actual and forecast exist across multiple intervals for backtesting or model evaluation.
            </p>
          </div>
          {/* Mini SVG Diagram */}
          <div className="w-full bg-zinc-950/80 rounded-lg p-2 border border-white/[0.04]">
            <svg viewBox="0 0 220 80" className="w-full h-auto" fill="none">
              <path d="M 10 60 L 60 50 L 120 42 L 180 30" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
              <path d="M 60 55 L 120 48 L 180 38 L 210 32" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 3" fill="none" />
              <circle cx="60" cy="50" r="3" fill="#3b82f6" />
              <circle cx="120" cy="42" r="3" fill="#3b82f6" />
              <circle cx="180" cy="30" r="3" fill="#3b82f6" />
              <circle cx="60" cy="55" r="3" fill="#10b981" />
              <circle cx="120" cy="48" r="3" fill="#10b981" />
              <circle cx="180" cy="38" r="3" fill="#10b981" />
              <text x="120" y="70" className="text-[9px] font-mono fill-sky-300 text-anchor-middle">Coexisting Signals</text>
            </svg>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 border-t border-white/[0.04] pt-2">
            ✓ Both signals rendered faithfully without hiding actuals.
          </div>
        </div>
      </div>
    </figure>
  )
}
