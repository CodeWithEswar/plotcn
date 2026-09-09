"use client"

import * as React from "react"

/* -------------------------------------------------------------------------- */
/*  1. Variance Derivation Model Diagram                                      */
/* -------------------------------------------------------------------------- */

export function VarianceDerivationModelDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Derivation Flow
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Actual &minus; Plan = Signed Variance
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Flow diagram showing how consumer-supplied actual and plan values are subtracted to produce the derived signed variance bar, contrasting arithmetic delta with statistical variance.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 260"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Variance Derivation Model</title>

          {/* Background Grid Accent */}
          <rect width="860" height="260" fill="transparent" />

          {/* Actual Input Box */}
          <rect x="40" y="45" width="180" height="70" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
          <text x="55" y="72" className="fill-muted-foreground text-[11px] font-mono font-medium uppercase tracking-wider">Input Role 1</text>
          <text x="55" y="98" className="fill-foreground text-sm font-bold">Actual Value</text>

          {/* Plan Input Box */}
          <rect x="40" y="145" width="180" height="70" rx="8" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
          <text x="55" y="172" className="fill-muted-foreground text-[11px] font-mono font-medium uppercase tracking-wider">Input Role 2</text>
          <text x="55" y="198" className="fill-foreground text-sm font-bold">Plan / Reference</text>

          {/* Connecting Arrows to Math Operator */}
          <path d="M 220 80 L 290 115" stroke="var(--border)" strokeWidth="2" fill="none" />
          <path d="M 220 180 L 290 145" stroke="var(--border)" strokeWidth="2" fill="none" />

          {/* Subtraction Operator Node */}
          <circle cx="320" cy="130" r="30" className="fill-muted/30 stroke-border" strokeWidth="2" />
          <text x="320" y="138" textAnchor="middle" className="fill-foreground text-2xl font-bold font-mono">&minus;</text>

          {/* Arrow to Variance Result */}
          <path d="M 350 130 L 430 130" stroke="var(--border)" strokeWidth="2" fill="none" markerEnd="url(#arrow-head)" />

          {/* Derived Output Box */}
          <rect x="430" y="65" width="220" height="130" rx="10" className="fill-card stroke-border" strokeWidth="2" />
          <text x="450" y="98" className="fill-muted-foreground text-[11px] font-mono uppercase tracking-wider">Derived Quantitative Mark</text>
          <text x="450" y="126" className="fill-foreground text-base font-bold">Signed Variance</text>
          <text x="450" y="152" className="fill-muted-foreground text-xs font-mono">variance = actual &minus; plan</text>
          <text x="450" y="176" className="fill-muted-foreground/80 text-[11px]">Categorical Delta &ne; Statistical Mean Dev</text>

          {/* Arrow to Geometry */}
          <path d="M 650 130 L 710 130" stroke="var(--border)" strokeWidth="2" fill="none" />

          {/* Rendered Bar Representation */}
          <rect x="710" y="55" width="120" height="150" rx="8" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <line x1="770" y1="65" x2="770" y2="195" stroke="var(--foreground)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="770" y="215" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">Zero Base</text>

          {/* Positive bar */}
          <rect x="770" y="90" width="40" height="22" rx="3" fill="var(--chart-1)" />
          <text x="785" y="105" className="fill-background text-[10px] font-bold font-mono">+20</text>

          {/* Negative bar */}
          <rect x="730" y="140" width="40" height="22" rx="3" fill="var(--chart-2)" />
          <text x="745" y="155" className="fill-background text-[10px] font-bold font-mono">&minus;20</text>

          <defs>
            <marker id="arrow-head" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="var(--border)" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  2. Actual vs Plan -> Delta Diagram                                        */
/* -------------------------------------------------------------------------- */

