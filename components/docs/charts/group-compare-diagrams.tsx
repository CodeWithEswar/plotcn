"use client"

import React from "react"

/**
 * 1. Grouped Comparison Model Diagram
 * Illustrates side-by-side peer bars inside discrete categorical bands,
 * each starting independently from a shared zero baseline.
 */
export function GroupedComparisonModelDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="group-model-title group-model-desc"
        viewBox="0 0 840 300"
        className="w-full h-auto"
      >
        <title id="group-model-title">Group Compare Bars Comparison Model</title>
        <desc id="group-model-desc">
          Each category contains stable side-by-side slots for peer series measured against one shared quantitative scale and zero baseline.
        </desc>

        {/* Outer Canvas / Background */}
        <rect width="840" height="300" rx="10" fill="#09090b" />

        {/* Quantitative Grid Lines */}
        <g stroke="#27272a" strokeDasharray="3 3" strokeWidth="1">
          <line x1="100" y1="50" x2="780" y2="50" />
          <line x1="100" y1="105" x2="780" y2="105" />
          <line x1="100" y1="160" x2="780" y2="160" />
          <line x1="100" y1="215" x2="780" y2="215" />
        </g>

        {/* Quantitative Y-Axis Values */}
        <g fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">
          <text x="88" y="54">600</text>
          <text x="88" y="109">400</text>
          <text x="88" y="164">200</text>
          <text x="88" y="219">0</text>
        </g>

        {/* Zero Baseline Reference Line */}
        <line x1="100" y1="215" x2="780" y2="215" stroke="#52525b" strokeWidth="1.5" />

        {/* Category Band 1: Q1 */}
        <g transform="translate(160, 0)">
          {/* Categorical Band Highlight */}
          <rect x="0" y="30" width="180" height="195" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x="90" y="242" fill="#e4e4e7" fontSize="12" fontWeight="600" textAnchor="middle">
            Quarter 1 (Q1)
          </text>
          <text x="90" y="258" fill="#71717a" fontSize="10" textAnchor="middle">
            Category Band
          </text>

          {/* Bar A (Web: 420) -> height 115 */}
          <path d="M 30 215 L 30 103 A 4 4 0 0 1 34 100 L 76 100 A 4 4 0 0 1 80 103 L 80 215 Z" fill="#3b82f6" />
          <text x="55" y="92" fill="#93c5fd" fontSize="10" fontWeight="600" textAnchor="middle">420</text>
          <text x="55" y="200" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">Web</text>

          {/* Bar B (Mobile: 510) -> height 140 */}
          <path d="M 100 215 L 100 78 A 4 4 0 0 1 104 75 L 146 75 A 4 4 0 0 1 150 78 L 150 215 Z" fill="#10b981" />
          <text x="125" y="67" fill="#6ee7b7" fontSize="10" fontWeight="600" textAnchor="middle">510</text>
          <text x="125" y="200" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">Mobile</text>
        </g>

        {/* Category Band 2: Q2 */}
        <g transform="translate(480, 0)">
          {/* Categorical Band Highlight */}
          <rect x="0" y="30" width="180" height="195" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x="90" y="242" fill="#e4e4e7" fontSize="12" fontWeight="600" textAnchor="middle">
            Quarter 2 (Q2)
          </text>
          <text x="90" y="258" fill="#71717a" fontSize="10" textAnchor="middle">
            Category Band
          </text>

          {/* Bar A (Web: 480) -> height 132 */}
          <path d="M 30 215 L 30 86 A 4 4 0 0 1 34 83 L 76 83 A 4 4 0 0 1 80 86 L 80 215 Z" fill="#3b82f6" />
          <text x="55" y="75" fill="#93c5fd" fontSize="10" fontWeight="600" textAnchor="middle">480</text>
          <text x="55" y="200" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">Web</text>

          {/* Bar B (Mobile: 570) -> height 156 */}
          <path d="M 100 215 L 100 62 A 4 4 0 0 1 104 59 L 146 59 A 4 4 0 0 1 150 62 L 150 215 Z" fill="#10b981" />
          <text x="125" y="51" fill="#6ee7b7" fontSize="10" fontWeight="600" textAnchor="middle">570</text>
          <text x="125" y="200" fill="#ffffff" fontSize="9" fontWeight="500" textAnchor="middle">Mobile</text>
        </g>

        {/* Explanatory Annotations */}
        <path d="M 390 120 L 430 120" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="410" y="140" fill="#a1a1aa" fontSize="10" textAnchor="middle" fontFamily="monospace">
          groupGap
        </text>

        <path d="M 240 170 L 260 170" stroke="#71717a" strokeWidth="1.5" />
        <text x="250" y="165" fill="#a1a1aa" fontSize="9" textAnchor="middle" fontFamily="monospace">
          barGap
        </text>
      </svg>
    </div>
  )
}

