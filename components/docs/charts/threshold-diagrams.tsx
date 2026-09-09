"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  Layers01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons"

/**
 * Threshold Line Diagram 1: Continuous Signal Relative to Horizontal Boundaries & Operating Bands
 * Visualizes the core analytical question: "Where is the signal relative to the boundaries that matter?"
 */
export function ThresholdModelFlow() {
  const signalPathD = "M 40,145 C 120,155 180,120 280,135 C 380,150 440,75 520,48 C 600,20 660,110 720,140"

  return (
    <figure
      role="region"
      aria-label="Threshold Line Continuous Signal and Horizontal Boundaries Flow Diagram"
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
              Mental Model Architecture
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Horizontal Boundaries & Target Operating Regions
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-blue-400" />
            <span>Signal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-amber-400" />
            <span>Boundary Line</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-emerald-500/30 border border-emerald-400/50" />
            <span>Target Region</span>
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
              <linearGradient id="thresholdSignalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="65%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              <style>{`
                @keyframes thresholdDashAnim {
                  to { stroke-dashoffset: -32; }
                }
                .animate-threshold-flow {
                  stroke-dasharray: 6 6;
                  animation: thresholdDashAnim 2.5s linear infinite;
                }
              `}</style>
            </defs>

            {/* 1. Target Operating Band (ReferenceArea) between Y = 110 and Y = 165 */}
            <rect
              x="30"
              y="110"
              width="700"
              height="55"
              fill="#10b981"
              fillOpacity="0.1"
              stroke="#10b981"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
              strokeWidth="1"
              rx="4"
            />
            <g transform="translate(685, 125)">
              <rect x="-140" y="0" width="140" height="20" rx="4" fill="#064e3b" stroke="#059669" strokeWidth="1" />
              <text x="-70" y="14" fill="#6ee7b7" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="600">
                Operating Band (130-190ms)
              </text>
            </g>

            {/* 2. Cartesian Grid Reference Lines */}
            <line x1="30" y1="190" x2="730" y2="190" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <line x1="30" y1="90" x2="730" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

            {/* 3. Hard SLA Threshold Boundary (ReferenceLine) at Y = 50 */}
            <line
              x1="30"
              y1="50"
              x2="730"
              y2="50"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <g transform="translate(685, 38)">
              <rect x="-115" y="0" width="115" height="20" rx="4" fill="#78350f" stroke="#d97706" strokeWidth="1" />
              <text x="-58" y="14" fill="#fde68a" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="600">
                SLA Ceiling (300ms)
              </text>
            </g>

            {/* 4. Continuous Metric Signal Path */}
            <path
              d={signalPathD}
              fill="none"
              stroke="url(#thresholdSignalGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Animated dashed dashoffset overlay */}
            <path
              d={signalPathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeOpacity="0.75"
              strokeLinecap="round"
              className="animate-threshold-flow motion-reduce:hidden"
            />

            {/* Observation Vertex Dots */}
            <circle cx="40" cy="145" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="150" cy="140" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="280" cy="135" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="410" cy="95" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="520" cy="48" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            <circle cx="630" cy="65" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="720" cy="140" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />

            {/* Exceedance indicator callout */}
            <g transform="translate(520, 22)">
              <rect x="-42" y="0" width="84" height="18" rx="4" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" />
              <text x="0" y="13" fill="#fca5a5" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="700">
                Boundary Cross
              </text>
            </g>

            {/* Animated Energy Particle */}
            <circle r="6" fill="#60a5fa" opacity="0.4" className="motion-reduce:hidden">
              <animateMotion dur="4.5s" repeatCount="indefinite" path={signalPathD} />
            </circle>
            <circle r="3" fill="#ffffff" className="motion-reduce:hidden">
              <animateMotion dur="4.5s" repeatCount="indefinite" path={signalPathD} />
            </circle>

            {/* Bottom Coordinate Indicators */}
            <g transform="translate(30, 205)">
              <text x="10" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                00:00
              </text>
              <text x="120" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                04:00
              </text>
              <text x="250" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                08:00
              </text>
              <text x="380" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                12:00
              </text>
              <text x="490" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                16:00
              </text>
              <text x="600" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                20:00
              </text>
              <text x="690" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                23:59
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={Activity01Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Continuous Signal Trend</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Unbroken quantitative telemetry series with honest gap handling for missing periods.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={Layers01Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Boundary Reference Lines</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Horizontal limits spanning the entire domain with inside top-right labels.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Target Operating Bands</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Bounded regions layered cleanly beneath the Cartesian grid for zero obstruction.
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}

/**
 * Threshold Line Diagram 2: Architecture & Rendering Layering Flow
 * Visualizes the separated data streams and strict SVG layering order
 */
export function ThresholdContextFlow() {
  return (
    <figure
      role="region"
      aria-label="Threshold Line Decoupled Architecture and SVG Layering Order Flow"
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md"
    >
      <div className="relative z-10 space-y-4">
        {/* Stream 1: Telemetry Data */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-950/15">
          <div className="flex items-center gap-2.5 sm:w-60 shrink-0">
            <div className="size-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-blue-300">
              TimeSeries Observations
            </span>
          </div>
          <div className="hidden sm:flex items-center justify-center text-blue-500/50">
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </div>
          <div className="flex-1 text-xs text-zinc-300">
            <span className="font-semibold text-white">Recharts Line (Top Layer)</span> — Continuous primary metric stroke rendered on top of all reference guides.
          </div>
        </div>

        {/* Stream 2: Threshold Boundaries */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/15">
          <div className="flex items-center gap-2.5 sm:w-60 shrink-0">
            <div className="size-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-amber-300">
              Threshold Boundaries (line)
            </span>
          </div>
          <div className="hidden sm:flex items-center justify-center text-amber-500/50">
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </div>
          <div className="flex-1 text-xs text-zinc-300">
            <span className="font-semibold text-white">ReferenceLine</span> — Horizontal dashed limit lines with collision-safe labels positioned inside the Cartesian frame.
          </div>
        </div>

        {/* Stream 3: Operating Regions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/15">
          <div className="flex items-center gap-2.5 sm:w-60 shrink-0">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-300">
              Operating Bands (region)
            </span>
          </div>
          <div className="hidden sm:flex items-center justify-center text-emerald-500/50">
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </div>
          <div className="flex-1 text-xs text-zinc-300">
            <span className="font-semibold text-white">ReferenceArea (Base Layer)</span> — Soft semi-transparent fills positioned beneath CartesianGrid and the primary signal.
          </div>
        </div>
      </div>
    </figure>
  )
}