export function ActualPlanDeltaDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Arithmetic Comparison
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Three Canonical States: Above, Equal, Below Plan
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison diagram illustrating actual 120 vs plan 100 yielding positive 20, actual 100 vs plan 100 yielding zero, and actual 80 vs plan 100 yielding negative 20.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Actual vs Plan to Delta States</title>

          {/* Column Headers */}
          <text x="40" y="30" className="fill-muted-foreground text-xs font-mono uppercase tracking-wider">State</text>
          <text x="210" y="30" className="fill-muted-foreground text-xs font-mono uppercase tracking-wider">Actual</text>
          <text x="320" y="30" className="fill-muted-foreground text-xs font-mono uppercase tracking-wider">Plan</text>
          <text x="430" y="30" className="fill-muted-foreground text-xs font-mono uppercase tracking-wider">Arithmetic</text>
          <text x="560" y="30" className="fill-muted-foreground text-xs font-mono uppercase tracking-wider">Variance</text>
          <text x="680" y="30" className="fill-muted-foreground text-xs font-mono uppercase tracking-wider">Bar Geometry</text>

          {/* Row 1: Above Plan */}
          <rect x="30" y="45" width="800" height="55" rx="6" className="fill-muted/10 stroke-border/40" strokeWidth="1" />
          <text x="45" y="78" className="fill-foreground font-semibold text-xs">Above Plan</text>
          <text x="215" y="78" className="fill-foreground font-mono text-xs">120</text>
          <text x="325" y="78" className="fill-muted-foreground font-mono text-xs">100</text>
          <text x="435" y="78" className="fill-muted-foreground font-mono text-xs">120 &minus; 100</text>
          <text x="565" y="78" className="fill-blue-500 dark:fill-blue-400 font-mono font-bold text-xs">+20</text>
          {/* Bar track */}
          <line x1="680" y1="72" x2="780" y2="72" stroke="var(--border)" strokeWidth="1" />
          <line x1="730" y1="58" x2="730" y2="86" stroke="var(--foreground)" strokeWidth="1.5" />
          <rect x="730" y="63" width="36" height="18" rx="2" fill="var(--chart-1)" />

          {/* Row 2: Equal Plan (Zero) */}
          <rect x="30" y="110" width="800" height="55" rx="6" className="fill-muted/10 stroke-border/40" strokeWidth="1" />
          <text x="45" y="143" className="fill-foreground font-semibold text-xs">On Plan (Equal)</text>
          <text x="215" y="143" className="fill-foreground font-mono text-xs">100</text>
          <text x="325" y="143" className="fill-muted-foreground font-mono text-xs">100</text>
          <text x="435" y="143" className="fill-muted-foreground font-mono text-xs">100 &minus; 100</text>
          <text x="565" y="143" className="fill-muted-foreground font-mono font-bold text-xs">0</text>
          {/* Bar track */}
          <line x1="680" y1="137" x2="780" y2="137" stroke="var(--border)" strokeWidth="1" />
          <line x1="730" y1="123" x2="730" y2="151" stroke="var(--foreground)" strokeWidth="2" />
          <circle cx="730" cy="137" r="3" fill="var(--chart-axis)" />

          {/* Row 3: Below Plan */}
          <rect x="30" y="175" width="800" height="55" rx="6" className="fill-muted/10 stroke-border/40" strokeWidth="1" />
          <text x="45" y="208" className="fill-foreground font-semibold text-xs">Below Plan</text>
          <text x="215" y="208" className="fill-foreground font-mono text-xs">80</text>
          <text x="325" y="208" className="fill-muted-foreground font-mono text-xs">100</text>
          <text x="435" y="208" className="fill-muted-foreground font-mono text-xs">80 &minus; 100</text>
          <text x="565" y="208" className="fill-orange-500 dark:fill-orange-400 font-mono font-bold text-xs">&minus;20</text>
          {/* Bar track */}
          <line x1="680" y1="202" x2="780" y2="202" stroke="var(--border)" strokeWidth="1" />
          <line x1="730" y1="188" x2="730" y2="216" stroke="var(--foreground)" strokeWidth="1.5" />
          <rect x="694" y="193" width="36" height="18" rx="2" fill="var(--chart-2)" />
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  3. Zero-Variance Baseline Diagram                                         */
/* -------------------------------------------------------------------------- */

export function ZeroVarianceBaselineDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Baseline Semantics
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Zero Baseline as Equality Anchor
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Diagram showing the prominent zero baseline as the dividing reference line between negative and positive variance, signifying actual equals plan.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Zero-Variance Baseline</title>

          {/* Negative Region Indicator */}
          <rect x="60" y="40" width="350" height="130" rx="8" className="fill-muted/10 stroke-border/30" strokeDasharray="3 3" />
          <text x="235" y="65" textAnchor="middle" className="fill-muted-foreground font-mono text-xs uppercase tracking-wider">&minus; Negative Variance</text>
          <text x="235" y="85" textAnchor="middle" className="fill-muted-foreground/70 text-[11px]">Actual numerically below plan</text>
          <rect x="230" y="110" width="150" height="30" rx="4" fill="var(--chart-2)" />
          <text x="290" y="130" className="fill-background font-mono text-xs font-bold">&minus;45K</text>

          {/* Center Zero Baseline */}
          <line x1="430" y1="25" x2="430" y2="185" stroke="var(--chart-axis, #71717a)" strokeWidth="3" />
          <circle cx="430" cy="125" r="5" fill="var(--chart-axis, #71717a)" />

          {/* Zero Callout */}
          <rect x="385" y="190" width="90" height="24" rx="4" className="fill-muted stroke-border" />
          <text x="430" y="206" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">0 Baseline</text>

          {/* Positive Region Indicator */}
          <rect x="450" y="40" width="350" height="130" rx="8" className="fill-muted/10 stroke-border/30" strokeDasharray="3 3" />
          <text x="625" y="65" textAnchor="middle" className="fill-muted-foreground font-mono text-xs uppercase tracking-wider">+ Positive Variance</text>
          <text x="625" y="85" textAnchor="middle" className="fill-muted-foreground/70 text-[11px]">Actual numerically above plan</text>
          <rect x="450" y="110" width="150" height="30" rx="4" fill="var(--chart-1)" />
          <text x="510" y="130" className="fill-background font-mono text-xs font-bold">+45K</text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  4. Positive / Zero / Negative Geometry Diagram                            */
/* -------------------------------------------------------------------------- */

export function PositiveZeroNegativeGeometryDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Geometry Model
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Symmetric Bar Extrusion Around Zero Reference
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        SVG demonstrating how positive bars extrude outward upward or rightward, negative bars extrude downward or leftward, and zero values produce no fake bar width.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 240"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Positive Zero Negative Geometry</title>

          {/* Grid lines */}
          <line x1="80" y1="120" x2="780" y2="120" stroke="var(--chart-axis, #71717a)" strokeWidth="2" />
          <text x="60" y="124" className="fill-muted-foreground font-mono text-xs">0</text>

          {/* Cat 1: Large positive */}
          <rect x="150" y="40" width="50" height="80" rx="4" fill="var(--chart-1)" />
          <text x="175" y="30" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">+80</text>
          <text x="175" y="145" textAnchor="middle" className="fill-muted-foreground text-xs">Enterprise</text>

          {/* Cat 2: Moderate negative */}
          <rect x="290" y="120" width="50" height="50" rx="4" fill="var(--chart-2)" />
          <text x="315" y="185" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">&minus;50</text>
          <text x="315" y="145" textAnchor="middle" className="fill-muted-foreground text-xs">Mid-Market</text>

          {/* Cat 3: Exact Zero */}
          <circle cx="455" cy="120" r="4" fill="var(--chart-axis, #71717a)" />
          <text x="455" y="105" textAnchor="middle" className="fill-muted-foreground font-mono text-xs font-bold">0</text>
          <text x="455" y="145" textAnchor="middle" className="fill-muted-foreground text-xs">SMB (No Bar)</text>

          {/* Cat 4: Small positive */}
          <rect x="570" y="95" width="50" height="25" rx="4" fill="var(--chart-1)" />
          <text x="595" y="85" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">+25</text>
          <text x="595" y="145" textAnchor="middle" className="fill-muted-foreground text-xs">Public</text>

          {/* Cat 5: Large negative */}
          <rect x="700" y="120" width="50" height="80" rx="4" fill="var(--chart-2)" />
          <text x="725" y="215" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">&minus;80</text>
          <text x="725" y="145" textAnchor="middle" className="fill-muted-foreground text-xs">Partners</text>

          {/* Symmetric magnitude note */}
          <path d="M 205 80 L 250 80 L 250 160 L 285 160" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  5. Direction Is Not Favorability Diagram                                  */
/* -------------------------------------------------------------------------- */

export function DirectionNotFavorabilityDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Governing Principle
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Numerical Direction &ne; Business Favorability
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Critical diagram contrasting revenue variance of plus 20 with operating cost variance of plus 20, demonstrating why Plotcn must never equate positive direction with good or negative direction with bad.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 260"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Direction Is Not Favorability</title>

          {/* Panel 1: Revenue (Positive is desirable) */}
          <rect x="50" y="30" width="360" height="180" rx="10" className="fill-muted/10 stroke-border/60" strokeWidth="1.5" />
          <text x="75" y="60" className="fill-foreground font-bold text-sm">Example A: Gross Revenue</text>
          <text x="75" y="85" className="fill-muted-foreground text-xs font-mono">Actual: $120M | Plan: $100M</text>

          <rect x="75" y="105" width="160" height="32" rx="4" fill="var(--chart-1)" />
          <text x="85" y="126" className="fill-background font-mono text-xs font-bold">Variance: +$20M</text>

          <rect x="75" y="150" width="310" height="42" rx="6" className="fill-muted/30 stroke-border/40" />
          <text x="85" y="168" className="fill-foreground text-[11px] font-medium">Business Meaning: Surplus / Growth</text>
          <text x="85" y="184" className="fill-muted-foreground text-[10px]">Higher revenue than budgeted may be favorable.</text>

          {/* Panel 2: Cost (Positive is undesirable) */}
          <rect x="450" y="30" width="360" height="180" rx="10" className="fill-muted/10 stroke-border/60" strokeWidth="1.5" />
          <text x="475" y="60" className="fill-foreground font-bold text-sm">Example B: Cloud Infrastructure Cost</text>
          <text x="475" y="85" className="fill-muted-foreground text-xs font-mono">Actual: $120K | Plan: $100K</text>

          <rect x="475" y="105" width="160" height="32" rx="4" fill="var(--chart-1)" />
          <text x="485" y="126" className="fill-background font-mono text-xs font-bold">Variance: +$20K</text>

          <rect x="475" y="150" width="310" height="42" rx="6" className="fill-muted/30 stroke-border/40" />
          <text x="485" y="168" className="fill-foreground text-[11px] font-medium">Business Meaning: Budget Overrun / Spill</text>
          <text x="485" y="184" className="fill-muted-foreground text-[10px]">Higher expenses than budgeted may be unfavorable.</text>

          {/* Neutral Principle Footer */}
          <text x="430" y="240" textAnchor="middle" className="fill-foreground font-medium text-xs">
            Plotcn strictly reports mathematical direction (&ldquo;Above plan&rdquo;), never automatic &ldquo;Good&rdquo; or &ldquo;Bad&rdquo;.
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  6. Negative Input Arithmetic Diagram                                      */
/* -------------------------------------------------------------------------- */

export function NegativeInputArithmeticDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Signed Values
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Negative Input Values Obey Arithmetic Delta
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Mathematical diagram demonstrating that actual negative 80 minus plan negative 100 equals positive 20, proving that variance direction comes from subtraction and not raw input sign.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Negative Input Arithmetic</title>

          {/* Number Line */}
          <line x1="80" y1="120" x2="780" y2="120" stroke="var(--border)" strokeWidth="2" />
          <circle cx="430" cy="120" r="4" fill="var(--chart-axis, #71717a)" />
          <text x="430" y="145" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">0</text>

          {/* Point: Plan = -100 */}
          <circle cx="180" cy="120" r="5" fill="var(--foreground)" />
          <text x="180" y="105" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">Plan (&minus;100)</text>

          {/* Point: Actual = -80 */}
          <circle cx="280" cy="120" r="5" fill="var(--chart-1)" />
          <text x="280" y="105" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">Actual (&minus;80)</text>

          {/* Delta Vector from Plan to Actual */}
          <path d="M 185 120 L 275 120" stroke="var(--chart-1)" strokeWidth="4" markerEnd="url(#delta-arrow)" />
          <text x="232" y="80" textAnchor="middle" className="fill-chart-1 font-mono text-sm font-bold">&Delta; = +20</text>

          {/* Explanation Callout */}
          <rect x="420" y="35" width="380" height="65" rx="6" className="fill-muted/20 stroke-border" />
          <text x="435" y="60" className="fill-foreground font-mono text-xs font-bold">
            (&minus;80) &minus; (&minus;100) = &minus;80 + 100 = +20
          </text>
          <text x="435" y="82" className="fill-muted-foreground text-[11px]">
            Even though Actual is negative, it is numerically above Plan.
          </text>

          <defs>
            <marker id="delta-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="var(--chart-1)" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  7. Missing Pair Semantics Diagram                                         */
/* -------------------------------------------------------------------------- */

