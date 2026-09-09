"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CursorPointer01Icon,
  KeyboardIcon,
  LockKeyIcon,
  EyeIcon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"

/* -------------------------------------------------------------------------- */
/*  Diagram 1: Inspection Model Flow                                          */
/* -------------------------------------------------------------------------- */

export function InteractiveAreaInspectionDiagram() {
  const titleId = "interactive-area-inspection-title"
  const descId = "interactive-area-inspection-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
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
              <span className="size-1.5 rounded-full bg-sky-400" />
              INSPECTION PIPELINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Input to Resolution
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Input Coordinate to Persistent Observation Lock
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" />
            <span>Observed Datum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" />
            <span>Locked State</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Inspection flow diagram showing input events mapped to nearest domain X coordinates, resolving real observations without interpolation, and driving crosshair, marker, and persistent lockable tooltip.
      </p>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 270"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs */}
          <defs>
            <marker
              id="arrow-head-inspect"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#71717a" />
            </marker>
          </defs>

          {/* Node 1: Input Events */}
          <g transform="translate(30, 95)">
            <rect width="130" height="74" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="14" y="24" className="text-[11px] font-mono fill-zinc-300 font-bold">1. Input Event</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-400">Pointer scrub</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">Keyboard ← → / Tap</text>
          </g>

          {/* Arrow 1 -> 2 */}
          <line x1="160" y1="132" x2="200" y2="132" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-head-inspect)" />

          {/* Node 2: Resolve Nearest-X */}
          <g transform="translate(205, 95)">
            <rect width="145" height="74" rx="8" fill="#09090b" stroke="rgba(56,189,248,0.35)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-sky-400 font-bold">2. Nearest-X Math</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-300">Horizontal plot X</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">Ignore vertical Y</text>
          </g>

          {/* Arrow 2 -> 3 */}
          <line x1="350" y1="132" x2="390" y2="132" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-head-inspect)" />

          {/* Node 3: Real Observation */}
          <g transform="translate(395, 95)">
            <rect width="145" height="74" rx="8" fill="#09090b" stroke="rgba(59,130,246,0.5)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-blue-400 font-bold">3. Real Datum</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-white font-semibold">data[activeIndex]</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-emerald-400">Zero interpolation</text>
          </g>

          {/* Branch Arrows 3 -> Outputs */}
          {/* Branch to Crosshair (Top) */}
          <path d="M 540 120 L 580 60 L 615 60" fill="none" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-head-inspect)" />

          {/* Branch to Tooltip (Middle) */}
          <line x1="540" y1="132" x2="615" y2="132" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-head-inspect)" />

          {/* Branch to Locked Persistence (Bottom) */}
          <path d="M 540 144 L 580 204 L 615 204" fill="none" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-head-inspect)" />

          {/* Output 1: Crosshair */}
          <g transform="translate(620, 30)">
            <rect width="170" height="58" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="14" y="22" className="text-[11px] font-mono fill-zinc-200 font-bold">Neutral Crosshair</text>
            <text x="14" y="38" className="text-[10px] font-mono fill-zinc-400">Snaps to observation X</text>
            <text x="14" y="50" className="text-[9px] font-mono fill-zinc-500">--chart-crosshair</text>
          </g>

          {/* Output 2: Tooltip & Active Marker */}
          <g transform="translate(620, 103)">
            <rect width="170" height="58" rx="8" fill="#09090b" stroke="rgba(59,130,246,0.35)" strokeWidth="1" />
            <text x="14" y="22" className="text-[11px] font-mono fill-blue-400 font-bold">Tooltip &amp; Marker</text>
            <text x="14" y="38" className="text-[10px] font-mono fill-zinc-300">Exact observed value</text>
            <text x="14" y="50" className="text-[9px] font-mono fill-zinc-400">No marker if null/missing</text>
          </g>

          {/* Output 3: Persistent Locked State */}
          <g transform="translate(620, 175)">
            <rect width="170" height="62" rx="8" fill="#09090b" stroke="rgba(245,158,11,0.4)" strokeWidth="1.2" />
            <text x="14" y="22" className="text-[11px] font-mono fill-amber-400 font-bold">Persistent Lock (◎)</text>
            <text x="14" y="38" className="text-[10px] font-mono fill-zinc-300">Survives mouse leave</text>
            <text x="14" y="52" className="text-[9px] font-mono fill-amber-300/80">Enter / Click / Space</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-blue-400" />
          <span className="font-mono text-zinc-300">
            Truthful Principle: Pointer coordinates guide navigation; only real observations produce tooltips and crosshairs.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Inspection Model Architecture
        </span>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 2: Nearest-X Midpoint Snapping Model                              */
