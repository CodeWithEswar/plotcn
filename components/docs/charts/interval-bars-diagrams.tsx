"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  1. Interval Model Diagram                                                 */
/* -------------------------------------------------------------------------- */

export function IntervalModelDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Interval Model
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Floating Range Geometry: Start, End, and Span
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram illustrating the interval model where a floating bar begins at a supplied start coordinate and extends to an end coordinate, defining span as end minus start without an implicit zero origin.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Interval Model: Bounded Range Geometry</title>

          {/* Scale Axis Line */}
          <line x1="80" y1="170" x2="780" y2="170" stroke="var(--border)" strokeWidth="1.5" />
          <text x="80" y="195" className="fill-muted-foreground text-[11px] font-mono">Domain Min</text>
          <text x="780" y="195" textAnchor="end" className="fill-muted-foreground text-[11px] font-mono">Domain Max</text>

          {/* Start Boundary Marker */}
          <line x1="260" y1="60" x2="260" y2="175" stroke="var(--foreground)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="260" cy="115" r="4" fill="var(--chart-1)" />
          <text x="260" y="45" textAnchor="middle" className="fill-foreground text-xs font-bold font-mono">Start (Bound A)</text>
          <text x="260" y="195" textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">x(start)</text>

          {/* End Boundary Marker */}
          <line x1="600" y1="60" x2="600" y2="175" stroke="var(--foreground)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="600" cy="115" r="4" fill="var(--chart-1)" />
          <text x="600" y="45" textAnchor="middle" className="fill-foreground text-xs font-bold font-mono">End (Bound B)</text>
          <text x="600" y="195" textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">x(end)</text>

          {/* Floating Interval Bar */}
          <rect
            x="260"
            y="95"
            width="340"
            height="40"
            rx="6"
            fill="var(--chart-1)"
            opacity="0.85"
            className="stroke-foreground/20"
            strokeWidth="1"
          />

          {/* Span Dimension Callout */}
          <line x1="270" y1="115" x2="590" y2="115" stroke="#ffffff" strokeWidth="1.5" />
          <text x="430" y="119" textAnchor="middle" className="fill-white text-xs font-bold font-mono">
            span = end &minus; start
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  2. Floating vs Baseline Bar Diagram                                       */
/* -------------------------------------------------------------------------- */

export function FloatingVsBaselineBarDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Comparative Geometry
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Conventional Baseline Bar vs Floating Interval Bar
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison diagram contrasting conventional bars rooted at zero with floating interval bars anchored at both start and end coordinates.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Floating Bar vs Baseline Bar Comparison</title>

          {/* Panel 1: Standard Bar */}
          <rect x="40" y="30" width="370" height="190" rx="10" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <text x="60" y="55" className="fill-muted-foreground text-[11px] font-mono uppercase font-bold">Standard Bar (Rooted at Zero)</text>

          {/* Zero Axis */}
          <line x1="120" y1="75" x2="120" y2="185" stroke="var(--chart-axis, #71717a)" strokeWidth="2" />
          <text x="120" y="202" textAnchor="middle" className="fill-foreground text-[11px] font-mono font-bold">0</text>

          {/* Single Value Bar */}
          <rect x="120" y="105" width="220" height="34" rx="4" fill="var(--muted-foreground)" opacity="0.4" />
          <text x="230" y="127" textAnchor="middle" className="fill-foreground text-xs font-mono">value = 100</text>
          <text x="60" y="170" className="fill-muted-foreground text-[10px]">Geometry implicitly starts at zero baseline</text>

          {/* Panel 2: Interval Bar */}
          <rect x="450" y="30" width="370" height="190" rx="10" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <text x="470" y="55" className="fill-muted-foreground text-[11px] font-mono uppercase font-bold">Interval Bar (Floating Range)</text>

          {/* Scale Axis */}
          <line x1="470" y1="185" x2="790" y2="185" stroke="var(--border)" strokeWidth="1.5" />

          {/* Floating Interval Bar */}
          <line x1="560" y1="75" x2="560" y2="185" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="720" y1="75" x2="720" y2="185" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />

          <rect x="560" y="105" width="160" height="34" rx="4" fill="var(--chart-1)" opacity="0.85" />
          <text x="640" y="127" textAnchor="middle" className="fill-white text-xs font-mono font-bold">span = 20</text>

          <text x="560" y="202" textAnchor="middle" className="fill-foreground text-[11px] font-mono">100 (Start)</text>
          <text x="720" y="202" textAnchor="middle" className="fill-foreground text-[11px] font-mono">120 (End)</text>
          <text x="470" y="170" className="fill-muted-foreground text-[10px]">Position (100) and Span (20) are both primary data</text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  3. Start / End / Span Anatomy Diagram                                     */
