import type { ChartDetailDoc } from "./types"

export const areaInteractiveDoc: ChartDetailDoc = {
  chartId: "recharts-area-interactive",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "018",

  quickFacts: {
    bestFor:
      "Exact observation inspection along an ordered domain with nearest-X pointer scrubbing, observation-aligned crosshair, keyboard navigation, and persistent locking.",
    dataModel: "Single quantitative series over an ordered Cartesian domain (dates, timestamps, categories)",
    interaction: "Nearest-X snapping, neutral crosshair, Enter/Space/click lock, Escape unlock, arrow key traversal",
    responsive: "Container-driven fluid SVG with preserved hit surface and touch-action: pan-y mobile scrolling",
    animation: "Restrained 350ms entrance animation with immediate non-overshooting inspection positioning",
    runtime: "Recharts SVG (< 4KB component footprint, single interaction surface, zero per-point DOM overhead)",
  },

  dataFormat: {
    summary:
      "A sequential array of observation records with an ordered domain key (date, timestamp, day) and a single quantitative metric key. Missing observations are preserved in the domain and report as unavailable without zero coercion.",
    fields: [
      {
        field: "date",
        type: "string | Date",
        required: true,
        description: "Chronological or ordered domain coordinate along the horizontal axis.",
      },
      {
        field: "requests",
        type: "number | null",
        required: true,
        description: "Observed quantitative metric value. Non-finite values are normalized safely.",
      },
    ],
    nullPolicy:
      'Missing or unrecorded observations remain fully inspectable along the domain under missingValuePolicy="gap". The crosshair snaps to the date, no fake marker dot is drawn, and tooltip reports "—" or "Unavailable".',
    orderingPolicy:
      "Observations must be ordered along the horizontal domain for deterministic nearest-X lookup and faithful area geometry.",
    exampleRows: [
      { date: "May 01", requests: 12400 },
      { date: "May 04", requests: 14200 },
      { date: "May 08", requests: 11900 },
      { date: "May 12", requests: 16800 },
      { date: "May 16", requests: 18500 },
      { date: "May 20", requests: null },
      { date: "May 24", requests: 19800 },
      { date: "May 28", requests: 23400 },
      { date: "May 31", requests: 26100 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      description: "Readonly array of observation records. Caller data is never mutated or reordered.",
      category: "core",
    },
    {
      name: "xKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      description: "Property name on data records representing the horizontal domain coordinate.",
      category: "core",
    },
    {
      name: "series",
      type: "InteractiveAreaSeries<TData>",
      default: "—",
      required: true,
      description: "Single quantitative series configuration defining metric key, label, and valueFormatter.",
      category: "core",
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #3b82f6)"',
      required: false,
      description: "Primary stroke color, area fill, active marker point, and tooltip dot.",
      category: "visual",
      previewable: true,
      controlType: "color",
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection, #f59e0b)"',
      required: false,
      description: "Accent color for persistent locked marker ring, locked tooltip badge, and locked crosshair.",
      category: "visual",
      previewable: true,
      controlType: "color",
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.22",
      required: false,
      description: "Fill opacity for the occupied area polygon below the signal curve.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.15, label: "0.15 (Subtle)" },
        { value: 0.22, label: "0.22 (Standard)" },
        { value: 0.4, label: "0.40 (Prominent)" },
      ],
    },
    {
      name: "curve",
      type: '"monotone" | "linear" | "step"',
      default: '"monotone"',
      required: false,
      description: "Curve interpolation algorithm for the continuous area boundary stroke.",
      category: "visual",
      previewable: true,
      controlType: "select",
      controlOptions: [
        { value: "monotone", label: "Monotone (Smooth)" },
        { value: "linear", label: "Linear (Straight)" },
        { value: "step", label: "Step (Stepped)" },
      ],
    },
    {
      name: "baseline",
      type: 'number | "zero" | "domain-min"',
      default: '"zero"',
      required: false,
      description: "Baseline anchor for the area polygon baseValue.",
      category: "core",
      previewable: true,
      controlType: "select",
      controlOptions: [
        { value: "zero", label: "Zero (y = 0)" },
        { value: "domain-min", label: "Domain Minimum" },
      ],
    },
    {
      name: "domain",
      type: '[number, number] | "auto"',
      default: '"auto"',
      required: false,
      description: "Explicit vertical Y-axis scale bounds, or automatic padding computation.",
      category: "core",
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      description: "Visual container height in pixels or CSS dimension string.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 260, label: "260px" },
        { value: 320, label: "320px" },
        { value: 380, label: "380px" },
      ],
    },
    {
      name: "lockable",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether clicking or pressing Enter/Space locks the currently inspected observation.",
      category: "interaction",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "defaultLockedIndex",
      type: "number | null",
      default: "null",
      required: false,
      description: "Initial observation index to pin/lock on mount.",
      category: "interaction",
    },
    {
      name: "initialFocus",
      type: '"none" | "first" | "last"',
      default: '"none"',
      required: false,
      description: "Initial inspection position upon keyboard focus entry into the chart.",
      category: "interaction",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "carry" | "connect"',
      default: '"gap"',
      required: false,
      description: "Truthful handling of null/undefined observations. Under gap, missing points remain inspectable without area fill.",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Truthful Break)" },
        { value: "carry", label: "Carry (Last Known)" },
        { value: "connect", label: "Connect (Bridge)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render subtle horizontal background reference gridlines.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the horizontal category scale ticks and domain labels.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the vertical numeric scale ticks and metric values.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      description: "Whether to render the single-series identity legend.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "onActiveChange",
      type: "(active: ActiveDatum | null, index: number | null) => void",
      default: "—",
      required: false,
      description: "Callback fired whenever the active inspected observation changes.",
      category: "interaction",
    },
    {
      name: "onLockChange",
      type: "(locked: ActiveDatum | null, index: number | null) => void",
      default: "—",
      required: false,
      description: "Callback fired whenever the persistent locked observation changes.",
      category: "interaction",
    },
    {
      name: "title",
      type: "string",
      default: "—",
      required: false,
      description: "Accessible name announced to assistive technologies.",
      category: "a11y",
    },
    {
      name: "description",
      type: "string",
      default: "—",
      required: false,
      description: "Detailed descriptive summary announced to assistive technologies.",
      category: "a11y",
    },
  ],

  examples: [
    {
      id: "basic",
      title: "Basic Inspection",
      description: "Pointer scrub along the timeline, snapping crosshair to observations with synchronized tooltips.",
      snippet: `<InteractiveArea
  data={data}
  xKey="date"
  series={{
    key: "requests",
    label: "API Requests",
  }}
/>`,
      props: {
        showGrid: true,
      },
    },
    {
      id: "locked",
      title: "Persistent Locked Tooltip",
      description: "Click or press Enter to pin the observation. Pointer movement no longer drifts the tooltip.",
      snippet: `<InteractiveArea
  data={data}
  xKey="date"
  series={{
    key: "requests",
    label: "API Requests",
  }}
  defaultLockedIndex={4}
  selectionColor="var(--chart-selection)"
/>`,
      props: {
        defaultLockedIndex: 4,
        selectionColor: "var(--chart-selection)",
        showGrid: true,
      },
    },
    {
      id: "missing-observation",
      title: "Missing Observation Handling",
      description: "Unrecorded observations exist in the domain and report as unavailable without synthetic values.",
      snippet: `<InteractiveArea
  data={[
    { date: "May 01", requests: 120 },
    { date: "May 02", requests: null },
    { date: "May 03", requests: 180 },
  ]}
  xKey="date"
  series={{ key: "requests", label: "Requests" }}
  missingValuePolicy="gap"
/>`,
      props: {
        missingValuePolicy: "gap",
        showGrid: true,
      },
    },
    {
      id: "custom-colors",
      title: "Custom Series and Selection Theming",
      description: "Independent series color for the area fill and selectionColor for the locked double ring.",
      snippet: `<InteractiveArea
  data={data}
  xKey="date"
  series={{ key: "requests", label: "Requests" }}
  color="#3b82f6"
  selectionColor="#f59e0b"
/>`,
      props: {
        color: "#3b82f6",
        selectionColor: "#f59e0b",
        showGrid: true,
      },
    },
  ],

  responsive: {
    overview:
      "Interactive Area preserves the full inspection hit surface, nearest-X resolution, observation-aligned crosshair, and persistent lock state across all viewport dimensions down to 320px.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Spacious Cartesian grid, full domain tick density, observation-aligned crosshair, anchored inspection card, and complete keyboard shortcuts.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive domain tick thinning, preserved hit region, and compact inspection gutters.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, touch-forgiving tap inspection, pan-y scroll preservation, and persistent locked inspection card.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance path reveal. Inspection crosshairs and tooltip positioning respond immediately without elastic spring or overshoot.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Observation-aligned inspection card showing domain coordinate, observed metric value, lock badge, and keyboard/touch hints.",
    crosshair:
      "Neutral structural crosshair snapping strictly to the scaled X coordinate of the selected observation.",
    legend:
      "Optional single-series identity indicator with series color swatch.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter/Space, and Escape shortcuts. Complete structured data table provided for screen readers.",
    screenReader:
      "Announces domain coordinate, observed value, observation index and count, and locked status factually without editorial commentary.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation across the domain." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation across the domain." },
      { key: "Home", action: "Jump inspection directly to the first observation." },
      { key: "End", action: "Jump inspection directly to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock persistent inspection at the active coordinate." },
      { key: "Escape", action: "Release locked selection without losing active keyboard focus." },
    ],
    colorIndependence:
      "Concentric double-ring marker (◎), observation-aligned vertical crosshair, textual lock badge, and offscreen structured HTML table ensure non-color accessibility.",
    reducedMotion:
      "All entrance animations immediately bypass when prefers-reduced-motion is detected in user system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "InteractiveArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates single quantitative series validation, safe Cartesian domain calculation, nearest-X resolution, AreaChart rendering, crosshair snapping, and lockable tooltip",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates scales, Cartesian grid, Area geometry, ReferenceLine crosshair, and Tooltip",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the area geometry",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal domain labels and auto-padded vertical scale",
            },
            {
              name: "ReferenceLine",
              role: "Observation-aligned crosshair",
              description: "Structural vertical line snapping strictly to active observation coordinate",
            },
            {
              name: "Area",
              role: "Primary area fill & stroke",
              description: "Quantitative area filled with series color and dot callback rendering 0 or 1 active/locked marker",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays domain coordinate, observed value, lock indicator badge, and release hints",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-interactive.tsx",
        description:
          "Complete Interactive Area component with nearest-X inspection, observation-aligned crosshair, and persistent lockable tooltip",
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
