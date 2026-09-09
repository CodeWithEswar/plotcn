import type { ChartDetailDoc } from "./types"

export const areaPercentStreamDoc: ChartDetailDoc = {
  chartId: "recharts-area-percent-stream",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "013 / RECHARTS / AREA / PERCENT STREAM AREA / PREVIEW",

  quickFacts: {
    bestFor:
      "Showing how each contributor's proportional share of a whole evolves over an ordered domain while preserving access to underlying raw quantities.",
    dataModel:
      "Ordered observation records containing a horizontal domain key (month, date, version) and multiple non-negative numeric additive series sharing the same unit.",
    interaction:
      "Nearest-X horizontal scrubbing with shared tooltip displaying prominent percentage shares alongside raw counts, persistent locked inspection, and visible-series re-normalization legend controls.",
    responsive:
      "Container-driven responsive layout, wrapped interactive legend controls, and preserved 0%–100% normalized geometry across all device widths down to 320px without automatically dropping series.",
    animation:
      "Restrained multi-layer area reveal; zero-lag cursor inspection; automatic bypass under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Cartesian AreaChart SVG combining stacked Area primitives (stackId='plotcn-percent-stack'), CartesianGrid, 0%–100% YAxis, crosshairs, and custom HTML tooltip.",
  },

  dataFormat: {
    summary:
      "Accepts an ordered array of observation records where each record contains an X-domain coordinate and multiple numeric additive metric values.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing date, month, timestamp, or ordered category.",
      },
      {
        field: "series",
        type: "readonly PercentStreamSeries<TData>[]",
        required: true,
        description: "Ordered array of additive series definitions. Geometry stacks from series[0] at bottom to series[n-1] at top.",
      },
    ],
    nullPolicy:
      "Missing observations (null/undefined) under default 'gap' policy mark composition at that X as incomplete, breaking geometry and displaying 'Composition: Incomplete'.",
    orderingPolicy:
      "Observations must be ordered chronologically or along the domain sequence. Caller data is never sorted in place or mutated.",
    exampleRows: [
      { month: "Jan", web: 500, ios: 300, android: 200 },
      { month: "Feb", web: 5000, ios: 3000, android: 2000 },
      { month: "Mar", web: 4800, ios: 3200, android: 2000 },
      { month: "Apr", web: 4000, ios: 3600, android: 2400 },
      { month: "May", web: 3600, ios: 3700, android: 2700 },
      { month: "Jun", web: 3300, ios: 3900, android: 2800 },
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
      type: "readonly PercentStreamSeries<TData>[]",
      default: "[]",
      required: true,
      description: "Ordered array of additive series definitions. Geometry stacks from series[0] at bottom to series[n-1] at top.",
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
      type: '"monotone" | "linear" | "step"',
      default: '"monotone"',
      required: false,
      description: "Curve interpolation algorithm shared across all stacked area boundaries.",
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
      name: "fillOpacity",
      type: "number",
      default: "0.75",
      required: false,
      description: "Opacity of normalized area layers (0.1 to 1.0) ensuring layers remain distinguishable.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.55, label: "0.55 Soft" },
        { value: 0.75, label: "0.75 Balanced" },
        { value: 0.95, label: "0.95 Solid" },
      ],
    },
    {
      name: "gradientMode",
      type: '"none" | "vertical-fade"',
      default: '"none"',
      required: false,
      description: 'Gradient fill treatment: "none" (solid translucent) or "vertical-fade" (restrained top-to-bottom fade).',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "Solid" },
        { value: "vertical-fade", label: "Vertical Fade" },
      ],
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Accent color for the locked crosshair and selection pin.",
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
      description: "Whether to render the vertical percentage scale (0%–100%).",
      category: "visual",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "true",
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
      name: "interactiveLegend",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether legend items can be clicked/keyboard-activated to toggle layer visibility and re-normalize the visible whole.",
      category: "visual",
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
      description: "Whether clicking or pressing Enter/Space pins the currently inspected X datum.",
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
      type: '"gap" | "zero"',
      default: '"gap"',
      required: false,
      description: "Handling of missing observations: 'gap' marks composition incomplete; 'zero' substitutes 0.",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Preserve Gap" },
        { value: "zero", label: "Treat As Zero" },
      ],
    },
    {
      name: "animation",
      type: '"draw" | "fade" | "none"',
      default: '"draw"',
      required: false,
      description: "Entry reveal animation mode.",
      category: "visual",
    },
    {
      name: "shareFormatter",
      type: "(share: number) => string",
      default: "(s) => `${s.toFixed(1)}%`",
      required: false,
      description: "Custom formatter for normalized percentage shares in tooltips.",
      category: "visual",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "n.toLocaleString()",
      required: false,
      description: "Custom formatter for raw underlying quantities in tooltips and tables.",
      category: "visual",
    },
    {
      name: "title",
      type: "string",
      default: '"Percent Stream Area Chart"',
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
      id: "traffic-mix",
      title: "Traffic Mix Evolution",
      description: "Tracking client platform share evolution over six months while underlying raw traffic scales 10x.",
      snippet: `<PercentStreamArea
  data={trafficData}
  xKey="month"
  series={[
    { key: "web", label: "Web" },
    { key: "ios", label: "iOS" },
    { key: "android", label: "Android" },
  ]}
  showLegend
  interactiveLegend
  lockableTooltip
  valueFormatter={(v) => \`\${v.toLocaleString()} req/s\`}
  showGrid
/>`,
      props: { height: 320, showGrid: true, showLegend: true },
    },
    {
      id: "subscription-tiers",
      title: "Subscription Tier Mix",
      description: "Monthly customer account mix across Free, Pro, and Enterprise tiers.",
      snippet: `<PercentStreamArea
  data={tierData}
  xKey="month"
  series={[
    { key: "free", label: "Free Tier" },
    { key: "pro", label: "Pro Tier" },
    { key: "enterprise", label: "Enterprise Tier" },
  ]}
  showLegend
  interactiveLegend
  lockableTooltip
  valueFormatter={(v) => \`\${v.toLocaleString()} accounts\`}
  showGrid
/>`,
      props: { height: 320, showGrid: true, showLegend: true },
    },
  ],

  responsive: {
    overview:
      "Percent Stream Area preserves full 100% normalized layer composition and deterministic color mappings across all viewport widths without dropping series.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior: "Full horizontal percentage ticks (0%, 25%, 50%, 75%, 100%), inline interactive legend, and spacious multi-column tooltip.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior: "Adaptive wrapped interactive legend, thinned domain ticks, and continuous 100% normalized geometry.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior: "Compact percentage Y-axis, compact stacked tooltip, scrollable legend. Series are never silently dropped.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entry path reveals and smoothly interpolated visible-series re-normalization. Never uses bouncing restacks or staggered theatrical waves.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection card showing active domain coordinate, prominent percentage shares, raw underlying counts, and visible raw total.",
    crosshair:
      "Shared neutral vertical crosshair pinned to the active observation coordinate.",
    legend:
      "Interactive series buttons with rectangular area swatches allowing real-time visible-series re-normalization.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter, and Escape shortcuts. Separate standard button tab stops for interactive legend toggles.",
    screenReader:
      "Figure element announces chart title and 100% normalized composition summary. Live region announces inspected coordinate, visible shares, and raw quantities.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation across visible series." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation across visible series." },
      { key: "Home", action: "Jump inspection directly to the first observation." },
      { key: "End", action: "Jump inspection directly to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock persistent inspection at the active coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active inspection tooltip." },
      { key: "Tab", action: "Move focus to interactive series visibility controls in the legend." },
    ],
    colorIndependence:
      "Deterministic series order, distinct stroke boundaries, interactive fill swatches, and structured data table provide accessible non-color differentiation.",
    reducedMotion:
      "All entrance reveal animations and restacking transitions immediately bypass when prefers-reduced-motion is detected.",
  },

  sourceAnatomy: {
    tree: {
      name: "PercentStreamArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates data normalization, non-negative validation, missing-value policies, Recharts AreaChart 100% stacking, and shared inspection",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and CSS token scoping",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, 0%–100% Y-axis, Cartesian grid, and Area polygon rendering with stackId",
          children: [
            {
              name: "defs (optional)",
              role: "SVG gradient definition",
              description: "Collision-safe linear gradients rendered per layer when gradientMode is vertical-fade",
            },
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the stacked layers",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal domain labels and fixed 0%–100% vertical percentage scale",
            },
            {
              name: "Area (multi-instance)",
              role: "100% normalized stacked area layers",
              description: "Renders stacked polygons with stackId='plotcn-percent-stack', fillOpacity, and connectNulls=false",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays tabular formatted observation values, percentage shares, raw quantities, and visible raw total",
            },
          ],
        },
        {
          name: "PercentStreamLegend",
          role: "Series identity & visibility controls",
          description: "Interactive button controls with rectangular area swatches and visible-series re-normalization",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-percent-stream.tsx",
        description:
          "Complete Percent Stream Area component with 100% normalized composition, deterministic series identity, and re-normalization",
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
