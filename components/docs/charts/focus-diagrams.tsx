"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CursorPointer01Icon,
  KeyboardIcon,
  LockKeyIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons"

/**
 * Focus Line Diagram 1: Tri-State Mental Model Flow
 * Visualizes the 3 strictly decoupled states:
 * 1. FOCUS (Keyboard entry shell --chart-focus)
 * 2. ACTIVE DATUM (Transient inspection dot + neutral crosshair --chart-crosshair)
 * 3. LOCKED DATUM (Concentric marker ◎ + persistent crosshair + pinned tooltip)
 */
export function FocusModelFlow() {
  return (
    <figure
      role="region"
      aria-label="Focus Line Tri-State Mental Model Flow Diagram"
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
              SVG FLOW ANIMATION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              State Decoupling Architecture
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Focus vs. Active Datum vs. Locked Selection
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-sky-400 bg-sky-500/20" />
            <span>Chart Focus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" />
            <span>Active Point</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-amber-400 bg-amber-400" />
            <span>Locked Pin</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <div className="min-w-[660px]">
          <svg
            viewBox="0 0 760 250"
            className="w-full h-auto select-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="focusLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="68%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
              </linearGradient>

              <style>{`
                @keyframes focusDashAnim {
                  to { stroke-dashoffset: -32; }
                }
                .animate-focus-flow {
                  stroke-dasharray: 6 6;
                  animation: focusDashAnim 2.5s linear infinite;
                }
                @keyframes focusPulseRing {
                  0%, 100% { r: 8; opacity: 0.9; }
                  50% { r: 11; opacity: 0.4; }
                }
                .animate-focus-ring {
                  animation: focusPulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
              `}</style>
            </defs>

            {/* 1. Root Container Focus Shell (tabIndex={0} Focus Ring) */}
            <rect
              x="25"
              y="20"
              width="710"
              height="205"
              rx="12"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-focus-flow"
              opacity="0.85"
            />
            <g transform="translate(40, 36)">
              <rect x="0" y="0" width="130" height="18" rx="4" fill="#0369a1" fillOpacity="0.3" stroke="#0284c7" strokeWidth="1" />
              <text x="65" y="12.5" fill="#38bdf8" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="600">
                ROOT FOCUS RING
              </text>
            </g>

            {/* 2. Grid lines */}
            <line x1="45" y1="180" x2="715" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="45" y1="130" x2="715" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="45" y1="80" x2="715" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

            {/* 3. Primary Line Signal */}
            <path
              d="M 60,165 C 130,175 190,140 270,145 C 340,150 400,105 480,95 C 550,88 620,135 695,120"
              fill="none"
              stroke="url(#focusLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 4. Transient Active Datum: X=270, Y=145 (11:00, 147ms) */}
            <g transform="translate(270, 0)">
              {/* Vertical Crosshair Line */}
              <line x1="0" y1="50" x2="0" y2="195" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              
              {/* Active Marker: Solid Point */}
              <circle cx="0" cy="145" r="4.5" fill="#3b82f6" stroke="#09090b" strokeWidth="2" />

              {/* Transient Label Bubble */}
              <g transform="translate(0, 52)">
                <rect x="-42" y="0" width="84" height="26" rx="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />
                <text x="0" y="12" fill="#a1a1aa" fontSize="8.5" fontFamily="ui-monospace, monospace" textAnchor="middle">
                  11:00 · TRANSIENT
                </text>
                <text x="0" y="21" fill="#38bdf8" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="700">
                  147 ms
                </text>
              </g>
            </g>

            {/* 5. Locked Datum: X=480, Y=95 (14:00, 181ms) */}
            <g transform="translate(480, 0)">
              {/* Persistent Crosshair Line */}
              <line x1="0" y1="40" x2="0" y2="195" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.9" />

              {/* Locked Concentric Double-Ring Marker ───◎─── */}
              <circle cx="0" cy="95" r="8.5" fill="none" stroke="#f59e0b" strokeWidth="1.75" className="animate-focus-ring" />
              <circle cx="0" cy="95" r="4" fill="#f59e0b" stroke="#09090b" strokeWidth="1.5" />

              {/* Locked Pinned Tooltip */}
              <g transform="translate(0, 32)">
                <rect x="-56" y="0" width="112" height="36" rx="6" fill="#1c1917" stroke="#d97706" strokeWidth="1.2" />
                <circle cx="-42" cy="12" r="3" fill="#f59e0b" />
                <text x="-34" y="15" fill="#fbbf24" fontSize="8.5" fontFamily="ui-monospace, monospace" fontWeight="700">
                  LOCKED (PINNED)
                </text>
                <text x="0" y="29" fill="#f5f5f4" fontSize="10.5" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="700">
                  14:00 · 181 ms
                </text>
              </g>
            </g>

            {/* 6. Action Interaction Vectors */}
            <g transform="translate(375, 140)">
              <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#09090b" stroke="#27272a" strokeWidth="1" />
              <text x="0" y="3" fill="#e4e4e7" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
                Enter / Click to Lock →
              </text>
            </g>

            {/* 7. Bottom X-Axis Ticks */}
            <g transform="translate(0, 205)">
              <text x="60" y="0" fill="#71717a" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle">09:00</text>
              <text x="165" y="0" fill="#71717a" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle">10:00</text>
              <text x="270" y="0" fill="#38bdf8" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="600">11:00</text>
              <text x="375" y="0" fill="#71717a" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle">12:00</text>
              <text x="480" y="0" fill="#fbbf24" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle" fontWeight="700">14:00 [Locked]</text>
              <text x="585" y="0" fill="#71717a" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle">15:00</text>
              <text x="695" y="0" fill="#71717a" fontSize="9.5" fontFamily="ui-monospace, monospace" textAnchor="middle">16:00</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Feature Explanations */}
      <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
        <div className="rounded-xl border border-sky-500/20 bg-sky-950/20 p-3.5 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={KeyboardIcon} size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-200">1. Focus (Navigation)</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Chart root <code className="text-sky-300 font-mono">figure tabIndex=0</code> receives keyboard input via <code className="text-sky-300 font-mono">--chart-focus</code>. Single tab stop, no point spam.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={EyeIcon} size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-200">2. Active (Inspection)</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Transient observation resolved via horizontal pointer scrub or Left/Right arrows. Disappears on pointer leave unless locked.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <HugeiconsIcon icon={LockKeyIcon} size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-200">3. Locked (Selection)</div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Pinned observation with concentric ring <code className="text-amber-300 font-mono">───◎───</code> and persistent tooltip that survives pointer leave, color updates, and resizes.
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}

