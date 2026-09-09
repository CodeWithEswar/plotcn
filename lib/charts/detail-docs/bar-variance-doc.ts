import type { ChartDetailDoc } from "./types"

export const barVarianceDoc: ChartDetailDoc = {
  chartId: "recharts-bar-variance",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "026",

  quickFacts: {
    bestFor:
      "Actual-versus-plan financial, budget, and operational variance analysis centered on an explicit zero-variance reference baseline.",
    dataModel: "Categorical observations with actual measure, plan/reference value, and derived signed delta",
    interaction: "Category band hit testing, synchronized tooltip with actual, plan, and signed variance, keyboard traversal",
    responsive: "Container-driven fluid SVG supporting both vertical columns and horizontal scorecard rows down to 320px",
    animation: "Restrained baseline-anchored outward growth from zero without bouncy overshoot or artificial status recoloring",
    runtime: "Idiomatic Recharts SVG with dynamic Cell fills, ReferenceLine zero baseline, and zero external statistical dependencies",
  },

  dataFormat: {
    summary:
      "An array of categorical records with discrete category identifiers, observed actual values, and explicit plan/reference values. Plotcn immutably derives signed arithmetic variance as actual - plan around an explicit zero reference.",
    fields: [
      {
        field: "segment",
        type: "string | number",
        required: true,
        description: "Discrete category label along the categorical axis.",
      },
      {
        field: "actual",
        type: "number | null",
        required: true,
        description: "Observed quantitative measure. Null indicates missing observation.",
      },
      {
        field: "plan",
        type: "number | null",
        required: true,
        description: "Reference plan or target value. Null indicates unconfigured plan.",
      },
    ],
    nullPolicy:
      'Variance requires both actual and plan to be finite numbers. If either is missing, variance is reported as "Unavailable" without fake zero-substitution.',
    orderingPolicy:
      "Category order is strictly caller-preserved. Variance Bars does not automatically sort or rank categories.",
    exampleRows: [
      { segment: "Enterprise", actual: 124, plan: 110 },
      { segment: "Mid-market", actual: 92, plan: 100 },
      { segment: "SMB", actual: 74, plan: 74 },
      { segment: "Public sector", actual: 68, plan: 72 },
      { segment: "Partners", actual: 81, plan: 75 },
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
      description: "Key on data records representing the discrete category label.",
      category: "core",
    },
    {
      name: "series",
      type: "VarianceBarSeries<TData>",
      default: "—",
      required: true,
      description: "Series definition specifying actualKey, planKey, label, and optional formatters.",
      category: "core",
    },
    {
      name: "orientation",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      required: false,
      description: "Arrangement of categorical and quantitative axes.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Vertical", value: "vertical" },
        { label: "Horizontal", value: "horizontal" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "340",
      required: false,
      description: "Chart container height in pixels or CSS dimension string.",
      category: "core",
    },
    {
      name: "domain",
      type: '[number, number] | "auto"',
      default: '"auto"',
      required: false,
      description: "Quantitative domain bounds. Follows Policy B symmetry for mixed signs.",
      category: "core",
    },
    {
      name: "positiveColor",
      type: "string",
      default: '"var(--chart-1)"',
      required: false,
      description: "Fill color for bars where actual is numerically above plan.",
      category: "visual",
    },
    {
      name: "negativeColor",
      type: "string",
      default: '"var(--chart-2)"',
      required: false,
      description: "Fill color for bars where actual is numerically below plan.",
      category: "visual",
    },
    {
      name: "zeroColor",
      type: "string",
      default: '"var(--chart-axis)"',
      required: false,
      description: "Stroke color for the zero baseline reference line.",
      category: "visual",
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Stroke emphasis color for the currently focused category bar.",
      category: "visual",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle background Cartesian grid lines.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    {
      name: "showZeroLine",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the prominent zero reference baseline.",
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
      type: '"none" | "variance" | "auto"',
      default: '"none"',
      required: false,
      description: "Policy for rendering inline numeric variance labels.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "None", value: "none" },
        { label: "Variance", value: "variance" },
      ],
    },
    {
      name: "tooltipMode",
      type: '"variance" | "full"',
      default: '"full"',
      required: false,
      description: 'Tooltip depth ("full" displays actual, plan, and variance).',
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Full", value: "full" },
        { label: "Variance", value: "variance" },
      ],
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
      id: "revenue-vs-plan",
      title: "Revenue vs Plan by Segment",
      description: "Standard business scorecard comparing segment revenues against financial budget plans.",
      snippet: `<VarianceBars
  data={[
    { segment: "Enterprise", actual: 124, plan: 110 },
    { segment: "Mid-market", actual: 92, plan: 100 },
    { segment: "SMB", actual: 74, plan: 74 },
    { segment: "Public sector", actual: 68, plan: 72 },
    { segment: "Partners", actual: 81, plan: 75 },
  ]}
  categoryKey="segment"
  series={{
    actualKey: "actual",
    planKey: "plan",
    label: "Revenue Variance",
    valueFormatter: (v) => \`$\${v}M\`,
    varianceFormatter: (v) => \`\${v > 0 ? "+" : ""}$\${v}M\`,
  }}
/>`,
      props: {
        categoryKey: "segment",
        series: {
          actualKey: "actual",
          planKey: "plan",
          label: "Revenue Variance",
        },
      },
    },
    {
      id: "horizontal-cost-scorecard",
      title: "Operating Cost Variance (Horizontal)",
      description: "Compact horizontal scorecard for operating budget variance with long department labels.",
      snippet: `<VarianceBars
  data={[
    { dept: "Engineering & Cloud", actual: 145, plan: 120 },
    { dept: "Product Design", actual: 48, plan: 50 },
    { dept: "Customer Support", actual: 82, plan: 82 },
    { dept: "Global Marketing", actual: 95, plan: 110 },
    { dept: "Legal & Compliance", actual: 34, plan: 30 },
  ]}
  categoryKey="dept"
  orientation="horizontal"
  series={{
    actualKey: "actual",
    planKey: "plan",
    label: "Operating Expenses",
    valueFormatter: (v) => \`$\${v}K\`,
    varianceFormatter: (v) => \`\${v > 0 ? "+" : ""}$\${v}K\`,
  }}
/>`,
      props: {
        categoryKey: "dept",
        orientation: "horizontal",
        series: {
          actualKey: "actual",
          planKey: "plan",
          label: "Operating Expenses",
        },
      },
    },
  ],

  responsive: {
    overview:
      "VarianceBars uses container-driven geometry via ResizeObserver and SVG viewbox scaling. Zero baseline and equal absolute bar lengths are preserved at every width.",
    breakpoints: [
      {
        name: "Mobile Compact",
        width: "< 440px",
        behavior:
          "Category labels truncate gracefully or reflow into horizontal scorecard rows; tooltips clamp within container width with compact typography.",
      },
      {
        name: "Tablet / Split",
        width: "440px – 768px",
        behavior:
          "Standard vertical column composition with reduced tick density on the quantitative scale and full category band touch hit testing.",
      },
      {
        name: "Desktop Expanded",
        width: "> 768px",
        behavior:
          "Full analytical layout displaying quantitative gridlines, outward value labels, and rich actual/plan/delta tooltip inspection.",
      },
    ],
  },

  animation: {
    overview:
      "Signed variance bars extrude outward smoothly from the zero reference line to their derived deviation values on initial mount without bouncy overshoot.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Container-clamped card disclosing discrete category, observed actual value, reference plan value, signed variance, and factual position without good/bad moralizing.",
    crosshair:
      "Full category band highlight ensuring zero, tiny, or unavailable variance categories remain interactive under pointer and keyboard inspection.",
    legend:
      "Directional legend identifying positive variance (+), negative variance (−), and zero variance baseline.",
  },

  accessibility: {
    role: "region",
    summary:
      "Semantic figure region with single tab stop, orientation-specific arrow-key traversal, Home/End navigation, polite ARIA announcements, and an offscreen structured HTML table disclosing actuals, plans, and variances.",
    screenReader:
      "Announces category name, observed actual value, reference plan, derived signed variance, and factual position relative to plan.",
    keyboardShortcuts: [
      { key: "ArrowLeft / ArrowRight", action: "Traverse categories in vertical orientation" },
      { key: "ArrowUp / ArrowDown", action: "Traverse categories in horizontal orientation" },
      { key: "Home", action: "Jump focus to the first category" },
      { key: "End", action: "Jump focus to the last category" },
      { key: "Escape", action: "Clear active category inspection" },
    ],
    colorIndependence:
      "Direction is encoded geometrically by extrusion relative to the center zero baseline (above/right for positive, below/left for negative). Color serves purely as supplementary visual identity.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "VarianceBars",
      role: "Semantic figure and variance coordinator",
      description:
        "Validates actual and plan numbers, derives arithmetic delta, enforces Policy B symmetric domain, renders Recharts BarChart, and outputs offscreen table.",
      children: [
        {
          name: "ChartContainer",
          role: "Container query wrapper",
          description: "Provides responsive sizing and token styling",
          children: [
            {
              name: "ResponsiveContainer",
              role: "Fluid SVG canvas coordinator",
              description: "Measures container geometry and provides dimensions to BarChart",
              children: [
                {
                  name: "BarChart",
                  role: "Cartesian chart coordinator",
                  description: "Coordinates quantitative scale, zero baseline, and signed bars",
                  children: [
                    {
                      name: "CartesianGrid",
                      role: "Reference grid lines",
                      description: "Subtle dashed grid perpendicular to the quantitative axis",
                    },
                    {
                      name: "ReferenceLine (Zero)",
                      role: "Zero-variance equality baseline",
                      description: "Prominent rule at 0 anchoring positive and negative deviations",
                    },
                    {
                      name: "Bar + Cell",
                      role: "Signed variance geometry",
                      description: "Extrudes bars outward from zero with dynamic directional fills",
                    },
                    {
                      name: "Tooltip",
                      role: "Synchronized analytical card",
                      description: "Container-clamped tooltip displaying category, actual, plan, and variance",
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
        path: "registry/recharts/bar-variance.tsx",
        description:
          "Complete VarianceBars component with actual-vs-plan arithmetic derivation, Policy B symmetric domain, and accessible table.",
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
