"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Activity01Icon,
  Clock01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons"

/**
 * Diagram 1: Step Signal Persistence vs Transition Flow
 * Replaces ASCII text diagram:
 * 10,000 req/min ────────────┐
 *                            │ (discrete change at milestone)
 *                            └────────15,000 req/min ──────────┐
 *                                                              │
 *                                                              └────12,000 req/min
 */
export function StepSignalFlowDiagram() {
  const stepPathD = "M 45,70 L 250,70 L 250,140 L 490,140 L 490,100 L 715,100"

  return (
    <figure
      role="region"
      aria-label="Step Signal State Persistence and Discrete Transition Flow Diagram"
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
              State Persistence Architecture
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Discrete Level Persistence & Boundary Transitions
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-emerald-400" />
            <span>Active Level</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-amber-400" />
            <span>90° Boundary</span>
          </div>
        </div>
      </div>

      {/* SVG Flow Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <div className="min-w-[620px]">
          <svg
            viewBox="0 0 760 210"
            className="w-full h-auto select-none"
            aria-hidden="true"
          >
            <defs>
              {/* Linear gradient along path */}
              <linearGradient id="stepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="45%" stopColor="#34d399" />
                <stop offset="70%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="stepGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Animated dash pattern */}
              <style>{`
                @keyframes stepFlowDashAnim {
                  to { stroke-dashoffset: -40; }
                }
                .animate-step-flow {
                  stroke-dasharray: 8 6;
                  animation: stepFlowDashAnim 3s linear infinite;
                }
              `}</style>
            </defs>

            {/* Subtle horizontal reference baselines */}
            <line x1="30" y1="70" x2="730" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="30" y1="100" x2="730" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="30" y1="140" x2="730" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* Ghost background track */}
            <path
              d={stepPathD}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active primary stepped path */}
            <path
              id="stepSignalPathTrack"
              d={stepPathD}
              fill="none"
              stroke="url(#stepGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#stepGlow)"
            />

            {/* Flowing animated dash beam */}
            <path
              d={stepPathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-step-flow motion-reduce:hidden"
            />

            {/* Traveling energy photon */}
            <circle r="7" fill="#34d399" opacity="0.3" className="motion-reduce:hidden">
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path={stepPathD}
              />
            </circle>
            <circle r="3.5" fill="#ffffff" className="motion-reduce:hidden">
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path={stepPathD}
              />
            </circle>

            {/* Segment 1: 10,000 req/min */}
            <g transform="translate(45, 36)">
              <rect
                x="0"
                y="0"
                width="135"
                height="24"
                rx="6"
                fill="#09090b"
                stroke="#10b981"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              <circle cx="10" cy="12" r="3" fill="#10b981" />
              <text
                x="20"
                y="16"
                fill="#ffffff"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="600"
              >
                10,000 req/min
              </text>
            </g>

            {/* Milestone 1: 90° Discrete Transition */}
            <g transform="translate(250, 70)">
              {/* Pulsing beacon */}
              <circle cx="0" cy="0" r="10" fill="#f59e0b" opacity="0.18" className="motion-reduce:hidden">
                <animate attributeName="r" values="6;13;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(250, 140)">
              <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* Milestone 1 Annotation Badge */}
            <g transform="translate(262, 96)">
              <rect
                x="0"
                y="0"
                width="190"
                height="22"
                rx="5"
                fill="#18181b"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <text
                x="8"
                y="15"
                fill="#fbbf24"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fontWeight="500"
              >
                discrete change at milestone
              </text>
            </g>

            {/* Segment 2: 15,000 req/min */}
            <g transform="translate(290, 150)">
              <rect
                x="0"
                y="0"
                width="135"
                height="24"
                rx="6"
                fill="#09090b"
                stroke="#0ea5e9"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              <circle cx="10" cy="12" r="3" fill="#0ea5e9" />
              <text
                x="20"
                y="16"
                fill="#ffffff"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="600"
              >
                15,000 req/min
              </text>
            </g>

            {/* Milestone 2: 90° Discrete Transition */}
            <g transform="translate(490, 140)">
              <circle cx="0" cy="0" r="10" fill="#f59e0b" opacity="0.18" className="motion-reduce:hidden">
                <animate attributeName="r" values="6;13;6" dur="2s" begin="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(490, 100)">
              <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* Milestone 2 Annotation Badge */}
            <g transform="translate(502, 114)">
              <rect
                x="0"
                y="0"
                width="190"
                height="22"
                rx="5"
                fill="#18181b"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <text
                x="8"
                y="15"
                fill="#fbbf24"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fontWeight="500"
              >
                discrete change at milestone
              </text>
            </g>

            {/* Segment 3: 12,000 req/min */}
            <g transform="translate(570, 66)">
              <rect
                x="0"
                y="0"
                width="135"
                height="24"
                rx="6"
                fill="#09090b"
                stroke="#06b6d4"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              <circle cx="10" cy="12" r="3" fill="#06b6d4" />
              <text
                x="20"
                y="16"
                fill="#ffffff"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="600"
              >
                12,000 req/min
              </text>
            </g>

            {/* Timeline coordinates footer */}
            <g transform="translate(45, 195)">
              <text x="0" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                Observation 01 (Jan 01)
              </text>
              <text x="205" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                Observation 02 (Mar 01)
              </text>
              <text x="445" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                Observation 03 (Apr 15)
              </text>
              <text x="635" y="0" fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                Ongoing
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Semantic Footprint Cards */}
      <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={Clock01Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Horizontal = Duration</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Levels remain active and constant across time intervals. No artificial drift.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={Activity01Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Vertical = Transition</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Clean 90° boundary at the milestone. Zero time spent at intermediate states.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">Truthful State Model</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Engineered specifically for quotas, rate plans, and discrete system states.
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}

/**
 * Diagram 2: Step Model Interval & Transition Anatomy
 * Replaces ASCII text diagram:
 * Observation A (Jan 01)
 * value = 10,000
 *        │
 *        └──────── active level remains in effect across interval
 *                                                                │
 *                                                                ▼
 * Observation B (Apr 15)                          discrete transition occurs
 * value = 15,000 ───────────────────────────────────────────────┘
 *        │
 *        └──────── new active level remains in effect
 */
export function StepSignalTransitionModelFlow() {
  const transitionPathD = "M 80,140 L 440,140 L 440,70 L 700,70"

  return (
    <figure
      role="region"
      aria-label="Step Model Interval and Discrete Transition Anatomy Diagram"
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
              INTERVAL & TRANSITION ANATOMY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Mathematical Coordinate Model
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Interval Persistence vs Instantaneous Step Shift
          </h4>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Interval: <span className="text-emerald-400">104 days</span> · Shift: <span className="text-amber-400">0 days (Instant)</span>
        </div>
      </div>

      {/* SVG Flow Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <div className="min-w-[640px]">
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto select-none"
            aria-hidden="true"
          >
            <defs>
              {/* Stepped gradient */}
              <linearGradient id="transitionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="65%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Marker Arrow for transition point */}
              <marker
                id="stepArrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
              </marker>

              <style>{`
                @keyframes transitionDashAnim {
                  to { stroke-dashoffset: -36; }
                }
                .animate-transition-flow {
                  stroke-dasharray: 6 6;
                  animation: transitionDashAnim 2.4s linear infinite;
                }
              `}</style>
            </defs>

            {/* Baseline grid */}
            <line x1="40" y1="140" x2="720" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="40" y1="70" x2="720" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

            {/* False continuous diagonal slope comparison (ghost line) */}
            <line
              x1="80"
              y1="140"
              x2="440"
              y2="70"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.45"
            />
            <g transform="translate(190, 96)">
              <rect x="0" y="0" width="170" height="18" rx="4" fill="#09090b" stroke="#ef4444" strokeWidth="0.8" strokeOpacity="0.3" />
              <text x="6" y="12.5" fill="#f87171" fontSize="9" fontFamily="ui-monospace, monospace">
                ✕ False Continuous Slope
              </text>
            </g>

            {/* True stepped path track */}
            <path
              d={transitionPathD}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active primary line */}
            <path
              d={transitionPathD}
              fill="none"
              stroke="url(#transitionGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Flowing animated dash beam */}
            <path
              d={transitionPathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeOpacity="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-transition-flow motion-reduce:hidden"
            />

            {/* Particle motion along trajectory */}
            <circle r="7" fill="#38bdf8" opacity="0.35" className="motion-reduce:hidden">
              <animateMotion
                dur="4.2s"
                repeatCount="indefinite"
                path={transitionPathD}
              />
            </circle>
            <circle r="3.5" fill="#ffffff" className="motion-reduce:hidden">
              <animateMotion
                dur="4.2s"
                repeatCount="indefinite"
                path={transitionPathD}
              />
            </circle>

            {/* Observation A Card */}
            <g transform="translate(30, 160)">
              <rect
                x="0"
                y="0"
                width="165"
                height="46"
                rx="8"
                fill="#09090b"
                stroke="#10b981"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <text x="12" y="19" fill="#10b981" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600">
                Observation A
              </text>
              <text x="12" y="34" fill="#a1a1aa" fontSize="10" fontFamily="ui-monospace, monospace">
                Jan 01 · value = 10,000
              </text>
            </g>

            {/* Observation A Node */}
            <circle cx="80" cy="140" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <line x1="80" y1="140" x2="80" y2="160" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />

            {/* Interval Annotation on Horizontal Beam */}
            <g transform="translate(130, 150)">
              <rect x="0" y="0" width="260" height="22" rx="5" fill="#18181b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1" />
              <text x="10" y="15" fill="#e4e4e7" fontSize="10" fontFamily="ui-monospace, monospace">
                active level remains in effect across interval
              </text>
            </g>

            {/* Transition Event at x = 440 */}
            <g transform="translate(440, 70)">
              <circle cx="0" cy="0" r="11" fill="#f59e0b" opacity="0.2" className="motion-reduce:hidden">
                <animate attributeName="r" values="7;14;7" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0.05;0.35" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            </g>
            <circle cx="440" cy="140" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

            {/* Vertical Transition Guide Line with Arrow */}
            <line
              x1="440"
              y1="135"
              x2="440"
              y2="80"
              stroke="#f59e0b"
              strokeWidth="2"
              markerEnd="url(#stepArrow)"
            />

            {/* Discrete Transition Occurs Badge */}
            <g transform="translate(452, 98)">
              <rect
                x="0"
                y="0"
                width="170"
                height="24"
                rx="6"
                fill="#18181b"
                stroke="#f59e0b"
                strokeWidth="1.2"
              />
              <text x="10" y="16" fill="#fbbf24" fontSize="10" fontFamily="ui-monospace, monospace" fontWeight="600">
                discrete transition occurs
              </text>
            </g>

            {/* Observation B Card */}
            <g transform="translate(420, 15)">
              <rect
                x="0"
                y="0"
                width="165"
                height="46"
                rx="8"
                fill="#09090b"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <text x="12" y="19" fill="#38bdf8" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600">
                Observation B
              </text>
              <text x="12" y="34" fill="#a1a1aa" fontSize="10" fontFamily="ui-monospace, monospace">
                Apr 15 · value = 15,000
              </text>
            </g>
            <line x1="440" y1="61" x2="440" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

            {/* Next Active Level Annotation */}
            <g transform="translate(490, 80)">
              <rect x="0" y="0" width="215" height="22" rx="5" fill="#18181b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1" />
              <text x="10" y="15" fill="#38bdf8" fontSize="10" fontFamily="ui-monospace, monospace">
                new active level remains in effect
              </text>
            </g>

            <circle cx="700" cy="70" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Analytical Truth Footnote */}
      <div className="relative z-10 mt-5 p-3 rounded-xl border border-white/[0.06] bg-zinc-950/60 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">✓ Invariant:</span>
          <span>Between Jan 01 and Apr 15, the system never operated at 12,500.</span>
        </div>
        <div className="hidden sm:block text-zinc-500">
          stepMode=&quot;after&quot;
        </div>
      </div>
    </figure>
  )
}
