import type { ChartDetailDoc } from "./types"

export const barSignalDoc: ChartDetailDoc = {
  chartId: "recharts-bar-signal",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "019",

  quickFacts: {
    bestFor:
      "Discrete categorical comparison across one or more peer quantitative measures with stable caller ordering, truthful zero baseline, and category-centric band inspection.",
    dataModel: "Discrete categorical records with one or more peer numeric series sharing the same unit and scale",
    interaction: "Category band hit testing, synchronized peer-series tooltip, orientation-aware arrow navigation, Home/End traversal",
    responsive: "Container-driven fluid SVG with tick reduction, preserved underlying data bars, and touch-action: pan-y mobile scrolling",
    animation: "Restrained 350ms baseline-anchored growth animation respecting prefers-reduced-motion without bounce or overshoot",
    runtime: "Idiomatic Recharts SVG (< 4KB component footprint, single interaction surface, zero per-point DOM overhead)",
  },

  dataFormat: {
    summary:
      "An array of categorical records containing a discrete category identifier (region, priority, team, tier) and one or more peer numeric metrics sharing the same quantitative unit and scale. Category order is strictly preserved, zero is valid, and missing values render no fake rectangles.",
    fields: [
      {
        field: "region",
        type: "string | number",
        required: true,
        description: "Discrete category identifier along the categorical axis.",
      },
      {
        field: "web",
        type: "number | null",
        required: true,
        description: "First quantitative peer measure. Null represents unavailable/unrecorded data.",
      },
      {
        field: "mobile",
        type: "number | null",
        required: false,
        description: "Second quantitative peer measure sharing the same unit and scale.",
      },
    ],
    nullPolicy:
      'Missing or unrecorded measures remain null and render no visual rectangle. Category bands remain inspectable, tooltips display "Unavailable", and accessible tables report "Unavailable" without zero coercion.',
    orderingPolicy:
      "Caller category order is strictly preserved. No automatic sorting or value-ranking is applied.",
    exampleRows: [
      { region: "North", web: 128400, mobile: 94200 },
      { region: "South", web: 103800, mobile: 121300 },
      { region: "East", web: 87400, mobile: 69800 },
      { region: "West", web: 145100, mobile: 110600 },
      { region: "Central", web: 76200, mobile: 81900 },
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
      type: "readonly SignalBarSeries<TData>[]",
      default: "—",
      required: true,
      description: "Array of peer numeric series sharing the same quantitative unit, domain, and scale.",
      category: "core",
    },
    {
      name: "orientation",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      required: false,
      description: 'Bar direction: "vertical" puts categories on horizontal X-axis; "horizontal" puts categories on vertical Y-axis.',
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
      default: "320",
      required: false,
      description: "Container height in pixels or CSS dimension string.",
      category: "visual",
    },
    {
      name: "maxBarSize",
      type: "number",
      default: "48",
      required: false,
      description: "Maximum bar thickness in pixels to prevent grotesque bar expansion when only 2-3 categories exist.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 24, label: "Slim (24px)" },
        { value: 48, label: "Default (48px)" },
        { value: 72, label: "Broad (72px)" },
      ],
    },
    {
      name: "barGap",
      type: "number",
      default: "4",
      required: false,
      description: "Pixel spacing between peer series bars within the same category group.",
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
      name: "groupGap",
      type: "number",
      default: "16",
      required: false,
      description: "Spacing between distinct category groups along the categorical axis.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 8, label: "Tight (8px)" },
        { value: 16, label: "Default (16px)" },
        { value: 32, label: "Spacious (32px)" },
      ],
    },
    {
      name: "valueLabel",
      type: '"none" | "auto" | "always"',
      default: '"none"',
      required: false,
      description: "Inline numeric value label policy. Auto displays labels when space permits without collision.",
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
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle reference grid lines perpendicular to the quantitative axis.",
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
      description: "Whether to render the horizontal scale ticks and axis line.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Show X-Axis" },
        { value: false, label: "Hide X-Axis" },
      ],
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the vertical scale ticks and axis line.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Show Y-Axis" },
        { value: false, label: "Hide Y-Axis" },
      ],
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "series.length > 1",
      required: false,
      description: "Whether to render the series legend. Automatically enabled for multi-series grouped charts.",
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
      description: "Whether clicking legend items toggles individual series visibility with stable color assignment.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Interactive" },
        { value: false, label: "Static" },
      ],
    },
    {
      name: "cursorMode",
      type: '"category" | "bar"',
      default: '"category"',
      required: false,
      description: "Interaction hit-testing target: category band (forgiving 44px) or individual bar rectangle.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "category", label: "Category Band" },
        { value: "bar", label: "Individual Bar" },
      ],
    },
    {
      name: "tooltipMode",
      type: '"category" | "bar"',
      default: '"category"',
      required: false,
      description: "Tooltip composition: category shows all peer series together; bar shows only the hovered metric.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "category", label: "Category" },
        { value: "bar", label: "Bar" },
      ],
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Animation toggle or configuration. Automatically disabled when prefers-reduced-motion is detected.",
      category: "advanced",
    },
    {
      name: "categoryFormatter",
      type: "(category: string | number) => string",
      default: "—",
      required: false,
      description: "Custom formatter function for axis ticks and tooltip category labels.",
      category: "advanced",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "—",
      required: false,
      description: "Global numeric formatter function for quantitative values across tooltips and value labels.",
      category: "advanced",
    },
    {
      name: "onActiveChange",
      type: "(active: ActiveCategoryDatum<TData> | null) => void",
      default: "—",
      required: false,
      description: "Callback invoked whenever the active inspected category changes via pointer, touch, or keyboard.",
      category: "interaction",
    },
  ],

  examples: [
    {
      id: "grouped-comparison",
      title: "Requests by Region (Grouped Peer Series)",
      description:
        "Canonical multi-series grouped bar chart comparing Web and Mobile traffic across five geographic regions with stable series ordering and shared quantitative scale.",
      snippet: `<SignalBars
  data={data}
  categoryKey="region"
  series={[
    { key: "web", label: "Web", color: "var(--chart-1)" },
    { key: "mobile", label: "Mobile", color: "var(--chart-2)" },
  ]}
  maxBarSize={48}
  showGrid
/>`,
      props: {
        categoryKey: "region",
        maxBarSize: 48,
        showGrid: true,
      },
    },
    {
      id: "single-series",
      title: "Support Tickets by Priority (Single Series)",
      description:
        "Canonical single-series categorical comparison demonstrating truthful zero-anchored magnitude across priority tiers.",
      snippet: `<SignalBars
  data={data}
  categoryKey="priority"
  series={[
    {
      key: "count",
      label: "Tickets",
      color: "var(--chart-1)",
    },
  ]}
  maxBarSize={56}
  showGrid
/>`,
      props: {
        categoryKey: "priority",
        maxBarSize: 56,
        showGrid: true,
      },
    },
    {
      id: "signed-net-change",
      title: "Net Operating Growth (Signed Values)",
      description:
        "Bi-directional bars extending from a common zero baseline, demonstrating positive growth and negative contraction without absolute-value distortion.",
      snippet: `<SignalBars
  data={data}
  categoryKey="region"
  series={[
    {
      key: "netChange",
      label: "Net Growth",
      color: "var(--chart-1)",
    },
  ]}
  maxBarSize={44}
  showGrid
/>`,
      props: {
        categoryKey: "region",
        maxBarSize: 44,
        showGrid: true,
      },
    },
    {
      id: "horizontal-long-labels",
      title: "Enterprise Teams (Horizontal Orientation)",
      description:
        "Horizontal bar orientation providing ample layout width for lengthy categorical labels without cramped diagonal typography.",
      snippet: `<SignalBars
  data={data}
  categoryKey="team"
  orientation="horizontal"
  series={[
    {
      key: "incidents",
      label: "Resolved Incidents",
      color: "var(--chart-1)",
    },
  ]}
  height={280}
  maxBarSize={32}
  showGrid
/>`,
      props: {
        categoryKey: "team",
        orientation: "horizontal",
        height: 280,
        maxBarSize: 32,
        showGrid: true,
      },
    },
  ],

  responsive: {
    overview:
      "Signal Bars preserves all categorical records, zero-anchored geometry, and category band interaction across all screen widths down to 320px, thinning axis tick labels while never dropping underlying data bars.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full category tick density, multi-series legend, spacious category bands, and complete keyboard traversal.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive category tick reduction, compact margins, and preserved 44px touch hit regions.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, thinned ticks, 44px touch targets, pan-y scroll preservation, and multi-series wrapped legend.",
      },
    ],
  },

  animation: {
    overview:
      "Bars animate from the zero baseline on initial appearance without bounce or spring overshoot. Resize and theme updates recompute immediately without replaying animations.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized category inspection card listing all visible peer series in canonical order with tabular numerals and unavailable indicators.",
    crosshair:
      "Subtle background category band highlight indicating the actively inspected categorical record.",
    legend:
      "Interactive peer-series visibility controls with stable color preservation when toggling series.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with orientation-aware arrow navigation (Left/Right for vertical, Up/Down for horizontal), Home/End traversal, and full off-screen structured HTML table for screen readers.",
    screenReader:
      "Announces category name, index position, total categories, and all peer series measurements factually without editorializing.",
    keyboardShortcuts: [
      { key: "ArrowRight / ArrowDown", action: "Inspect next category across the discrete domain." },
      { key: "ArrowLeft / ArrowUp", action: "Inspect previous category across the discrete domain." },
      { key: "Home", action: "Jump inspection directly to the first category." },
      { key: "End", action: "Jump inspection directly to the last category." },
      { key: "Escape", action: "Clear active category inspection." },
    ],
    colorIndependence:
      "Grouped bar positions, distinct legend labels, tabular numbers, and full off-screen structured HTML table ensure non-color accessibility.",
    reducedMotion:
      "All entrance animations are bypassed immediately when prefers-reduced-motion is detected in system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "SignalBars",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates peer series normalization, safe zero-anchored domain calculation, BarChart rendering, category band hit testing, and synchronized tooltip",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "BarChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates scales, Cartesian grid, Bar geometry, zero baseline ReferenceLine, and Tooltip",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle reference lines perpendicular to the quantitative axis",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Discrete category labels and auto-padded quantitative scale anchored at zero",
            },
            {
              name: "ReferenceLine",
              role: "Zero baseline",
              description: "Structural zero baseline reference line anchoring all positive and negative bars",
            },
            {
              name: "Bar",
              role: "Peer series bars",
              description: "Quantitative bar rectangles with grounded baseline edges and subtle outer corner rounding",
            },
            {
              name: "Tooltip",
              role: "Synchronized category card",
              description: "Displays category name, index, and all visible peer series values with tabular numerals",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/bar-signal.tsx",
        description:
          "Complete Signal Bars component for discrete categorical comparison with grouped peer series and category band inspection",
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

