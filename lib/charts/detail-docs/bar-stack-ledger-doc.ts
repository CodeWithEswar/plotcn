import type { ChartDetailDoc } from "./types"

export const barStackLedgerDoc: ChartDetailDoc = {
  chartId: "recharts-bar-stack-ledger",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "022",

  quickFacts: {
    bestFor:
      "Additive multi-series categorical composition where individual contributor segments sum into a meaningful category whole, with stable series stacking and total-aware inspection.",
    dataModel: "Categorical records with two or more non-negative additive contributors sharing the same quantitative unit",
    interaction: "Forgiving category band hit testing, synchronized composition tooltip with visible totals, arrow keyboard traversal, and legend visibility toggles",
    responsive: "Container-driven fluid SVG with tick reduction, preserved contributor segments, and touch-action: pan-y mobile scrolling",
    animation: "Restrained baseline-anchored growth animation respecting prefers-reduced-motion without bounce or overshoot",
    runtime: "Idiomatic Recharts SVG with shared stackId, zero per-point DOM overhead, and strict non-negative data safety",
  },

  dataFormat: {
    summary:
      "An array of categorical records containing a discrete category identifier (quarter, month, department, cluster) and two or more additive numeric contributors sharing the same quantitative unit. Contributor order is defined by series configuration, zero is valid, and missing values invalidate the complete category total by default.",
    fields: [
      {
        field: "quarter",
        type: "string | number",
        required: true,
        description: "Discrete category identifier along the categorical axis.",
      },
      {
        field: "compute",
        type: "number | null",
        required: true,
        description: "First additive contributor (e.g. compute cost). Null indicates unrecorded/missing contribution.",
      },
      {
        field: "storage",
        type: "number | null",
        required: true,
        description: "Second additive contributor sharing the same unit and scale.",
      },
      {
        field: "network",
        type: "number | null",
        required: false,
        description: "Third additive contributor completing the category whole.",
      },
    ],
    nullPolicy:
      'Under default missingValuePolicy="incomplete", any missing contributor invalidates the category total and omits stack geometry to avoid visual deception. Tooltips display "Unavailable — incomplete composition". Under explicit "zero" policy, missing values are coerced to 0.',
    orderingPolicy:
      "Category order is strictly caller-preserved. Stack order is strictly defined by the series configuration order and never sorts dynamically by value magnitude.",
    exampleRows: [
      { quarter: "Q1", compute: 48000, storage: 31000, network: 21000 },
      { quarter: "Q2", compute: 54000, storage: 35000, network: 24000 },
      { quarter: "Q3", compute: 51000, storage: 42000, network: 26000 },
      { quarter: "Q4", compute: 62000, storage: 48000, network: 31000 },
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
      description: "Property name on data records identifying discrete categorical stacks.",
      category: "core",
    },
    {
      name: "series",
      type: "readonly StackLedgerSeries<TData>[]",
      default: "—",
      required: true,
      description: "Array of additive contributor series definitions. Array order strictly defines bottom-to-top stack order.",
      category: "core",
    },
    {
      name: "layout",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      required: false,
      description: 'Stack direction: "vertical" puts categories on horizontal X-axis; "horizontal" puts categories on vertical Y-axis for long labels.',
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
      description: "Container height in pixels or CSS dimension string.",
      category: "visual",
    },
    {
      name: "maxBarSize",
      type: "number",
      default: "48",
      required: false,
      description: "Maximum bar thickness in pixels to prevent grotesque column expansion when few categories exist.",
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
      name: "groupGap",
      type: "number",
      default: "20",
      required: false,
      description: "Pixel spacing between distinct category stacks along the categorical axis.",
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
      name: "valueLabel",
      type: '"none" | "total" | "auto"',
      default: '"none"',
      required: false,
      description: 'Value label policy: "none" hides labels; "total" shows outer extent sum; "auto" displays contributor values when space permits.',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "None" },
        { value: "total", label: "Total" },
        { value: "auto", label: "Auto" },
      ],
    },
    {
      name: "missingValuePolicy",
      type: '"incomplete" | "zero"',
      default: '"incomplete"',
      required: false,
      description: 'Missing value handling: "incomplete" omits stack geometry and marks total unavailable; "zero" treats missing values as $0.',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "incomplete", label: "Incomplete (Default)" },
        { value: "zero", label: "Treat as Zero" },
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
      name: "showLegend",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the series legend displaying all configured contributors.",
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
      description: "Whether clicking legend items toggles contributor visibility, updating visible totals with stable color assignment.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Interactive" },
        { value: false, label: "Static" },
      ],
    },
    {
      name: "showTotal",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to compute and display total / visible total in tooltips and accessible screen reader tables.",
      category: "visual",
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Animation toggle or configuration. Automatically bypassed when prefers-reduced-motion is active.",
      category: "advanced",
    },
    {
      name: "categoryFormatter",
      type: "(category: string | number) => string",
      default: "—",
      required: false,
      description: "Custom formatter function for axis ticks and tooltip category titles.",
      category: "advanced",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "—",
      required: false,
      description: "Global numeric formatter function for quantitative values across tooltips and total labels.",
      category: "advanced",
    },
    {
      name: "onActiveChange",
      type: "(active: ActiveStackLedgerDatum<TData> | null) => void",
      default: "—",
      required: false,
      description: "Callback fired when the actively inspected category or contributor changes via pointer, touch, or keyboard.",
      category: "interaction",
    },
  ],

  examples: [
    {
      id: "cloud-cost-composition",
      title: "Cloud Cost Composition (Default Vertical)",
      description:
        "Canonical multi-contributor stacked bar chart showing Compute, Storage, and Network costs composing quarterly cloud budgets with stable series ordering.",
      snippet: `<StackLedgerBars
  data={data}
  categoryKey="quarter"
  series={[
    { key: "compute", label: "Compute", color: "var(--chart-1)" },
    { key: "storage", label: "Storage", color: "var(--chart-2)" },
    { key: "network", label: "Network", color: "var(--chart-3)" },
  ]}
  valueLabel="total"
  showGrid
/>`,
      props: {
        categoryKey: "quarter",
        valueLabel: "total",
        showGrid: true,
      },
    },
    {
      id: "horizontal-enterprise-departments",
      title: "Department Budgets (Horizontal Orientation)",
      description:
        "Horizontal orientation giving ample layout room for lengthy department titles without cramped diagonal typography.",
      snippet: `<StackLedgerBars
  data={data}
  categoryKey="department"
  layout="horizontal"
  series={[
    { key: "personnel", label: "Personnel", color: "var(--chart-1)" },
    { key: "operations", label: "Operations", color: "var(--chart-2)" },
    { key: "r_and_d", label: "R&D", color: "var(--chart-3)" },
  ]}
  height={300}
  maxBarSize={32}
  showGrid
/>`,
      props: {
        categoryKey: "department",
        layout: "horizontal",
        height: 300,
        maxBarSize: 32,
        showGrid: true,
      },
    },
    {
      id: "constant-totals-changing-composition",
      title: "Changing Composition with Constant Totals",
      description:
        "Demonstrates fixed total budget envelopes ($100k) with dramatically shifting internal contributor proportions across quarters.",
      snippet: `<StackLedgerBars
  data={data}
  categoryKey="quarter"
  series={[
    { key: "compute", label: "Compute", color: "var(--chart-1)" },
    { key: "storage", label: "Storage", color: "var(--chart-2)" },
    { key: "network", label: "Network", color: "var(--chart-3)" },
  ]}
  showGrid
  showLegend
/>`,
      props: {
        categoryKey: "quarter",
        showGrid: true,
        showLegend: true,
      },
    },
    {
      id: "missing-contributor-safety",
      title: "Missing Value Handling (Default Incomplete Policy)",
      description:
        "Truthful handling of incomplete composition: missing contributor data omits deceptive partial bar geometry while preserving category band accessibility.",
      snippet: `<StackLedgerBars
  data={dataWithMissing}
  categoryKey="quarter"
  missingValuePolicy="incomplete"
  series={[
    { key: "compute", label: "Compute" },
    { key: "storage", label: "Storage" },
    { key: "network", label: "Network" },
  ]}
  showGrid
/>`,
      props: {
        categoryKey: "quarter",
        missingValuePolicy: "incomplete",
        showGrid: true,
      },
    },
  ],

  responsive: {
    overview:
      "Stack Ledger Bars maintains full additive composition fidelity across all breakpoints down to 320px. Category ticks thin adaptively, while all configured contributor segments and outer totals remain present.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full category tick density, inline total labels, spacious category bands, and comprehensive tooltip cards.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive category tick thinning, compact margins, and preserved 44px touch hit targets.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Thinned ticks, wrapped legend buttons, 44px touch targets, pan-y page scroll preservation, and compact card tooltips.",
      },
    ],
  },

  animation: {
    overview:
      "Bars rise smoothly from the zero baseline on initial mount. Reordering, resizing, theme changes, or color customizations update immediately without replaying animations.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Composition-aware category card displaying all visible contributors in canonical series order with tabular numerals, active row emphasis, and truthful total / visible total summaries.",
    crosshair:
      "Subtle category-band highlight representing the discrete category currently under pointer or keyboard inspection.",
    legend:
      "Interactive contributor visibility controls with stable color mapping and an all-hidden recoverable state.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single tab stop on root figure with orientation-aware arrow navigation (Left/Right for vertical, Up/Down for horizontal), Home/End traversal, polite ARIA live announcements, and full off-screen structured HTML table for assistive devices.",
    screenReader:
      "Announces category name, stack position, total categories, all contributor magnitudes, and resulting category total factually without subjective interpretation.",
    keyboardShortcuts: [
      { key: "ArrowRight / ArrowDown", action: "Inspect next categorical stack across the discrete domain." },
      { key: "ArrowLeft / ArrowUp", action: "Inspect previous categorical stack across the discrete domain." },
      { key: "Home", action: "Jump inspection directly to the first category." },
      { key: "End", action: "Jump inspection directly to the last category." },
      { key: "Escape", action: "Clear active stack inspection." },
    ],
    colorIndependence:
      "Consistent vertical stack order, 1px structural segment boundaries, explicit legend labels, and full off-screen HTML table ensure complete non-color accessibility.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "StackLedgerBars",
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
          description: "Coordinates scales, Cartesian grid, stacked Bar geometry with shared stackId, zero baseline ReferenceLine, and Tooltip",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle reference lines perpendicular to the quantitative axis",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Discrete category labels and zero-anchored quantitative scale enclosing max total",
            },
            {
              name: "ReferenceLine",
              role: "Zero baseline",
              description: "Structural zero baseline reference line anchoring all positive additive stacks",
            },
            {
              name: "Bar (repeated per series)",
              role: "Stacked contributor bars",
              description: "Shares stackId='ledger'; outermost visible segment receives outer rounded radius; interior segments remain flat with 1px boundaries",
            },
            {
              name: "Tooltip",
              role: "Synchronized composition card",
              description: "Displays category title, index, canonical contributor rows with tabular numerals, and category total or visible total",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/bar-stack-ledger.tsx",
        description:
          "Complete Stack Ledger Bars component for additive multi-series category composition with stable contributor identity and total-aware inspection",
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
