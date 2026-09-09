"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Flag01Icon,
  ChartBarLineIcon,
  Layers01Icon,
  Calendar01Icon,
  Compass01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

/**
 * Milestone Line Diagram 1: Top Annotation Lane & Sparse Milestone Guides
 * Replaces ASCII diagram:
 *                   [V2 Launch]               [Enterprise]
 *                        ●                          ●
 *                        │                          │
 *         ┌──────────────┼──────────┐               │
 *         │              │          └───────────────┼─────────►
 *         ▼              ▼                          ▼
 *    Observation     Milestone                 Observation
 *       Point          Guide                      Point
 */
export function MilestoneAnnotationFlow() {
  const trendPathD = "M 40,155 Q 160,140 260,110 T 520,70 T 720,40"

  return (
    <figure
      role="region"
      aria-label="Milestone Line Top Annotation Lane and Vertical Guides Flow Diagram"
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
              Top Annotation Lane Architecture
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Decoupled Event Pins & Quantitative Trend Geometry
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-emerald-400" />
            <span>Metric Trend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-purple-400" />
            <span>Milestone Pin</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <div className="min-w-[640px]">
          <svg
            viewBox="0 0 760 220"
            className="w-full h-auto select-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="milestoneTrendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <style>{`
                @keyframes milestoneFlowPulse {
                  0%, 100% { opacity: 0.2; transform: scale(1); }
                  50% { opacity: 0.9; transform: scale(1.1); }
                }
                @keyframes milestoneDashAnim {
                  to { stroke-dashoffset: -32; }
                }
                .animate-milestone-flow {
                  stroke-dasharray: 6 6;
                  animation: milestoneDashAnim 2.5s linear infinite;
                }
              `}</style>
            </defs>

            {/* Top Dedicated Annotation Lane Header Box */}
            <rect
              x="30"
              y="12"
              width="700"
              height="34"
              rx="6"
              fill="#18181b"
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
            <text x="45" y="33" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace" fontWeight="600">
              TOP ANNOTATION LANE (ZERO Y-AXIS DISTORTION)
            </text>

            {/* Milestone 1: V2 Launch at x = 280 */}
            <g transform="translate(280, 18)">
              <rect x="-48" y="0" width="96" height="22" rx="5" fill="#581c87" stroke="#a855f7" strokeWidth="1" />
              <text x="0" y="15" fill="#f3e8ff" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="600">
                [V2 Launch]
              </text>
            </g>
            <circle cx="280" cy="40" r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="280" y1="45" x2="280" y2="190" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

            {/* Milestone 2: Enterprise at x = 540 */}
            <g transform="translate(540, 18)">
              <rect x="-48" y="0" width="96" height="22" rx="5" fill="#581c87" stroke="#a855f7" strokeWidth="1" />
              <text x="0" y="15" fill="#f3e8ff" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="600">
                [Enterprise]
              </text>
            </g>
            <circle cx="540" cy="40" r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="540" y1="45" x2="540" y2="190" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

            {/* Trend line path */}
            <path
              d={trendPathD}
              fill="none"
              stroke="url(#milestoneTrendGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Flowing animated dash */}
            <path
              d={trendPathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
              className="animate-milestone-flow motion-reduce:hidden"
            />

            {/* Observation Vertices */}
            {/* Jan */}
            <circle cx="40" cy="155" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            {/* Feb */}
            <circle cx="160" cy="138" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            {/* Mar */}
            <circle cx="280" cy="108" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
            {/* Apr */}
            <circle cx="400" cy="88" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            {/* May */}
            <circle cx="540" cy="68" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
            {/* Jun */}
            <circle cx="640" cy="52" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
            {/* Jul */}
            <circle cx="720" cy="40" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Moving particle along trend */}
            <circle r="6" fill="#34d399" opacity="0.4" className="motion-reduce:hidden">
              <animateMotion dur="5s" repeatCount="indefinite" path={trendPathD} />
            </circle>
            <circle r="3" fill="#ffffff" className="motion-reduce:hidden">
              <animateMotion dur="5s" repeatCount="indefinite" path={trendPathD} />
            </circle>

            {/* Bottom Pointer Legend */}
            <g transform="translate(130, 195)">
              <rect x="0" y="0" width="130" height="20" rx="4" fill="#09090b" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />
              <text x="12" y="14" fill="#10b981" fontSize="10" fontFamily="ui-monospace, monospace">
                ▲ Observation Point
              </text>
            </g>

            <g transform="translate(280, 195)">
              <rect x="-65" y="0" width="130" height="20" rx="4" fill="#09090b" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
              <text x="0" y="14" fill="#c084fc" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
                ▲ Milestone Guide
              </text>
            </g>

            <g transform="translate(540, 195)">
              <rect x="-65" y="0" width="130" height="20" rx="4" fill="#09090b" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
              <text x="0" y="14" fill="#c084fc" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
                ▲ Milestone Guide
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Highlights */}
      <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={ChartBarLineIcon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Continuous Metric Trend</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Clean quantitative line vertices representing real observation values.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={Flag01Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Decoupled Top Lane</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Pins remain in their own collision-free space. Zero fake Y-interpolation.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Vertical Context Guides</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Subtle dashed reference lines connect events cleanly to the timeline.
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}

/**
 * Milestone Line Diagram 2: Independent Semantic Layers Flow
 * Replaces ASCII diagram:
 * Ordered observations ──────► Recharts Line (primary quantitative trend)
 *                                    │
 * Sparse milestone collection ─► Top Annotation Lane + Vertical Guides + Pins
 */
export function MilestoneLayerFlow() {
  return (
    <figure
      role="region"
      aria-label="Milestone Line Dual-Layer Semantic Architecture Flow"
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md"
    >
      <div className="relative z-10 space-y-4">
        {/* Layer 1: Quantitative Trend Stream */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/15">
          <div className="flex items-center gap-2.5 sm:w-60 shrink-0">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-300">
              Ordered Observations
            </span>
          </div>
          <div className="hidden sm:flex items-center justify-center text-emerald-500/50">
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </div>
          <div className="flex-1 text-xs text-zinc-300">
            <span className="font-semibold text-white">Recharts Line</span> — Primary quantitative Cartesian series with continuous path interpolation.
          </div>
        </div>

        {/* Layer 2: Sparse Context Stream */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-purple-500/20 bg-purple-950/15">
          <div className="flex items-center gap-2.5 sm:w-60 shrink-0">
            <div className="size-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-purple-300">
              Sparse Milestones
            </span>
          </div>
          <div className="hidden sm:flex items-center justify-center text-purple-500/50">
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </div>
          <div className="flex-1 text-xs text-zinc-300">
            <span className="font-semibold text-white">Top Annotation Lane + Guides</span> — Coordinated vertical reference pins positioned strictly along horizontal time domain.
          </div>
        </div>
      </div>
    </figure>
  )
}
