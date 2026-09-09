import type { ChartDetailDoc } from "./types"

export const areaBaselineDoc: ChartDetailDoc = {
  chartId: "recharts-area-baseline",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "017",

  quickFacts: {
    bestFor:
      "Tracking single-series deviation above and below an explicit quantitative reference baseline (targets, thresholds, zero anchors).",
    dataModel: "Single quantitative series with required explicit constant reference baseline",
    interaction: "Nearest-X crosshair inspection with signed delta arithmetic and persistent locking",
    responsive: "Fluid container-driven SVG with continuous vertical gradient segmentation across all breakpoints",
    animation: "350ms path entrance with baseline-aligned hard-stop color fill",
    runtime: "Recharts SVG (< 4KB component footprint, O(1) linearGradient definition)",
  },

  dataFormat: {
    summary:
      "A sequential array of observation records with an ordered horizontal domain key (day, date, month) and a single quantitative metric key. The reference baseline is passed as an explicit top-level prop, never baked into the data.",
    fields: [
      {
        field: "day",
        type: "string | Date",
        required: true,
        description: "Chronological or ordered domain coordinate along the horizontal axis.",
      },
      {
        field: "utilization",
        type: "number | null",
        required: true,
        description: "Observed quantitative value. Non-finite values are safely rejected before SVG layout.",
      },
    ],
    nullPolicy:
      'Missing or null observations render a truthful geometric break under missingValuePolicy="gap". A missing value is never collapsed onto the baseline.',
    orderingPolicy:
      "Observations must be ordered along the horizontal domain for faithful area polygon interpolation.",
    exampleRows: [
      { day: "Day 01", utilization: 68 },
      { day: "Day 03", utilization: 72 },
      { day: "Day 05", utilization: 84 },
      { day: "Day 07", utilization: 89 },
      { day: "Day 09", utilization: 79 },
      { day: "Day 11", utilization: 75 },
      { day: "Day 13", utilization: 66 },
      { day: "Day 15", utilization: null },
      { day: "Day 17", utilization: 74 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      description: "Readonly array of observation records. Caller data is never mutated or reordered.",
      category: "core",
    },
    {
      name: "xKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      description: "Property name on data records representing the horizontal domain coordinate.",
      category: "core",
    },
    {
      name: "series",
      type: "BaselineAreaSeries<TData>",
      default: "—",
      required: true,
      description: "Single quantitative series configuration defining metric key, label, and valueFormatter.",
      category: "core",
    },
    {
      name: "baseline",
      type: "number",
      default: "—",
      required: true,
      description: "Explicit constant reference baseline. Strictly required and validated as finite (never defaults to zero).",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 75, label: "75 (Target)" },
        { value: 70, label: "70 (Lower)" },
        { value: 80, label: "80 (Upper)" },
        { value: 0, label: "0 (Zero Anchor)" },
      ],
    },
    {
      name: "baselineLabel",
      type: "string",
      default: '"Reference"',
      required: false,
      description: "Human-readable label for the reference line (e.g. Target, SLA, Budget, Baseline).",
      category: "visual",
    },
    {
      name: "aboveLabel",
      type: "string",
      default: '"Above reference"',
      required: false,
      description: "Label for observations exceeding the baseline (communicates position, not business outcome).",
      category: "visual",
    },
    {
      name: "belowLabel",
      type: "string",
      default: '"Below reference"',
      required: false,
      description: "Label for observations falling below the baseline (communicates position, not business outcome).",
      category: "visual",
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      description: "Container height in pixels or standard CSS dimension string.",
      category: "visual",
    },
    {
      name: "curve",
      type: '"monotone" | "linear" | "step"',
      default: '"monotone"',
      required: false,
      description: "Interpolation curve applied to the signal boundary stroke and filled area geometry.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "monotone", label: "Monotone" },
        { value: "linear", label: "Linear" },
        { value: "step", label: "Step" },
      ],
    },
    {
      name: "domain",
      type: '[number, number] | "auto"',
      default: '"auto"',
      required: false,
      description: 'Explicit Y-axis numeric domain bounds, or "auto" to safely enclose both data and baseline.',
      category: "visual",
    },
    {
      name: "color",
      type: "string",
      default: "var(--chart-1)",
      required: false,
      description: "Primary signal stroke and active observation marker color.",
      category: "visual",
    },
    {
      name: "aboveColor",
      type: "string",
      default: "var(--chart-1)",
      required: false,
      description: "Area fill color for observations exceeding the reference baseline.",
      category: "visual",
    },
    {
      name: "belowColor",
      type: "string",
      default: "var(--chart-2)",
      required: false,
      description: "Area fill color for observations falling below the reference baseline.",
      category: "visual",
    },
    {
      name: "baselineColor",
      type: "string",
      default: "var(--chart-axis)",
      required: false,
      description: "Stroke color for the constant horizontal reference baseline line.",
      category: "visual",
    },
    {
      name: "selectionColor",
      type: "string",
      default: "var(--chart-selection)",
      required: false,
      description: "Color for locked inspection crosshair reference line.",
      category: "visual",
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.24",
      required: false,
      description: "Fill opacity applied to both above and below occupied area regions.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.15, label: "0.15 (Subtle)" },
        { value: 0.24, label: "0.24 (Medium)" },
        { value: 0.45, label: "0.45 (Prominent)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle horizontal Cartesian grid reference lines.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render horizontal domain tick labels.",
      category: "visual",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render vertical metric scale ticks.",
      category: "visual",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      description: "Whether to render above/below/baseline status indicator legend.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showDeviation",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to derive and display signed arithmetic deviation in inspection tooltips.",
      category: "interaction",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "lockableTooltip",
      type: "boolean",
      default: "true",
      required: false,
      description: "Enables persistent inspection pinning on click or keyboard Enter/Space.",
      category: "interaction",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "connect"',
      default: '"gap"',
      required: false,
      description: 'Policy for missing data: "gap" preserves truthful breaks; "connect" bridges across gaps.',
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Truthful)" },
        { value: "connect", label: "Connect" },
      ],
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Enables entrance path animation. Automatically bypassed when prefers-reduced-motion is active.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
  ],

  examples: [
    {
      id: "utilization-target",
      title: "Utilization vs 75% Target Baseline",
      description:
        "Standard single-series resource utilization tracking positive and negative deviations from an explicit 75% reference target.",
      snippet: `<BaselineArea
  data={utilizationData}
  xKey="day"
  series={{
    key: "utilization",
    label: "Resource Utilization",
    valueFormatter: (v) => \`\${v}%\`,
  }}
  baseline={75}
  baselineLabel="Target SLA"
  aboveLabel="Above SLA"
  belowLabel="Below SLA"
  showGrid
  showDeviation
/>`,
      props: {
        baseline: 75,
        baselineLabel: "Target SLA",
        aboveLabel: "Above SLA",
        belowLabel: "Below SLA",
        showGrid: true,
        showDeviation: true,
      },
    },
    {
      id: "frequent-crossings",
      title: "Frequent Reference Crossings",
      description:
        "Validates continuous vertical Y segmentation when data oscillates frequently above and below the reference baseline.",
      snippet: `<BaselineArea
  data={crossingData}
  xKey="day"
  series={{
    key: "utilization",
    label: "Resource Utilization",
    valueFormatter: (v) => \`\${v}%\`,
  }}
  baseline={75}
  curve="monotone"
  fillOpacity={0.3}
  showGrid
/>`,
      props: {
        baseline: 75,
        curve: "monotone",
        fillOpacity: 0.3,
        showGrid: true,
      },
    },
    {
      id: "zero-baseline",
      title: "Zero Baseline (Positive/Negative)",
      description:
        "Explicit baseline={0} anchor demonstrating truthful handling of mathematical zero without collapsing negative values.",
      snippet: `<BaselineArea
  data={growthData}
  xKey="month"
  series={{
    key: "growth",
    label: "Net Growth",
    valueFormatter: (v) => \`\${v}%\`,
  }}
  baseline={0}
  baselineLabel="Zero Growth"
  aboveLabel="Positive Growth"
  belowLabel="Contraction"
  showGrid
/>`,
      props: {
        baseline: 0,
        baselineLabel: "Zero Growth",
        aboveLabel: "Positive Growth",
        belowLabel: "Contraction",
        showGrid: true,
      },
    },
    {
      id: "linear-interpolation",
      title: "Linear Interpolation with Exact Crossings",
      description:
        "Piecewise linear segments demonstrating deterministic vertex alignment and exact baseline intersection geometry.",
      snippet: `<BaselineArea
  data={utilizationData}
  xKey="day"
  series={{
    key: "utilization",
    label: "Resource Utilization",
  }}
  baseline={75}
  curve="linear"
  showGrid
/>`,
      props: {
        baseline: 75,
        curve: "linear",
        showGrid: true,
      },
    },
    {
      id: "with-legend",
      title: "Status Legend Enabled",
      description:
        "Displays structural sample swatches for Above Reference, Below Reference, and the Reference Baseline.",
      snippet: `<BaselineArea
  data={utilizationData}
  xKey="day"
  series={{
    key: "utilization",
    label: "Resource Utilization",
  }}
  baseline={75}
  showLegend
  showGrid
/>`,
      props: {
        baseline: 75,
        showLegend: true,
        showGrid: true,
      },
    },
  ],

  responsive: {
    overview:
      "Baseline Area preserves the constant horizontal reference baseline, continuous above/below segmentation, and nearest-X inspection across all viewport dimensions down to 320px.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Spacious Cartesian grid, full domain tick density, inline baseline label annotations, and detailed inspection card.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive domain tick thinning, preserved reference line geometry, and compact inspection gutters.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, touch-forgiving nearest-X scrubbing, truthful missing breaks, and uncompromised continuous Y color segmentation.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance path reveal. The linearGradient fill remains fixed to the baseline coordinate throughout animation and never overshoots.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized nearest-X inspection card showing domain coordinate, series value, baseline reference, and signed arithmetic deviation.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation coordinate.",
    legend:
      "Optional status legend providing non-color structural samples for Above Reference, Below Reference, and Reference Baseline.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter/Space, and Escape shortcuts. Structured data table provided for assistive technologies.",
    screenReader:
      "Announces domain coordinate, observed value, reference baseline, and signed deviation. Classifications are narrated factually without business value judgments.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation across the domain." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation across the domain." },
      { key: "Home", action: "Jump inspection directly to the first observation." },
      { key: "End", action: "Jump inspection directly to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock persistent inspection at the active coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active inspection tooltip." },
    ],
    colorIndependence:
      "Reference line geometry, active dot marker, signed +/- deviation readout, and structured offscreen HTML table ensure complete non-color accessibility.",
    reducedMotion:
      "All entrance animations immediately bypass when prefers-reduced-motion is detected in user system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "BaselineArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates single quantitative series validation, explicit finite baseline check, safe Y-domain calculation, Recharts AreaChart rendering, and nearest-X inspection",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates scales, Cartesian grid, defs linearGradient, Area geometry, and ReferenceLine",
          children: [
            {
              name: "defs > linearGradient",
              role: "Hard-stop segmentation definition",
              description: "SSR-safe, collision-safe vertical linear gradient with sharp color transition at the exact baseline percentage",
            },
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the area geometry",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal domain labels and auto-padded vertical scale enclosing both series values and baseline",
            },
            {
              name: "ReferenceLine",
              role: "Constant baseline reference",
              description: "Thin horizontal dashed reference line aligned precisely with the gradient color transition",
            },
            {
              name: "Area",
              role: "Primary area fill & stroke",
              description: "Quantitative area filled with url(#gradientId) using baseValue={baseline} and stroked with series color",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays domain coordinate, observed value, baseline value, signed deviation, and position badge",
            },
          ],
        },
        {
          name: "BaselineAreaLegend",
          role: "Status indicator legend",
          description: "Displays above, below, and baseline reference swatches",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-baseline.tsx",
        description:
          "Complete Baseline Area component with explicit reference baseline, hard-stop continuous fill, and nearest-X inspection",
      },
    ],
    registryDependencies: [
      "@plotcn/chart-container",
      "@plotcn/chart-state",
      "@plotcn/chart-tooltip",
      "@plotcn/chart-motion",
    ],
    npmDependencies: ["recharts", "@hugeicons/react", "@hugeicons/core-free-icons"],
  },
}
