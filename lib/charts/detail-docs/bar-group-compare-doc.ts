import type { ChartDetailDoc } from "./types"

export const barGroupCompareDoc: ChartDetailDoc = {
  chartId: "recharts-bar-group-compare",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "021",

  quickFacts: {
    bestFor:
      "Side-by-side peer categorical comparison across two or more measures with stable spatial identity, shared zero-anchored quantitative scaling, and category-centric band inspection.",
    dataModel: "Discrete categorical records with two or more peer numeric series sharing the same unit, domain, and scale",
    interaction: "Category band hit testing, synchronized peer-series tooltip, orientation-aware arrow navigation, Home/End traversal",
    responsive: "Container-driven fluid SVG with tick reduction, preserved peer bars, and touch-action: pan-y mobile scrolling",
    animation: "Restrained 350ms baseline-anchored growth animation respecting prefers-reduced-motion without bounce or overshoot",
    runtime: "Idiomatic Recharts SVG (< 4KB component footprint, single interaction surface, zero per-point DOM overhead)",
  },

  dataFormat: {
    summary:
      "An array of categorical records containing a discrete category identifier (quarter, department, channel) and two or more peer numeric metrics sharing the same quantitative unit and scale. Category order and configured series order are strictly preserved, zero is valid, and missing values reserve their slot without drawing fake bars.",
    fields: [
      {
        field: "quarter",
        type: "string | number",
        required: true,
        description: "Discrete category identifier along the categorical axis.",
      },
      {
        field: "current",
        type: "number | null",
        required: true,
        description: "First quantitative peer measure. Null represents unavailable/unrecorded data.",
      },
      {
        field: "previous",
        type: "number | null",
        required: true,
        description: "Second quantitative peer measure sharing the same unit and scale.",
      },
      {
        field: "target",
        type: "number | null",
        required: false,
        description: "Optional third peer benchmark or reference measure.",
      },
    ],
    nullPolicy:
      'Missing or unrecorded measures remain null and render no visual rectangle. Crucially, the series slot remains reserved so surviving bars never impersonate an absent peer. Category bands remain inspectable and tooltips report "Unavailable".',
    orderingPolicy:
      "Caller category order is strictly preserved. Configured series order remains invariant across all categories regardless of value magnitudes.",
    exampleRows: [
      { quarter: "Q1", current: 184000, previous: 163000, target: 175000 },
      { quarter: "Q2", current: 216000, previous: 191000, target: 200000 },
      { quarter: "Q3", current: 228000, previous: 207000, target: 220000 },
      { quarter: "Q4", current: 252000, previous: 236000, target: 240000 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      description: "Readonly array of categorical records. Caller data is never mutated or reordered.",
      category: "core",
    },
    {
      name: "categoryKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      description: "Property name on data records representing the discrete category domain.",
      category: "core",
    },
    {
      name: "series",
      type: "readonly GroupCompareBarSeries<TData>[]",
      default: "—",
      required: true,
      description: "Array of peer numeric series sharing the same quantitative unit, domain, and scale.",
      category: "core",
    },
    {
      name: "layout",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      required: false,
      description:
        'Orientation of the chart. "vertical" places categories on X with vertical bars; "horizontal" places categories on Y with horizontal bars for long labels.',
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
      description: "Height of the chart container in pixels or valid CSS string.",
      category: "visual",
    },
    {
      name: "domain",
      type: "[number, number]",
      default: "Auto [min <= 0, max >= 0 + 8%]",
      required: false,
      description: "Explicit quantitative domain override. Always anchored at zero by default.",
      category: "visual",
    },
    {
      name: "groupGap",
      type: "number",
      default: "20",
      required: false,
      description: "Pixel gap between discrete category groups (barCategoryGap).",
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
      name: "barGap",
      type: "number",
      default: "4",
      required: false,
      description: "Pixel gap between peer bars within one categorical group.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 2, label: "Tight (2px)" },
        { value: 4, label: "Default (4px)" },
        { value: 8, label: "Spacious (8px)" },
      ],
    },
    {
      name: "maxBarSize",
      type: "number",
      default: "36",
      required: false,
      description: "Maximum quantitative thickness of individual bars in pixels.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 24, label: "Slim (24px)" },
        { value: 36, label: "Default (36px)" },
        { value: 48, label: "Broad (48px)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle dashed reference grid lines.",
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
      description: "Whether to display the categorical or numeric X-axis.",
      category: "visual",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to display the quantitative or categorical Y-axis.",
      category: "visual",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to display the interactive series legend.",
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
      description: "Whether clicking legend items toggles series visibility.",
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
      type: '"none" | "auto" | "always"',
      default: '"none"',
      required: false,
      description: 'Value label rendering mode: "none", "auto" (fit-aware), or "always".',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "None" },
        { value: "auto", label: "Auto" },
        { value: "always", label: "Always" },
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
      description: "Global formatter function for numeric values.",
      category: "advanced",
    },
    {
      name: "onActiveChange",
      type: "(datum: ActiveGroupCompareDatum<TData> | null) => void",
      default: "—",
      required: false,
      description: "Callback fired when active category index or series key changes.",
      category: "interaction",
    },
  ],

  examples: [
    {
      id: "revenue-quarterly",
      title: "Quarterly Revenue Comparison",
      description: "Side-by-side comparison of Current Year vs. Previous Year quarterly performance.",
      snippet: `<GroupCompareBars
  data={[
    { quarter: "Q1", current: 184000, previous: 163000 },
    { quarter: "Q2", current: 216000, previous: 191000 },
    { quarter: "Q3", current: 228000, previous: 207000 },
    { quarter: "Q4", current: 252000, previous: 236000 },
  ]}
  categoryKey="quarter"
  series={[
    { key: "current", label: "Current Year", color: "var(--chart-1)" },
    { key: "previous", label: "Previous Year", color: "var(--chart-2)" },
  ]}
  valueFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"}
/>`,
      props: {
        categoryKey: "quarter",
      },
    },
    {
      id: "channel-signups",
      title: "Signups by Channel (3 Series)",
      description: "Three-way comparison across Web, Mobile, and Partner channels.",
      snippet: `<GroupCompareBars
  data={[
    { month: "Jan", web: 4200, mobile: 5100, partner: 1800 },
    { month: "Feb", web: 4600, mobile: 5400, partner: 2100 },
    { month: "Mar", web: 5100, mobile: 6200, partner: 2400 },
    { month: "Apr", web: 5400, mobile: 6100, partner: 2900 },
  ]}
  categoryKey="month"
  series={[
    { key: "web", label: "Web", color: "var(--chart-1)" },
    { key: "mobile", label: "Mobile", color: "var(--chart-2)" },
    { key: "partner", label: "Partner", color: "var(--chart-3)" },
  ]}
/>`,
      props: {
        categoryKey: "month",
      },
    },
    {
      id: "horizontal-departments",
      title: "Horizontal Enterprise Departments",
      description: "Explicit horizontal orientation recommended for lengthy enterprise labels.",
      snippet: `<GroupCompareBars
  data={[
    { department: "Enterprise Customer Success", headcount2025: 48, headcount2026: 62 },
    { department: "Government & Public Sector", headcount2025: 34, headcount2026: 41 },
    { department: "International Operations", headcount2025: 56, headcount2026: 59 },
    { department: "Platform & Core Systems", headcount2025: 72, headcount2026: 88 },
  ]}
  categoryKey="department"
  layout="horizontal"
  height={300}
  series={[
    { key: "headcount2025", label: "2025 Actual", color: "var(--chart-1)" },
    { key: "headcount2026", label: "2026 Target", color: "var(--chart-2)" },
  ]}
/>`,
      props: {
        categoryKey: "department",
        layout: "horizontal",
        height: 300,
      },
    },
    {
      id: "missing-series-slot",
      title: "Missing Data Slot Reservation",
      description: "Demonstrating how missing data reserves its slot without bar impersonation.",
      snippet: `<GroupCompareBars
  data={[
    { quarter: "Q1", web: 420, mobile: 510, partner: 180 },
    { quarter: "Q2", web: 480, mobile: null, partner: 240 },
    { quarter: "Q3", web: 540, mobile: 630, partner: 290 },
  ]}
  categoryKey="quarter"
  series={[
    { key: "web", label: "Web" },
    { key: "mobile", label: "Mobile" },
    { key: "partner", label: "Partner" },
  ]}
/>`,
      props: {
        categoryKey: "quarter",
      },
    },
    {
      id: "negative-mixed-sign",
      title: "Mixed-Sign Value Comparison",
      description: "Finite negative values extend downward from the shared zero baseline.",
      snippet: `<GroupCompareBars
  data={[
    { region: "North", netGrowth: 18, churnRisk: -6 },
    { region: "South", netGrowth: 24, churnRisk: -4 },
    { region: "East", netGrowth: -8, churnRisk: -14 },
    { region: "West", netGrowth: 12, churnRisk: -9 },
  ]}
  categoryKey="region"
  series={[
    { key: "netGrowth", label: "Net Growth %", color: "var(--chart-1)" },
    { key: "churnRisk", label: "Churn Risk %", color: "var(--chart-5)" },
  ]}
  valueFormatter={(v) => v + "%"}
/>`,
      props: {
        categoryKey: "region",
      },
    },
  ],

  responsive: {
    overview:
      "Group Compare Bars maintains full side-by-side peer comparison fidelity across all breakpoints down to 320px. Category ticks thin adaptively, while all configured peer series remain visible and truthful without silent removal.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full category tick density, inline peer bars with full spacing, and comprehensive synchronized tooltips.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive category tick thinning, compact margins, and preserved 44px touch interaction targets.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Thinned category ticks, wrapped legend buttons, 44px touch targets, vertical page scroll preservation, and compact card tooltips.",
      },
    ],
  },

  animation: {
    overview:
      "Bars rise smoothly from the shared zero baseline on initial mount. Reordering, resizing, theme changes, or color customizations update immediately without replaying entrance animations.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Category-centric card displaying all visible peer series in canonical configuration order with tabular numerals, active series row emphasis, and truthful missing value reporting.",
    crosshair:
      "Subtle category-band highlight representing the discrete category currently under pointer or keyboard inspection.",
    legend:
      "Interactive peer visibility controls with stable color mapping and an all-hidden recoverable state.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single tab stop on root figure with orientation-aware arrow navigation (Left/Right for vertical, Up/Down for horizontal), Home/End traversal, polite ARIA live announcements, and full off-screen structured HTML table for assistive devices.",
    screenReader:
      "Announces category name, group index, total categories, and all peer series values factually without subjective leader/winner assumptions.",
    keyboardShortcuts: [
      { key: "ArrowRight / ArrowDown", action: "Inspect next categorical group across the discrete domain." },
      { key: "ArrowLeft / ArrowUp", action: "Inspect previous categorical group across the discrete domain." },
      { key: "Home", action: "Jump inspection directly to the first category." },
      { key: "End", action: "Jump inspection directly to the last category." },
      { key: "Escape", action: "Clear active group inspection." },
    ],
    colorIndependence:
      "Deterministic horizontal/vertical series slot positions, explicit legend labels, category tooltips, and complete off-screen HTML table ensure complete non-color accessibility even when series share identical hues.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "GroupCompareBars",
      role: "Semantic figure and keyboard navigation entry point",
      description:
        "Coordinates categorical normalization, zero-inclusive domain calculation, stable color resolution, BarChart rendering, and category-centric inspection",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container",
          description: "Manages container aspect ratio, dimensions, and fluid SVG scaling",
          children: [
            {
              name: "BarChart",
              role: "Recharts Cartesian coordinator",
              description: "Coordinates scales, grid, zero baseline ReferenceLine, and peer Bar series",
              children: [
                {
                  name: "CartesianGrid",
                  role: "Reference grid lines",
                  description: "Subtle reference lines perpendicular to the quantitative axis",
                },
                {
                  name: "XAxis & YAxis",
                  role: "Scale coordinates",
                  description: "Discrete category labels and zero-anchored quantitative scale",
                },
                {
                  name: "ReferenceLine",
                  role: "Zero baseline",
                  description: "Structural zero baseline reference line anchoring positive and negative bars",
                },
                {
                  name: "Bar",
                  role: "Peer series bars",
                  description: "Side-by-side quantitative rectangles with outer corner rounding and flat baseline edges",
                },
                {
                  name: "Tooltip",
                  role: "Synchronized category card",
                  description: "Displays category name and all visible peer series values in canonical order",
                },
              ],
            },
          ],
        },
        {
          name: "Legend Toolbar",
          role: "Interactive series controls",
          description: "Accessible toolbar with series color swatches and interactive visibility toggling",
        },
        {
          name: "Screen Reader Table",
          role: "Accessible data alternative",
          description: "Offscreen HTML table providing complete data access for assistive technologies",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/bar-group-compare.tsx",
        description:
          "Complete Group Compare Bars component for side-by-side multi-series categorical comparison with stable series identity",
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