/**
 * Focus Line Diagram 2: Input Modality & Nearest-X Inspection Pipeline
 * Visualizes how pointer scrubbing and keyboard navigation cleanly converge
 * into a single unified observation model.
 */
export function FocusInspectionFlow() {
  return (
    <figure
      role="region"
      aria-label="Focus Line Dual Input Modality and Inspection Pipeline Flow Diagram"
      className="my-8 w-full rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-900/40 p-4 sm:p-6 relative overflow-hidden not-prose shadow-2xl backdrop-blur-md"
    >
      <div className="relative z-10 space-y-4">
        {/* Step 1: Modalities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-950/15 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <HugeiconsIcon icon={CursorPointer01Icon} size={16} />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-blue-300">
                Pointer Scrubbing (Horizontal Nearest-X)
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Pointer enters anywhere in the plot frame. X-coordinate calculates Euclidean nearest categorical/temporal observation without requiring a 2px stroke hit.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-950/15 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
              <HugeiconsIcon icon={KeyboardIcon} size={16} />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-sky-300">
                Keyboard Stepping (ArrowLeft / ArrowRight)
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Single tab stop on root figure. Left/Right moves through ordered sequence; Home/End jumps directly to boundaries; Enter/Space locks or unlocks.
              </p>
            </div>
          </div>
        </div>

        {/* Transition Arrow */}
        <div className="flex items-center justify-center text-zinc-600">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/80 px-3 py-1 rounded-full border border-white/[0.08]">
            Unified Observation Arbitration
          </span>
        </div>

        {/* Step 2: Unified Pipeline */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-semibold text-white">
                Truthful Datum Normalization
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                No interpolated fake values · Gaps preserved (<code className="text-amber-300 font-mono">null</code> is not <code className="text-red-300 font-mono">0</code>) · NaN and Infinity safely filtered
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-1 rounded text-[10px] font-mono text-zinc-300 bg-zinc-800/60 border border-white/[0.06]">
              Escape: Unlock
            </span>
            <span className="px-2 py-1 rounded text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20">
              Enter/Click: Lock
            </span>
          </div>
        </div>
      </div>
    </figure>
  )
}