/* -------------------------------------------------------------------------- */

export function InteractiveAreaNearestXDiagram() {
  const titleId = "interactive-area-nearestx-title"
  const descId = "interactive-area-nearestx-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
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
              <span className="size-1.5 rounded-full bg-sky-400" />
              NEAREST-X RESOLUTION
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Snapping &amp; Midpoint Partitioning
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Midpoint Boundary Zones and Observation-Aligned Snapping
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-dashed border-zinc-500" />
            <span>Midpoint Bound</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400" />
            <span>Crosshair Snapped</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Conceptual diagram showing ordered domain observations, midpoint boundaries dividing screen zones, a pointer in zone 2, and the resulting snapped crosshair at the real observation coordinate.
      </p>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 280"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Area Fill Simulation */}
          <path
            d="M 80 210 L 80 160 L 220 130 L 360 80 L 500 140 L 640 100 L 750 120 L 750 210 Z"
            fill="rgba(59,130,246,0.12)"
          />
          <path
            d="M 80 160 L 220 130 L 360 80 L 500 140 L 640 100 L 750 120"
            stroke="rgba(59,130,246,0.4)"
            strokeWidth="2"
          />

          {/* Baseline horizontal line */}
          <line x1="60" y1="210" x2="760" y2="210" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Observation 0: x = 80 */}
          <circle cx="80" cy="160" r="4.5" fill="#3b82f6" stroke="#09090b" strokeWidth="2" />
          <text x="80" y="230" className="text-[11px] font-mono fill-zinc-400 font-semibold" textAnchor="middle">x₀ (Jan 1)</text>

          {/* Midpoint 0-1: x = 150 */}
          <line x1="150" y1="40" x2="150" y2="215" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
          <text x="150" y="32" className="text-[9px] font-mono fill-zinc-500" textAnchor="middle">m₀₁</text>

          {/* Observation 1: x = 220 */}
          <circle cx="220" cy="130" r="4.5" fill="#3b82f6" stroke="#09090b" strokeWidth="2" />
          <text x="220" y="230" className="text-[11px] font-mono fill-zinc-400 font-semibold" textAnchor="middle">x₁ (Jan 2)</text>

          {/* Midpoint 1-2: x = 290 */}
          <line x1="290" y1="40" x2="290" y2="215" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
          <text x="290" y="32" className="text-[9px] font-mono fill-zinc-500" textAnchor="middle">m₁₂</text>

          {/* Observation 2: x = 360 (Active Selected Point!) */}
          {/* Active Highlight Zone */}
          <rect x="290" y="40" width="140" height="170" fill="rgba(56,189,248,0.06)" rx="4" />
          
          {/* Observation-Aligned Crosshair at x = 360 */}
          <line x1="360" y1="40" x2="360" y2="215" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="360" cy="80" r="6" fill="#38bdf8" stroke="#09090b" strokeWidth="2" />
          <text x="360" y="230" className="text-[11px] font-mono fill-sky-400 font-bold" textAnchor="middle">x₂ (Jan 3)</text>
          <text x="360" y="246" className="text-[10px] font-mono fill-sky-300 font-medium" textAnchor="middle">Selected Datum</text>

          {/* Midpoint 2-3: x = 430 */}
          <line x1="430" y1="40" x2="430" y2="215" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
          <text x="430" y="32" className="text-[9px] font-mono fill-zinc-500" textAnchor="middle">m₂₃</text>

          {/* Observation 3: x = 500 */}
          <circle cx="500" cy="140" r="4.5" fill="#3b82f6" stroke="#09090b" strokeWidth="2" />
          <text x="500" y="230" className="text-[11px] font-mono fill-zinc-400 font-semibold" textAnchor="middle">x₃ (Jan 4)</text>

          {/* Midpoint 3-4: x = 570 */}
          <line x1="570" y1="40" x2="570" y2="215" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
          <text x="570" y="32" className="text-[9px] font-mono fill-zinc-500" textAnchor="middle">m₃₄</text>

          {/* Observation 4: x = 640 */}
          <circle cx="640" cy="100" r="4.5" fill="#3b82f6" stroke="#09090b" strokeWidth="2" />
          <text x="640" y="230" className="text-[11px] font-mono fill-zinc-400 font-semibold" textAnchor="middle">x₄ (Jan 5)</text>

          {/* Raw Pointer Location Demonstration */}
          {/* Pointer is at x = 328, y = 55 (Inside zone 2, between m12 and x2) */}
          <g transform="translate(328, 55)">
            {/* Cursor Indicator Circle */}
            <circle cx="0" cy="0" r="4" fill="#f43f5e" />
            {/* Cursor Arrow Icon Representation */}
            <path d="M 0 0 L 10 10 L 4 12 L 2 18 L -2 16 L 0 0" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
            
            {/* Callout Badge */}
            <g transform="translate(14, -8)">
              <rect width="130" height="36" rx="6" fill="#18181b" stroke="rgba(244,63,94,0.4)" strokeWidth="1" />
              <text x="8" y="15" className="text-[9px] font-mono fill-rose-300 font-semibold">Raw Pointer: (328, 55)</text>
              <text x="8" y="28" className="text-[8.5px] font-mono fill-zinc-400">Vertical Y ignored</text>
            </g>
          </g>

          {/* Snap Vector Arrow from Pointer X to x2 */}
          <path d="M 328 100 L 354 100" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow-head-inspect)" />
          <text x="341" y="94" className="text-[8px] font-mono fill-rose-300" textAnchor="middle">Snaps</text>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="font-mono text-zinc-300">
            Observation-Centric Invariant: The crosshair always snaps to x₂ (360px). It never follows raw cursor X (328px) continuously.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Nearest-X Mathematical Model
        </span>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 3: Interaction States Flow                                        */