/* -------------------------------------------------------------------------- */

export function StartEndSpanAnatomyDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Component Anatomy
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Category Row, Start/End Bounds, and Span Geometry
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Anatomy breakdown showing the category label row, the floating bar body with rounded corners, the start bound coordinate, the end bound coordinate, and the derived span width.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 240"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Start End Span Anatomy</title>

          {/* Row Hit Band */}
          <rect x="40" y="50" width="780" height="120" rx="8" className="fill-muted/10 stroke-border/40" strokeWidth="1" />
          <text x="60" y="115" className="fill-foreground text-sm font-bold">Authentication</text>
          <text x="60" y="132" className="fill-muted-foreground text-[10px] font-mono">Category Row</text>

          {/* Floating Interval Bar */}
          <rect x="300" y="85" width="360" height="48" rx="6" fill="var(--chart-1)" opacity="0.85" />

          {/* Start Callout */}
          <path d="M 300 85 L 300 45" stroke="var(--foreground)" strokeWidth="1.5" />
          <circle cx="300" cy="85" r="4" fill="var(--foreground)" />
          <text x="300" y="35" textAnchor="middle" className="fill-foreground text-xs font-mono font-bold">Start: 09:00</text>

          {/* End Callout */}
          <path d="M 660 85 L 660 45" stroke="var(--foreground)" strokeWidth="1.5" />
          <circle cx="660" cy="85" r="4" fill="var(--foreground)" />
          <text x="660" y="35" textAnchor="middle" className="fill-foreground text-xs font-mono font-bold">End: 11:30</text>

          {/* Span Dimension Bar */}
          <line x1="310" y1="110" x2="650" y2="110" stroke="#ffffff" strokeWidth="1.5" />
          <text x="480" y="114" textAnchor="middle" className="fill-white text-xs font-bold font-mono">
            Duration: 2h 30m
          </text>

          {/* Bottom Scale */}
          <line x1="200" y1="170" x2="800" y2="170" stroke="var(--border)" strokeWidth="1.5" />
          <text x="300" y="195" textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">09:00</text>
          <text x="480" y="195" textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">10:15</text>
          <text x="660" y="195" textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">11:30</text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  4. Bounds Validation Diagram                                              */
/* -------------------------------------------------------------------------- */

export function BoundsValidationDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Data Safety
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Bounds Validation: Valid, Zero-Width, and Invalid Reversed
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Validation flow diagram comparing standard valid interval bounds, zero-width intervals rendered with a marker tick, and invalid reversed bounds where start is greater than end.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 260"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Bounds Validation Rules</title>

          {/* Row 1: Valid */}
          <g transform="translate(40, 20)">
            <rect width="780" height="60" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="35" className="fill-foreground text-xs font-bold">Valid (10 &rarr; 20)</text>
            <text x="20" y="50" className="fill-muted-foreground text-[10px]">start &le; end</text>
            {/* Bar */}
            <rect x="260" y="18" width="280" height="24" rx="4" fill="var(--chart-1)" opacity="0.85" />
            <text x="400" y="34" textAnchor="middle" className="fill-white text-[10px] font-mono font-bold">span = 10 (Rendered)</text>
            <text x="760" y="36" textAnchor="end" className="fill-emerald-500 dark:fill-emerald-400 text-xs font-bold font-mono">STATUS: VALID</text>
          </g>

          {/* Row 2: Zero-Width */}
          <g transform="translate(40, 100)">
            <rect width="780" height="60" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="35" className="fill-foreground text-xs font-bold">Zero-Width (10 &rarr; 10)</text>
            <text x="20" y="50" className="fill-muted-foreground text-[10px]">start === end</text>
            {/* Marker tick */}
            <line x1="260" y1="12" x2="260" y2="48" stroke="var(--chart-1)" strokeWidth="3" />
            <circle cx="260" cy="30" r="5" fill="var(--chart-1)" />
            <text x="310" y="35" className="fill-muted-foreground text-[10px] font-mono">Marker tick (span = 0, no fake bar)</text>
            <text x="760" y="36" textAnchor="end" className="fill-blue-500 dark:fill-blue-400 text-xs font-bold font-mono">STATUS: ZERO-WIDTH</text>
          </g>

          {/* Row 3: Invalid Reversed */}
          <g transform="translate(40, 180)">
            <rect width="780" height="60" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="35" className="fill-foreground text-xs font-bold">Reversed (20 &rarr; 10)</text>
            <text x="20" y="50" className="fill-muted-foreground text-[10px]">start &gt; end (Invalid)</text>
            {/* Omitted Geometry */}
            <line x1="260" y1="30" x2="540" y2="30" stroke="var(--destructive)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="400" y="35" textAnchor="middle" className="fill-destructive text-[11px] font-mono font-medium">Geometry omitted &bull; Never silently swapped</text>
            <text x="760" y="36" textAnchor="end" className="fill-destructive text-xs font-bold font-mono">STATUS: INVALID</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  5. Missing Bounds Diagram                                                 */
