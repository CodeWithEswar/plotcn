import type { ChartDetailDoc } from "./types"

export const areaComparisonDoc: ChartDetailDoc = {
  chartId: "recharts-area-comparison",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "015 / RECHARTS / AREA / COMPARISON AREA / PREVIEW",

  quickFacts: {
    bestFor:
      "Comparing a primary magnitude against a meaningful reference magnitude across the same ordered domain, using restrained overlap, deterministic role identity, and shared Y-scale.",
    dataModel:
      "Ordered observation records containing a horizontal domain key (month, quarter, time) and two compatible numeric metric keys representing primary and reference series.",
    interaction:
      "Nearest-X horizontal scrubbing with shared tooltip displaying primary value, reference value, and factual delta; persistent locked inspection via click or Enter/Space.",
    responsive:
      "Container-driven responsive layout preserving both comparison series across all viewport widths down to 320px without dropping either role.",
    animation:
      "Restrained synchronized entry reveal; automatically bypassed under prefers-reduced-motion.",
    runtime:
      "Recharts AreaChart SVG combining two overlapping Area primitives, shared CartesianGrid, non-color structural samples in Legend, and custom HTML tooltip.",
  },

  dataFormat: {
    summary:
      "Accepts an ordered array of observation records where each record contains an X-domain coordinate and two compatible numeric quantities measured on the same scale.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing date, timestamp, or ordered category.",
      },
      {
        field: "series.primary.key",
        type: "string",
        required: true,
        description: "Property key for the primary (current / dominant) series magnitude.",
      },
      {
        field: "series.primary.label",
        type: "string",
        required: true,
        description: "Display label for the primary series.",
      },
      {
        field: "series.reference.key",
        type: "string",
        required: true,
        description: "Property key for the reference (benchmark / previous period) series magnitude.",
      },
      {
        field: "series.reference.label",
        type: "string",
        required: true,
        description: "Display label for the reference series.",
      },
    ],
    nullPolicy:
      "Missing observations in either role produce truthful gaps for that role only without affecting the other. Zero is never substituted for missing values.",
    orderingPolicy:
      "Observations must be ordered chronologically or categorically along the domain. Caller data is never sorted in place or mutated.",
    exampleRows: [
      { month: "Jan", current: 125, previous: 110 },
      { month: "Feb", current: 142, previous: 120 },
      { month: "Mar", current: 138, previous: 135 },
      { month: "Apr", current: 165, previous: 140 },
      { month: "May", current: 158, previous: 162 },
      { month: "Jun", current: 184, previous: 155 },
      { month: "Jul", current: 195, previous: 170 },
      { month: "Aug", current: 188, previous: 182 },
      { month: "Sep", current: 210, previous: 190 },
      { month: "Oct", current: 225, previous: 198 },
      { month: "Nov", current: 240, previous: 215 },
      { month: "Dec", current: 265, previous: 230 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      description: "Readonly array of observation records. Caller data is never mutated or sorted in place.",
      category: "core",
    },
    {
      name: "xKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      description: "Property name on data records for horizontal domain coordinates.",
      category: "core",
    },
    {
      name: "series",
      type: "ComparisonAreaSeries<TData>",
      default: "—",
      required: true,
      description: "Explicit semantic configuration defining primary and reference roles.",
      category: "core",
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      description: "Container height in pixels or standard CSS dimension strings.",
      category: "visual",
    },
    {
      name: "curve",
      type: '"linear" | "monotone" | "step"',
      default: '"monotone"',
      required: false,
      description: "Shared interpolation algorithm applied identically to both areas.",
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
      name: "primaryColor",
      type: "string",
      default: '"var(--chart-1)"',
      required: false,
      description: "Color for primary area fill, solid boundary stroke, and legend sample.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "var(--chart-1)", label: "Chart 1 (Default)" },
        { value: "var(--chart-2)", label: "Chart 2" },
        { value: "var(--chart-3)", label: "Chart 3" },
      ],
    },
    {
      name: "referenceColor",
      type: "string",
      default: '"var(--chart-2)"',
      required: false,
      description: "Color for reference area fill, dashed boundary stroke, and legend sample.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "var(--chart-2)", label: "Chart 2 (Default)" },
        { value: "var(--chart-1)", label: "Chart 1" },
        { value: "var(--chart-4)", label: "Chart 4" },
      ],
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Color for active locked inspection crosshair.",
      category: "visual",
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.28",
      required: false,
      description: "Primary area fill opacity (0.05 to 1.0). Reference opacity derives quieter (~0.14).",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.18, label: "0.18 Subtle" },
        { value: 0.28, label: "0.28 Balanced" },
        { value: 0.45, label: "0.45 Strong" },
      ],
    },
    {
      name: "showDelta",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to display factual comparison arithmetic (primary − reference) in the tooltip.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Delta On" },
        { value: false, label: "Delta Off" },
      ],
    },
    {
      name: "deltaType",
      type: '"absolute" | "percentage" | "both"',
      default: '"both"',
      required: false,
      description: "Format for comparison delta readout in the inspection card.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "both", label: "Both (Abs + Pct)" },
        { value: "absolute", label: "Absolute Only" },
        { value: "percentage", label: "Percent Only" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render horizontal Cartesian reference rules.",
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
      description: "Whether to render horizontal category scale ticks.",
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
      default: "true",
      required: false,
      description: "Whether to render the series identity legend with non-color structural samples.",
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
      description: "Enables clicking legend items to toggle role visibility.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Interactive" },
        { value: false, label: "Static" },
      ],
    },
    {
      name: "lockableTooltip",
      type: "boolean",
      default: "true",
      required: false,
      description: "Enables persistent tooltip pinning on click, tap, or Enter/Space.",
      category: "interaction",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Lockable" },
        { value: false, label: "Hover Only" },
      ],
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "connect"',
      default: '"gap"',
      required: false,
      description: "Handling of missing / null values.",
      category: "core",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "v => v.toLocaleString()",
      required: false,
      description: "Custom formatter for metric values and delta readouts.",
      category: "visual",
    },
    {
      name: "xFormatter",
      type: "(value: any) => string",
      default: "—",
      required: false,
      description: "Custom formatter for horizontal domain tick labels.",
      category: "visual",
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Controls entry reveal animations. Automatically bypassed under reduced motion.",
      category: "visual",
    },
    {
      name: "title",
      type: "string",
      default: '"Comparison Area Chart"',
      required: false,
      description: "Accessible heading announced to screen readers.",
      category: "a11y",
    },
    {
      name: "description",
      type: "string",
      default: "—",
      required: false,
      description: "Extended descriptive summary for assistive technologies.",
      category: "a11y",
    },
  ],

  examples: [
    {
      id: "revenue-comparison",
      title: "Monthly Revenue Comparison",
      description:
        "Monthly recurring revenue comparing 2026 (current year) against 2025 (previous year) across identical months.",
      snippet: `<ComparisonArea
  data={revenueData}
  xKey="month"
  series={{
    primary: { key: "current", label: "2026 (Current)" },
    reference: { key: "previous", label: "2025 (Previous)" },
  }}
  primaryColor="var(--chart-1)"
  referenceColor="var(--chart-2)"
  valueFormatter={(v) => \`$\${v.toLocaleString()}k\`}
  showGrid
  showLegend
/>`,
      props: { height: 320, showGrid: true, showLegend: true },
    },
    {
      id: "same-color",
      title: "Same-Color Structural Distinction",
      description:
        "Demonstrates non-color differentiation: even when both series use identical colors, primary (solid border, stronger fill) and reference (dashed border, quieter fill) remain immediately readable.",
      snippet: `<ComparisonArea
  data={revenueData}
  xKey="month"
  series={{
    primary: { key: "current", label: "Current" },
    reference: { key: "previous", label: "Reference" },
  }}
  primaryColor="var(--foreground)"
  referenceColor="var(--foreground)"
  fillOpacity={0.3}
  showGrid
  showLegend
/>`,
      props: {
        height: 320,
        primaryColor: "var(--foreground)",
        referenceColor: "var(--foreground)",
        showGrid: true,
        showLegend: true,
      },
    },
    {
      id: "crossing-series",
      title: "Crossing Trajectories",
      description:
        "Primary and reference series cross multiple times over the domain, validating that restrained opacity preserves legibility throughout intersections without flashy blend modes.",
      snippet: `<ComparisonArea
  data={crossingData}
  xKey="month"
  series={{
    primary: { key: "actual", label: "Actual" },
    reference: { key: "target", label: "Target" },
  }}
  showGrid
  showLegend
/>`,
      props: { height: 320, showGrid: true, showLegend: true },
    },
    {
      id: "missing-observations",
      title: "Independent Missing Values",
      description:
        "Truthful gap rendering when observations are missing in either series. A missing reference leaves the primary intact and marks difference unavailable.",
      snippet: `<ComparisonArea
  data={missingData}
  xKey="month"
  series={{
    primary: { key: "current", label: "Current" },
    reference: { key: "previous", label: "Previous" },
  }}
  missingValuePolicy="gap"
  showGrid
  showLegend
/>`,
      props: { height: 320, missingValuePolicy: "gap", showGrid: true, showLegend: true },
    },
  ],

  responsive: {
    overview:
      "Comparison Area preserves both primary and reference layers, non-color structural samples, and active inspection slice across all device widths down to 320px.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Spacious overlap geometry, full domain ticks, horizontal legend, and comprehensive inspection tooltip with delta readout.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive domain tick thinning, preserved primary/reference hierarchy, and wrapped legend controls.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, full dual-layer area geometry without dropping either role, and compact stacked tooltip preventing horizontal overflow.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance reveal drawing primary and reference areas synchronously. Quantitative geometry never overshoots.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection card showing domain coordinate, primary value, reference value, and factual delta arithmetic.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation coordinate.",
    legend:
      "Interactive series identity legend with solid primary swatch and dashed reference swatch for non-color identification.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter/Space, and Escape shortcuts.",
    screenReader:
      "Announces domain coordinate, primary value, and reference value. Factual arithmetic delta is narrated without good/bad value judgments.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation across the domain." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation across the domain." },
      { key: "Home", action: "Jump inspection directly to the first observation." },
      { key: "End", action: "Jump inspection directly to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock persistent inspection at the active coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active inspection tooltip." },
    ],
    colorIndependence:
      "Primary solid stroke (2px) versus Reference dashed stroke (1.5px, 4 3), opacity attenuation, and structured data table ensure complete non-color accessibility.",
    reducedMotion:
      "All entrance animations immediately bypass when prefers-reduced-motion is detected in user system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "ComparisonArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates primary and reference role validation, shared Y-domain calculation, Recharts AreaChart rendering, and comparison inspection",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates scales, Cartesian grid, reference area, primary area, and shared tooltip",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the area geometry",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal domain labels and auto-padded shared vertical scale enclosing both roles",
            },
            {
              name: "Area (reference)",
              role: "Quieter reference magnitude",
              description: "Rendered first, underneath, with dashed stroke, lower fill opacity, and quieter boundary",
            },
            {
              name: "Area (primary)",
              role: "Dominant primary magnitude",
              description: "Rendered second, on top, with solid stroke, stronger fill opacity, and solid boundary",
            },
            {
              name: "Tooltip",
              role: "Synchronized comparison card",
              description: "Displays primary value, reference value, and factual delta arithmetic",
            },
          ],
        },
        {
          name: "ComparisonAreaLegend",
          role: "Series identity and filter controls",
          description: "Encodes structural differences (solid vs dashed) and supports visibility toggling",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-comparison.tsx",
        description:
          "Complete Comparison Area component with primary/reference roles, restrained overlap, and non-color identity",
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