/* -------------------------------------------------------------------------- */

export function InteractiveAreaStateDiagram() {
  const titleId = "interactive-area-state-title"
  const descId = "interactive-area-state-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
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
              <span className="size-1.5 rounded-full bg-sky-400" />
              STATE MACHINE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Focus vs Active vs Locked
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Interaction State Transitions &amp; Input Decoupling
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-sky-400 bg-sky-500/20" />
            <span>Focus Shell</span>
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

      <p id={descId} className="sr-only">
        State machine diagram illustrating transitions between IDLE, FOCUSED, ACTIVE, and LOCKED states. Shows keyboard focus, arrow navigation, click-to-lock, and escape-to-unlock flows.
      </p>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 280"
          className="w-full min-w-[700px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-state"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#71717a" />
            </marker>
          </defs>

          {/* State 1: IDLE */}
          <g transform="translate(40, 95)">
            <rect width="180" height="90" rx="10" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="20" y="28" className="text-[12px] font-mono fill-zinc-300 font-bold">IDLE STATE</text>
            <text x="20" y="48" className="text-[10px] font-mono fill-zinc-400">No active cursor</text>
            <text x="20" y="64" className="text-[10px] font-mono fill-zinc-400">Tooltip closed</text>
            <text x="20" y="80" className="text-[9px] font-mono fill-zinc-500">Awaiting user action</text>
          </g>

          {/* Forward Arrow IDLE -> ACTIVE */}
          <path d="M 220 125 L 310 125" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
          <text x="265" y="118" className="text-[9px] font-mono fill-sky-400" textAnchor="middle">pointerenter / Tab / tap</text>

          {/* State 2: ACTIVE */}
          <g transform="translate(315, 95)">
            <rect width="200" height="90" rx="10" fill="#09090b" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
            <text x="20" y="28" className="text-[12px] font-mono fill-blue-400 font-bold">ACTIVE INSPECTION</text>
            <text x="20" y="48" className="text-[10px] font-mono fill-white">Nearest-X resolved</text>
            <text x="20" y="64" className="text-[10px] font-mono fill-zinc-300">Transient crosshair &amp; dot</text>
            <text x="20" y="80" className="text-[9px] font-mono fill-sky-300">← → navigates domain</text>
          </g>

          {/* Reverse Arrow ACTIVE -> IDLE */}
          <path d="M 315 155 L 225 155" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
          <text x="270" y="170" className="text-[9px] font-mono fill-zinc-500" textAnchor="middle">pointerleave / blur</text>

          {/* Forward Arrow ACTIVE -> LOCKED */}
          <path d="M 515 125 L 590 125" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
          <text x="552" y="118" className="text-[9px] font-mono fill-amber-400 font-semibold" textAnchor="middle">Click / Enter / Space</text>

          {/* State 3: LOCKED */}
          <g transform="translate(595, 95)">
            <rect width="190" height="90" rx="10" fill="#09090b" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
            <text x="20" y="28" className="text-[12px] font-mono fill-amber-400 font-bold">LOCKED SELECTION (◎)</text>
            <text x="20" y="48" className="text-[10px] font-mono fill-white">Persistent double ring</text>
            <text x="20" y="64" className="text-[10px] font-mono fill-amber-300/90">Pointer drift ignored</text>
            <text x="20" y="80" className="text-[9px] font-mono fill-zinc-400">← → moves locked pin</text>
          </g>

          {/* Reverse Arrow LOCKED -> ACTIVE */}
          <path d="M 595 155 L 520 155" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
          <text x="557" y="170" className="text-[9px] font-mono fill-zinc-400" textAnchor="middle">Escape / click again</text>

          {/* Self-Loop on LOCKED: Navigation */}
          <path d="M 690 95 C 690 60, 750 60, 750 90" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.2" markerEnd="url(#arrow-state)" />
          <text x="720" y="52" className="text-[9px] font-mono fill-amber-300 font-medium" textAnchor="middle">← → advances lock</text>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={LockKeyIcon} size={14} className="text-amber-400" />
          <span className="font-mono text-zinc-300">
            Lock Invariant: When locked, incidental pointer movement never alters the selected observation until explicitly unlocked or clicked elsewhere.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Interaction State Machine
        </span>
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  Diagram 4: Rendering & Architecture Pipeline                              */
/* -------------------------------------------------------------------------- */

export function InteractiveAreaArchitectureDiagram() {
  const titleId = "interactive-area-arch-title"
  const descId = "interactive-area-arch-desc"

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
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
              <span className="size-1.5 rounded-full bg-sky-400" />
              SYSTEM ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Rendering &amp; Event Topology
            </span>
          </div>
          <h4 id={titleId} className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Recharts Area Chart and Synchronized Inspection Layers
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-indigo-400" />
            <span>Pure SVG Pipeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Accessible DOM</span>
          </div>
        </div>
      </div>

      <p id={descId} className="sr-only">
        System architecture diagram detailing raw data ingestion, normalizer, domain and scale computation, Recharts Area rendering, nearest-X resolution, and synchronized crosshair and HTML tooltip overlays.
      </p>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto">
        <svg
          viewBox="0 0 820 300"
          className="w-full min-w-[720px] h-auto font-sans"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-arch"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#71717a" />
            </marker>
          </defs>

          {/* Layer 1: Consumer Layer */}
          <g transform="translate(30, 20)">
            <rect width="210" height="70" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="14" y="24" className="text-[11px] font-mono fill-zinc-300 font-bold">1. Caller Input &amp; Validation</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-400">Readonly TData[] + xKey</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-500">Non-finite values sanitized</text>
          </g>

          {/* Arrow 1 -> 2 */}
          <line x1="240" y1="55" x2="280" y2="55" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-arch)" />

          {/* Layer 2: Geometry & Scale Normalization */}
          <g transform="translate(285, 20)">
            <rect width="230" height="70" rx="8" fill="#09090b" stroke="rgba(99,102,241,0.4)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-indigo-400 font-bold">2. Scale &amp; Domain Engine</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-300">calculateInteractiveAreaDomain()</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">Encloses data &amp; baseValue</text>
          </g>

          {/* Arrow 2 -> 3 */}
          <line x1="515" y1="55" x2="555" y2="55" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-arch)" />

          {/* Layer 3: Area Geometry */}
          <g transform="translate(560, 20)">
            <rect width="230" height="70" rx="8" fill="#09090b" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-blue-400 font-bold">3. Recharts Area Chart</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-white">&lt;Area baseValue=&#123;baseline&#125; /&gt;</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">Restrained 22% fill + stroke</text>
          </g>

          {/* Downward Arrow to Interaction Surface */}
          <line x1="675" y1="90" x2="675" y2="130" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-arch)" />

          {/* Layer 4: Interaction Hit Surface */}
          <g transform="translate(560, 135)">
            <rect width="230" height="70" rx="8" fill="#09090b" stroke="rgba(56,189,248,0.4)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-sky-400 font-bold">4. Unified Hit Surface</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-300">touch-action: pan-y (scroll-safe)</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">One plot surface (no 100 hit rects)</text>
          </g>

          {/* Left Arrow to Nearest-X Engine */}
          <line x1="560" y1="170" x2="520" y2="170" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-arch)" />

          {/* Layer 5: Nearest-X Resolution */}
          <g transform="translate(285, 135)">
            <rect width="230" height="70" rx="8" fill="#09090b" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-emerald-400 font-bold">5. Nearest-X Index Engine</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-200">resolveNearestIndex()</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">Equidistant midpoint tie-break</text>
          </g>

          {/* Left Arrow to Output State */}
          <line x1="285" y1="170" x2="245" y2="170" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#arrow-arch)" />

          {/* Layer 6: Synchronized Outputs */}
          <g transform="translate(30, 135)">
            <rect width="210" height="70" rx="8" fill="#09090b" stroke="rgba(245,158,11,0.4)" strokeWidth="1.2" />
            <text x="14" y="24" className="text-[11px] font-mono fill-amber-400 font-bold">6. Observation Outputs</text>
            <text x="14" y="42" className="text-[10px] font-mono fill-zinc-200">Crosshair + Concentric Ring</text>
            <text x="14" y="58" className="text-[10px] font-mono fill-zinc-400">Lockable HTML Tooltip + A11y</text>
          </g>

          {/* Invariant Footer Strip */}
          <g transform="translate(30, 230)">
            <rect width="760" height="50" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x="16" y="22" className="text-[11px] font-mono fill-zinc-300 font-semibold">
              Performance &amp; Accessibility Invariant:
            </text>
            <text x="16" y="38" className="text-[10px] font-mono fill-zinc-400">
              Only 1 Area geometry is generated. Tooltip values strictly map to real observations without synthetic continuous interpolation.
            </text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-400" />
          <span className="font-mono text-zinc-300 font-medium">
            SVG Pipeline: Zero external gesture or state machine libraries. Clean source portability.
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          Registry Component: area-interactive
        </span>
      </div>
    </figure>
  )
}
