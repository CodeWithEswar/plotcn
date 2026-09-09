import type { ChartDetailDoc } from "./types"

export const barInteractiveDoc: ChartDetailDoc = {
  chartId: "recharts-bar-interactive",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "028",

  quickFacts: {
    bestFor:
      "Deliberate multi-series categorical inspection across desktop pointer hover, persistent mobile touch lock, and single-tab-stop keyboard navigation.",
    dataModel: "Categorical observations with one or more peer numeric series sharing identical quantitative units",
    interaction: "Category band hit testing, persistent touch/click lock, single-tab-stop arrow traversal, Esc to unlock",
    responsive: "Container-driven fluid SVG supporting both vertical grouped bars and horizontal scorecard rows down to 320px",
    animation: "Restrained baseline-anchored bar entry; immediate discrete category snapping without spring jitter",
    runtime: "Idiomatic Recharts SVG with controlled band cursor, category-centric tooltip, and zero external gesture runtimes",
  },

  dataFormat: {
    summary:
      "An array of categorical records with discrete category identifiers and one or more numeric peer measures. Caller order is strictly preserved without auto-sorting.",
    fields: [
      {
        field: "quarter",
        type: "string | number",
        required: true,
        description: "Discrete category label along the categorical axis.",
      },
      {
        field: "product",
        type: "number | null",
        required: true,
        description: "Primary peer numeric series measure. Null represents missing observation.",
      },
      {
        field: "services",
        type: "number | null",
        required: false,
        description: "Secondary peer numeric series measure.",
      },
      {
        field: "enterprise",
        type: "number | null",
        required: false,
        description: "Tertiary peer numeric series measure.",
      },
    ],
    nullPolicy:
      'Missing or null series values are rendered without geometry and reported truthfully in tooltips as "Unavailable" without fake zero-substitution.',
    orderingPolicy:
      "Category order and series array order are strictly caller-preserved.",
    exampleRows: [
      { quarter: "Q1", product: 82, services: 54, enterprise: 38 },
      { quarter: "Q2", product: 96, services: 61, enterprise: 44 },
      { quarter: "Q3", product: 88, services: 67, enterprise: 52 },
      { quarter: "Q4", product: 104, services: 72, enterprise: 58 },
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
      type: "readonly InteractiveBarSeries<TData>[]",
      default: "—",
      required: true,
      description: "One or more peer numeric series definitions specifying key, label, and formatters.",
      category: "core",
    },
    {
      name: "layout",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      required: false,
      description: "Layout orientation: vertical (default) puts categories on X, horizontal puts categories on Y.",
      category: "core",
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
      description: "Container height in pixels or CSS height string.",
      category: "core",
    },
    {
      name: "domain",
      type: '[number, number] | "auto"',
      default: '"auto"',
      required: false,
      description: "Quantitative domain policy. Defaults to zero-anchored extent covering all series values.",
      category: "core",
    },
    {
      name: "cursorMode",
      type: '"band-and-bar" | "band"',
      default: '"band-and-bar"',
      required: false,
      description: "Cursor highlighting policy: full category band only or band plus active bar emphasis.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Band & Bar", value: "band-and-bar" },
        { label: "Band Only", value: "band" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle background Cartesian gridlines.",
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
      description: "Whether to display the structural series legend.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    {
      name: "interactiveLegend",
      type: "boolean",
      default: "false",
      required: false,
      description: "Whether clicking legend items toggles series visibility.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Interactive", value: true },
        { label: "Static", value: false },
      ],
    },
    {
      name: "valueLabel",
      type: '"none" | "auto"',
      default: '"none"',
      required: false,
      description: "Display mode for permanent numeric value labels.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "None", value: "none" },
        { label: "Auto", value: "auto" },
      ],
    },
    {
      name: "lockOnClick",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether mouse clicks establish a persistent inspection lock.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false },
      ],
    },
    {
      name: "lockOnTouch",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether touch taps establish a persistent inspection lock.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false },
      ],
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Animation toggle honoring prefers-reduced-motion.",
      category: "advanced",
    },
  ],

  examples: [
    {
      id: "revenue-mix-demo",
      title: "Quarterly Revenue Mix",
      description: "Three peer revenue streams compared across four quarters with persistent touch lock.",
      snippet: `<InteractiveBars
  data={[
    { quarter: "Q1", product: 82, services: 54, enterprise: 38 },
    { quarter: "Q2", product: 96, services: 61, enterprise: 44 },
    { quarter: "Q3", product: 88, services: 67, enterprise: 52 },
    { quarter: "Q4", product: 104, services: 72, enterprise: 58 },
  ]}
  categoryKey="quarter"
  series={[
    { key: "product", label: "Product", valueFormatter: (v) => \`$\${v}M\` },
    { key: "services", label: "Services", valueFormatter: (v) => \`$\${v}M\` },
    { key: "enterprise", label: "Enterprise", valueFormatter: (v) => \`$\${v}M\` },
  ]}
  showLegend
/>`,
      props: {
        showLegend: true,
      },
    },
    {
      id: "zero-tiny-inspection",
      title: "Zero and Micro Value Inspection",
      description: "Proves that zero and tiny bars remain 100% inspectable without artificial geometry distortion.",
      snippet: `<InteractiveBars
  data={[
    { category: "Item A", val1: 0, val2: 45 },
    { category: "Item B", val1: 0.001, val2: 80 },
    { category: "Item C", val1: 65, val2: 0 },
    { category: "Item D", val1: 95, val2: 110 },
  ]}
  categoryKey="category"
  series={[
    { key: "val1", label: "Primary", valueFormatter: (v) => \`$\${v}\` },
    { key: "val2", label: "Secondary", valueFormatter: (v) => \`$\${v}\` },
  ]}
  showLegend
/>`,
      props: {
        showLegend: true,
      },
    },
    {
      id: "missing-series-handling",
      title: "Missing Observations",
      description: "Demonstrates that missing records are omitted without fake zero-substitution and reported truthfully.",
      snippet: `<InteractiveBars
  data={[
    { quarter: "Q1", web: 120, mobile: 80 },
    { quarter: "Q2", web: 140, mobile: null },
    { quarter: "Q3", web: 165, mobile: 110 },
    { quarter: "Q4", web: null, mobile: 130 },
  ]}
  categoryKey="quarter"
  series={[
    { key: "web", label: "Web Requests" },
    { key: "mobile", label: "Mobile Requests" },
  ]}
  showLegend
/>`,
      props: {
        showLegend: true,
      },
    },
    {
      id: "horizontal-benchmarks",
      title: "Horizontal Team Benchmarks",
      description: "Horizontal orientation for long category labels and compact mobile screens.",
      snippet: `<InteractiveBars
  data={[
    { team: "Core Infrastructure", p95: 42, p99: 88 },
    { team: "Payments & Invoicing", p95: 65, p99: 124 },
    { team: "Identity & Security", p95: 28, p99: 55 },
    { team: "Search & Retrieval", p95: 52, p99: 94 },
  ]}
  categoryKey="team"
  series={[
    { key: "p95", label: "p95 Latency", valueFormatter: (v) => \`\${v}ms\` },
    { key: "p99", label: "p99 Latency", valueFormatter: (v) => \`\${v}ms\` },
  ]}
  layout="horizontal"
  showLegend
/>`,
      props: {
        layout: "horizontal",
        showLegend: true,
      },
    },
  ],

  responsive: {
    overview:
      "Container-driven responsiveness. Preserves category hit targets, full category bands, persistent inspection lock, and exact tooltips down to 320px mobile viewports without blocking native vertical scrolling.",
    breakpoints: [
      {
        name: "Mobile Compact",
        width: "< 440px",
        behavior:
          "Category bands maintain generous touch targets; quantitative tick count is thinned accessibly; legend wraps cleanly.",
      },
      {
        name: "Tablet / Medium",
        width: "440px – 768px",
        behavior:
          "Full category band hit regions allow comfortable touch activation and tap-to-lock inspection of all peer series.",
      },
      {
        name: "Desktop Expanded",
        width: "> 768px",
        behavior:
          "Full layout displaying subtle Cartesian gridlines, hover cursor bands, exact series rectangle emphasis, and multi-series tooltip cards.",
      },
    ],
  },

  animation: {
    overview:
      "Initial entrance animation is restrained and non-distorting. Category band cursor and lock transitions use instant or subtle opacity motion without layout bounce.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Controlled category-first tooltip disclosing all visible peer series in canonical order, distinguishing zero from missing observations, with lock indicator badge.",
    crosshair:
      "Restrained category band cursor highlighting the entire category group rather than a single thin line, ensuring zero and tiny bars remain easily inspectable.",
    legend:
      "Optional interactive legend supporting individual series toggling without recoloring remaining series or resetting the locked category.",
  },

  accessibility: {
    role: "region",
    summary:
      "Accessible categorical bar chart with single tab stop, orientation-specific arrow-key traversal, Home/End navigation, Enter/Space persistent lock, Escape unlock, polite live region announcements, and offscreen structured HTML table.",
    screenReader:
      "Announces category name, category index of total, and exact values for all peer series factually, including explicit 'Unavailable' announcements for missing records.",
    keyboardShortcuts: [
      { key: "ArrowRight / ArrowLeft", action: "Traverse categories in vertical layout" },
      { key: "ArrowDown / ArrowUp", action: "Traverse categories in horizontal layout" },
      { key: "Home", action: "Jump focus to the first category" },
      { key: "End", action: "Jump focus to the last category" },
      { key: "Enter / Space", action: "Toggle persistent inspection lock on active category" },
      { key: "Escape", action: "Unlock inspection and dismiss tooltip" },
    ],
    colorIndependence:
      "Series identity is reinforced through grouped bar positions, tooltip labels, legend marks, and structured table data, remaining fully functional in monochrome.",
    reducedMotion:
      "All entrance transitions and cursor animations are suppressed when prefers-reduced-motion is enabled.",
  },

  sourceAnatomy: {
    tree: {
      name: "InteractiveBars",
      role: "Semantic figure and interaction coordinator",
      description:
        "Normalizes multi-series data, manages active/locked state machine, resolves truthful domain with zero baseline, handles keyboard/touch navigation, and renders Recharts BarChart with controlled tooltip.",
      children: [
        {
          name: "ChartContainer",
          role: "Container query wrapper",
          description: "Provides responsive sizing and theme token scope",
          children: [
            {
              name: "ResponsiveContainer",
              role: "Fluid SVG canvas coordinator",
              description: "Measures container dimensions and passes them to BarChart",
              children: [
                {
                  name: "BarChart",
                  role: "Cartesian chart coordinator",
                  description: "Coordinates categorical and quantitative scales and grouped bar geometry",
                  children: [
                    {
                      name: "CartesianGrid",
                      role: "Reference grid lines",
                      description: "Subtle dashed grid lines perpendicular to the numeric axis",
                    },
                    {
                      name: "XAxis / YAxis",
                      role: "Scale axes",
                      description: "Discrete category axis and continuous quantitative axis",
                    },
                    {
                      name: "Tooltip + CategoryBandCursor",
                      role: "Category inspection overlay",
                      description: "Category band cursor with persistent lock styling and controlled series readout",
                    },
                    {
                      name: "Bar[]",
                      role: "Grouped peer bars",
                      description: "Renders rectangles for each visible series with active emphasis stroke",
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
        path: "registry/recharts/bar-interactive.tsx",
        description:
          "Complete InteractiveBars component with state reducer, category-band cursor, touch lock, single-tab keyboard traversal, and accessible table.",
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
