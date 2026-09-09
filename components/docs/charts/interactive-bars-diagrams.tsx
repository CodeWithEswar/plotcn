"use client"

import React from "react"

/* -------------------------------------------------------------------------- */
/*  1. Interaction State Machine Diagram                                       */
/* -------------------------------------------------------------------------- */
export function InteractionStateMachineDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 300"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Interactive Bars State Machine"
      >
        <title>Interactive Bars State Machine</title>
        <desc>
          Diagram illustrating state transitions between IDLE, ACTIVE, and LOCKED states driven by pointer, touch, and keyboard input.
        </desc>
        <defs>
          <marker id="arrow-state" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" strokeLinecap="round" />
          </marker>
        </defs>

        {/* State 1: IDLE */}
        <g transform="translate(60, 100)">
          <rect width="160" height="90" rx="12" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />
          <circle cx="80" cy="30" r="12" fill="var(--muted, #27272a)" />
          <text x="80" y="34" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11" fontFamily="monospace">01</text>
          <text x="80" y="60" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="600">IDLE</text>
          <text x="80" y="76" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">No active category</text>
        </g>

        {/* State 2: ACTIVE (Transient) */}
        <g transform="translate(300, 40)">
          <rect width="170" height="95" rx="12" fill="var(--card, #18181b)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
          <circle cx="85" cy="28" r="12" fill="rgba(59,130,246,0.15)" />
          <text x="85" y="32" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="11" fontFamily="monospace">02</text>
          <text x="85" y="56" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="600">ACTIVE</text>
          <text x="85" y="72" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="11" fontWeight="500">Transient Hover</text>
          <text x="85" y="86" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Clears on pointer leave</text>
        </g>

        {/* State 3: LOCKED (Persistent) */}
        <g transform="translate(540, 100)">
          <rect width="170" height="95" rx="12" fill="var(--card, #18181b)" stroke="var(--chart-3, #10b981)" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="85" cy="28" r="12" fill="rgba(16,185,129,0.15)" />
          <text x="85" y="32" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="11" fontFamily="monospace">03</text>
          <text x="85" y="56" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="600">LOCKED</text>
          <text x="85" y="72" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="11" fontWeight="500">Persistent Selection</text>
          <text x="85" y="86" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Survives scroll &amp; leave</text>
        </g>

        {/* Transitions */}
        {/* IDLE -> ACTIVE (Pointer enter) */}
        <path d="M 180,100 C 220,60 250,60 295,65" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
        <text x="240" y="70" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="10" fontFamily="monospace">pointer enter</text>

        {/* ACTIVE -> IDLE (Pointer leave) */}
        <path d="M 295,110 C 250,115 220,115 225,120" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-state)" />
        <text x="250" y="132" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10" fontFamily="monospace">pointer leave</text>

        {/* ACTIVE -> LOCKED (Click / Enter) */}
        <path d="M 475,85 C 495,85 510,105 535,115" fill="none" stroke="var(--chart-3, #10b981)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
        <text x="510" y="90" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="10" fontFamily="monospace">click / tap / Space</text>

        {/* IDLE -> LOCKED (Direct touch tap / keyboard) */}
        <path d="M 220,165 C 340,240 440,240 540,175" fill="none" stroke="var(--chart-3, #10b981)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
        <text x="380" y="245" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="11" fontWeight="500">Touch tap / Keyboard direct</text>

        {/* LOCKED -> IDLE (Escape / 2nd tap) */}
        <path d="M 540,140 C 420,155 300,155 225,145" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrow-state)" />
        <text x="380" y="165" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10" fontFamily="monospace">Escape / tap again / dismiss</text>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 1: Complete three-state lifecycle distinguishing transient hover from persistent inspection.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  2. Active vs Locked Side-by-Side Diagram                                   */