/**
 * 2. Grouped vs Stacked Comparison Diagram
 * Visually contrasts independent side-by-side grouped bars with
 * additive cumulative stacked bars.
 */
export function GroupedVsStackedDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="group-vs-stack-title group-vs-stack-desc"
        viewBox="0 0 840 280"
        className="w-full h-auto"
      >
        <title id="group-vs-stack-title">Grouped Compare vs Stacked Composition</title>
        <desc id="group-vs-stack-desc">
          Contrasting independent side-by-side peer bars starting from zero versus additive stacked bars composing a cumulative total.
        </desc>

        <rect width="840" height="280" rx="10" fill="#09090b" />

        {/* Panel 1: GROUPED */}
        <g transform="translate(30, 20)">
          <rect x="0" y="0" width="370" height="240" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x="20" y="32" fill="#10b981" fontSize="13" fontWeight="700" letterSpacing="0.05em">
            GROUPED BARS (021)
          </text>
          <text x="20" y="48" fill="#a1a1aa" fontSize="11">
            Peer comparison • Independent magnitudes from zero
          </text>

          {/* Baseline */}
          <line x1="30" y1="190" x2="340" y2="190" stroke="#52525b" strokeWidth="1.5" />
          <text x="30" y="208" fill="#71717a" fontSize="10" fontFamily="monospace">Zero Baseline (0)</text>

          {/* Group: Q1 */}
          <g transform="translate(70, 0)">
            {/* Current: 120 -> height 110 */}
            <rect x="0" y="80" width="48" height="110" rx="4" fill="#3b82f6" />
            <text x="24" y="72" fill="#93c5fd" fontSize="11" fontWeight="600" textAnchor="middle">120</text>
            <text x="24" y="105" fill="#ffffff" fontSize="9" textAnchor="middle">Current</text>

            {/* Previous: 100 -> height 92 */}
            <rect x="56" y="98" width="48" height="92" rx="4" fill="#10b981" />
            <text x="80" y="90" fill="#6ee7b7" fontSize="11" fontWeight="600" textAnchor="middle">100</text>
            <text x="80" y="120" fill="#ffffff" fontSize="9" textAnchor="middle">Previous</text>

            <text x="52" y="224" fill="#f4f4f5" fontSize="11" fontWeight="600" textAnchor="middle">Q1</text>
          </g>

          <text x="230" y="140" fill="#71717a" fontSize="10">
            {"Current = 120"}
          </text>
          <text x="230" y="156" fill="#71717a" fontSize="10">
            {"Previous = 100"}
          </text>
          <text x="230" y="176" fill="#10b981" fontSize="10" fontWeight="600">
            No sum implied
          </text>
        </g>

        {/* Panel 2: STACKED */}
        <g transform="translate(440, 20)">
          <rect x="0" y="0" width="370" height="240" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x="20" y="32" fill="#a855f7" fontSize="13" fontWeight="700" letterSpacing="0.05em">
            STACKED BARS (022)
          </text>
          <text x="20" y="48" fill="#a1a1aa" fontSize="11">
            Additive composition • Segments sum to a total
          </text>

          {/* Baseline */}
          <line x1="30" y1="190" x2="340" y2="190" stroke="#52525b" strokeWidth="1.5" />
          <text x="30" y="208" fill="#71717a" fontSize="10" fontFamily="monospace">Zero Baseline (0)</text>

          {/* Stack: Q1 */}
          <g transform="translate(90, 0)">
            {/* Segment 1: Current (120) -> height 70 */}
            <rect x="0" y="120" width="60" height="70" fill="#3b82f6" />
            <text x="30" y="160" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">120</text>

            {/* Segment 2: Previous (100) -> height 60 */}
            <path d="M 0 120 L 0 64 A 4 4 0 0 1 4 60 L 56 60 A 4 4 0 0 1 60 64 L 60 120 Z" fill="#10b981" />
            <text x="30" y="95" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">100</text>

            {/* Outer Total Indicator */}
            <line x1="68" y1="60" x2="100" y2="60" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="106" y="64" fill="#fbbf24" fontSize="11" fontWeight="700">Total = 220</text>

            <text x="30" y="224" fill="#f4f4f5" fontSize="11" fontWeight="600" textAnchor="middle">Q1</text>
          </g>

          <text x="230" y="140" fill="#71717a" fontSize="10">
            {"120 + 100 = 220"}
          </text>
          <text x="230" y="156" fill="#a855f7" fontSize="10" fontWeight="600">
            Additive ledger
          </text>
          <text x="230" y="172" fill="#71717a" fontSize="10">
            Different question
          </text>
        </g>
      </svg>
    </div>
  )
}

