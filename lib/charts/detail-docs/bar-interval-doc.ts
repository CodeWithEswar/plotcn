import type { ChartDetailDoc } from "./types"

export const barIntervalDoc: ChartDetailDoc = {
  chartId: "recharts-bar-interval",
  engine: "recharts",
  category: "bar",
  renderer: "svg",
  status: "preview",
  blueprint: "027",

  quickFacts: {
    bestFor:
      "Schedules, maintenance windows, operating durations, and bounded numeric or temporal ranges where start and end positions are both first-class data.",
    dataModel: "Categorical observations with explicit start and end bounds along a continuous scale",
    interaction: "Category band hit testing, synchronized tooltip with start, end, and duration, keyboard traversal",
    responsive: "Container-driven fluid SVG defaulting to horizontal rows with ample category label room down to 320px",
    animation: "Restrained geometry fade without misleading zero-origin bar growth",
    runtime: "Idiomatic Recharts SVG with floating range bars, custom zero-width markers, and zero external temporal libraries",
  },

  dataFormat: {
    summary:
      "An array of categorical records with discrete category identifiers and explicit numeric or epoch timestamp start and end bounds. Plotcn immutably derives span as end minus start without defaulting either bound to zero.",
    fields: [
      {
        field: "service",
        type: "string | number",
        required: true,
        description: "Discrete category label along the categorical axis.",
      },
      {
        field: "start",
        type: "number | null",
        required: true,
        description: "Initial boundary coordinate along the continuous domain. Null indicates missing bound.",
      },
      {
        field: "end",
        type: "number | null",
        required: true,
        description: "Terminal boundary coordinate along the continuous domain. Null indicates missing bound.",
      },
    ],
    nullPolicy:
      'A valid interval requires both start and end to be finite numbers. If either is missing, the interval is reported as "Unavailable" without fake zero or current-time substitution.',
    orderingPolicy:
      "Category order is strictly caller-preserved. Interval Bars does not automatically sort or rank categories.",
    exampleRows: [
      { service: "Authentication", start: 9.0, end: 10.5 },
      { service: "Payments API", start: 10.0, end: 12.25 },
      { service: "Notifications", start: 8.5, end: 9.75 },
      { service: "Analytics Engine", start: 11.0, end: 13.0 },
      { service: "Data Exporter", start: 12.25, end: 14.0 },
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
      type: "IntervalBarSeries<TData>",
      default: "—",
      required: true,
      description: "Series definition specifying startKey, endKey, label, and optional formatters.",
      category: "core",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      required: false,
      description: "Layout orientation: horizontal (default) extends bars left-to-right, vertical extends bottom-to-top.",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Horizontal", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
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
      description: "Quantitative domain policy. Defaults to bounds-driven extent covering observed starts and ends.",
      category: "core",
    },
    {
      name: "color",
      type: "string",
      default: "var(--chart-1)",
      required: false,
      description: "Fill color for interval bars.",
      category: "visual",
    },
    {
      name: "selectionColor",
      type: "string",
      default: "var(--chart-selection)",
      required: false,
      description: "Stroke color for the active or keyboard-focused category row.",
      category: "visual",
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
      name: "valueLabel",
      type: '"none" | "span" | "bounds" | "auto"',
      default: '"none"',
      required: false,
      description: "Display mode for permanent numeric labels.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "None", value: "none" },
        { label: "Span", value: "span" },
        { label: "Bounds", value: "bounds" },
      ],
    },
    {
      name: "tooltipMode",
      type: '"bounds" | "bounds-and-span"',
      default: '"bounds-and-span"',
      required: false,
      description: 'Tooltip depth mode: "bounds-and-span" discloses start, end, and duration.',
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { label: "Bounds & Span", value: "bounds-and-span" },
        { label: "Bounds", value: "bounds" },
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
      id: "basic-maintenance-schedule",
      title: "Service Maintenance Windows",
      description: "Standard horizontal interval chart showing scheduled operational maintenance windows.",
      snippet: `<IntervalBars
  data={[
    { service: "Authentication", start: 9.0, end: 10.5 },
    { service: "Payments API", start: 10.0, end: 12.25 },
    { service: "Notifications", start: 8.5, end: 9.75 },
    { service: "Analytics Engine", start: 11.0, end: 13.0 },
    { service: "Data Exporter", start: 12.25, end: 14.0 },
  ]}
  categoryKey="service"
  series={{
    startKey: "start",
    endKey: "end",
    label: "Maintenance Window",
    startLabel: "Start Time",
    endLabel: "End Time",
    spanLabel: "Duration",
    valueFormatter: (h) => \`\${Math.floor(h).toString().padStart(2, "0")}:\${((h % 1) * 60).toString().padStart(2, "0")}\`,
    spanFormatter: (span) => \`\${Math.floor(span)}h \${(span % 1) * 60}m\`,
  }}
/>`,
      props: {
        categoryKey: "service",
        series: {
          startKey: "start",
          endKey: "end",
          label: "Maintenance Window",
        },
      },
    },
    {
      id: "operating-temperatures-vertical",
      title: "Operating Temperature Windows (Vertical)",
      description: "Vertical orientation showing min/max operating thermal ranges across server zones.",
      snippet: `<IntervalBars
  data={[
    { zone: "Zone A - Core Compute", start: 18, end: 24 },
    { zone: "Zone B - High-Density GPU", start: 20, end: 29 },
    { zone: "Zone C - Cold Storage", start: 15, end: 21 },
    { zone: "Zone D - Network Fabric", start: 22, end: 27 },
  ]}
  categoryKey="zone"
  orientation="vertical"
  series={{
    startKey: "start",
    endKey: "end",
    label: "Operating Temperature",
    startLabel: "Min Temp",
    endLabel: "Max Temp",
    spanLabel: "Thermal Range",
    valueFormatter: (v) => \`\${v}°C\`,
    spanFormatter: (s) => \`\${s}°C delta\`,
  }}
/>`,
      props: {
        categoryKey: "zone",
        orientation: "vertical",
        series: {
          startKey: "start",
          endKey: "end",
          label: "Operating Temperature",
        },
      },
    },
  ],

  responsive: {
    overview:
      "IntervalBars uses container-driven geometry via ResizeObserver and SVG coordinate scaling. Horizontal layout reserves dedicated category label space, ensuring long names never compress the plotting area.",
    breakpoints: [
      {
        name: "Mobile Compact",
        width: "< 440px",
        behavior:
          "Horizontal layout allows long category titles to remain legible; tick frequency on the time/numeric axis is thinned accessibly.",
      },
      {
        name: "Tablet / Split",
        width: "440px – 768px",
        behavior:
          "Full category band hit regions allow comfortable touch activation of short, zero-width, or narrow intervals.",
      },
      {
        name: "Desktop Expanded",
        width: "> 768px",
        behavior:
          "Full layout displaying Cartesian gridlines, hover cursor bands, and detailed start/end/duration tooltip cards.",
      },
    ],
  },

  animation: {
    overview:
      "Interval bars animate with a restrained entrance transition without misleading growth from zero. Position and span are preserved truthfully.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Container-clamped card disclosing discrete category, start bound, end bound, and derived duration/span.",
    crosshair:
      "Full category band highlight ensuring zero-width and short intervals remain interactive under pointer and keyboard inspection.",
    legend:
      "Structural legend identifying the interval series and zero-width marker tick representation.",
  },

  accessibility: {
    role: "region",
    summary:
      "Semantic figure region with single tab stop, orientation-specific arrow-key traversal, Home/End navigation, polite ARIA announcements, and an offscreen structured HTML table disclosing start, end, and duration values.",
    screenReader:
      "Announces category name, start bound, end bound, and derived duration span factually without assuming operational delays or conflicts.",
    keyboardShortcuts: [
      { key: "ArrowDown / ArrowUp", action: "Traverse categories in horizontal orientation" },
      { key: "ArrowRight / ArrowLeft", action: "Traverse categories in vertical orientation" },
      { key: "Home", action: "Jump focus to the first category" },
      { key: "End", action: "Jump focus to the last category" },
      { key: "Escape", action: "Clear active category inspection" },
    ],
    colorIndependence:
      "Interval ranges are encoded primarily through spatial geometry along the continuous axis. Color identifies the series, not start versus end.",
    reducedMotion:
      "All initial entrance animations are bypassed immediately when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "IntervalBars",
      role: "Semantic figure and interval coordinator",
      description:
        "Validates start and end bounds, derives span, enforces bounds-driven domain, renders Recharts BarChart, and outputs offscreen table.",
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
                  description: "Coordinates quantitative/temporal scale and floating interval geometry",
                  children: [
                    {
                      name: "CartesianGrid",
                      role: "Reference grid lines",
                      description: "Subtle dashed grid perpendicular to the quantitative axis",
                    },
                    {
                      name: "XAxis / YAxis",
                      role: "Scale axes",
                      description: "Continuous quantitative/temporal axis and discrete categorical axis",
                    },
                    {
                      name: "Bar + IntervalBarShape",
                      role: "Floating interval geometry",
                      description: "Renders floating bars with outer rounded radii and crisp zero-width markers",
                    },
                    {
                      name: "Tooltip",
                      role: "Synchronized analytical card",
                      description: "Container-clamped tooltip displaying category, start, end, and duration",
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
        path: "registry/recharts/bar-interval.tsx",
        description:
          "Complete IntervalBars component with pairwise bounds validation, bounds-driven domain, custom floating shape, and accessible table.",
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
