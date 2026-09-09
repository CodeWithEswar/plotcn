import type { ChartDetailDoc } from "./types"

export const areaGradientDepthDoc: ChartDetailDoc = {
  chartId: "recharts-area-gradient-depth",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "016 / RECHARTS / AREA / GRADIENT DEPTH AREA / PREVIEW",

  quickFacts: {
    bestFor:
      "Communicating quantitative magnitude with a controlled semantic fade-to-surface fill, providing visual depth without encoding additional false variables.",
    dataModel:
      "Ordered observations containing a horizontal domain key (date, timestamp, category) and a single quantitative numeric magnitude series.",
    interaction:
      "Nearest-X horizontal scrubbing resolving the exact observation value, persistent tooltip locking via click or Enter/Space, and accessible keyboard navigation.",
    responsive:
      "Container-driven measurement with adaptive axis tick thinning, compact gutters, and preserved area geometry across all viewports down to 320px.",
    animation:
      "Restrained entrance path draw animation; zero-lag cursor tracking during inspection; automatic bypass under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Cartesian AreaChart SVG combining linearGradient with proportional opacity stops, Area stroke, CartesianGrid, neutral vertical crosshair, and HTML tooltip.",
  },

  dataFormat: {
    summary:
      "Accepts an ordered array of observation records where each record contains an X-domain coordinate and a single quantitative metric value.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing date, timestamp, month, or ordered category.",
      },
      {
        field: "series",
        type: "GradientDepthAreaSeries<TData>",
        required: true,
        description: "Semantic series descriptor declaring key, label, and optional numeric valueFormatter.",
      },
    ],
    nullPolicy:
      "Missing observations (null, undefined, NaN, Infinity) create truthful visual breaks without coercing null to zero (null != 0). Gradient never bridges across gaps.",
    orderingPolicy:
      "Observations must be ordered along the X domain sequence. Caller data is never sorted in place or mutated.",
    exampleRows: [
      { date: "May 01", requests: 12400 },
      { date: "May 05", requests: 14800 },
      { date: "May 10", requests: 13900 },
      { date: "May 15", requests: 18200 },
      { date: "May 20", requests: 21500 },
      { date: "May 25", requests: 19800 },
      { date: "May 30", requests: 24600 },
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
      type: "GradientDepthAreaSeries<TData>",
      default: "—",
      required: true,
      description: "Single semantic series configuration mapping metric key, label, and valueFormatter.",
      category: "core",
    },
    {
      name: "gradientMode",
      type: '"surface" | "none"',
      default: '"surface"',
      required: false,
      description: 'Controls depth fill style. "surface" applies a semantic fade toward chart surface; "none" renders a flat fill.',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "surface", label: "Surface Fade" },
        { value: "none", label: "Flat Fill" },
      ],
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.32",
      required: false,
      description: "Leading fill opacity at the signal boundary (0.05 to 1.0). Subordinate gradient stops derive proportionally.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.16, label: "0.16 (Subtle)" },
        { value: 0.32, label: "0.32 (Medium)" },
        { value: 0.5, label: "0.50 (Deep)" },
      ],
    },
    {
      name: "baseline",
      type: '"zero" | "domain-min" | number',
      default: '"zero"',
      required: false,
      description: 'Baseline reference toward which the area fills. "zero" includes 0 in automatic domain; "domain-min" fills to domain minimum.',
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "zero", label: "Zero Baseline" },
        { value: "domain-min", label: "Domain Min" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      description: "Container height in pixels or CSS units.",
      category: "visual",
    },
    {
      name: "curve",
      type: '"monotone" | "linear" | "step"',
      default: '"monotone"',
      required: false,
      description: "Interpolation curve applied to the signal boundary stroke and filled area geometry.",
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
      name: "domain",
      type: '[number, number] | "auto"',
      default: '"auto"',
      required: false,
      description: 'Explicit Y-axis numeric domain bounds, or "auto" for auto-padded safe scale enclosing baseline.',
      category: "visual",
    },
    {
      name: "color",
      type: "string",
      default: "var(--chart-1)",
      required: false,
      description: "Primary semantic series color applied to stroke, active marker, and all gradient stops.",
      category: "visual",
    },
    {
      name: "selectionColor",
      type: "string",
      default: "var(--chart-selection)",
      required: false,
      description: "Color for active locked observation crosshair reference line.",
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
      controlType: "switch",
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render horizontal domain tick labels.",
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
      default: "false",
      required: false,
      description: "Whether to render series identity legend.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "lockableTooltip",
      type: "boolean",
      default: "true",
      required: false,
      description: "Enables persistent inspection pinning on click or keyboard Enter/Space.",
      category: "interaction",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "connect"',
      default: '"gap"',
      required: false,
      description: 'Policy for missing data: "gap" preserves truthful breaks; "connect" bridges across missing observations.',
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Truthful)" },
        { value: "connect", label: "Connect" },
      ],
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      description: "Enables entrance path animation. Automatically bypassed when prefers-reduced-motion is active.",
      category: "visual",
      previewable: true,
      controlType: "switch",
    },
  ],

  examples: [
    {
      id: "basic",
      title: "Basic Semantic Depth",
      description: "Default single-series request volume with controlled fade-to-surface depth.",
      snippet: `<GradientDepthArea
  data={requestData}
  xKey="date"
  series={{
    key: "requests",
    label: "Daily Requests",
  }}
  gradientMode="surface"
  fillOpacity={0.32}
  showGrid
/>`,
      props: {
        gradientMode: "surface",
        fillOpacity: 0.32,
        baseline: "zero",
        showGrid: true,
      },
    },
    {
      id: "deep-fade",
      title: "Deep Fade",
      description: "Prominent leading boundary opacity tapering cleanly into the background.",
      snippet: `<GradientDepthArea
  data={requestData}
  xKey="date"
  series={{
    key: "requests",
    label: "Daily Requests",
  }}
  gradientMode="surface"
  fillOpacity={0.55}
  showGrid
/>`,
      props: {
        gradientMode: "surface",
        fillOpacity: 0.55,
        baseline: "zero",
        showGrid: true,
      },
    },
    {
      id: "flat-fill",
      title: "Flat Fill (No Fade)",
      description: "Disables gradient fade to compare against uniform semantic area fill.",
      snippet: `<GradientDepthArea
  data={requestData}
  xKey="date"
  series={{
    key: "requests",
    label: "Daily Requests",
  }}
  gradientMode="none"
  fillOpacity={0.22}
  showGrid
/>`,
      props: {
        gradientMode: "none",
        fillOpacity: 0.22,
        baseline: "zero",
        showGrid: true,
      },
    },
    {
      id: "domain-min",
      title: "Domain Min Baseline",
      description: "Fills toward the domain floor rather than zero for elevated ranges.",
      snippet: `<GradientDepthArea
  data={requestData}
  xKey="date"
  series={{
    key: "requests",
    label: "Daily Requests",
  }}
  baseline="domain-min"
  showGrid
/>`,
      props: {
        gradientMode: "surface",
        fillOpacity: 0.35,
        baseline: "domain-min",
        showGrid: true,
      },
    },
    {
      id: "linear-curve",
      title: "Linear Interpolation",
      description: "Piecewise linear segments demonstrating deterministic vertex alignment.",
      snippet: `<GradientDepthArea
  data={requestData}
  xKey="date"
  series={{
    key: "requests",
    label: "Daily Requests",
  }}
  curve="linear"
  showGrid
/>`,
      props: {
        curve: "linear",
        gradientMode: "surface",
        fillOpacity: 0.32,
      },
    },
    {
      id: "with-legend",
      title: "With Legend",
      description: "Displays series identity indicator and fill description.",
      snippet: `<GradientDepthArea
  data={requestData}
  xKey="date"
  series={{
    key: "requests",
    label: "Daily Requests",
  }}
  showLegend
  showGrid
/>`,
      props: {
        showLegend: true,
        gradientMode: "surface",
      },
    },
  ],

  responsive: {
    overview:
      "Gradient Depth Area preserves single-series magnitude, semantic fade geometry, and nearest-X inspection across all device widths down to 320px.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Spacious vertical gradient fade, full domain ticks, horizontal legend option, and detailed inspection card.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive domain tick thinning, preserved gradient depth ratio, and compact tooltip gutters.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, truthful missing gaps, touch-forgiving nearest-X inspection, and uncompromised semantic gradient fill.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entry path reveal. The linearGradient fill moves synchronously with the area stroke and never animates independently.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized nearest-X inspection card showing domain coordinate, series label, formatted value, and locked state.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation coordinate.",
    legend:
      "Optional series identity legend with matching semantic color swatch.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter/Space, and Escape shortcuts. Structured data table provided for assistive technologies.",
    screenReader:
      "Announces domain coordinate and quantitative series value. Gradient depth is treated purely as styling and is never announced as an additional variable.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation across the domain." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation across the domain." },
      { key: "Home", action: "Jump inspection directly to the first observation." },
      { key: "End", action: "Jump inspection directly to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock persistent inspection at the active coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active inspection tooltip." },
    ],
    colorIndependence:
      "High-contrast stroke (2px), active circle marker, persistent crosshair, and offscreen structured HTML data table ensure complete non-color accessibility.",
    reducedMotion:
      "All entrance reveal animations immediately bypass when prefers-reduced-motion is detected in user system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "GradientDepthArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates single quantitative series validation, baseline and safe domain resolution, Recharts AreaChart rendering, and nearest-X inspection",
      children: [
        {
          name: "ResponsiveContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and SVG viewBox sizing",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates scales, Cartesian grid, defs linearGradient, area geometry, and inspection tooltip",
          children: [
            {
              name: "defs > linearGradient",
              role: "Semantic fade definition",
              description: "SSR-safe, collision-safe vertical linear gradient with proportional opacity decay toward chart surface",
            },
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the area geometry",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal domain labels and auto-padded truthful vertical scale enclosing baseline",
            },
            {
              name: "Area",
              role: "Primary area fill & stroke",
              description: "Quantitative area filled with url(#gradientId) and stroked with matching series color",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays domain coordinate, series label, and formatted value with optional lock pin",
            },
          ],
        },
        {
          name: "GradientDepthAreaLegend",
          role: "Series identity legend",
          description: "Displays series label and semantic color swatch indicator",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-gradient-depth.tsx",
        description:
          "Complete Gradient Depth Area component with semantic fade-to-surface depth, truthful baseline, and nearest-X inspection",
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