/**
 * 3. Stable Series Identity Diagram
 * Illustrates that series order inside every category slot is fixed
 * and NEVER dynamically reorders by value magnitude.
 */
export function StableSeriesIdentityDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="stable-identity-title stable-identity-desc"
        viewBox="0 0 840 280"
        className="w-full h-auto"
      >
        <title id="stable-identity-title">Stable Series Identity Across Categories</title>
        <desc id="stable-identity-desc">
          Shows that series order [Web, Mobile, Partner] remains invariant across all categories, even when magnitude crosses.
        </desc>

        <rect width="840" height="280" rx="10" fill="#09090b" />

        {/* Legend / Identity Header */}
        <g transform="translate(40, 25)">
          <text x="0" y="14" fill="#f4f4f5" fontSize="13" fontWeight="600">
            Configured Canonical Order:
          </text>
          <rect x="220" y="2" width="12" height="12" rx="2" fill="#3b82f6" />
          <text x="238" y="13" fill="#e4e4e7" fontSize="11">1. Web</text>

          <rect x="310" y="2" width="12" height="12" rx="2" fill="#10b981" />
          <text x="328" y="13" fill="#e4e4e7" fontSize="11">2. Mobile</text>

          <rect x="410" y="2" width="12" height="12" rx="2" fill="#a855f7" />
          <text x="428" y="13" fill="#e4e4e7" fontSize="11">3. Partner</text>
        </g>

        {/* Baseline */}
        <line x1="40" y1="200" x2="800" y2="200" stroke="#3f3f46" strokeWidth="1.5" />

        {/* Category 1: Q1 (Web > Mobile > Partner) */}
        <g transform="translate(80, 0)">
          <rect x="0" y="60" width="190" height="140" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="95" y="222" fill="#f4f4f5" fontSize="12" fontWeight="600" textAnchor="middle">Q1: Web Leading</text>
          <text x="95" y="238" fill="#71717a" fontSize="10" textAnchor="middle">Web &gt; Mobile &gt; Partner</text>

          {/* Slot 1: Web (90) */}
          <rect x="25" y="90" width="36" height="110" rx="3" fill="#3b82f6" />
          <text x="43" y="82" fill="#93c5fd" fontSize="10" textAnchor="middle">90</text>
          {/* Slot 2: Mobile (60) */}
          <rect x="77" y="125" width="36" height="75" rx="3" fill="#10b981" />
          <text x="95" y="117" fill="#6ee7b7" fontSize="10" textAnchor="middle">60</text>
          {/* Slot 3: Partner (30) */}
          <rect x="129" y="160" width="36" height="40" rx="3" fill="#a855f7" />
          <text x="147" y="152" fill="#d8b4fe" fontSize="10" textAnchor="middle">30</text>
        </g>

        {/* Category 2: Q2 (Mobile > Partner > Web) */}
        <g transform="translate(325, 0)">
          <rect x="0" y="60" width="190" height="140" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="95" y="222" fill="#f4f4f5" fontSize="12" fontWeight="600" textAnchor="middle">Q2: Mobile Leading</text>
          <text x="95" y="238" fill="#10b981" fontSize="10" textAnchor="middle">Slot order UNCHANGED</text>

          {/* Slot 1: Web (40) - Still in slot 1! */}
          <rect x="25" y="150" width="36" height="50" rx="3" fill="#3b82f6" />
          <text x="43" y="142" fill="#93c5fd" fontSize="10" textAnchor="middle">40</text>
          {/* Slot 2: Mobile (95) - Still in slot 2! */}
          <rect x="77" y="85" width="36" height="115" rx="3" fill="#10b981" />
          <text x="95" y="77" fill="#6ee7b7" fontSize="10" textAnchor="middle">95</text>
          {/* Slot 3: Partner (70) - Still in slot 3! */}
          <rect x="129" y="115" width="36" height="85" rx="3" fill="#a855f7" />
          <text x="147" y="107" fill="#d8b4fe" fontSize="10" textAnchor="middle">70</text>
        </g>

        {/* Category 3: Q3 (Partner > Web > Mobile) */}
        <g transform="translate(570, 0)">
          <rect x="0" y="60" width="190" height="140" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="95" y="222" fill="#f4f4f5" fontSize="12" fontWeight="600" textAnchor="middle">Q3: Partner Leading</text>
          <text x="95" y="238" fill="#10b981" fontSize="10" textAnchor="middle">Slot order UNCHANGED</text>

          {/* Slot 1: Web (60) */}
          <rect x="25" y="125" width="36" height="75" rx="3" fill="#3b82f6" />
          <text x="43" y="117" fill="#93c5fd" fontSize="10" textAnchor="middle">60</text>
          {/* Slot 2: Mobile (50) */}
          <rect x="77" y="140" width="36" height="60" rx="3" fill="#10b981" />
          <text x="95" y="132" fill="#6ee7b7" fontSize="10" textAnchor="middle">50</text>
          {/* Slot 3: Partner (100) */}
          <rect x="129" y="75" width="36" height="125" rx="3" fill="#a855f7" />
          <text x="147" y="67" fill="#d8b4fe" fontSize="10" textAnchor="middle">100</text>
        </g>
      </svg>
    </div>
  )
}

