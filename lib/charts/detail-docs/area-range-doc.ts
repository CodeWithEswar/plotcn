import type { ChartDetailDoc } from "./types"

export const areaRangeDoc: ChartDetailDoc = {
  chartId: "recharts-area-range",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "014 / RECHARTS / AREA / RANGE AREA / PREVIEW",

  quickFacts: {
    bestFor:
      "Visualizing lower and upper envelope bounds across an ordered domain, such as min/max latency, capacity tolerance bands, and uncertainty intervals.",
    dataModel:
      "Ordered observation records containing a horizontal domain key (time, date, sprint) and two numeric metric keys (lowerKey, upperKey) with an optional central value key (valueKey).",
    interaction:
      "Nearest-X horizontal scrubbing with shared tooltip displaying formatted lower/upper interval and optional center value, persistent locked inspection via click or Enter/Space.",
    responsive:
      "Container-driven responsive layout preserving the lower/upper envelope and optional centerline across all viewport widths down to 320px without dropping bounds.",
    animation:
      "Restrained entry path reveals and synchronized centerline drawing; automatic bypass under prefers-reduced-motion.",
    runtime:
      "Recharts ComposedChart SVG combining Area primitive with range tuple dataKey ([lower, upper]), optional Line primitive, CartesianGrid, and custom HTML tooltip.",
  },

  dataFormat: {
    summary:
      "Accepts an ordered array of observation records where each record contains an X-domain coordinate, a lower bound, an upper bound, and an optional centerline value.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing date, timestamp, or ordered category.",
      },
      {
        field: "series.lowerKey",
        type: "string",
        required: true,
        description: "Property key for the lower boundary of the interval envelope.",
      },
      {
        field: "series.upperKey",
        type: "string",
        required: true,
        description: "Property key for the upper boundary of the interval envelope.",
      },
      {
        field: "series.valueKey",
        type: "string",
        required: false,
        description: "Optional property key for the central or expected signal value (e.g. median, mean, target).",
      },
    ],
    nullPolicy:
      "Missing lower or upper bounds truthfully break the envelope band creating a gap. A missing centerline leaves the band intact with a gap in the line. Zero is never substituted for missing bounds.",
    orderingPolicy:
      "Observations must be ordered along the domain. Caller data is never sorted in place or mutated.",
    exampleRows: [
      { time: "10:00", min: 18, max: 26, median: 22 },
      { time: "11:00", min: 19, max: 28, median: 23 },
      { time: "12:00", min: 20, max: 36, median: 28 },
      { time: "13:00", min: 17, max: 29, median: 21 },
      { time: "14:00", min: 18, max: 25, median: 21 },
      { time: "15:00", min: 21, max: 32, median: 25 },
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
      type: "RangeAreaSeries<TData>",
      default: "—",
      required: true,
      description: "Semantic configuration defining lowerKey, upperKey, optional valueKey, and display labels.",
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
      default: '"linear"',
      required: false,
      description: "Curve interpolation algorithm shared identically across the envelope and centerline.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "linear", label: "Linear" },
        { value: "monotone", label: "Monotone" },
        { value: "step", label: "Step" },
      ],
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1)"',
      required: false,
      description: "Primary color for range envelope fill and boundary strokes.",
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
      name: "valueColor",
      type: "string",
      default: '"var(--chart-2)"',
      required: false,
      description: "Color for optional central signal line and center marker.",
      category: "visual",
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.25",
      required: false,
      description: "Opacity of the range envelope fill (0.05 to 1.0).",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.15, label: "0.15 Subtle" },
        { value: 0.25, label: "0.25 Balanced" },
        { value: 0.45, label: "0.45 Solid" },
      ],
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Accent color for the active inspection crosshair and locked pin.",
      category: "visual",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle horizontal Cartesian grid reference lines.",
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
      description: "Whether to render the horizontal category scale.",
      category: "visual",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the vertical value axis.",
      category: "visual",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
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
      name: "animation",
      type: '"draw" | "fade" | "none"',
      default: '"draw"',
      required: false,
      description: "Initial reveal animation style. Bypassed automatically under reduced motion.",
      category: "visual",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "—",
      required: false,
      description: "Custom formatter for range bounds and centerline values in tooltips.",
      category: "visual",
    },
    {
      name: "xFormatter",
      type: "(value: string | number) => string",
      default: "—",
      required: false,
      description: "Custom formatter for horizontal domain tick labels.",
      category: "visual",
    },
    {
      name: "title",
      type: "string",
      default: '"Range Area Chart"',
      required: false,
      description: "Accessible heading announced to screen readers.",
      category: "a11y",
    },
    {
      name: "description",
      type: "string",
      default: "undefined",
      required: false,
      description: "Accessible descriptive summary announced to screen readers.",
      category: "a11y",
    },
  ],

  examples: [
    {
      id: "api-latency",
      title: "API Latency Envelope with Median",
      description:
        "Hourly observed min/max latency bounds with median signal line illustrating typical service operating conditions.",
      snippet: `<RangeArea
  data={latencyData}
  xKey="time"
  series={{
    lowerKey: "min",
    upperKey: "max",
    valueKey: "median",
    label: "Latency envelope",
    lowerLabel: "Min latency",
    upperLabel: "Max latency",
    valueLabel: "Median latency",
  }}
  color="var(--chart-1)"
  valueColor="var(--chart-2)"
  fillOpacity={0.25}
  showGrid
/>`,
      props: { height: 320, showGrid: true },
    },
    {
      id: "range-only",
      title: "Tolerance Envelope Without Centerline",
      description:
        "Pure lower/upper operating envelope demonstrating that a centerline is never midpoint-derived when valueKey is omitted.",
      snippet: `<RangeArea
  data={latencyData}
  xKey="time"
  series={{
    lowerKey: "min",
    upperKey: "max",
    label: "Operating tolerance",
    lowerLabel: "Floor",
    upperLabel: "Ceiling",
  }}
  color="var(--chart-1)"
  fillOpacity={0.3}
  showGrid
/>`,
      props: { height: 320, showGrid: true },
    },
  ],

  responsive: {
    overview:
      "Range Area preserves full lower/upper envelope bounds, active inspection slice, and optional centerline across all device widths down to 320px.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Spacious envelope band, full domain ticks, and multi-line inspection tooltip displaying range span and centerline.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive domain tick thinning, preserved interval geometry, and synchronized nearest-X inspection.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, full interval band without dropping bounds, and compact locked tooltip preventing horizontal page overflow.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance reveal drawing the envelope and optional central signal line synchronously. Never uses bouncing or staggered theatrical waves.",
    duration: "450ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection card showing domain coordinate, formatted range interval (lower – upper), and optional central value.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation coordinate.",
    legend:
      "Optional series identity legend with rectangular envelope fill swatch and centerline swatch.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter/Space, and Escape shortcuts.",
    screenReader:
      "Announces domain coordinate, range envelope bounds (lower to upper), and centerline value when present. Explicitly alerts if bounds are missing or invalid.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation across the domain." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation across the domain." },
      { key: "Home", action: "Jump inspection directly to the first observation." },
      { key: "End", action: "Jump inspection directly to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock persistent inspection at the active coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active inspection tooltip." },
    ],
    colorIndependence:
      "Envelope boundary strokes, distinct fill translucency, formatted tooltip readouts, and off-screen structured data table provide accessible non-color differentiation.",
    reducedMotion:
      "All entrance animations immediately bypass when prefers-reduced-motion is detected in user system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "RangeArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates interval bound validation, missing-bound handling, Recharts ComposedChart rendering, and shared inspection",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "ComposedChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, Cartesian grid, Area range envelope, and Line centerline",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the envelope",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal domain labels and auto-padded vertical scale enclosing all bounds and centerline",
            },
            {
              name: "Area (range envelope)",
              role: "Bounded interval envelope",
              description: "Renders bounded polygon with dataKey='__range' ([lower, upper]), fillOpacity, and connectNulls=false",
            },
            {
              name: "Line (optional centerline)",
              role: "Central signal line",
              description: "Renders central or expected value with dataKey='__value' when valueKey is provided",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays tabular formatted observation values, lower/upper interval, and centerline",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-range.tsx",
        description:
          "Complete Range Area component with bounded envelope geometry, truthful missing-data policies, and interval safety",
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