/* -------------------------------------------------------------------------- */
export function ActiveVsLockedDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 260"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Active vs Locked Modality"
      >
        <title>Active vs Locked Modality</title>
        <desc>Side-by-side comparison showing transient active state on the left and persistent locked state on the right.</desc>

        {/* Panel 1: Active (Transient) */}
        <g transform="translate(40, 20)">
          <rect width="320" height="210" rx="14" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />
          <path d="M 0,0 L 320,0 L 320,44 L 0,44 Z" fill="rgba(59,130,246,0.08)" rx="14" />
          <circle cx="28" cy="22" r="6" fill="var(--chart-1, #3b82f6)" />
          <text x="44" y="26" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="600">ACTIVE STATE</text>
          <text x="290" y="26" textAnchor="end" fill="var(--chart-1, #3b82f6)" fontSize="11" fontFamily="monospace">Transient</text>

          <g transform="translate(20, 60)" fontSize="12" fill="var(--foreground, #fafafa)">
            <text y="16" fontWeight="500">• Driven by pointer hover</text>
            <text y="42" fill="var(--muted-foreground, #a1a1aa)">• Tooltip disappears immediately on pointer leave</text>
            <text y="68" fill="var(--muted-foreground, #a1a1aa)">• Requires stationary cursor</text>
            <text y="94" fill="var(--muted-foreground, #a1a1aa)">• Unsuitable for touch screen interaction</text>
            <text y="120" fill="var(--muted-foreground, #a1a1aa)">• Subordinate to locked selection</text>
          </g>
        </g>

        {/* Panel 2: Locked (Persistent) */}
        <g transform="translate(400, 20)">
          <rect width="320" height="210" rx="14" fill="var(--card, #18181b)" stroke="var(--chart-3, #10b981)" strokeWidth="2" />
          <path d="M 0,0 L 320,0 L 320,44 L 0,44 Z" fill="rgba(16,185,129,0.08)" rx="14" />
          <circle cx="28" cy="22" r="6" fill="var(--chart-3, #10b981)" />
          <text x="44" y="26" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="600">LOCKED STATE</text>
          <text x="290" y="26" textAnchor="end" fill="var(--chart-3, #10b981)" fontSize="11" fontFamily="monospace">Persistent</text>

          <g transform="translate(20, 60)" fontSize="12" fill="var(--foreground, #fafafa)">
            <text y="16" fontWeight="500">• Established by tap, click, or Space/Enter</text>
            <text y="42" fill="var(--muted-foreground, #a1a1aa)">• Tooltip remains pinned when finger/cursor leaves</text>
            <text y="68" fill="var(--muted-foreground, #a1a1aa)">• Survives vertical page scrolling</text>
            <text y="94" fill="var(--muted-foreground, #a1a1aa)">• Updates dynamically if underlying data changes</text>
            <text y="120" fill="var(--muted-foreground, #a1a1aa)">• Dismissed cleanly via Escape or 2nd tap</text>
          </g>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 2: Transient hover provides fluid desktop scanning, while persistent locking guarantees touch inspection.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  3. Category Band vs Rectangle Diagram                                      */