/**
 * 4. Missing-Series Slot Diagram
 * Illustrates that a missing series value leaves its slot reserved,
 * preventing neighboring series from shifting or impersonating its identity.
 */
export function MissingSeriesSlotDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="missing-slot-title missing-slot-desc"
        viewBox="0 0 840 280"
        className="w-full h-auto"
      >
        <title id="missing-slot-title">Missing Series Slot Reservation</title>
        <desc id="missing-slot-desc">
          Missing data reserves the slot rather than drawing a fake zero bar or allowing surviving series to shift left.
        </desc>

        <rect width="840" height="280" rx="10" fill="#09090b" />

        {/* Baseline */}
        <line x1="50" y1="200" x2="790" y2="200" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="50" y="218" fill="#71717a" fontSize="10" fontFamily="monospace">0 Baseline</text>

        {/* Category 1: Complete [A, B, C] */}
        <g transform="translate(100, 20)">
          <rect x="0" y="30" width="180" height="150" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="90" y="202" fill="#f4f4f5" fontSize="12" fontWeight="600" textAnchor="middle">Q1: Complete</text>
          <text x="90" y="216" fill="#71717a" fontSize="10" textAnchor="middle">All 3 series present</text>

          <rect x="25" y="80" width="36" height="100" rx="3" fill="#3b82f6" />
          <text x="43" y="72" fill="#93c5fd" fontSize="10" textAnchor="middle">80</text>
          <text x="43" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">A</text>

          <rect x="72" y="100" width="36" height="80" rx="3" fill="#10b981" />
          <text x="90" y="92" fill="#6ee7b7" fontSize="10" textAnchor="middle">65</text>
          <text x="90" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">B</text>

          <rect x="119" y="120" width="36" height="60" rx="3" fill="#a855f7" />
          <text x="137" y="112" fill="#d8b4fe" fontSize="10" textAnchor="middle">50</text>
          <text x="137" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">C</text>
        </g>

        {/* Category 2: Incomplete [A, null, C] */}
        <g transform="translate(330, 20)">
          <rect x="0" y="30" width="180" height="150" rx="6" fill="#18181b" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
          <text x="90" y="202" fill="#fb7185" fontSize="12" fontWeight="600" textAnchor="middle">Q2: Series B Missing</text>
          <text x="90" y="216" fill="#f43f5e" fontSize="10" textAnchor="middle">Slot reserved • No impersonation</text>

          {/* Slot A: present */}
          <rect x="25" y="70" width="36" height="110" rx="3" fill="#3b82f6" />
          <text x="43" y="62" fill="#93c5fd" fontSize="10" textAnchor="middle">90</text>
          <text x="43" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">A</text>

          {/* Slot B: RESERVED EMPTY SPACE */}
          <rect x="72" y="70" width="36" height="110" rx="3" fill="none" stroke="#f43f5e" strokeDasharray="3 3" strokeWidth="1" />
          <text x="90" y="125" fill="#fb7185" fontSize="9" textAnchor="middle" fontWeight="600">Reserved</text>
          <text x="90" y="138" fill="#71717a" fontSize="8" textAnchor="middle">Slot B</text>

          {/* Slot C: DOES NOT SHIFT LEFT */}
          <rect x="119" y="110" width="36" height="70" rx="3" fill="#a855f7" />
          <text x="137" y="102" fill="#d8b4fe" fontSize="10" textAnchor="middle">60</text>
          <text x="137" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">C</text>
        </g>

        {/* Category 3: Complete [A, B, C] */}
        <g transform="translate(560, 20)">
          <rect x="0" y="30" width="180" height="150" rx="6" fill="#18181b" stroke="#27272a" />
          <text x="90" y="202" fill="#f4f4f5" fontSize="12" fontWeight="600" textAnchor="middle">Q3: Complete</text>
          <text x="90" y="216" fill="#71717a" fontSize="10" textAnchor="middle">Alignment maintained</text>

          <rect x="25" y="90" width="36" height="90" rx="3" fill="#3b82f6" />
          <text x="43" y="82" fill="#93c5fd" fontSize="10" textAnchor="middle">75</text>
          <text x="43" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">A</text>

          <rect x="72" y="75" width="36" height="105" rx="3" fill="#10b981" />
          <text x="90" y="67" fill="#6ee7b7" fontSize="10" textAnchor="middle">85</text>
          <text x="90" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">B</text>

          <rect x="119" y="130" width="36" height="50" rx="3" fill="#a855f7" />
          <text x="137" y="122" fill="#d8b4fe" fontSize="10" textAnchor="middle">40</text>
          <text x="137" y="170" fill="#ffffff" fontSize="9" textAnchor="middle">C</text>
        </g>
      </svg>
    </div>
  )
}