/* -------------------------------------------------------------------------- */

export function MissingBoundsDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Pairwise Contract
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Missing-Bounds Semantics: No Zero or "Now" Substitution
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing that if start or end is missing, the interval is classified as unavailable without substituting zero, domain minimum, or current time.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Missing Bounds Semantics</title>

          {/* Missing Start Panel */}
          <g transform="translate(40, 20)">
            <rect width="370" height="170" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="35" className="fill-foreground text-xs font-bold font-mono">Start: null &bull; End: 11:45</text>
            <text x="20" y="55" className="fill-muted-foreground text-[10px]">Missing start bound</text>

            <line x1="20" y1="85" x2="350" y2="85" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="185" y="115" textAnchor="middle" className="fill-muted-foreground text-xs font-mono">
              Interval Unavailable
            </text>
            <text x="185" y="140" textAnchor="middle" className="fill-destructive text-[10px]">
              No substitute start = 0 or min
            </text>
          </g>

          {/* Missing End Panel */}
          <g transform="translate(450, 20)">
            <rect width="370" height="170" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="35" className="fill-foreground text-xs font-bold font-mono">Start: 10:00 &bull; End: null</text>
            <text x="20" y="55" className="fill-muted-foreground text-[10px]">Missing end bound</text>

            <line x1="20" y1="85" x2="350" y2="85" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="185" y="115" textAnchor="middle" className="fill-muted-foreground text-xs font-mono">
              Interval Unavailable
            </text>
            <text x="185" y="140" textAnchor="middle" className="fill-destructive text-[10px]">
              No substitute end = "now" or current time
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  6. Numeric Domain Resolution Diagram                                      */
/* -------------------------------------------------------------------------- */

