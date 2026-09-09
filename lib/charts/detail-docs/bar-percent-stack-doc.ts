import type { ChartDetailDoc } from "./types"

export const barPercentStackDoc: ChartDetailDoc = {
  chartId: "recharts-bar-percent-stack",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "023",

  quickFacts: {
    bestFor:
      "100% normalized multi-series categorical composition where every complete category normalizes to 100%, total-magnitude differences are intentionally removed from geometry, and contributor shares are compared with stable stack identity.",
    dataModel: "Categorical records with two or more non-negative additive numeric contributors sharing the same quantitative unit",
    interaction: "Forgiving category band hit testing, synchronized tooltip with derived shares and raw measurements, legend visibility toggles with live renormalization, and arrow key traversal",
    responsive: "Container-driven fluid SVG with tick reduction, preserved contributor shares, and touch-action: pan-y mobile scrolling",
    animation: "Restrained baseline-anchored growth animation respecting prefers-reduced-motion without bounce or overshoot",
    runtime: "Idiomatic Recharts SVG with normalized stackId, zero per-point DOM overhead, and strict non-negative data safety",
  },

  dataFormat: {
    summary:
      "An array of categorical records containing a discrete category identifier (segment, plan, department, tier) and two or more additive numeric contributors. Input measurements are raw non-negative values; Plotcn derives 0–100% normalized shares dynamically from the current visible total. Zero-total categories have undefined composition, and missing values invalidate the complete category by default.",
    fields: [
      {
        field: "segment",
        type: "string | number",
        required: true,
        description: "Discrete category identifier along the categorical axis.",
      },
      {
        field: "monthly",
        type: "number | null",
        required: true,
        description: "First additive contributor (e.g. monthly subscriptions). Null indicates unrecorded/missing contribution.",
      },
      {
        field: "annual",
        type: "number | null",
        required: true,
        description: "Second additive contributor sharing the same unit and scale.",
      },
      {
        field: "multiYear",
        type: "number | null",
        required: false,
        description: "Third additive contributor completing the category whole.",
      },
    ],
    nullPolicy:
      'Under default missingValuePolicy="incomplete", any missing contributor invalidates the category composition and omits stack geometry to avoid visual deception. Tooltips display "Unavailable — incomplete composition". Under explicit "zero" policy, missing values are coerced to 0.',
    orderingPolicy:
      "Category order is strictly caller-preserved. Stack order is strictly defined by the series configuration order and never sorts dynamically by percentage magnitude.",
    exampleRows: [
      { segment: "Startup", monthly: 620, annual: 310, multiYear: 70 },
      { segment: "Growth", monthly: 840, annual: 920, multiYear: 240 },
      { segment: "Enterprise", monthly: 90, annual: 215, multiYear: 195 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      description: "Readonly array of categorical records. Caller data is immutable and never modified.",
      category: "core",
    },
    {
      name: "categoryKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      description: "Property key on data records representing the discrete category label.",
      category: "core",
    },
    {
      name: "series",
      type: "readonly PercentStackBarSeries<TData>[]",
      default: "[]",
      required: true,
      description: "Array of two or more additive series definitions composing the category whole.",
      category: "core",
    },
    {
      name: "layout",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      required: false,
      description: 'Orientation layout: "vertical" (categories on X, stacks grow upward to 100%) or "horizontal" (categories on Y, stacks grow rightward).',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "340",
      required: false,
      description: "Chart container height in pixels or CSS dimension string.",
      category: "visual",
    },
    {
      name: "groupGap",
      type: "number",
      default: "20",
      required: false,
      description: "Space between adjacent category stacks along the categorical axis in pixels.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 12, label: "Tight (12px)" },
        { value: 20, label: "Default (20px)" },
        { value: 36, label: "Spacious (36px)" },
      ],
    },
    {
      name: "maxBarSize",
      type: "number",
      default: "48",
      required: false,
      description: "Maximum width/thickness for individual stacked bars in pixels.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 28, label: "Slim (28px)" },
        { value: 48, label: "Default (48px)" },
        { value: 72, label: "Broad (72px)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle reference grid lines at 0%, 25%, 50%, 75%, 100%.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Grid On" },
        { value: false, label: "Grid Off" },
      ],
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the categorical axis (vertical) or percentage scale (horizontal).",
      category: "visual",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the percentage scale (vertical) or categorical axis (horizontal).",
      category: "visual",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the series identity legend.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Legend On" },
        { value: false, label: "Legend Off" },
      ],
    },
    {
      name: "interactiveLegend",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether clicking legend items toggles series visibility. Hiding contributors dynamically renormalizes remaining visible series to 100%.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Interactive" },
        { value: false, label: "Static" },
      ],
    },
    {
      name: "valueLabel",
      type: '"none" | "auto"',
      default: '"none"',
      required: false,
      description: 'Value label rendering mode: "none" or "auto" (render percentage labels inside segments when space permits).',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "None" },
        { value: "auto", label: "Auto" },
      ],
    },
    {
      name: "missingValuePolicy",
      type: '"incomplete" | "zero"',
      default: '"incomplete"',
      required: false,
      description: 'Handling of missing values: "incomplete" marks composition unavailable and suppresses stack geometry; "zero" coerces missing values to 0.',
      category: "advanced",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "incomplete", label: "Incomplete (Default)" },
        { value: "zero", label: "Treat as Zero" },
      ],
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Animation configuration. Automatically disabled under prefers-reduced-motion.",
      category: "advanced",
    },
    {
      name: "percentageFormatter",
      type: "(value: number) => string",
      default: "val => `${val.toFixed(1)}%`",
      required: false,
      description: "Custom formatter function for normalized share percentages.",
      category: "advanced",
    },
    {
      name: "categoryFormatter",
      type: "(category: string | number) => string",
      default: "String(category)",
      required: false,
      description: "Custom formatter function for categorical axis labels.",
      category: "advanced",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "value.toLocaleString()",
      required: false,
      description: "Global fallback formatter function for raw numeric values in tooltips.",
      category: "advanced",
    },
    {
      name: "onActiveChange",
      type: "(active: ActivePercentStackDatum<TData> | null) => void",
      default: "—",
      required: false,
      description: "Callback fired when the active inspected category changes.",
      category: "interaction",
    },
  ],

  examples: [
    {
      id: "subscription-mix",
      title: "Subscription Mix by Segment",
      description: "100% normalized stacked bars comparing subscription plan distribution across customer segments with uneven raw totals.",
      snippet: `<PercentStackBars
  data={[
    { segment: "Startup", monthly: 620, annual: 310, multiYear: 70 },
    { segment: "Growth", monthly: 840, annual: 920, multiYear: 240 },
    { segment: "Enterprise", monthly: 90, annual: 215, multiYear: 195 },
  ]}
  categoryKey="segment"
  series={[
    { key: "monthly", label: "Monthly", color: "var(--chart-1)" },
    { key: "annual", label: "Annual", color: "var(--chart-2)" },
    { key: "multiYear", label: "Multi-year", color: "var(--chart-3)" },
  ]}
/>`,
      props: {
        categoryKey: "segment",
      },
    },
    {
      id: "unequal-totals",
      title: "Same Composition Across Unequal Totals",
      description: "Demonstrating the magnitude-loss rule: two categories with identical 50/30/20 proportions render identical 100% bar geometry despite a 100x difference in raw volume.",
      snippet: `<PercentStackBars
  data={[
    { segment: "Small Cohort (Total: 100)", monthly: 50, annual: 30, multiYear: 20 },
    { segment: "Large Cohort (Total: 10,000)", monthly: 5000, annual: 3000, multiYear: 2000 },
  ]}
  categoryKey="segment"
  series={[
    { key: "monthly", label: "Monthly", color: "var(--chart-1)" },
    { key: "annual", label: "Annual", color: "var(--chart-2)" },
    { key: "multiYear", label: "Multi-year", color: "var(--chart-3)" },
  ]}
/>`,
      props: {
        categoryKey: "segment",
      },
    },
    {
      id: "horizontal-enterprise",
      title: "Horizontal Enterprise Layout",
      description: "Explicit horizontal orientation recommended for lengthy category labels, keeping text unclipped and readable.",
      snippet: `<PercentStackBars
  data={[
    { department: "Enterprise Customer Success", selfService: 28, assisted: 44, dedicated: 28 },
    { department: "Government & Public Sector", selfService: 12, assisted: 36, dedicated: 52 },
    { department: "International Operations", selfService: 40, assisted: 35, dedicated: 25 },
  ]}
  categoryKey="department"
  layout="horizontal"
  height={280}
  series={[
    { key: "selfService", label: "Self-Service", color: "var(--chart-1)" },
    { key: "assisted", label: "Assisted", color: "var(--chart-2)" },
    { key: "dedicated", label: "Dedicated", color: "var(--chart-3)" },
  ]}
/>`,
      props: {
        categoryKey: "department",
        layout: "horizontal",
        height: 280,
      },
    },
    {
      id: "missing-policy",
      title: "Missing Contributor Incomplete State",
      description: "Demonstrating how missing data in a category invalidates composition by default to prevent visual deception.",
      snippet: `<PercentStackBars
  data={[
    { quarter: "Q1", web: 520, mobile: 340, partner: 140 },
    { quarter: "Q2", web: 610, mobile: null, partner: 190 },
    { quarter: "Q3", web: 580, mobile: 390, partner: 230 },
  ]}
  categoryKey="quarter"
  missingValuePolicy="incomplete"
  series={[
    { key: "web", label: "Web", color: "var(--chart-1)" },
    { key: "mobile", label: "Mobile", color: "var(--chart-2)" },
    { key: "partner", label: "Partner", color: "var(--chart-3)" },
  ]}
/>`,
      props: {
        categoryKey: "quarter",
        missingValuePolicy: "incomplete",
      },
    },
    {
      id: "zero-total",
      title: "Zero-Total Category Safety",
      description: "A category where all visible contributors are zero (0+0+0): Plotcn flags the composition unavailable and never invents equal shares.",
      snippet: `<PercentStackBars
  data={[
    { tier: "Free Tier", direct: 450, organic: 350, referral: 200 },
    { tier: "Decommissioned Tier", direct: 0, organic: 0, referral: 0 },
    { tier: "Paid Pro Tier", direct: 280, organic: 520, referral: 200 },
  ]}
  categoryKey="tier"
  series={[
    { key: "direct", label: "Direct", color: "var(--chart-1)" },
    { key: "organic", label: "Organic", color: "var(--chart-2)" },
    { key: "referral", label: "Referral", color: "var(--chart-3)" },
  ]}
/>`,
      props: {
        categoryKey: "tier",
      },
    },
  ],

  responsive: {
    overview:
      "Percent Stack Bars maintains full 100% normalized proportional composition across all screen dimensions down to 320px. Category labels thin adaptively, while all configured series remain visible and truthful without silent removal.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior: "Full category tick density, inline percentage labels where configured, and comprehensive synchronized tooltips.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior: "Adaptive category tick thinning, compact margins, and preserved 44px touch interaction targets.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior: "Strict vertical page scrolling (pan-y), legend wrapped into compact rows, and automatic hiding of inline segment labels to prevent clutter.",
      },
    ],
  },

  animation: {
    overview:
      "Bars rise smoothly from the zero baseline toward 100% on initial mount. Reordering, resizing, theme changes, or color customizations update immediately without replaying animations.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Composition-aware category card displaying all visible contributors in canonical series order with tabular numerals, derived percentage shares, active row emphasis, and truthful raw totals.",
    crosshair:
      "Subtle category-band highlight representing the discrete category currently under pointer or keyboard inspection.",
    legend:
      "Interactive contributor visibility controls that renormalize all remaining visible contributors to 100% with stable color mapping.",
  },

  accessibility: {
    role: "region",
    summary:
      "Percent Stack Bars provides dual-tier accessibility: an interactive SVG region with a single tab stop and arrow keyboard traversal, accompanied by an offscreen structured HTML table disclosing raw measurements alongside derived proportional shares.",
    screenReader:
      "Polite ARIA live region announces category label, each contributor's derived share and raw value, and visible raw total. Zero-total categories announce composition unavailable because the visible total is zero; incomplete categories announce composition unavailable because the category is incomplete.",
    keyboardShortcuts: [
      {
        key: "ArrowLeft / ArrowRight",
        action: "Traverses categories in horizontal X order (vertical layout). Updates live region with category, raw measurements, and derived percentages.",
      },
      {
        key: "ArrowUp / ArrowDown",
        action: "Traverses categories in vertical Y order (horizontal layout).",
      },
      {
        key: "Home / End",
        action: "Jumps focus directly to the first or last categorical record.",
      },
      {
        key: "Escape",
        action: "Dismisses active category inspection and clears focus outlines.",
      },
    ],
    colorIndependence:
      "Consistent canonical stack order, 1px structural segment boundaries, legend labels, and full off-screen HTML data table ensure complete non-color accessibility.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "PercentStackBars",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates contributor normalization, non-negative validation, missing policy resolution, stable color mapping, BarChart rendering, and composition tooltip",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "BarChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates scales, Cartesian grid, stacked Bar geometry with shared stackId='percent', and Tooltip",
          children: [
            {
              name: "CartesianGrid",
              role: "Percentage grid lines",
              description: "Subtle reference lines at 0%, 25%, 50%, 75%, and 100% ticks",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Discrete category labels and fixed 0–100 percentage quantitative scale",
            },
            {
              name: "Bar (repeated per series)",
              role: "Stacked contributor bars",
              description: "Shares stackId='percent'; outermost visible segment receives outer rounded radius; interior segments remain flat with 1px boundaries",
            },
            {
              name: "Tooltip",
              role: "Synchronized composition card",
              description: "Displays category title, canonical contributor rows with tabular numerals and percentages, and raw category total",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/bar-percent-stack.tsx",
        description:
          "Complete Percent Stack Bars component for 100% normalized categorical composition with raw values and legend renormalization",
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