/**
 * 5. Shared Quantitative Scale Diagram
 * Illustrates that every peer series shares the exact same quantitative scale,
 * so equal values render with equal bar lengths.
 */
export function SharedQuantitativeScaleDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="shared-scale-title shared-scale-desc"
        viewBox="0 0 840 260"
        className="w-full h-auto"
      >
        <title id="shared-scale-title">Shared Quantitative Scale Requirement</title>
        <desc id="shared-scale-desc">
          Every peer series shares one Y-axis scale. Equal numeric values of 100 produce identical bar heights.
        </desc>

        <rect width="840" height="260" rx="10" fill="#09090b" />

        {/* Quantitative Grid Lines */}
        <g stroke="#27272a" strokeDasharray="3 3">
          <line x1="90" y1="50" x2="780" y2="50" />
          <line x1="90" y1="110" x2="780" y2="110" />
          <line x1="90" y1="170" x2="780" y2="170" />
        </g>

        {/* Single Shared Y-Axis */}
        <line x1="90" y1="40" x2="90" y2="170" stroke="#52525b" strokeWidth="1.5" />
        <g fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">
          <text x="80" y="54">150</text>
          <text x="80" y="114">100</text>
          <text x="80" y="174">0</text>
        </g>

        {/* Shared Benchmark Line at 100 */}
        <line x1="90" y1="110" x2="780" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="785" y="114" fill="#fbbf24" fontSize="10" fontFamily="monospace">
          Value = 100
        </text>

        {/* Series A: 100 */}
        <g transform="translate(180, 0)">
          <rect x="0" y="110" width="50" height="60" rx="3" fill="#3b82f6" />
          <text x="25" y="100" fill="#93c5fd" fontSize="11" fontWeight="700" textAnchor="middle">100</text>
          <text x="25" y="192" fill="#f4f4f5" fontSize="11" fontWeight="600" textAnchor="middle">Series A</text>
          <text x="25" y="206" fill="#71717a" fontSize="9" textAnchor="middle">Height: 60px</text>
        </g>

        {/* Series B: 100 */}
        <g transform="translate(340, 0)">
          <rect x="0" y="110" width="50" height="60" rx="3" fill="#10b981" />
          <text x="25" y="100" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">100</text>
          <text x="25" y="192" fill="#f4f4f5" fontSize="11" fontWeight="600" textAnchor="middle">Series B</text>
          <text x="25" y="206" fill="#71717a" fontSize="9" textAnchor="middle">Height: 60px</text>
        </g>

        {/* Series C: 100 */}
        <g transform="translate(500, 0)">
          <rect x="0" y="110" width="50" height="60" rx="3" fill="#a855f7" />
          <text x="25" y="100" fill="#d8b4fe" fontSize="11" fontWeight="700" textAnchor="middle">100</text>
          <text x="25" y="192" fill="#f4f4f5" fontSize="11" fontWeight="600" textAnchor="middle">Series C</text>
          <text x="25" y="206" fill="#71717a" fontSize="9" textAnchor="middle">Height: 60px</text>
        </g>

        {/* Verified Equality Indicator */}
        <g transform="translate(630, 160)">
          <rect x="0" y="0" width="160" height="60" rx="6" fill="#18181b" stroke="#10b981" strokeWidth="1" />
          <text x="80" y="24" fill="#34d399" fontSize="11" fontWeight="600" textAnchor="middle">✓ Shared Scale Verified</text>
          <text x="80" y="42" fill="#71717a" fontSize="9" textAnchor="middle">No hidden dual axes</text>
        </g>
      </svg>
    </div>
  )
}

