import type { ChartDetailDoc } from "./types"

export const barBulletDoc: ChartDetailDoc = {
  chartId: "recharts-bar-bullet",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "025",

  quickFacts: {
    bestFor:
      "Compact operational scorecards comparing an actual quantitative measure against an explicit per-category target marker on a shared quantitative scale.",
    dataModel: "Categorical observations with actual measure, target value, and optional qualitative context bands",
    interaction: "Row-centric band hit testing, synchronized tooltip with actual, target, and arithmetic delta, Up/Down arrow key traversal",
    responsive: "Container-driven fluid SVG with auto-derived height from row count, adaptive margins, and preserved target markers down to 320px",
    animation: "Restrained baseline-anchored bar growth without bouncy target overshoot or artificial status re-coloration",
    runtime: "Idiomatic Recharts SVG with layered target marker rules and zero external gauge/progress library dependencies",
  },

  dataFormat: {
    summary:
      "An array of categorical records with discrete category identifiers, observed actual values, and explicit target references. Input observations remain canonical; Plotcn derives arithmetic delta as actual - target without moralizing pass/fail labels.",
    fields: [
      {
        field: "service",
        type: "string | number",
        required: true,
        description: "Discrete category label along the vertical categorical axis.",
      },
      {
        field: "actual",
        type: "number | null",
        required: true,
        description: "Observed quantitative measure. Null indicates missing observation.",
      },
      {
        field: "target",
        type: "number | null",
        required: true,
        description: "Explicit reference target value. Null indicates unconfigured target.",
      },
    ],
    nullPolicy:
      'Missing actual renders no bar while preserving the target marker. Missing target renders the actual bar without a marker. Delta is reported as "Unavailable" whenever either value is missing.',
    orderingPolicy:
      "Category order is strictly caller-preserved. Bullet Bars does not automatically sort or rank categories.",
    exampleRows: [
      { service: "Auth API", actual: 99.95, target: 99.90 },
      { service: "Search API", actual: 99.82, target: 99.90 },
      { service: "Checkout API", actual: 99.91, target: 99.95 },
      { service: "Profiles API", actual: 99.97, target: 99.90 },
      { service: "Notifications API", actual: 99.88, target: 99.90 },
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
      type: "BulletBarSeries<TData>",
      default: "—",
      required: true,
      description: "Series definition specifying valueKey, targetKey, label, and optional formatters.",
      category: "core",
    },
    {
      name: "ranges",
      type: "readonly BulletRange[]",
      default: "undefined",
      required: false,
      description: "Optional monotonic qualitative background context bands.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "None", value: undefined },
        {
          label: "Bands",
          value: [
            { to: 99.70, label: "Low" },
            { to: 99.90, label: "Medium" },
            { to: 100.0, label: "High" },
          ],
        },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "auto",
      required: false,
      description: "Total container height. Derived automatically from row count if omitted.",
      category: "core",
    },
    {
      name: "rowHeight",
      type: "number",
      default: "48",
      required: false,
      description: "Target height in pixels for each scorecard row.",
      category: "core",
    },
    {
      name: "domain",
      type: '[number, number] | "auto"',
      default: '"auto"',
      required: false,
      description: "Quantitative domain. 'auto' encompasses 0, all actuals, targets, and range limits.",
      category: "core",
    },
    {
      name: "valueColor",
      type: "string",
      default: '"var(--chart-1)"',
      required: false,
      description: "Fill color for the actual measure bar.",
      category: "visual",
    },
    {
      name: "targetColor",
      type: "string",
      default: '"var(--chart-foreground)"',
      required: false,
      description: "Stroke color for the per-category target marker rule.",
      category: "visual",
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Accent stroke color for the active scorecard row.",
      category: "visual",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle Cartesian gridlines.",
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
      description: "Whether to display the structural legend.",
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
      type: '"none" | "value" | "auto"',
      default: '"none"',
      required: false,
      description: "Policy for rendering inline numeric labels at outward bar ends.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "None", value: "none" },
        { label: "Value", value: "value" },
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
      id: "service-availability-scorecard",
      title: "Service Availability vs SLO",
      description: "Standard operational scorecard comparing service availability against explicit SLA targets in percentage space.",
      snippet: `<BulletBars
  data={[
    { service: "Auth API", actual: 99.95, target: 99.90 },
    { service: "Search API", actual: 99.82, target: 99.90 },
    { service: "Checkout API", actual: 99.91, target: 99.95 },
    { service: "Profiles API", actual: 99.97, target: 99.90 },
    { service: "Notifications API", actual: 99.88, target: 99.90 },
  ]}
  categoryKey="service"
  series={{
    valueKey: "actual",
    targetKey: "target",
    label: "Availability",
    valueFormatter: (v) => \`\${v.toFixed(2)}%\`,
  }}
/>`,
      props: {
        categoryKey: "service",
      },
    },
    {
      id: "regional-revenue-targets",
      title: "Regional Revenue vs Target",
      description: "Comparing regional financial performance against varied regional sales targets on a shared currency scale.",
      snippet: `<BulletBars
  data={[
    { region: "North", revenue: 480, target: 450 },
    { region: "South", revenue: 320, target: 350 },
    { region: "East", revenue: 560, target: 500 },
    { region: "West", revenue: 410, target: 410 },
    { region: "Central", revenue: 290, target: 330 },
  ]}
  categoryKey="region"
  series={{
    valueKey: "revenue",
    targetKey: "target",
    label: "Revenue",
    valueFormatter: (v) => \`$\${v}k\`,
  }}
/>`,
      props: {
        categoryKey: "region",
      },
    },
    {
      id: "zero-target-defect-rate",
      title: "Zero Target Defect Rate",
      description: "Validating that target = 0 renders truthfully at the baseline without division errors.",
      snippet: `<BulletBars
  data={[
    { component: "Parser", defects: 2, target: 0 },
    { component: "Renderer", defects: 0, target: 0 },
    { component: "Network", defects: 4, target: 0 },
  ]}
  categoryKey="component"
  series={{
    valueKey: "defects",
    targetKey: "target",
    label: "Defects",
  }}
/>`,
      props: {
        categoryKey: "component",
      },
    },
  ],

  responsive: {
    overview:
      "Bullet Bars adapts fluidly across device viewports. The horizontal orientation ensures category labels remain readable while target markers and actual bars maintain direct scale alignment down to 320px.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full categorical tick labels, outward numeric value callouts, and spacious analytical tooltips disclosing actual, target, and delta.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Compact category labels, preserved target marker rules, and responsive tooltip clamping within container bounds.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Strict touch-action pan-y preservation, tightened row margins, and full 44px touch hit targets across each scorecard row.",
      },
    ],
  },

  animation: {
    overview:
      "Actual bars grow smoothly from the zero baseline to their observed values on initial mount. Target markers appear crisply at their coordinates without bouncy overshoot.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Analytical card disclosing discrete category, observed actual value, explicit target value, arithmetic delta, and neutral positional state (Above target, Below target, On target).",
    crosshair:
      "Full row band highlight representing the categorical record under pointer or keyboard inspection.",
    legend:
      "Structural legend identifying the actual bar fill, target marker rule, and qualitative context bands without good/bad moralizing.",
  },

  accessibility: {
    role: "region",
    summary:
      "Semantic figure region with single tab stop, vertical arrow-key navigation (ArrowUp/ArrowDown) through scorecard rows, Home/End traversal, polite ARIA live announcements, and an offscreen structured HTML table disclosing actuals, targets, and deltas.",
    screenReader:
      "Announces category name, observed actual value, reference target, and arithmetic delta. Factual accessibility summary details counts above, below, and on target.",
    keyboardShortcuts: [
      { key: "ArrowDown", action: "Move focus to the next scorecard row" },
      { key: "ArrowUp", action: "Move focus to the previous scorecard row" },
      { key: "Home", action: "Jump focus to the first category" },
      { key: "End", action: "Jump focus to the last category" },
      { key: "Escape", action: "Clear active row inspection" },
    ],
    colorIndependence:
      "Actual measure is encoded by bar length; target reference is encoded by a vertical rule marker. The distinct geometry guarantees complete non-color accessibility even in pure Monochrome.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "BulletBars",
      role: "Semantic figure and operational scorecard coordinator",
      description:
        "Validates actual and target numbers, derives arithmetic delta, computes shared quantitative scale, renders horizontal Recharts canvas, and produces offscreen accessibility table.",
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
                  description: "Coordinates horizontal scales, grid, and composite bar shape",
                  children: [
                    {
                      name: "CartesianGrid",
                      role: "Reference grid lines",
                      description: "Subtle dashed grid perpendicular to the quantitative axis",
                    },
                    {
                      name: "XAxis & YAxis",
                      role: "Categorical and quantitative axes",
                      description: "Shared numeric scale on X and discrete category labels on Y",
                    },
                    {
                      name: "Bar (BulletBarShape)",
                      role: "Composite bar & target marker geometry",
                      description: "Layered SVG rendering background bands, actual bar, target rule, and hit box",
                    },
                    {
                      name: "Tooltip",
                      role: "Synchronized analytical card",
                      description: "Auto-adjusting tooltip displaying category, actual, target, and delta",
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
        path: "registry/recharts/bar-bullet.tsx",
        description:
          "Complete BulletBars component with per-category target markers, shared scale derivation, delta computation, and accessible table.",
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