export function NumericDomainResolutionDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Domain Resolution
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Bounds-Driven Domain vs Zero-Forced Domain
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Domain comparison diagram showing how bounds-driven domains cover the actual intervals efficiently while zero-forced domains waste plot area and distort positions.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Bounds Driven Domain Resolution</title>

          {/* Panel 1: Correct Bounds-Driven */}
          <g transform="translate(40, 20)">
            <rect width="370" height="200" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="30" className="fill-emerald-500 dark:fill-emerald-400 text-xs font-bold font-mono">
              &check; Bounds-Driven Domain: [100, 180]
            </text>
            <text x="20" y="48" className="fill-muted-foreground text-[10px]">Covers observed starts (100) and ends (180)</text>

            <line x1="40" y1="150" x2="330" y2="150" stroke="var(--border)" strokeWidth="1.5" />
            <text x="40" y="170" className="fill-muted-foreground text-[10px] font-mono">100</text>
            <text x="330" y="170" textAnchor="end" className="fill-muted-foreground text-[10px] font-mono">180</text>

            {/* Intervals */}
            <rect x="40" y="75" width="80" height="20" rx="3" fill="var(--chart-1)" opacity="0.85" />
            <text x="130" y="90" className="fill-muted-foreground text-[9px] font-mono">A: 100 &rarr; 120</text>

            <rect x="180" y="105" width="120" height="20" rx="3" fill="var(--chart-1)" opacity="0.85" />
            <text x="310" y="120" className="fill-muted-foreground text-[9px] font-mono">B: 140 &rarr; 170</text>
          </g>

          {/* Panel 2: Incorrect Zero-Forced */}
          <g transform="translate(450, 20)">
            <rect width="370" height="200" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="30" className="fill-destructive text-xs font-bold font-mono">
              &cross; Flawed Zero-Forced: [0, 180]
            </text>
            <text x="20" y="48" className="fill-muted-foreground text-[10px]">Wastes 55% of chart area with empty space</text>

            <line x1="40" y1="150" x2="330" y2="150" stroke="var(--border)" strokeWidth="1.5" />
            <text x="40" y="170" className="fill-muted-foreground text-[10px] font-mono">0</text>
            <text x="190" y="170" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">100</text>
            <text x="330" y="170" textAnchor="end" className="fill-muted-foreground text-[10px] font-mono">180</text>

            {/* Wasted Area Highlight */}
            <rect x="40" y="70" width="140" height="60" className="fill-destructive/10 stroke-destructive/30" strokeWidth="1" strokeDasharray="3 3" />
            <text x="110" y="105" textAnchor="middle" className="fill-destructive text-[10px] font-mono">Empty wasted space</text>

            {/* Squeezed Intervals */}
            <rect x="190" y="75" width="35" height="20" rx="2" fill="var(--chart-1)" opacity="0.5" />
            <rect x="250" y="105" width="50" height="20" rx="2" fill="var(--chart-1)" opacity="0.5" />
          </g>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  7. Temporal Interval Model Diagram                                        */
/* -------------------------------------------------------------------------- */

export function TemporalIntervalModelDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Temporal Mapping
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Epoch Timestamps &amp; Duration Formatting
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing how numeric timestamps position the interval while distinct formatters render wall-clock time bounds and duration span labels.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Temporal Interval Model</title>

          {/* Time scale */}
          <line x1="80" y1="160" x2="780" y2="160" stroke="var(--border)" strokeWidth="1.5" />
          <text x="160" y="185" textAnchor="middle" className="fill-muted-foreground text-xs font-mono">08:00</text>
          <text x="320" y="185" textAnchor="middle" className="fill-muted-foreground text-xs font-mono">10:00</text>
          <text x="480" y="185" textAnchor="middle" className="fill-muted-foreground text-xs font-mono">12:00</text>
          <text x="640" y="185" textAnchor="middle" className="fill-muted-foreground text-xs font-mono">14:00</text>

          {/* Maintenance Window Interval */}
          <rect x="240" y="80" width="320" height="46" rx="6" fill="var(--chart-1)" opacity="0.85" />

          {/* Start annotation */}
          <path d="M 240 80 L 240 40" stroke="var(--foreground)" strokeWidth="1.5" />
          <text x="240" y="30" textAnchor="middle" className="fill-foreground text-xs font-bold font-mono">09:00 (valueFormatter)</text>

          {/* End annotation */}
          <path d="M 560 80 L 560 40" stroke="var(--foreground)" strokeWidth="1.5" />
          <text x="560" y="30" textAnchor="middle" className="fill-foreground text-xs font-bold font-mono">13:00 (valueFormatter)</text>

          {/* Duration annotation */}
          <text x="400" y="108" textAnchor="middle" className="fill-white text-xs font-bold font-mono">
            Duration: 4h (spanFormatter)
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  8. Negative and Cross-Zero Intervals Diagram                              */
/* -------------------------------------------------------------------------- */