/* -------------------------------------------------------------------------- */
export function CategoryBandVsRectangleDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 280"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Category Band vs Rectangle Hit Target"
      >
        <title>Category Band vs Rectangle Hit Target</title>
        <desc>Illustration of a wide category band hit area enclosing peer series bars versus narrow individual rectangles.</desc>

        <rect width="760" height="280" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Background Grid */}
        <line x1="60" y1="210" x2="700" y2="210" stroke="var(--border, #3f3f46)" strokeWidth="1" />
        <line x1="60" y1="140" x2="700" y2="140" stroke="var(--border, #3f3f46)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="60" y1="70" x2="700" y2="70" stroke="var(--border, #3f3f46)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Category 1: Idle */}
        <g transform="translate(120, 0)">
          <rect x="0" y="50" width="160" height="160" fill="transparent" />
          <rect x="30" y="110" width="36" height="100" rx="3" fill="var(--chart-1, #3b82f6)" />
          <rect x="74" y="80" width="36" height="130" rx="3" fill="var(--chart-2, #f97316)" />
          <text x="70" y="235" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="12" fontWeight="500">Q1</text>
        </g>

        {/* Category 2: Active Category Band */}
        <g transform="translate(320, 0)">
          {/* Active Band Cursor */}
          <rect x="0" y="45" width="170" height="165" rx="8" fill="rgba(59,130,246,0.12)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
          <text x="85" y="36" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="11" fontWeight="600" fontFamily="monospace">FULL CATEGORY BAND</text>

          {/* Grouped Bars inside */}
          <rect x="32" y="90" width="38" height="120" rx="3" fill="var(--chart-1, #3b82f6)" />
          <rect x="78" y="65" width="38" height="145" rx="3" fill="var(--chart-2, #f97316)" stroke="var(--foreground, #ffffff)" strokeWidth="2" />

          <text x="85" y="235" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="700">Q2 (Active)</text>

          {/* Annotation Callout */}
          <path d="M 125,120 L 195,100" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1" markerEnd="url(#arrow-state)" />
          <text x="200" y="96" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="500">Exact Series Highlight</text>
          <text x="200" y="112" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Subordinate to category band</text>
        </g>

        {/* Category 3: Idle */}
        <g transform="translate(540, 0)">
          <rect x="0" y="50" width="160" height="160" fill="transparent" />
          <rect x="30" y="130" width="36" height="80" rx="3" fill="var(--chart-1, #3b82f6)" />
          <rect x="74" y="100" width="36" height="110" rx="3" fill="var(--chart-2, #f97316)" />
          <text x="70" y="235" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="12" fontWeight="500">Q3</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 3: The category band is the primary interaction unit. Touching anywhere in the band activates the full category.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  4. Zero & Tiny Bar Hit Region Diagram                                      */
/* -------------------------------------------------------------------------- */
export function ZeroTinyBarHitRegionDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 260"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Zero and Tiny Bar Inspectability"
      >
        <title>Zero and Tiny Bar Inspectability</title>
        <desc>Shows that zero and tiny bars remain fully interactive through category bands without distorting numeric geometry.</desc>

        <rect width="760" height="260" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Baseline */}
        <line x1="60" y1="180" x2="700" y2="180" stroke="var(--foreground, #fafafa)" strokeWidth="1.5" />
        <text x="50" y="184" textAnchor="end" fill="var(--muted-foreground, #a1a1aa)" fontSize="11" fontFamily="monospace">0</text>

        {/* Case A: Normal Bar */}
        <g transform="translate(100, 40)">
          <rect x="0" y="0" width="150" height="140" fill="transparent" />
          <rect x="45" y="40" width="45" height="100" rx="3" fill="var(--chart-1, #3b82f6)" />
          <text x="67" y="165" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12">Normal ($100)</text>
          <text x="67" y="25" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Easy target</text>
        </g>

        {/* Case B: Tiny Bar (0.001) */}
        <g transform="translate(310, 40)">
          {/* Broad Category Hit Target */}
          <rect x="0" y="0" width="150" height="140" rx="8" fill="rgba(59,130,246,0.12)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Truthful Tiny Bar */}
          <rect x="45" y="138" width="45" height="2" rx="1" fill="var(--chart-1, #3b82f6)" />
          <text x="75" y="165" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12">Tiny ($0.01)</text>
          <text x="75" y="25" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="10" fontWeight="600">Band hit area = 150px</text>
          <text x="75" y="125" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">No fake bar inflation</text>
        </g>

        {/* Case C: Zero Bar (0) */}
        <g transform="translate(520, 40)">
          {/* Broad Category Hit Target */}
          <rect x="0" y="0" width="150" height="140" rx="8" fill="rgba(16,185,129,0.12)" stroke="var(--chart-3, #10b981)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Zero marker on baseline */}
          <circle cx="75" cy="140" r="3" fill="var(--chart-3, #10b981)" />
          <text x="75" y="165" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12">Zero ($0.00)</text>
          <text x="75" y="25" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="10" fontWeight="600">Fully inspectable</text>
          <text x="75" y="125" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Tooltip reports truthful 0</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 4: Quantitative bar marks remain mathematically truthful without artificial minimum height or fake inflation.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  5. Touch Lock Lifecycle Diagram                                            */
/* -------------------------------------------------------------------------- */
export function TouchLockLifecycleDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 240"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Touch Lock Lifecycle"
      >
        <title>Touch Lock Lifecycle</title>
        <desc>Five-stage lifecycle showing tap activation, lock persistence, scroll safety, and clean dismissal.</desc>

        <rect width="760" height="240" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Step 1 */}
        <g transform="translate(40, 40)">
          <rect width="120" height="140" rx="10" fill="var(--muted, #27272a)" />
          <circle cx="60" cy="30" r="14" fill="var(--chart-1, #3b82f6)" />
          <text x="60" y="34" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">1</text>
          <text x="60" y="70" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Tap Bar</text>
          <text x="60" y="90" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Finger touches</text>
          <text x="60" y="104" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">category band</text>
        </g>

        {/* Step 2 */}
        <g transform="translate(185, 40)">
          <rect width="120" height="140" rx="10" fill="rgba(16,185,129,0.1)" stroke="var(--chart-3, #10b981)" strokeWidth="1.5" />
          <circle cx="60" cy="30" r="14" fill="var(--chart-3, #10b981)" />
          <text x="60" y="34" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">2</text>
          <text x="60" y="70" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Lock Set</text>
          <text x="60" y="90" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="10">Tooltip pinned</text>
          <text x="60" y="104" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Band highlighted</text>
        </g>

        {/* Step 3 */}
        <g transform="translate(330, 40)">
          <rect width="120" height="140" rx="10" fill="var(--muted, #27272a)" />
          <circle cx="60" cy="30" r="14" fill="var(--chart-1, #3b82f6)" />
          <text x="60" y="34" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">3</text>
          <text x="60" y="70" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Finger Lifts</text>
          <text x="60" y="90" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="10">Lock preserved</text>
          <text x="60" y="104" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">No hover loss</text>
        </g>

        {/* Step 4 */}
        <g transform="translate(475, 40)">
          <rect width="120" height="140" rx="10" fill="var(--muted, #27272a)" />
          <circle cx="60" cy="30" r="14" fill="var(--chart-1, #3b82f6)" />
          <text x="60" y="34" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">4</text>
          <text x="60" y="70" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Page Scroll</text>
          <text x="60" y="90" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="10">Scroll safe</text>
          <text x="60" y="104" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">No touch lockup</text>
        </g>

        {/* Step 5 */}
        <g transform="translate(620, 40)">
          <rect width="105" height="140" rx="10" fill="var(--muted, #27272a)" />
          <circle cx="52" cy="30" r="14" fill="var(--muted-foreground, #a1a1aa)" />
          <text x="52" y="34" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">5</text>
          <text x="52" y="70" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Dismiss</text>
          <text x="52" y="90" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Tap again /</text>
          <text x="52" y="104" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">tap other</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 5: Touch locking keeps inspection actionable on mobile without trapping page gestures.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  6. Keyboard Traversal Diagram                                              */