/**
 * 6. Category / Rectangle Hit Region Diagram
 * Demonstrates the forgiving category-band interaction area
 * combined with precise bar rectangle hit testing.
 */
export function CategoryBarHitRegionsDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="hit-regions-title hit-regions-desc"
        viewBox="0 0 840 280"
        className="w-full h-auto"
      >
        <title id="hit-regions-title">Dual-Layer Hit Testing Architecture</title>
        <desc id="hit-regions-desc">
          Shows forgiving category-band activation on pointer hover alongside precise bar rectangle hit testing for series-level emphasis.
        </desc>

        <rect width="840" height="280" rx="10" fill="#09090b" />

        {/* Panel 1: Category Band Hit Testing */}
        <g transform="translate(40, 20)">
          <rect x="0" y="0" width="360" height="240" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="20" y="28" fill="#38bdf8" fontSize="12" fontWeight="700">1. Category Band Hit Region</text>
          <text x="20" y="44" fill="#71717a" fontSize="10">Forgiving pointer activation for shared category tooltip</text>

          {/* Broad Category Band Bounding Box */}
          <rect x="40" y="60" width="280" height="150" rx="6" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeDasharray="4 4" strokeWidth="1.5" />
          <text x="180" y="80" fill="#38bdf8" fontSize="10" fontWeight="600" textAnchor="middle">
            Active Category Band (Broad Hit Region)
          </text>

          {/* Peer Bars Inside */}
          <rect x="80" y="100" width="40" height="90" rx="3" fill="#3b82f6" opacity="0.8" />
          <rect x="140" y="115" width="40" height="75" rx="3" fill="#10b981" opacity="0.8" />
          <rect x="200" y="130" width="40" height="60" rx="3" fill="#a855f7" opacity="0.8" />

          {/* Pointer Icon */}
          <circle cx="260" cy="110" r="16" fill="rgba(56, 189, 248, 0.2)" />
          <circle cx="260" cy="110" r="4" fill="#38bdf8" />
          <text x="260" y="140" fill="#71717a" fontSize="9" textAnchor="middle">Pointer in Band</text>
        </g>

        {/* Panel 2: Precise Bar Rectangle Hit Testing */}
        <g transform="translate(440, 20)">
          <rect x="0" y="0" width="360" height="240" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="20" y="28" fill="#34d399" fontSize="12" fontWeight="700">2. Precise Rectangle Focus</text>
          <text x="20" y="44" fill="#71717a" fontSize="10">Specific bar intersection emphasizes active series in tooltip &amp; legend</text>

          {/* Category Band */}
          <rect x="40" y="60" width="280" height="150" rx="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />

          {/* Inactive Bar A */}
          <rect x="80" y="100" width="40" height="90" rx="3" fill="#3b82f6" opacity="0.4" />

          {/* Active Bar B: Emphasized with bright stroke */}
          <rect x="140" y="115" width="40" height="75" rx="3" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <text x="160" y="105" fill="#6ee7b7" fontSize="10" fontWeight="700" textAnchor="middle">Active</text>

          {/* Inactive Bar C */}
          <rect x="200" y="130" width="40" height="60" rx="3" fill="#a855f7" opacity="0.4" />

          {/* Pointer Hovering Directly on Bar B */}
          <circle cx="160" cy="140" r="14" fill="rgba(16, 185, 129, 0.3)" />
          <circle cx="160" cy="140" r="4" fill="#10b981" />
          <text x="160" y="170" fill="#6ee7b7" fontSize="9" textAnchor="middle">Direct Hit</text>
        </g>
      </svg>
    </div>
  )
}

/**
 * 7. Responsive Orientation Diagram
 * Illustrates vertical layout for concise categories versus horizontal layout
 * for lengthy enterprise labels.
 */