export function MissingPairSemanticsDiagram() {
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
            Pairwise Validity: Missing Pair Yields Unavailable
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Two-panel diagram showing that missing actual with valid plan, or valid actual with missing plan, produces an unavailable variance rather than coercing missing data to zero.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Missing Pair Semantics</title>

          {/* Panel 1: Actual Missing */}
          <rect x="50" y="30" width="360" height="160" rx="8" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <text x="70" y="60" className="fill-foreground font-semibold text-xs uppercase tracking-wider">Case 1: Actual Missing</text>
          <text x="70" y="85" className="fill-muted-foreground font-mono text-xs">Actual: null | Plan: 100</text>

          <rect x="70" y="105" width="220" height="30" rx="4" className="fill-muted/30 stroke-dashed stroke-border" strokeDasharray="3 3" />
          <text x="80" y="125" className="fill-muted-foreground font-mono text-xs">Variance: Unavailable</text>

          <text x="70" y="165" className="fill-muted-foreground text-[11px]">
            &times; Never infer 0 &minus; 100 = &minus;100. No fake bar.
          </text>

          {/* Panel 2: Plan Missing */}
          <rect x="450" y="30" width="360" height="160" rx="8" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <text x="470" y="60" className="fill-foreground font-semibold text-xs uppercase tracking-wider">Case 2: Plan Missing</text>
          <text x="470" y="85" className="fill-muted-foreground font-mono text-xs">Actual: 80 | Plan: null</text>

          <rect x="470" y="105" width="220" height="30" rx="4" className="fill-muted/30 stroke-dashed stroke-border" strokeDasharray="3 3" />
          <text x="480" y="125" className="fill-muted-foreground font-mono text-xs">Variance: Unavailable</text>

          <text x="470" y="165" className="fill-muted-foreground text-[11px]">
            &times; Never infer 80 &minus; 0 = +80. No fake bar.
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  8. Mixed-Sign Symmetric Domain Diagram                                    */
/* -------------------------------------------------------------------------- */

export function MixedSignSymmetricDomainDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Domain Resolution (Policy B)
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Symmetric Zero-Centered Domain Preserves Equal Visual Magnitude
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Comparison contrasting an asymmetric data domain with a symmetric zero-centered domain [-80, +80], proving that equal absolute values like plus 40 and minus 40 receive equal visual bar lengths.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Mixed Sign Symmetric Domain</title>

          {/* Symmetric Axis: -80 to +80 */}
          <line x1="80" y1="90" x2="780" y2="90" stroke="var(--border)" strokeWidth="2" />
          <line x1="430" y1="35" x2="430" y2="145" stroke="var(--chart-axis, #71717a)" strokeWidth="2.5" />
          <text x="430" y="165" textAnchor="middle" className="fill-foreground font-mono text-xs font-bold">0 Center</text>

          <text x="80" y="115" className="fill-muted-foreground font-mono text-xs">&minus;80</text>
          <text x="760" y="115" className="fill-muted-foreground font-mono text-xs">+80</text>

          {/* Equal absolute bars */}
          {/* Minus 40 bar */}
          <rect x="255" y="70" width="175" height="20" rx="3" fill="var(--chart-2)" />
          <text x="265" y="84" className="fill-background font-mono text-[11px] font-bold">&minus;40 (175px)</text>

          {/* Plus 40 bar */}
          <rect x="430" y="70" width="175" height="20" rx="3" fill="var(--chart-1)" />
          <text x="525" y="84" className="fill-background font-mono text-[11px] font-bold">+40 (175px)</text>

          {/* Dimension comparison marker */}
          <path d="M 255 55 L 430 55" stroke="var(--chart-2)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 430 55 L 605 55" stroke="var(--chart-1)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="430" y="48" textAnchor="middle" className="fill-foreground font-mono text-xs font-medium">Equal Absolute Lengths (1:1)</text>

          {/* Policy Callout Box */}
          <rect x="180" y="190" width="500" height="45" rx="6" className="fill-muted/20 stroke-border" />
          <text x="430" y="218" textAnchor="middle" className="fill-muted-foreground text-xs">
            When both positive and negative variances exist, domain expands to &plusmn;max(|min|, |max|).
          </text>
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  9. Category Band / Hit Region Diagram                                     */
/* -------------------------------------------------------------------------- */

export function CategoryBandHitRegionDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Interaction Geometry
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Category Band Hit Targets Keep Zero/Tiny Bars Accessible
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Interaction diagram showing how the entire categorical band acts as the hit target, allowing zero or tiny variance bars to remain inspectable on touch devices and desktop pointers.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 220"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Category Band Hit Region</title>

          {/* Band 1: Normal positive */}
          <rect x="50" y="30" width="760" height="50" rx="6" className="fill-muted/10 stroke-border/40" />
          <text x="70" y="60" className="fill-foreground font-medium text-xs">Enterprise (+35K)</text>
          <rect x="430" y="42" width="120" height="26" rx="3" fill="var(--chart-1)" />

          {/* Band 2: Exact Zero with Hit Region */}
          <rect x="50" y="90" width="760" height="50" rx="6" className="fill-accent/20 stroke-primary" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="70" y="120" className="fill-foreground font-bold text-xs">SMB (0 Variance)</text>
          <line x1="430" y1="90" x2="430" y2="140" stroke="var(--chart-axis, #71717a)" strokeWidth="2" />
          <circle cx="430" cy="115" r="4" fill="var(--chart-axis, #71717a)" />

          {/* Hit Region Callout Badge */}
          <rect x="580" y="100" width="210" height="30" rx="4" className="fill-background stroke-border shadow-xs" />
          <text x="685" y="120" textAnchor="middle" className="fill-foreground font-mono text-[11px]">Active Hit Band (48px)</text>

          {/* Band 3: Tiny negative */}
          <rect x="50" y="150" width="760" height="50" rx="6" className="fill-muted/10 stroke-border/40" />
          <text x="70" y="180" className="fill-foreground font-medium text-xs">Partners (&minus;1K)</text>
          <rect x="415" y="162" width="15" height="26" rx="2" fill="var(--chart-2)" />
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  10. Vertical vs Horizontal Composition Diagram                            */
/* -------------------------------------------------------------------------- */

export function VerticalVsHorizontalCompositionDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Layout Specialization
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            Vertical vs Horizontal Orientation
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Side-by-side comparison illustrating vertical orientation best for standard metrics vs horizontal orientation best for long category labels and compact scorecards.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 250"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Vertical vs Horizontal Composition</title>

          {/* Vertical Panel */}
          <rect x="50" y="30" width="360" height="200" rx="10" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <text x="70" y="55" className="fill-foreground font-bold text-xs uppercase tracking-wider">Vertical (Default)</text>
          <text x="70" y="72" className="fill-muted-foreground text-[11px]">Best for standard labels &amp; dashboard tiles</text>

          <line x1="80" y1="140" x2="380" y2="140" stroke="var(--chart-axis, #71717a)" strokeWidth="1.5" />
          <rect x="120" y="90" width="30" height="50" rx="3" fill="var(--chart-1)" />
          <rect x="180" y="140" width="30" height="40" rx="3" fill="var(--chart-2)" />
          <rect x="240" y="110" width="30" height="30" rx="3" fill="var(--chart-1)" />
          <rect x="300" y="140" width="30" height="60" rx="3" fill="var(--chart-2)" />

          {/* Horizontal Panel */}
          <rect x="450" y="30" width="360" height="200" rx="10" className="fill-muted/10 stroke-border/60" strokeWidth="1" />
          <text x="470" y="55" className="fill-foreground font-bold text-xs uppercase tracking-wider">Horizontal</text>
          <text x="470" y="72" className="fill-muted-foreground text-[11px]">Best for long department names &amp; mobile scorecards</text>

          <line x1="630" y1="90" x2="630" y2="210" stroke="var(--chart-axis, #71717a)" strokeWidth="1.5" />
          <text x="470" y="112" className="fill-muted-foreground font-mono text-[10px] truncate">Engineering</text>
          <rect x="630" y="100" width="60" height="16" rx="2" fill="var(--chart-1)" />

          <text x="470" y="142" className="fill-muted-foreground font-mono text-[10px] truncate">Infrastructure</text>
          <rect x="580" y="130" width="50" height="16" rx="2" fill="var(--chart-2)" />

          <text x="470" y="172" className="fill-muted-foreground font-mono text-[10px] truncate">Global Sales</text>
          <rect x="630" y="160" width="85" height="16" rx="2" fill="var(--chart-1)" />

          <text x="470" y="202" className="fill-muted-foreground font-mono text-[10px] truncate">Customer Ops</text>
          <rect x="550" y="190" width="80" height="16" rx="2" fill="var(--chart-2)" />
        </svg>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  11. Rendering & Interaction Architecture Diagram                          */
/* -------------------------------------------------------------------------- */

export function VarianceRenderingArchitectureDiagram() {
  const titleId = React.useId()
  const descId = React.useId()

  return (
    <div className="w-full my-6 rounded-xl border border-border/60 bg-card/40 p-4 md:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            Internal Pipeline
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            VarianceBars Rendering &amp; Accessibility Pipeline
          </h4>
        </div>
      </div>

      <p id={descId} className="sr-only">
        Complete rendering architecture flowchart tracing consumer data through pair validation, arithmetic subtraction, symmetric domain resolution, Recharts SVG rendering, and offscreen accessible tables.
      </p>

      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          viewBox="0 0 860 300"
          className="w-full min-w-[680px] h-auto text-zinc-200 select-none font-sans"
        >
          <title id={titleId}>Variance Rendering Architecture</title>

          {/* Node 1: Consumer Data */}
          <rect x="40" y="30" width="160" height="50" rx="6" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
          <text x="120" y="60" textAnchor="middle" className="fill-foreground font-semibold text-xs">Consumer Data (TData[])</text>

          {/* Arrow 1 */}
          <line x1="200" y1="55" x2="250" y2="55" stroke="var(--border)" strokeWidth="1.5" />

          {/* Node 2: Finite Pair Validation */}
          <rect x="250" y="30" width="180" height="50" rx="6" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
          <text x="340" y="53" textAnchor="middle" className="fill-foreground font-semibold text-xs">Pairwise Validation</text>
          <text x="340" y="70" textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">isFinite(actual) &amp; isFinite(plan)</text>

          {/* Arrow 2 */}
          <line x1="430" y1="55" x2="480" y2="55" stroke="var(--border)" strokeWidth="1.5" />

          {/* Node 3: Arithmetic Subtraction */}
          <rect x="480" y="30" width="170" height="50" rx="6" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
          <text x="565" y="53" textAnchor="middle" className="fill-foreground font-semibold text-xs">Derived Variance</text>
          <text x="565" y="70" textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">actual &minus; plan</text>

          {/* Arrow 3 */}
          <line x1="650" y1="55" x2="700" y2="55" stroke="var(--border)" strokeWidth="1.5" />

          {/* Node 4: Domain Policy B */}
          <rect x="700" y="30" width="120" height="50" rx="6" className="fill-muted/20 stroke-border" strokeWidth="1.5" />
          <text x="760" y="53" textAnchor="middle" className="fill-foreground font-semibold text-xs">Policy B Domain</text>
          <text x="760" y="70" textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">&plusmn;maxAbs</text>

          {/* Downward Arrow to Recharts */}
          <path d="M 760 80 L 760 130 L 480 130" stroke="var(--border)" strokeWidth="1.5" fill="none" />

          {/* Node 5: Recharts Composition */}
          <rect x="250" y="110" width="230" height="60" rx="8" className="fill-card stroke-border" strokeWidth="2" />
          <text x="365" y="136" textAnchor="middle" className="fill-foreground font-bold text-xs">Recharts SVG Layer</text>
          <text x="365" y="154" textAnchor="middle" className="fill-muted-foreground text-[10px]">Bar + Cell Coloring + Zero ReferenceLine</text>

          {/* Split Arrows to Tooltip & Accessibility */}
          <path d="M 365 170 L 365 210 L 200 210" stroke="var(--border)" strokeWidth="1.5" fill="none" />
          <path d="M 365 170 L 365 210 L 530 210" stroke="var(--border)" strokeWidth="1.5" fill="none" />

          {/* Node 6: Tooltip & Interaction */}
          <rect x="50" y="195" width="220" height="65" rx="6" className="fill-muted/20 stroke-border" />
          <text x="160" y="222" textAnchor="middle" className="fill-foreground font-semibold text-xs">Container-Clamped Tooltip</text>
          <text x="160" y="242" textAnchor="middle" className="fill-muted-foreground text-[10px]">Actual, Plan, Signed Variance, Position</text>

          {/* Node 7: Accessibility */}
          <rect x="480" y="195" width="240" height="65" rx="6" className="fill-muted/20 stroke-border" />
          <text x="600" y="222" textAnchor="middle" className="fill-foreground font-semibold text-xs">Offscreen Accessible Table</text>
          <text x="600" y="242" textAnchor="middle" className="fill-muted-foreground text-[10px]">Keyboard Traversal + Screen Reader Summary</text>
        </svg>
      </div>
    </div>
  )
}