/* -------------------------------------------------------------------------- */
export function KeyboardTraversalDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 220"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Single Tab-Stop Keyboard Traversal"
      >
        <title>Single Tab-Stop Keyboard Traversal</title>
        <desc>Keyboard navigation model using Left and Right arrows, Home, End, Enter, Space, and Escape.</desc>

        <rect width="760" height="220" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Keys grid */}
        <g transform="translate(50, 40)">
          {/* ArrowLeft / ArrowRight */}
          <g transform="translate(0, 0)">
            <rect width="190" height="60" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
            <text x="20" y="36" fill="var(--foreground, #fafafa)" fontSize="16" fontFamily="monospace">←  →</text>
            <text x="80" y="28" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Next / Prev</text>
            <text x="80" y="46" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Category traversal</text>
          </g>

          {/* Home / End */}
          <g transform="translate(230, 0)">
            <rect width="200" height="60" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
            <text x="20" y="36" fill="var(--foreground, #fafafa)" fontSize="13" fontFamily="monospace">Home / End</text>
            <text x="110" y="28" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Extremes</text>
            <text x="110" y="46" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">First or last category</text>
          </g>

          {/* Enter / Space */}
          <g transform="translate(470, 0)">
            <rect width="190" height="60" rx="8" fill="rgba(16,185,129,0.1)" stroke="var(--chart-3, #10b981)" strokeWidth="1.5" />
            <text x="16" y="36" fill="var(--chart-3, #10b981)" fontSize="13" fontFamily="monospace">Enter / Space</text>
            <text x="120" y="28" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Toggle Lock</text>
            <text x="120" y="46" fill="var(--chart-3, #10b981)" fontSize="10">Pin/unpin tooltip</text>
          </g>

          {/* Escape */}
          <g transform="translate(0, 80)">
            <rect width="190" height="50" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
            <text x="20" y="32" fill="var(--foreground, #fafafa)" fontSize="13" fontFamily="monospace">Escape</text>
            <text x="80" y="24" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Unlock</text>
            <text x="80" y="40" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Dismiss inspection</text>
          </g>

          {/* One Tab Stop Rule */}
          <g transform="translate(230, 80)">
            <rect width="430" height="50" rx="8" fill="rgba(59,130,246,0.08)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1" />
            <circle cx="25" cy="25" r="8" fill="var(--chart-1, #3b82f6)" />
            <text x="25" y="29" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">!</text>
            <text x="45" y="24" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">One Tab Stop Architecture</text>
            <text x="45" y="40" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Focus belongs to the figure container; bars do not generate individual tab stops.</text>
          </g>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 6: One-tab-stop keyboard interaction prevents tab explosions while allowing exhaustive category traversal.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  7. Grouped Series Inspection Diagram                                       */
/* -------------------------------------------------------------------------- */
export function GroupedSeriesInspectionDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 260"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Grouped Multi-Series Readout"
      >
        <title>Grouped Multi-Series Readout</title>
        <desc>Demonstrates how the category tooltip reports all peer series values simultaneously when hovering a category.</desc>

        <rect width="760" height="260" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Grouped Category in Chart */}
        <g transform="translate(100, 40)">
          <rect x="0" y="10" width="180" height="170" rx="8" fill="rgba(59,130,246,0.08)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1" />
          <rect x="25" y="50" width="36" height="120" rx="3" fill="var(--chart-1, #3b82f6)" />
          <rect x="70" y="70" width="36" height="100" rx="3" fill="var(--chart-2, #f97316)" stroke="var(--foreground, #ffffff)" strokeWidth="2" />
          <rect x="115" y="100" width="36" height="70" rx="3" fill="var(--chart-3, #10b981)" />
          <text x="90" y="195" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="600">Q2 2026</text>
        </g>

        {/* Arrow to Tooltip */}
        <path d="M 285,115 L 365,115" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />

        {/* Synchronized Tooltip Card */}
        <g transform="translate(390, 35)">
          <rect width="280" height="180" rx="12" fill="var(--popover, #09090b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />
          <path d="M 0,0 L 280,0 L 280,36 L 0,36 Z" fill="rgba(255,255,255,0.04)" rx="12" />

          {/* Header */}
          <text x="16" y="24" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="600">Q2 2026</text>
          <text x="264" y="24" textAnchor="end" fill="var(--chart-3, #10b981)" fontSize="10" fontFamily="monospace">Locked</text>

          {/* Series Row 1 */}
          <g transform="translate(16, 56)">
            <rect width="8" height="8" rx="2" fill="var(--chart-1, #3b82f6)" />
            <text x="16" y="8" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Product Revenue</text>
            <text x="248" y="8" textAnchor="end" fill="var(--foreground, #fafafa)" fontSize="11" fontFamily="monospace" fontWeight="500">$96M</text>
          </g>

          {/* Series Row 2 (Emphasized because hovered directly) */}
          <g transform="translate(16, 88)">
            <rect x="-6" y="-6" width="260" height="26" rx="4" fill="rgba(255,255,255,0.08)" />
            <rect width="8" height="8" rx="2" fill="var(--chart-2, #f97316)" />
            <text x="16" y="8" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="600">Services Revenue ★</text>
            <text x="248" y="8" textAnchor="end" fill="var(--foreground, #fafafa)" fontSize="11" fontFamily="monospace" fontWeight="700">$61M</text>
          </g>

          {/* Series Row 3 */}
          <g transform="translate(16, 120)">
            <rect width="8" height="8" rx="2" fill="var(--chart-3, #10b981)" />
            <text x="16" y="8" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Enterprise</text>
            <text x="248" y="8" textAnchor="end" fill="var(--foreground, #fafafa)" fontSize="11" fontFamily="monospace" fontWeight="500">$44M</text>
          </g>

          {/* Footer note */}
          <line x1="16" y1="144" x2="264" y2="144" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="16" y="162" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">All visible peer series disclosed in canonical order.</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 7: Inspecting an individual bar highlights that series without suppressing its peer comparisons.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  8. Input Handoff Precedence Diagram                                        */