export function ResponsiveOrientationDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="orientation-title orientation-desc"
        viewBox="0 0 840 280"
        className="w-full h-auto"
      >
        <title id="orientation-title">Responsive Layout: Vertical vs Horizontal</title>
        <desc id="orientation-desc">
          Vertical layout for concise category labels versus explicit horizontal layout for lengthy enterprise department names.
        </desc>

        <rect width="840" height="280" rx="10" fill="#09090b" />

        {/* Panel 1: Vertical Layout */}
        <g transform="translate(30, 20)">
          <rect x="0" y="0" width="370" height="240" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="20" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">{"Vertical Layout (layout=\"vertical\")"}</text>
          <text x="20" y="42" fill="#71717a" fontSize="10">Best for concise dates, quarters, short codes</text>

          {/* Vertical Axes */}
          <line x1="60" y1="60" x2="60" y2="180" stroke="#52525b" strokeWidth="1" />
          <line x1="60" y1="180" x2="330" y2="180" stroke="#52525b" strokeWidth="1" />

          {/* Group 1: Q1 */}
          <g transform="translate(90, 0)">
            <rect x="0" y="100" width="20" height="80" rx="2" fill="#3b82f6" />
            <rect x="24" y="120" width="20" height="60" rx="2" fill="#10b981" />
            <text x="22" y="196" fill="#a1a1aa" fontSize="10" textAnchor="middle">Q1</text>
          </g>

          {/* Group 2: Q2 */}
          <g transform="translate(170, 0)">
            <rect x="0" y="80" width="20" height="100" rx="2" fill="#3b82f6" />
            <rect x="24" y="95" width="20" height="85" rx="2" fill="#10b981" />
            <text x="22" y="196" fill="#a1a1aa" fontSize="10" textAnchor="middle">Q2</text>
          </g>

          {/* Group 3: Q3 */}
          <g transform="translate(250, 0)">
            <rect x="0" y="90" width="20" height="90" rx="2" fill="#3b82f6" />
            <rect x="24" y="70" width="20" height="110" rx="2" fill="#10b981" />
            <text x="22" y="196" fill="#a1a1aa" fontSize="10" textAnchor="middle">Q3</text>
          </g>
        </g>

        {/* Panel 2: Horizontal Layout */}
        <g transform="translate(440, 20)">
          <rect x="0" y="0" width="370" height="240" rx="8" fill="#18181b" stroke="#27272a" />
          <text x="20" y="28" fill="#f4f4f5" fontSize="12" fontWeight="600">{"Horizontal Layout (layout=\"horizontal\")"}</text>
          <text x="20" y="42" fill="#71717a" fontSize="10">Best for lengthy department &amp; squad names</text>

          {/* Horizontal Axes */}
          <line x1="140" y1="60" x2="140" y2="200" stroke="#52525b" strokeWidth="1" />
          <line x1="140" y1="200" x2="330" y2="200" stroke="#52525b" strokeWidth="1" />

          {/* Row 1: Infrastructure */}
          <text x="130" y="86" fill="#a1a1aa" fontSize="10" textAnchor="end">Infrastructure</text>
          <rect x="140" y="74" width="110" height="12" rx="2" fill="#3b82f6" />
          <rect x="140" y="88" width="80" height="12" rx="2" fill="#10b981" />

          {/* Row 2: Customer Success */}
          <text x="130" y="126" fill="#a1a1aa" fontSize="10" textAnchor="end">Customer Success</text>
          <rect x="140" y="114" width="95" height="12" rx="2" fill="#3b82f6" />
          <rect x="140" y="128" width="130" height="12" rx="2" fill="#10b981" />

          {/* Row 3: Platform Eng */}
          <text x="130" y="166" fill="#a1a1aa" fontSize="10" textAnchor="end">Platform Eng</text>
          <rect x="140" y="154" width="140" height="12" rx="2" fill="#3b82f6" />
          <rect x="140" y="168" width="120" height="12" rx="2" fill="#10b981" />
        </g>
      </svg>
    </div>
  )
}

/**
 * 8. Rendering Architecture Flow Diagram
 * Full flow diagram depicting the pipeline from Consumer Data to
 * Recharts Grouped Bars and Accessibility Output.
 */