export function NegativeCrossZeroDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Signed Geometry
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Negative Ranges &amp; Cross-Zero Intervals
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Illustration of purely negative intervals and intervals that cross zero, showing that cross-zero intervals remain one continuous bar without splitting into directional colors.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Negative and Cross-Zero Intervals</title>

          {/* Zero reference line */}
          <line x1="430" y1="30" x2="430" y2="180" stroke="var(--chart-axis, #71717a)" strokeWidth="2" strokeDasharray="4 4" />
          <text x="430" y="200" textAnchor="middle" className="fill-foreground text-xs font-mono font-bold">0 Baseline</text>

          {/* Pure negative interval */}
          <g transform="translate(0, 50)">
            <text x="60" y="25" className="fill-foreground text-xs font-bold">Zone A (Purely Negative)</text>
            <rect x="180" y="10" width="180" height="28" rx="4" fill="var(--chart-1)" opacity="0.85" />
            <text x="270" y="28" textAnchor="middle" className="fill-white text-[10px] font-mono font-bold">&minus;80 &rarr; &minus;40 (span 40)</text>
          </g>

          {/* Cross-zero interval */}
          <g transform="translate(0, 110)">
            <text x="60" y="25" className="fill-foreground text-xs font-bold">Zone B (Cross-Zero Range)</text>
            <rect x="330" y="10" width="260" height="28" rx="4" fill="var(--chart-1)" opacity="0.85" />
            <text x="460" y="28" textAnchor="middle" className="fill-white text-[10px] font-mono font-bold">&minus;20 &rarr; +30 (span 50, continuous bar)</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  9. Category Band Hit Region Diagram                                       */
/* -------------------------------------------------------------------------- */

export function CategoryBandHitRegionDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Interaction Mechanics
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Category Band vs Visible Interval Rectangle Hit Region
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Hit region diagram demonstrating that hovering anywhere within the full category band activates the category inspection tooltip, ensuring short and zero-width intervals remain usable.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Category Band Hit Region</title>

          {/* Full Category Band */}
          <rect
            x="40"
            y="40"
            width="780"
            height="130"
            rx="8"
            className="fill-accent/15 stroke-primary/50"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="60" y="70" className="fill-primary text-xs font-mono font-bold uppercase">
            &larr; Entire Category Interactive Hit Band &rarr;
          </text>

          {/* Small Interval Bar inside band */}
          <rect x="420" y="80" width="80" height="40" rx="4" fill="var(--chart-1)" opacity="0.9" />
          <text x="460" y="105" textAnchor="middle" className="fill-white text-[10px] font-mono font-bold">Tiny Bar</text>

          {/* Pointer hover location outside bar */}
          <circle cx="240" cy="100" r="14" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
          <circle cx="240" cy="100" r="4" className="fill-primary" />
          <text x="240" y="135" textAnchor="middle" className="fill-foreground text-[11px] font-medium">
            Pointer in band activates tooltip
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  10. Zero-Width Interaction Diagram                                        */
/* -------------------------------------------------------------------------- */

export function ZeroWidthInteractionDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Zero Span Handling
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Zero-Width Interval: Crisp Marker Tick Without Fake Width
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Illustration of zero-width intervals where start equals end, showing a clean marker tick at the coordinate without inflating quantitative width.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Zero Width Interval Interaction</title>

          {/* Scale */}
          <line x1="80" y1="160" x2="780" y2="160" stroke="var(--border)" strokeWidth="1.5" />
          <text x="430" y="185" textAnchor="middle" className="fill-foreground text-xs font-mono font-bold">Coordinate: 12.0</text>

          {/* Crisp Marker */}
          <rect x="428.5" y="70" width="3" height="70" rx="1.5" fill="var(--chart-1)" />
          <circle cx="430" cy="105" r="5" fill="var(--chart-1)" />

          {/* Callout */}
          <path d="M 430 70 L 430 40" stroke="var(--foreground)" strokeWidth="1.5" />
          <text x="430" y="30" textAnchor="middle" className="fill-foreground text-xs font-mono font-bold">
            start === end (12 &rarr; 12, span = 0)
          </text>
          <text x="580" y="100" className="fill-muted-foreground text-xs">
            <tspan x="580" dy="0">&bull; Truthful quantitative span (0)</tspan>
            <tspan x="580" dy="18">&bull; Fully inspectable via category band</tspan>
            <tspan x="580" dy="18">&bull; No deceptive minimum width padding</tspan>
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  11. Interval Orientation Diagram                                          */
/* -------------------------------------------------------------------------- */