/* -------------------------------------------------------------------------- */
export function InputHandoffDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 220"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Input Modality Precedence Hierarchy"
      >
        <title>Input Modality Precedence Hierarchy</title>
        <desc>Deterministic resolution flow between touch, keyboard, and pointer inputs without race conditions.</desc>

        <rect width="760" height="220" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Priority 1 */}
        <g transform="translate(40, 50)">
          <rect width="200" height="120" rx="12" fill="rgba(16,185,129,0.1)" stroke="var(--chart-3, #10b981)" strokeWidth="2" />
          <text x="100" y="32" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="11" fontWeight="700" fontFamily="monospace">PRIORITY 1</text>
          <text x="100" y="58" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="600">Locked State</text>
          <text x="100" y="80" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Survives all pointer motion</text>
          <text x="100" y="96" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Unlocked only by explicit action</text>
        </g>

        {/* Arrow > */}
        <path d="M 255,110 L 285,110" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="2" markerEnd="url(#arrow-state)" />

        {/* Priority 2 */}
        <g transform="translate(300, 50)">
          <rect width="200" height="120" rx="12" fill="rgba(59,130,246,0.1)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
          <text x="100" y="32" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="11" fontWeight="700" fontFamily="monospace">PRIORITY 2</text>
          <text x="100" y="58" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="600">Keyboard Traversal</text>
          <text x="100" y="80" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Intentional Arrow/Home/End</text>
          <text x="100" y="96" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Overrides stale hover position</text>
        </g>

        {/* Arrow > */}
        <path d="M 515,110 L 545,110" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="2" markerEnd="url(#arrow-state)" />

        {/* Priority 3 */}
        <g transform="translate(560, 50)">
          <rect width="160" height="120" rx="12" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="80" y="32" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11" fontWeight="700" fontFamily="monospace">PRIORITY 3</text>
          <text x="80" y="58" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="600">Pointer Hover</text>
          <text x="80" y="80" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Transient inspection</text>
          <text x="80" y="96" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Yields to lock &amp; keys</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 8: Deterministic modality hierarchy prevents race conditions between mouse, touch, and keyboard.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  9. Focus vs Active vs Locked Visual Distinction                            */
/* -------------------------------------------------------------------------- */
export function FocusVsActiveVsLockedDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 220"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Visual Distinction between Focus, Active, and Locked"
      >
        <title>Visual Distinction between Focus, Active, and Locked</title>
        <desc>Three distinct visual states: focus ring on chart shell, active band fill, and locked dashed structural border.</desc>

        <rect width="760" height="220" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* FOCUS */}
        <g transform="translate(50, 40)">
          <rect width="190" height="130" rx="12" fill="var(--muted, #27272a)" stroke="var(--ring, #3b82f6)" strokeWidth="2" strokeDasharray="0" />
          <text x="95" y="30" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="700">FOCUS</text>
          <text x="95" y="52" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="11" fontWeight="500">Outer Shell Ring</text>
          <text x="95" y="80" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Applies to &lt;figure&gt;</text>
          <text x="95" y="96" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Keyboard tab target</text>
        </g>

        {/* ACTIVE */}
        <g transform="translate(285, 40)">
          <rect width="190" height="130" rx="12" fill="rgba(59,130,246,0.12)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="95" y="30" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="700">ACTIVE</text>
          <text x="95" y="52" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="11" fontWeight="500">Subtle Band Fill</text>
          <text x="95" y="80" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Underlying category band</text>
          <text x="95" y="96" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Hover cursor opacity 0.09</text>
        </g>

        {/* LOCKED */}
        <g transform="translate(520, 40)">
          <rect width="190" height="130" rx="12" fill="rgba(16,185,129,0.12)" stroke="var(--chart-3, #10b981)" strokeWidth="2" strokeDasharray="4 2" />
          <text x="95" y="30" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="700">LOCKED</text>
          <text x="95" y="52" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="11" fontWeight="500">Dashed Border + Tag</text>
          <text x="95" y="80" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Persistent selection</text>
          <text x="95" y="96" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Lock badge in tooltip</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 9: Never conflate shell focus, transient hover, and persistent lock into one generic outline.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  10. Interactive Legend State Diagram                                       */
