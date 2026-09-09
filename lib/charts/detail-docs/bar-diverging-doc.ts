import type { ChartDetailDoc } from "./types"

export const barDivergingDoc: ChartDetailDoc = {
  chartId: "recharts-bar-diverging",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "024",

  quickFacts: {
    bestFor:
      "Signed categorical comparison around an explicit neutral reference (zero or benchmark/target), encoding deviation magnitude by bar length and direction by side relative to the baseline.",
    dataModel: "Categorical observations with a single semantic quantitative measure and a finite reference baseline",
    interaction: "Category band hit testing, synchronized tooltip with raw measurements and derived deviations, arrow key navigation",
    responsive: "Container-driven fluid SVG with symmetric quantitative scaling, adaptive tick formatting, and touch-safe interaction",
    animation: "Baseline-anchored outward growth animation without overshoot or teleportation across the neutral reference",
    runtime: "Idiomatic Recharts SVG with custom direction-aware corner radii, zero DOM overhead, and strict finite math safety",
  },

  dataFormat: {
    summary:
      "An array of categorical records containing a discrete category identifier and a numeric measure. Input observations are preserved canonical; Plotcn derives signed deviation as value - baseline in zero-centered comparison space.",
    fields: [
      {
        field: "region",
        type: "string | number",
        required: true,
        description: "Discrete category identifier along the categorical axis.",
      },
      {
        field: "variance",
        type: "number | null",
        required: true,
        description: "Quantitative metric observation. Null indicates missing/unrecorded observation.",
      },
    ],
    nullPolicy:
      'Missing values (null or undefined) render no bar and display "Unavailable" in tooltips. They are never coerced to zero deviation to prevent misleading on-reference claims.',
    orderingPolicy:
      "Category order is strictly caller-preserved. Diverging Bars does not sort or rank categories automatically.",
    exampleRows: [
      { region: "North", variance: 18 },
      { region: "South", variance: -12 },
      { region: "East", variance: 31 },
      { region: "West", variance: -24 },
      { region: "Central", variance: 0 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      description: "Array of categorical data records. Order is strictly preserved.",
      category: "core",
    },
    {
      name: "categoryKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      description: "Key on data records representing the discrete category.",
      category: "core",
    },
    {
      name: "series",
      type: "DivergingBarSeries<TData>",
      default: "—",
      required: true,
      description: "Quantitative series definition containing key, label, and optional valueFormatter.",
      category: "core",
    },
    {
      name: "baseline",
      type: "number",
      default: "0",
      required: false,
      description: "Explicit neutral reference baseline against which deviation is derived (value - baseline).",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "0 (Zero)", value: 0 },
        { label: "10 (Target)", value: 10 },
        { label: "-10 (Negative)", value: -10 },
      ],
    },
    {
      name: "baselineLabel",
      type: "string",
      default: "undefined",
      required: false,
      description: "Optional label for the baseline (e.g. 'Target', 'Plan', 'SLA').",
      category: "visual",
    },
    {
      name: "layout",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      required: false,
      description: "Visual layout: 'horizontal' (categories on Y) or 'vertical' (categories on X).",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Horizontal", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
      ],
    },
    {
      name: "domain",
      type: '[number, number] | "symmetric"',
      default: '"symmetric"',
      required: false,
      description: "Quantitative scale domain in deviation space. 'symmetric' scales [-maxAbs, +maxAbs].",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Symmetric", value: "symmetric" },
        { label: "[-40, 40]", value: [-40, 40] },
      ],
    },
    {
      name: "aboveColor",
      type: "string",
      default: '"var(--chart-1)"',
      required: false,
      description: "Fill color for bars deviating above the neutral baseline reference.",
      category: "visual",
    },
    {
      name: "belowColor",
      type: "string",
      default: '"var(--chart-2)"',
      required: false,
      description: "Fill color for bars deviating below the neutral baseline reference.",
      category: "visual",
    },
    {
      name: "baselineColor",
      type: "string",
      default: '"var(--chart-axis)"',
      required: false,
      description: "Stroke color for the structural baseline reference line.",
      category: "visual",
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Accent stroke color for the currently inspected category bar.",
      category: "visual",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle background gridlines.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      description: "Whether to display the directional legend.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Hide", value: false },
        { label: "Show", value: true },
      ],
    },
    {
      name: "valueLabel",
      type: '"none" | "value" | "deviation" | "auto"',
      default: '"none"',
      required: false,
      description: "Policy for rendering inline numeric labels at outward bar ends.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "None", value: "none" },
        { label: "Deviation", value: "deviation" },
        { label: "Value", value: "value" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "340",
      required: false,
      description: "Container height in pixels or CSS dimension string.",
      category: "core",
    },
    {
      name: "maxBarSize",
      type: "number",
      default: "36",
      required: false,
      description: "Maximum bar thickness in pixels.",
      category: "core",
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Animation toggle honoring reduced-motion preferences.",
      category: "advanced",
    },
  ],

  examples: [
    {
      id: "variance-zero-baseline",
      title: "Variance from Plan (Zero Baseline)",
      description: "Regional performance variance around a zero neutral reference baseline.",
      snippet: `<DivergingBars
  data={[
    { region: "North", variance: 18 },
    { region: "South", variance: -12 },
    { region: "East", variance: 31 },
    { region: "West", variance: -24 },
    { region: "Central", variance: 0 },
  ]}
  categoryKey="region"
  series={{ key: "variance", label: "Variance from Plan" }}
  baseline={0}
/>`,
      props: {
        categoryKey: "region",
        baseline: 0,
      },
    },
    {
      id: "latency-target-sla",
      title: "API Latency vs Target SLA (Non-Zero Baseline)",
      description: "Service latencies compared against a 250ms target benchmark, rendered in deviation space.",
      snippet: `<DivergingBars
  data={[
    { service: "Auth", latency: 210 },
    { service: "Search", latency: 290 },
    { service: "Billing", latency: 250 },
    { service: "Reports", latency: 340 },
    { service: "Profile", latency: 190 },
  ]}
  categoryKey="service"
  series={{ key: "latency", label: "Latency", valueFormatter: (v) => \`\${v} ms\` }}
  baseline={250}
  baselineLabel="Target SLA"
/>`,
      props: {
        categoryKey: "service",
        baseline: 250,
        baselineLabel: "Target SLA",
      },
    },
  ],

  responsive: {
    overview:
      "Diverging Bars fluidly adapts from ultra-wide enterprise monitoring down to narrow 320px mobile displays. Symmetric domain scaling guarantees balanced visual anchor on both sides of the reference line at all widths and heights.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full categorical tick labels, outward value callouts, and spacious analytical tooltips with raw measurements and derived deviations.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Compact category labels, preserved symmetric domain bounds, and responsive tooltip clamping within container bounds.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Horizontal layout recommended to afford long category names, strict touch-action pan-y preservation, and compact card tooltips with auto-adjustment.",
      },
    ],
  },

  animation: {
    overview:
      "Bars grow outwards from the reference baseline to their deviation endpoints on mount. Interactive domain changes, baseline modifications, and hover states transition smoothly without jarring reflows.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Analytical card disclosing discrete category, raw value, reference baseline, signed deviation (+/-), and non-judgmental position (Above reference, Below reference, On reference).",
    crosshair:
      "Subtle category-band highlight representing the categorical record under pointer or keyboard inspection.",
    legend:
      "Neutral structural legend identifying Above Reference, Below Reference, and Reference Line without good/bad moralizing.",
  },

  accessibility: {
    role: "region",
    summary:
      "Semantic figure region with single tab stop, arrow-key navigation (Left/Right for vertical layout, Up/Down for horizontal layout), Home/End traversal, polite ARIA live announcements, and an offscreen structured HTML table for screen readers.",
    screenReader:
      "Announces category name, raw value, baseline reference, and signed deviation. Factual accessibility summary details counts above, below, and on reference.",
    keyboardShortcuts: [
      { key: "ArrowDown / ArrowRight", action: "Move focus to the next category" },
      { key: "ArrowUp / ArrowLeft", action: "Move focus to the previous category" },
      { key: "Home", action: "Jump focus to the first category" },
      { key: "End", action: "Jump focus to the last category" },
      { key: "Escape", action: "Clear active category inspection" },
    ],
    colorIndependence:
      "Spatial direction relative to the baseline unambiguously conveys sign even under complete monochromatic rendering. Explicit table columns and legend indicators ensure color is never the sole information carrier.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "DivergingBars",
      role: "Semantic figure and keyboard navigation coordinator",
      description:
        "Derives deviation = value - baseline, calculates symmetric quantitative bounds, renders Cartesian canvas, and produces offscreen accessibility table.",
      children: [
        {
          name: "ChartContainer",
          role: "Container query wrapper",
          description: "Provides responsive container sizing and design tokens",
          children: [
            {
              name: "ResponsiveContainer",
              role: "Fluid SVG canvas coordinator",
              description: "Measures container geometry and provides dimensions to BarChart",
              children: [
                {
                  name: "BarChart",
                  role: "Cartesian chart coordinator",
                  description: "Manages axes, grid, reference baseline, and custom bar geometries",
                  children: [
                    {
                      name: "CartesianGrid",
                      role: "Reference grid lines",
                      description: "Subtle dashed grid perpendicular to the quantitative axis",
                    },
                    {
                      name: "XAxis & YAxis",
                      role: "Categorical and quantitative axes",
                      description: "Zero-centered symmetric deviation scale and discrete category labels",
                    },
                    {
                      name: "ReferenceLine",
                      role: "Explicit neutral reference",
                      description: "Structural zero-deviation reference line with optional benchmark label",
                    },
                    {
                      name: "Bar (DivergingBarShape)",
                      role: "Direction-aware outward bar geometry",
                      description: "Custom SVG path with outward rounded caps and flat baseline edge",
                    },
                    {
                      name: "Tooltip",
                      role: "Synchronized analytical card",
                      description: "Auto-adjusting tooltip displaying category, raw value, baseline, and deviation",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/bar-diverging.tsx",
        description:
          "Complete DivergingBars component with deviation derivation, symmetric domain resolution, direction-aware corner caps, and accessible table.",
      },
    ],
    registryDependencies: [
      "@plotcn/chart-container",
      "@plotcn/chart-state",
      "@plotcn/chart-tooltip",
      "@plotcn/chart-motion",
    ],
    npmDependencies: ["recharts"],
  },
}