export function RenderingArchitectureFlowDiagram() {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border bg-card p-4">
      <svg
        role="img"
        aria-labelledby="arch-flow-title arch-flow-desc"
        viewBox="0 0 840 360"
        className="w-full h-auto"
      >
        <title id="arch-flow-title">Group Compare Bars Architecture Flow</title>
        <desc id="arch-flow-desc">
          Dataflow pipeline from consumer data through series validation, zero-inclusive domain calculation, Recharts grouped bars, and inspection surfaces.
        </desc>

        <rect width="840" height="360" rx="10" fill="#09090b" />

        {/* Row 1: Input & Normalization */}
        {/* Node 1: Consumer Data */}
        <g transform="translate(30, 30)">
          <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1" />
          <text x="80" y="26" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="600">Consumer Data</text>
          <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">data &amp; categoryKey</text>
        </g>

        <path d="M 190 60 L 230 60" stroke="#52525b" strokeWidth="1.5" />

        {/* Node 2: Series Contract */}
        <g transform="translate(230, 30)">
          <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#3b82f6" strokeWidth="1" />
          <text x="85" y="26" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="600">Series Configuration</text>
          <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Ordered Peer Series</text>
        </g>

        <path d="M 400 60 L 440 60" stroke="#52525b" strokeWidth="1.5" />

        {/* Node 3: Validation & Slot Reservation */}
        <g transform="translate(440, 30)">
          <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="1" />
          <text x="85" y="26" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="600">Validation &amp; Slots</text>
          <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Missing = Reserved Slot</text>
        </g>

        <path d="M 610 60 L 650 60" stroke="#52525b" strokeWidth="1.5" />

        {/* Node 4: Stable Colors */}
        <g transform="translate(650, 30)">
          <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#a855f7" strokeWidth="1" />
          <text x="80" y="26" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">Stable Colors</text>
          <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Canonical Map</text>
        </g>

        {/* Vertical Transition Down to Row 2 */}
        <path d="M 730 90 L 730 140" stroke="#52525b" strokeWidth="1.5" />

        {/* Row 2: Mid-pipeline: Domain & Visibility */}
        {/* Node 5: Interactive Visibility */}
        <g transform="translate(650, 140)">
          <rect x="0" y="0" width="160" height="60" rx="8" fill="#18181b" stroke="#a855f7" strokeWidth="1" />
          <text x="80" y="26" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">Visible Filtering</text>
          <text x="80" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Interactive Legend</text>
        </g>

        <path d="M 650 170 L 610 170" stroke="#52525b" strokeWidth="1.5" />

        {/* Node 6: Shared Quantitative Domain */}
        <g transform="translate(440, 140)">
          <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
          <text x="85" y="26" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">Zero-Inclusive Domain</text>
          <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">[Min, Max] includes 0</text>
        </g>

        <path d="M 440 170 L 400 170" stroke="#52525b" strokeWidth="1.5" />

        {/* Node 7: Category Band Scale */}
        <g transform="translate(230, 140)">
          <rect x="0" y="0" width="170" height="60" rx="8" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
          <text x="85" y="26" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="600">Categorical Groups</text>
          <text x="85" y="42" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">groupGap &amp; barGap</text>
        </g>

        {/* Vertical Transition Down to Execution */}
        <path d="M 315 200 L 315 250" stroke="#52525b" strokeWidth="1.5" />

        {/* Row 3: Recharts Grouped Bars & Inspection Surfaces */}
        {/* Node 8: Recharts Cartesian Grouped Bars */}
        <g transform="translate(30, 250)">
          <rect x="0" y="0" width="370" height="90" rx="10" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
          <text x="185" y="28" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="600">Recharts Cartesian Grouped Bars</text>
          <text x="185" y="48" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontFamily="monospace">{"NO stackId • Side-by-Side Peer Slots"}</text>
          <text x="185" y="68" textAnchor="middle" fill="#71717a" fontSize="10">XAxis, YAxis, CartesianGrid, ReferenceLine (0)</text>
        </g>

        <path d="M 400 295 L 440 295" stroke="#52525b" strokeWidth="1.5" />

        {/* Node 9: Inspection & Accessibility */}
        <g transform="translate(440, 250)">
          <rect x="0" y="0" width="370" height="90" rx="10" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="185" y="26" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="600">Inspection &amp; Accessible Outputs</text>
          <text x="185" y="46" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontFamily="monospace">Dual-Tier Focus &amp; Tooltip Card</text>
          <text x="185" y="68" textAnchor="middle" fill="#71717a" fontSize="10">Interactive Legend, Keyboard (Arrows/Home/End), Offscreen Table</text>
        </g>
      </svg>
    </div>
  )
}

export {
  GroupedVsStackedDiagram as GroupedVsStackedComparisonDiagram,
  RenderingArchitectureFlowDiagram as GroupCompareArchitectureFlowDiagram,
}