export function IntervalOrientationDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Composition
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Horizontal (Default) vs Vertical Orientation
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison of horizontal layout for schedules and timelines versus vertical layout for numeric min/max comparisons.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Horizontal vs Vertical Interval Composition</title>

          {/* Horizontal Layout (Default) */}
          <g transform="translate(40, 20)">
            <rect width="370" height="200" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="30" className="fill-foreground text-xs font-bold font-mono">Horizontal (Default)</text>
            <text x="20" y="46" className="fill-muted-foreground text-[10px]">Schedules, maintenance windows, long labels</text>

            <line x1="120" y1="70" x2="120" y2="170" stroke="var(--border)" strokeWidth="1" />
            <text x="30" y="95" className="fill-foreground text-[11px]">Auth API</text>
            <rect x="130" y="82" width="120" height="18" rx="3" fill="var(--chart-1)" opacity="0.85" />

            <text x="30" y="130" className="fill-foreground text-[11px]">Worker Queue</text>
            <rect x="180" y="117" width="150" height="18" rx="3" fill="var(--chart-1)" opacity="0.85" />
          </g>

          {/* Vertical Layout */}
          <g transform="translate(450, 20)">
            <rect width="370" height="200" rx="8" className="fill-muted/15 stroke-border" strokeWidth="1" />
            <text x="20" y="30" className="fill-foreground text-xs font-bold font-mono">Vertical</text>
            <text x="20" y="46" className="fill-muted-foreground text-[10px]">Operating temperatures, min/max ranges</text>

            <line x1="50" y1="160" x2="330" y2="160" stroke="var(--border)" strokeWidth="1" />

            <rect x="100" y="80" width="30" height="70" rx="3" fill="var(--chart-1)" opacity="0.85" />
            <text x="115" y="178" textAnchor="middle" className="fill-foreground text-[11px]">Zone 1</text>

            <rect x="200" y="60" width="30" height="90" rx="3" fill="var(--chart-1)" opacity="0.85" />
            <text x="215" y="178" textAnchor="middle" className="fill-foreground text-[11px]">Zone 2</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  12. Interval Rendering Architecture Diagram                               */
/* -------------------------------------------------------------------------- */

export function IntervalRenderingArchitectureDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Data &amp; Rendering Pipeline
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Interval Bars Execution Architecture
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Pipeline architecture diagram showing consumer data ingestion, finite validation, bounds validation, span derivation, domain resolution, Recharts floating bar layout, custom shape rendering, and accessible structured output.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 380"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Interval Rendering Architecture</title>

          {/* Node 1: Consumer Data */}
          <g transform="translate(60, 40)">
            <rect width="180" height="60" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="90" y="28" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Stage 1</text>
            <text x="90" y="46" textAnchor="middle" className="fill-foreground text-xs font-bold">Consumer Data</text>
          </g>

          <line x1="240" y1="70" x2="310" y2="70" stroke="var(--border)" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Node 2: Pairwise Finite Check */}
          <g transform="translate(310, 40)">
            <rect width="220" height="60" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="110" y="28" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Stage 2</text>
            <text x="110" y="46" textAnchor="middle" className="fill-foreground text-xs font-bold">Finite Bounds Check</text>
          </g>

          <line x1="530" y1="70" x2="600" y2="70" stroke="var(--border)" strokeWidth="2" />

          {/* Node 3: Bounds Validation */}
          <g transform="translate(600, 40)">
            <rect width="200" height="60" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="100" y="28" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Stage 3</text>
            <text x="100" y="46" textAnchor="middle" className="fill-foreground text-xs font-bold">start &le; end Validation</text>
          </g>

          {/* Downward flow to Domain & Tuple */}
          <path d="M 700 100 L 700 150 L 530 150" stroke="var(--border)" strokeWidth="2" fill="none" />

          {/* Node 4: Domain & Tuple Preparation */}
          <g transform="translate(310, 120)">
            <rect width="220" height="60" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="110" y="28" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Stage 4</text>
            <text x="110" y="46" textAnchor="middle" className="fill-foreground text-xs font-bold">Bounds Domain &amp; Tuple</text>
          </g>

          <line x1="310" y1="150" x2="240" y2="150" stroke="var(--border)" strokeWidth="2" />

          {/* Node 5: Recharts Composition */}
          <g transform="translate(60, 120)">
            <rect width="180" height="60" rx="8" className="fill-primary/15 stroke-primary/40" strokeWidth="1.5" />
            <text x="90" y="28" textAnchor="middle" className="fill-primary text-[10px] font-mono uppercase">Stage 5</text>
            <text x="90" y="46" textAnchor="middle" className="fill-foreground text-xs font-bold">Recharts SVG Layout</text>
          </g>

          {/* Downward to Presentation */}
          <path d="M 150 180 L 150 230" stroke="var(--border)" strokeWidth="2" fill="none" />

          {/* Node 6: Custom Shape Renderer */}
          <g transform="translate(60, 230)">
            <rect width="220" height="70" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="110" y="25" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Rendering</text>
            <text x="110" y="44" textAnchor="middle" className="fill-foreground text-xs font-bold">Floating Interval Shape</text>
            <text x="110" y="58" textAnchor="middle" className="fill-muted-foreground text-[10px]">&bull; Outer rounded radii &bull; Zero marker</text>
          </g>

          <line x1="280" y1="265" x2="350" y2="265" stroke="var(--border)" strokeWidth="2" />

          {/* Node 7: Hit Band & Tooltip */}
          <g transform="translate(350, 230)">
            <rect width="220" height="70" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="110" y="25" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Interaction</text>
            <text x="110" y="44" textAnchor="middle" className="fill-foreground text-xs font-bold">Category Hit Band</text>
            <text x="110" y="58" textAnchor="middle" className="fill-muted-foreground text-[10px]">&bull; Keyboard traversal &bull; Tooltip anchor</text>
          </g>

          <line x1="570" y1="265" x2="640" y2="265" stroke="var(--border)" strokeWidth="2" />

          {/* Node 8: Accessibility */}
          <g transform="translate(640, 230)">
            <rect width="180" height="70" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
            <text x="90" y="25" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono uppercase">Accessibility</text>
            <text x="90" y="44" textAnchor="middle" className="fill-foreground text-xs font-bold">Structured Table</text>
            <text x="90" y="58" textAnchor="middle" className="fill-muted-foreground text-[10px]">&bull; Screen reader speech</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  13. Animated Conventional vs Interval Bar Diagram                          */