/* -------------------------------------------------------------------------- */
export function InteractiveLegendStateDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 210"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Interactive Legend Series Toggling"
      >
        <title>Interactive Legend Series Toggling</title>
        <desc>Demonstrates how toggling series in the legend preserves category lock and stable color identity.</desc>

        <rect width="760" height="210" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Legend buttons */}
        <g transform="translate(60, 40)">
          {/* Active series 1 */}
          <rect x="0" y="0" width="180" height="42" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <rect x="14" y="15" width="12" height="12" rx="2" fill="var(--chart-1, #3b82f6)" />
          <text x="36" y="27" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Product (Visible)</text>

          {/* Hidden series 2 */}
          <rect x="200" y="0" width="200" height="42" rx="8" fill="var(--muted, #27272a)" opacity="0.4" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <rect x="214" y="15" width="12" height="12" rx="2" fill="var(--chart-2, #f97316)" />
          <text x="236" y="27" fill="var(--muted-foreground, #a1a1aa)" fontSize="12" textDecoration="line-through">Services (Hidden)</text>

          {/* Active series 3 */}
          <rect x="420" y="0" width="180" height="42" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <rect x="434" y="15" width="12" height="12" rx="2" fill="var(--chart-3, #10b981)" />
          <text x="456" y="27" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Enterprise (Visible)</text>
        </g>

        {/* Invariants banner */}
        <g transform="translate(60, 110)">
          <rect width="640" height="65" rx="8" fill="rgba(59,130,246,0.08)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1" />
          <text x="24" y="28" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Stability Invariants Guaranteed by Plotcn:</text>
          <text x="24" y="48" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">
            1. Hiding a series never recolors peers. 2. Locked category remains active. 3. Tooltip preserves canonical series order.
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 10: Toggling series visibility filters data rows without resetting interactive locks or reassigning palette slots.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  11. Orientation Interaction Diagram                                        */
/* -------------------------------------------------------------------------- */
export function OrientationInteractionDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 250"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Vertical vs Horizontal Interaction Axes"
      >
        <title>Vertical vs Horizontal Interaction Axes</title>
        <desc>Comparison of horizontal X category traversal vs vertical Y category traversal.</desc>

        <rect width="760" height="250" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Vertical Layout */}
        <g transform="translate(50, 30)">
          <rect width="300" height="180" rx="12" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="150" y="26" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="600">Vertical Layout (Default)</text>

          {/* Vertical bands */}
          <rect x="40" y="45" width="60" height="100" rx="4" fill="rgba(59,130,246,0.12)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1" />
          <rect x="58" y="75" width="24" height="70" rx="2" fill="var(--chart-1, #3b82f6)" />

          <rect x="120" y="45" width="60" height="100" rx="4" fill="transparent" />
          <rect x="138" y="95" width="24" height="50" rx="2" fill="var(--muted-foreground, #a1a1aa)" />

          <rect x="200" y="45" width="60" height="100" rx="4" fill="transparent" />
          <rect x="218" y="60" width="24" height="85" rx="2" fill="var(--muted-foreground, #a1a1aa)" />

          <text x="150" y="165" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">X-Axis Bands • ArrowLeft / ArrowRight</text>
        </g>

        {/* Horizontal Layout */}
        <g transform="translate(410, 30)">
          <rect width="300" height="180" rx="12" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="150" y="26" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="600">Horizontal Layout</text>

          {/* Horizontal bands */}
          <rect x="30" y="45" width="240" height="30" rx="4" fill="rgba(16,185,129,0.12)" stroke="var(--chart-3, #10b981)" strokeWidth="1" />
          <rect x="30" y="52" width="140" height="16" rx="2" fill="var(--chart-3, #10b981)" />

          <rect x="30" y="85" width="240" height="30" rx="4" fill="transparent" />
          <rect x="30" y="92" width="90" height="16" rx="2" fill="var(--muted-foreground, #a1a1aa)" />

          <rect x="30" y="125" width="240" height="30" rx="4" fill="transparent" />
          <rect x="30" y="132" width="160" height="16" rx="2" fill="var(--muted-foreground, #a1a1aa)" />

          <text x="150" y="168" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="11">Y-Axis Rows • ArrowUp / ArrowDown</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 11: Category bands and keyboard navigation adapt automatically to vertical or horizontal orientation.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  12. Rendering & Interaction Architecture Diagram                           */
