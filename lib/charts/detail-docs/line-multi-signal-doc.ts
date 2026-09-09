import type { ChartDetailDoc } from "./types"

export const lineMultiSignalDoc: ChartDetailDoc = {
  chartId: "recharts-line-multi-signal",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "009 / RECHARTS / LINE / MULTI-SIGNAL LINE / PREVIEW",

  quickFacts: {
    bestFor:
      "Multi-series time-series comparison across comparable platforms, regions, or services with deterministic identity, interactive legend toggling, and shared nearest-X inspection.",
    dataModel:
      "Ordered temporal or categorical observations across multiple peer numeric series sharing the same X domain and Y scale unit. Missing observations remain truthful gaps independently per series.",
    interaction:
      "Nearest-X horizontal scrubbing across all visible series simultaneously, persistent locked inspection with pin badges, and keyboard-accessible interactive legend toggling.",
    responsive:
      "Responsive legend wrapping with compact presentation on mobile viewports, safe Y domain auto-recalculation upon series visibility changes, and preserved visibility states across resizes.",
    animation:
      "Restrained entrance draw animation with synchronous transition across peer series; immediate, stutter-free Y-scale transitions upon series toggling.",
    runtime:
      "Pure Recharts Cartesian SVG with deterministic palette token resolution (--chart-1 through --chart-8) keyed by canonical series order rather than dynamic visible index.",
  },

  dataFormat: {
    summary:
      "Accepts chronological or categorical observations where each record contains the domain coordinate and multiple peer numeric fields.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing time, timestamp, or ordered category.",
      },
      {
        field: "series",
        type: "readonly MultiSignalSeries<TData>[]",
        required: true,
        description: "Array of series descriptors defining key, human-readable label, optional color override, and optional stroke style.",
      },
    ],
    nullPolicy:
      "Missing values (null or undefined) create honest breaks (gaps) in that specific series without affecting peer series at the same X observation (null != 0).",
    orderingPolicy:
      "Observations must be chronologically or categorially ordered along the X domain. Tooltip rows strictly preserve canonical series configuration order.",
    exampleRows: [
      { month: "Jan", web: 120, ios: 90, android: 100 },
      { month: "Feb", web: 136, ios: 105, android: 121 },
      { month: "Mar", web: 154, ios: 130, android: 145 },
      { month: "Apr", web: 148, ios: 138, android: 140 },
      { month: "May", web: 172, ios: 152, android: 165 },
      { month: "Jun", web: 189, ios: 168, android: 178 },
      { month: "Jul", web: 210, ios: 185, android: 195 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      category: "core",
      description: "Readonly array of observation records. Caller data is never mutated.",
      bestFor: "Primary dataset",
    },
    {
      name: "xKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      category: "core",
      description: "Property name for horizontal domain coordinates (e.g., month, date).",
      bestFor: "Domain mapping",
    },
    {
      name: "series",
      type: "readonly MultiSignalSeries<TData>[]",
      default: "—",
      required: true,
      category: "core",
      description: "Array of series configuration objects specifying key, label, and optional style.",
      bestFor: "Multi-series definition",
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      category: "visual",
      description: "Container height in pixels or standard CSS dimension strings.",
    },
    {
      name: "curve",
      type: '"monotone" | "linear" | "step"',
      default: '"monotone"',
      required: false,
      category: "visual",
      description: "Curve interpolation algorithm shared uniformly across all peer series.",
    },
    {
      name: "domain",
      type: '[number, number] | ["auto", "auto"]',
      default: '["auto", "auto"]',
      required: false,
      category: "visual",
      description: "Vertical Y scale range calculated safely over currently visible series.",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to render subtle horizontal Cartesian grid reference lines.",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "true",
      required: false,
      category: "interaction",
      description: "Whether to render the series identity legend.",
    },
    {
      name: "interactiveLegend",
      type: "boolean",
      default: "true",
      required: false,
      category: "interaction",
      description: "Enables interactive button controls in the legend to toggle series visibility.",
    },
    {
      name: "lockableTooltip",
      type: "boolean",
      default: "true",
      required: false,
      category: "interaction",
      description: "Enables persistent tooltip locking via click, tap, or Enter/Space.",
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      category: "visual",
      description: "Accent color for the locked crosshair and locked inspection status indicator.",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "carry"',
      default: '"gap"',
      required: false,
      category: "advanced",
      description: "Visual treatment of missing values: honest visual break or forward carry.",
    },
    {
      name: "animation",
      type: '"draw" | "fade" | "none"',
      default: '"draw"',
      required: false,
      category: "visual",
      description: "Entry reveal animation. Bypassed automatically when reduced motion is preferred.",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "n.toLocaleString()",
      required: false,
      category: "visual",
      description: "Default formatter for tooltip values and vertical scale ticks.",
    },
    {
      name: "xFormatter",
      type: "(value: string | number) => string",
      default: "String",
      required: false,
      category: "visual",
      description: "Custom formatter for horizontal domain tick labels.",
    },
    {
      name: "title",
      type: "string",
      default: '"Multi-Signal Line Chart"',
      required: false,
      category: "a11y",
      description: "Accessible title for assistive technologies and screen readers.",
    },
    {
      name: "description",
      type: "string",
      default: "undefined",
      required: false,
      category: "a11y",
      description: "Accessible description detailing series identities and keyboard shortcuts.",
    },
  ],

  examples: [
    {
      id: "platform-usage",
      title: "Cross-Platform Usage Signals",
      description:
        "Three peer signals (Web, iOS, Android) moving together over monthly intervals with interactive legend toggling.",
      snippet: `<MultiSignalLine\n  data={usageData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web" },\n    { key: "ios", label: "iOS" },\n    { key: "android", label: "Android" },\n  ]}\n  lockableTooltip\n/>`,
      props: { height: 320 },
    },
    {
      id: "custom-colors",
      title: "Explicit Series Color Assignment",
      description:
        "Explicit brand colors specified per series overriding semantic palette tokens while preserving deterministic identity.",
      snippet: `<MultiSignalLine\n  data={usageData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web", color: "#3b82f6" },\n    { key: "ios", label: "iOS", color: "#10b981" },\n    { key: "android", label: "Android", color: "#f59e0b" },\n  ]}\n/>`,
      props: { height: 320, color_web: "#3b82f6", color_ios: "#10b981", color_android: "#f59e0b" },
    },
    {
      id: "missing-series",
      title: "Independent Missing Values Per Series",
      description:
        "Demonstrates honest gaps when individual series have null observations without corrupting peer series.",
      snippet: `<MultiSignalLine\n  data={gappyData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web" },\n    { key: "ios", label: "iOS" },\n    { key: "android", label: "Android" },\n  ]}\n  missingValuePolicy="gap"\n/>`,
      props: { height: 320 },
    },
    {
      id: "interactive-legend",
      title: "Interactive Legend Visibility Toggles",
      description:
        "Click or press Enter on legend items to toggle series visibility. Remaining series keep their original colors.",
      snippet: `<MultiSignalLine\n  data={usageData}\n  xKey="month"\n  series={seriesConfig}\n  interactiveLegend\n/>`,
      props: { height: 320, interactiveLegend: true },
    },
  ],

  responsive: {
    overview:
      "Multi-Signal Line adapts legend wrapping and X-axis ticks based on container width. Series visibility and locked inspection are preserved across screen resizes.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full horizontal legend row with stroke samples, complete X-axis ticks, and spacious shared tooltip readouts.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Wrapped multi-row legend maintaining readable text size, thinned categorical ticks, and synchronized nearest-X inspection.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact wrapped series controls with 32px touch targets, pan-y page scroll safety, and viewport-clamped tooltip positioning.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance draw animation synchronized across peer series. Bypassed automatically under prefers-reduced-motion.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized shared multi-series inspection tooltip presenting active datum in canonical series order with series color swatches.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation X-coordinate.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter, and Escape shortcuts. Interactive legend items provide semantic button controls with aria-pressed states.",
    screenReader:
      "Announces domain time, count of visible series, and individual series metric values factually for the inspected observation.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next observation across all visible series." },
      { key: "ArrowLeft", action: "Inspect previous observation across all visible series." },
      { key: "Home", action: "Jump inspection to the first observation." },
      { key: "End", action: "Jump inspection to the last observation." },
      { key: "Enter / Space", action: "Lock or unlock the currently active inspection coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active tooltip." },
      { key: "Tab", action: "Move focus to interactive legend series toggle buttons." },
    ],
    colorIndependence:
      "Series are distinguished by stroke styling, explicit human-readable labels, and tooltip swatches. Hidden series remain visible in the legend with line-through indicators and explicit aria-pressed states.",
    reducedMotion:
      "All entrance transitions immediately bypass when prefers-reduced-motion is detected in system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "MultiSignalLine",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description: "Coordinates series identity resolution, visibility state, safe shared Y domain, and SVG composition",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and CSS token scoping",
        },
        {
          name: "LineChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, Cartesian grid, and multiple peer Line elements",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the signal curves",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Category tick labels and auto-padded vertical scale covering all visible series",
            },
            {
              name: "Tooltip (MultiSignalTooltipContent)",
              role: "Synchronized inspection overlay",
              description: "Displays all visible series values in canonical order with series color markers and missing states",
            },
            {
              name: "Line[]",
              role: "Multiple peer trend signals",
              description: "Renders each visible series with its deterministic color and stroke style",
            },
          ],
        },
        {
          name: "MultiSignalInteractiveLegend",
          role: "Responsive interactive legend controls",
          description: "Semantic button controls allowing users to toggle series visibility with aria-pressed states",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/line-multi-signal.tsx",
        description: "Complete Multi-Signal Line component with deterministic identity, interactive legend, and shared inspection",
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