/* -------------------------------------------------------------------------- */
export function ConventionalVsIntervalAnimationDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <figure className="my-8 flex flex-col items-center justify-center">
      <div className="w-full rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              Comparative Motion Geometry
            </span>
            <h4 className="text-sm font-semibold text-foreground">
              Conventional Bar (Zero Baseline) vs. Interval Bar (Floating Range)
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            Animated
          </span>
        </div>

        <p id={descId} className="sr-only">
          Animated diagram showing conventional bars expanding from a pinned zero baseline origin versus interval bars floating dynamically between independent start and end coordinates without zero pinning.
        </p>

        <div className="w-full overflow-x-auto no-scrollbar">
          <svg
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            viewBox="0 0 860 300"
            className="w-full min-w-[720px] h-auto text-zinc-200 select-none font-sans overflow-visible"
          >
            <title id={titleId}>Conventional vs Interval Bar Animated Geometry</title>
            <style>{`
              @keyframes conventionalGrow {
                0%, 15% { width: 0px; }
                55%, 80% { width: 220px; }
                95%, 100% { width: 0px; }
              }
              @keyframes intervalFloat {
                0%, 15% { transform: translateX(0px); }
                50%, 80% { transform: translateX(90px); }
                95%, 100% { transform: translateX(0px); }
              }
              @keyframes pulsePin {
                0%, 100% { opacity: 0.6; r: 4; }
                50% { opacity: 1; r: 6; }
              }
              .anim-conv-bar {
                animation: conventionalGrow 4.5s ease-in-out infinite;
              }
              .anim-int-group {
                animation: intervalFloat 4.5s ease-in-out infinite;
              }
              .anim-pin-dot {
                animation: pulsePin 2.25s ease-in-out infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .anim-conv-bar, .anim-int-group, .anim-pin-dot {
                  animation: none !important;
                }
                .anim-conv-bar {
                  width: 220px !important;
                }
                .anim-int-group {
                  transform: translateX(45px) !important;
                }
              }
            `}</style>

            <defs>
              <linearGradient id="grad-conv-bar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--muted-foreground, #71717a)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--muted-foreground, #71717a)" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="grad-int-bar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--chart-1, #3b82f6)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--chart-1, #3b82f6)" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* TRACK 1: CONVENTIONAL BAR */}
            <g transform="translate(40, 20)">
              {/* Track panel */}
              <rect x="0" y="0" width="780" height="115" rx="10" fill="var(--card, #18181b)" stroke="var(--border, #27272a)" strokeWidth="1" />
              <text x="24" y="28" fill="var(--muted-foreground, #a1a1aa)" fontSize="11" fontFamily="monospace" fontWeight="700">
                CONVENTIONAL BAR:
              </text>
              <text x="175" y="28" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="500">
                0 ├───────────────────────── value
              </text>

              {/* Axis Line */}
              <line x1="120" y1="75" x2="720" y2="75" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

              {/* Zero baseline vertical anchor line */}
              <line x1="160" y1="40" x2="160" y2="95" stroke="var(--chart-2, #f97316)" strokeWidth="2.5" />
              <circle cx="160" cy="75" r="5" fill="var(--chart-2, #f97316)" className="anim-pin-dot" />
              <text x="160" y="105" textAnchor="middle" fill="var(--chart-2, #f97316)" fontSize="11" fontFamily="monospace" fontWeight="700">
                0 (Fixed Anchor)
              </text>

              {/* Animated Growing Bar from Zero */}
              <rect x="160" y="58" width="220" height="30" rx="4" fill="url(#grad-conv-bar)" className="anim-conv-bar" />
              <text x="400" y="78" fill="var(--foreground, #fafafa)" fontSize="11" fontFamily="monospace">
                value = 100
              </text>
              <text x="760" y="28" textAnchor="end" fill="var(--muted-foreground, #71717a)" fontSize="10">
                Anchored at zero origin · Length represents magnitude
              </text>
            </g>

            {/* TRACK 2: INTERVAL BAR */}
            <g transform="translate(40, 155)">
              {/* Track panel */}
              <rect x="0" y="0" width="780" height="125" rx="10" fill="var(--card, #18181b)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="24" y="28" fill="var(--chart-1, #3b82f6)" fontSize="11" fontFamily="monospace" fontWeight="700">
                INTERVAL BAR:
              </text>
              <text x="145" y="28" fill="var(--foreground, #fafafa)" fontSize="11" fontWeight="500">
                start ├───────────────────── end
              </text>

              {/* Axis Line */}
              <line x1="120" y1="85" x2="720" y2="85" stroke="var(--border, #3f3f46)" strokeWidth="1.5" />

              {/* Zero baseline indicator (unpinned) */}
              <line x1="160" y1="75" x2="160" y2="95" stroke="var(--muted-foreground, #71717a)" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="160" y="110" textAnchor="middle" fill="var(--muted-foreground, #71717a)" fontSize="10" fontFamily="monospace">
                0
              </text>

              {/* Animated Floating Group */}
              <g className="anim-int-group">
                {/* Dashed vertical bounds lines */}
                <line x1="280" y1="42" x2="280" y2="98" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="460" y1="42" x2="460" y2="98" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Floating Interval Bar */}
                <rect x="280" y="58" width="180" height="30" rx="5" fill="url(#grad-int-bar)" filter="drop-shadow(0 2px 8px rgba(59,130,246,0.3))" />

                {/* Derived Span Text */}
                <text x="370" y="78" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="700">
                  span = end - start (40m)
                </text>

                {/* Start coordinate label */}
                <text x="280" y="112" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="11" fontFamily="monospace" fontWeight="600">
                  start = 09:15
                </text>

                {/* End coordinate label */}
                <text x="460" y="112" textAnchor="middle" fill="var(--foreground, #fafafa)" fontSize="11" fontFamily="monospace" fontWeight="600">
                  end = 09:55
                </text>
              </g>

              <text x="760" y="28" textAnchor="end" fill="var(--chart-1, #3b82f6)" fontSize="10" fontWeight="600">
                Free-floating range · Neither bound pinned to zero
              </text>
            </g>
          </svg>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Figure: Conventional bars are origin-anchored at zero, whereas interval bars float freely along the quantitative domain with independent start and end coordinates.
      </figcaption>
    </figure>
  )
}