/* -------------------------------------------------------------------------- */
export function RenderingInteractionArchitectureDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 760 300"
        className="w-full max-w-2xl h-auto overflow-visible"
        role="img"
        aria-label="Rendering and Interaction Architecture"
      >
        <title>Rendering and Interaction Architecture</title>
        <desc>Architecture pipeline from raw data validation through Recharts grouped bars, interaction overlay, state reducer, and accessibility tree.</desc>

        <rect width="760" height="300" rx="16" fill="var(--card, #18181b)" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

        {/* Stage 1: Consumer Data */}
        <g transform="translate(40, 40)">
          <rect width="180" height="70" rx="10" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="90" y="28" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Consumer Data</text>
          <text x="90" y="48" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">CategoryKey + Series[]</text>
        </g>

        {/* Arrow > */}
        <path d="M 225,75 L 275,75" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />

        {/* Stage 2: Normalization */}
        <g transform="translate(290, 40)">
          <rect width="180" height="70" rx="10" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="90" y="28" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Data Normalizer</text>
          <text x="90" y="48" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Preserve order • Filter NaNs</text>
        </g>

        {/* Arrow > */}
        <path d="M 475,75 L 525,75" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />

        {/* Stage 3: Recharts Core */}
        <g transform="translate(540, 40)">
          <rect width="180" height="70" rx="10" fill="rgba(59,130,246,0.1)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
          <text x="90" y="28" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Recharts Core</text>
          <text x="90" y="48" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="10">BarChart • Axes • Grid</text>
        </g>

        {/* Branch down to Interaction Reducer */}
        <path d="M 630,115 L 630,150 L 465,175" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />

        {/* Stage 4: Interaction Reducer */}
        <g transform="translate(260, 155)">
          <rect width="240" height="95" rx="12" fill="rgba(16,185,129,0.1)" stroke="var(--chart-3, #10b981)" strokeWidth="2" />
          <text x="120" y="26" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="11" fontWeight="700" fontFamily="monospace">INTERACTION REDUCER</text>
          <text x="120" y="48" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">Active &amp; Locked State Machine</text>
          <text x="120" y="68" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Pointer • Touch tap • Keyboard arrows</text>
          <text x="120" y="82" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Discrete category snapping</text>
        </g>

        {/* Outputs from Reducer */}
        <path d="M 255,200 L 195,200" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />
        <path d="M 505,200 L 555,200" fill="none" stroke="var(--muted-foreground, #a1a1aa)" strokeWidth="1.5" markerEnd="url(#arrow-state)" />

        {/* Output A: Band Cursor & Tooltip */}
        <g transform="translate(40, 165)">
          <rect width="150" height="70" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="75" y="28" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="600">Band Cursor &amp; Tooltip</text>
          <text x="75" y="46" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Controlled position</text>
          <text x="75" y="58" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Persistent pin</text>
        </g>

        {/* Output B: Accessibility Shell */}
        <g transform="translate(565, 165)">
          <rect width="155" height="70" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="77" y="28" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="600">Accessibility Shell</text>
          <text x="77" y="46" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">aria-live polite</text>
          <text x="77" y="58" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">Structured HTML table</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure 12: Separation of concerns: Recharts handles mark geometry while Plotcn's reducer controls inspection state and a11y.
      </figcaption>
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/*  13. Animated Interaction Hierarchy Diagram                                 */
/* -------------------------------------------------------------------------- */
export function InteractionHierarchyDiagram() {
  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 860 380"
        className="w-full max-w-3xl h-auto overflow-visible"
        role="img"
        aria-label="Animated Interaction Hierarchy: Category-First Architecture"
      >
        <title>Animated Interaction Hierarchy: Category-First Architecture</title>
        <desc>
          Interactive hierarchy illustrating how Category is the primary stable inspection unit, branching into Category Band (pointer, keyboard, touch lock) and subordinate Exact Series Identity.
        </desc>
        <style>{`
          @keyframes signalFlow {
            0% { stroke-dashoffset: 32; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes pulseGlow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(59,130,246,0.3)); opacity: 0.9; }
            50% { filter: drop-shadow(0 0 10px rgba(59,130,246,0.7)); opacity: 1; }
          }
          @keyframes radarPing {
            0% { r: 5; opacity: 0.9; }
            70% { r: 14; opacity: 0; }
            100% { r: 14; opacity: 0; }
          }
          @keyframes pulseSubtle {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
          .anim-flow {
            stroke-dasharray: 8 8;
            animation: signalFlow 1.6s linear infinite;
          }
          .anim-glow {
            animation: pulseGlow 3s ease-in-out infinite;
          }
          .anim-ping {
            animation: radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .anim-subtle {
            animation: pulseSubtle 2.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .anim-flow, .anim-glow, .anim-ping, .anim-subtle {
              animation: none !important;
            }
          }
        `}</style>
        <defs>
          <linearGradient id="grad-cat-root" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--chart-1, #3b82f6)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--chart-1, #3b82f6)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="grad-band-branch" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--chart-3, #10b981)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--card, #18181b)" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="grad-series-branch" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--muted, #27272a)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--card, #18181b)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* ROOT: Category */}
        <g transform="translate(300, 20)">
          <rect
            width="260"
            height="64"
            rx="14"
            fill="url(#grad-cat-root)"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="2"
            className="anim-glow"
          />
          <text x="130" y="26" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="10" fontFamily="monospace" fontWeight="700" letterSpacing="0.08em">
            ROOT INTERACTION UNIT
          </text>
          <text x="130" y="48" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="16" fontWeight="700">
            Category
          </text>
          <circle cx="28" cy="32" r="6" fill="var(--chart-1, #3b82f6)" />
          <circle cx="28" cy="32" r="6" fill="none" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" className="anim-ping" />
        </g>

        {/* Branch Lines from Category */}
        {/* Left branch down to Category Band */}
        <path
          d="M 360,84 L 360,110 L 260,110 L 260,140"
          fill="none"
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth="2"
          className="anim-flow"
        />

        {/* Right branch down to Exact Series Identity */}
        <path
          d="M 500,84 L 500,110 L 680,110 L 680,140"
          fill="none"
          stroke="var(--muted-foreground, #71717a)"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />

        {/* BRANCH 1: Category Band (PRIMARY) */}
        <g transform="translate(40, 140)">
          {/* Main Card Container */}
          <rect
            width="440"
            height="215"
            rx="12"
            fill="url(#grad-band-branch)"
            stroke="var(--chart-3, #10b981)"
            strokeWidth="1.5"
            className="anim-subtle"
          />
          {/* Header pill */}
          <rect x="16" y="14" width="112" height="20" rx="6" fill="rgba(16,185,129,0.2)" stroke="var(--chart-3, #10b981)" strokeWidth="1" />
          <text x="72" y="28" textAnchor="middle" fill="var(--chart-3, #10b981)" fontSize="9" fontFamily="monospace" fontWeight="700">
            PRIMARY TARGET
          </text>
          <text x="140" y="29" fill="var(--foreground, #fafafa)" fontSize="14" fontWeight="700">
            category band
          </text>

          {/* Sub-item 1: Pointer inspection (transient) */}
          <g transform="translate(20, 48)">
            <rect width="400" height="46" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
            <circle cx="20" cy="23" r="4" fill="var(--chart-1, #3b82f6)" />
            <text x="36" y="21" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">
              pointer inspection
            </text>
            <rect x="175" y="11" width="70" height="16" rx="4" fill="rgba(59,130,246,0.15)" />
            <text x="210" y="22" textAnchor="middle" fill="var(--chart-1, #3b82f6)" fontSize="9" fontFamily="monospace" fontWeight="600">
              transient
            </text>
            <text x="36" y="37" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              Hover enters category band · Tooltip opens · Clears immediately on leave
            </text>
          </g>

          {/* Sub-item 2: Keyboard traversal (single tab stop) */}
          <g transform="translate(20, 102)">
            <rect width="400" height="46" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
            <circle cx="20" cy="23" r="4" fill="var(--chart-4, #a855f7)" />
            <text x="36" y="21" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">
              keyboard traversal
            </text>
            <rect x="180" y="11" width="92" height="16" rx="4" fill="rgba(168,85,247,0.15)" />
            <text x="226" y="22" textAnchor="middle" fill="var(--chart-4, #a855f7)" fontSize="9" fontFamily="monospace" fontWeight="600">
              single tab stop
            </text>
            <text x="36" y="37" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              Arrow keys move focus · Home/End jump · Clamps at boundaries
            </text>
          </g>

          {/* Sub-item 3: Touch activation / lock (persistent) */}
          <g transform="translate(20, 156)">
            <rect width="400" height="46" rx="8" fill="var(--muted, #27272a)" stroke="var(--chart-selection, #eab308)" strokeWidth="1.2" />
            <circle cx="20" cy="23" r="4" fill="var(--chart-selection, #eab308)" />
            <text x="36" y="21" fill="var(--foreground, #fafafa)" fontSize="12" fontWeight="600">
              touch activation / lock
            </text>
            <rect x="205" y="11" width="76" height="16" rx="4" fill="rgba(234,179,8,0.15)" />
            <text x="243" y="22" textAnchor="middle" fill="var(--chart-selection, #eab308)" fontSize="9" fontFamily="monospace" fontWeight="600">
              persistent
            </text>
            <text x="36" y="37" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              Single tap establishes locked state · Page scrolling remains fluid &amp; native
            </text>
          </g>
        </g>

        {/* BRANCH 2: optional exact series identity (SECONDARY) */}
        <g transform="translate(520, 140)">
          {/* Main Card Container */}
          <rect
            width="300"
            height="215"
            rx="12"
            fill="url(#grad-series-branch)"
            stroke="var(--border, #3f3f46)"
            strokeWidth="1.2"
          />
          {/* Header pill */}
          <rect x="16" y="14" width="135" height="20" rx="6" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
          <text x="83" y="28" textAnchor="middle" fill="var(--muted-foreground, #a1a1aa)" fontSize="9" fontFamily="monospace" fontWeight="600">
            OPTIONAL REFINEMENT
          </text>
          <text x="16" y="52" fill="var(--foreground, #fafafa)" fontSize="13" fontWeight="700">
            exact series identity
          </text>
          <text x="16" y="70" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
            Subordinate to category context
          </text>

          {/* Child element: Tooltip emphasis + active bar mark stroke */}
          <g transform="translate(16, 92)">
            <rect width="268" height="110" rx="8" fill="var(--muted, #27272a)" stroke="var(--border, #3f3f46)" strokeWidth="1" />
            <text x="14" y="24" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="600">
              tooltip emphasis + active stroke
            </text>
            <text x="14" y="44" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              • Emphasizes hovered bar rectangle
            </text>
            <text x="14" y="60" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              • Never hides visible peer series
            </text>
            <text x="14" y="76" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              • Preserves configured series order
            </text>
            <text x="14" y="92" fill="var(--muted-foreground, #a1a1aa)" fontSize="10">
              • Tooltip remains category-first
            </text>
          </g>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure: Interactive hierarchy showing Category as the primary stable unit, governing the category band and subordinate series mark emphasis.
      </figcaption>
    </figure>
  )
}
