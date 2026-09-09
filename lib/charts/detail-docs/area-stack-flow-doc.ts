import type { ChartDetailDoc } from "./types"

export const areaStackFlowDoc: ChartDetailDoc = {
  chartId: "recharts-area-stack-flow",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "012 / RECHARTS / AREA / STACK FLOW AREA / PREVIEW",

  quickFacts: {
    bestFor:
      "Showing how multiple additive series combine into a meaningful total and tracking how each contributor participates in that total over an ordered domain.",
    dataModel:
      "Ordered observations containing a domain key (month, date, sprint) and multiple non-negative numeric additive metric keys sharing the same unit.",
    interaction:
      "Nearest-X horizontal scrubbing with shared tooltip, persistent locked inspection via click or Enter/Space, and interactive legend layer toggling.",
    responsive:
      "Container-driven responsive layout, wrapped interactive legend controls, and preserved stacked layer composition across all device widths down to 320px.",
    animation:
      "Coherent multi-layer area reveal; zero-lag cursor inspection; automatic bypass under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Cartesian AreaChart SVG combining stacked Area primitives (stackId='plotcn-stack'), CartesianGrid, axes, crosshairs, and custom HTML tooltip.",
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
        type: "readonly StackFlowSeries<TData>[]",
        required: true,
        description: "Ordered array of additive series definitions. Geometry stacks from series[0] at bottom to series[n-1] at top.",
      },
      {
        field: "stackMode",
        type: '"absolute" | "percent"',
        required: false,
        description: '"absolute" renders raw additive quantities and stack totals; "percent" normalizes each slice to proportional share (0–100%).',
      },
    ],
    nullPolicy:
      "Missing observations (null/undefined) under default 'gap' policy mark the stack at that X as incomplete, breaking geometry and displaying 'Total: Incomplete'.",
    orderingPolicy:
      "Observations must be ordered chronologically or along the domain sequence. Caller data is never sorted in place or mutated.",
    exampleRows: [
      { month: "Jan", web: 120, ios: 80, android: 95 },
      { month: "Feb", web: 130, ios: 94, android: 103 },
      { month: "Mar", web: 138, ios: 112, android: 119 },
      { month: "Apr", web: 149, ios: 123, android: 131 },
      { month: "May", web: 162, ios: 135, android: 148 },
      { month: "Jun", web: 175, ios: 144, android: 160 },
      { month: "Jul", web: 190, ios: 158, android: 172 },
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
      type: "readonly StackFlowSeries<TData>[]",
      default: "[]",
      required: true,
      description: "Ordered array of additive series definitions. Geometry stacks from series[0] at bottom to series[n-1] at top.",
      category: "core",
    },
    {
      name: "stackMode",
      type: '"absolute" | "percent"',
      default: '"absolute"',
      required: false,
      description: '"absolute" plots raw additive quantities and stack totals; "percent" normalizes layers to proportional 100% shares.',
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "absolute", label: "Absolute (Sum)" },
        { value: "percent", label: "Percent (100% Share)" },
      ],
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
      name: "domain",
      type: '[number, number] | ["auto", "auto"] | "auto"',
      default: '"auto"',
      required: false,
      description: "Explicit Cartesian Y scale domain. In percent mode, domain is fixed strictly to [0, 100].",
      category: "core",
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.65",
      required: false,
      description: "Opacity of stacked area layers (clamped between 0.1 and 1.0) ensuring layers remain distinguishable.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.45, label: "0.45 (Balanced)" },
        { value: 0.65, label: "0.65 (Solid)" },
        { value: 0.85, label: "0.85 (Contrast)" },
      ],
    },
    {
      name: "gradientMode",
      type: '"none" | "vertical-fade"',
      default: '"none"',
      required: false,
      description: 'Gradient styling for layer fills. "vertical-fade" produces subtle top-to-bottom opacity fade per layer.',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "None (Solid)" },
        { value: "vertical-fade", label: "Vertical Fade" },
      ],
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection)"',
      required: false,
      description: "Accent color for the locked crosshair and locked inspection status indicator.",
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
      name: "showLegend",
      type: "boolean",
      default: "true",
      required: false,
      description: "Whether to render the series identity legend with area fill swatch samples.",
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
      description: "Whether legend items can be clicked/keyboard-activated to toggle layer visibility. Restacks remaining layers without shifting colors.",
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
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "zero"',
      default: '"gap"',
      required: false,
      description: '"gap" truthfully breaks geometry and flags total incomplete; "zero" explicitly coerces nulls to 0 for continuous stacking.',
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Break Stack)" },
        { value: "zero", label: "Zero (Continuous)" },
      ],
    },
    {
      name: "animation",
      type: '"draw" | "fade" | "none"',
      default: '"draw"',
      required: false,
      description: "Initial reveal animation style. Bypassed automatically when reduced motion is preferred.",
      category: "visual",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "—",
      required: false,
      description: "Custom formatter for Y-axis numbers and default tooltip metric values.",
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
  ],

  examples: [
    {
      id: "basic",
      title: "Platform Traffic Composition",
      description:
        "Standard multi-series stacked area visualization showing monthly requests by client platform (Web, iOS, Android) combining into a stack total.",
      snippet: `<StackFlowArea\n  data={trafficData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web" },\n    { key: "ios", label: "iOS" },\n    { key: "android", label: "Android" },\n  ]}\n  stackMode="absolute"\n/>`,
      props: { height: 320, stackMode: "absolute" },
    },
    {
      id: "percent",
      title: "100% Relative Share Mode",
      description:
        "Normalized 100% stacked area illustrating how each platform's proportional contribution evolves over time independent of total volume.",
      snippet: `<StackFlowArea\n  data={trafficData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web" },\n    { key: "ios", label: "iOS" },\n    { key: "android", label: "Android" },\n  ]}\n  stackMode="percent"\n/>`,
      props: { height: 320, stackMode: "percent" },
    },
    {
      id: "missing",
      title: "Truthful Incomplete Stack",
      description:
        "Under default gap policy, missing observations are never silently coerced to zero. Incomplete stacks break cleanly and tooltips report incomplete totals.",
      snippet: `<StackFlowArea\n  data={incompleteData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web" },\n    { key: "ios", label: "iOS" },\n    { key: "android", label: "Android" },\n  ]}\n  missingValuePolicy="gap"\n/>`,
      props: { height: 320, missingValuePolicy: "gap" },
    },
    {
      id: "changing-mix",
      title: "Constant Total with Changing Mix",
      description:
        "Demonstrates stacked area composition when the overall volume remains stable while contributor shares shift across quarters.",
      snippet: `<StackFlowArea\n  data={shiftingMixData}\n  xKey="month"\n  series={[\n    { key: "web", label: "Web" },\n    { key: "ios", label: "iOS" },\n    { key: "android", label: "Android" },\n  ]}\n/>`,
      props: { height: 320 },
    },
  ],

  responsive: {
    overview:
      "Stack Flow Area preserves full multi-series composition and layer distinction across all viewport widths without dropping layers or overflowing.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Spacious stacked area flow, inline legend with area fill swatches, and multi-row inspection tooltip with contributor breakdown and stack total.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Adaptive wrapped legend, thinned categorical ticks, and synchronized nearest-X inspection.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, 32px touch targets for interactive legend toggles, and compact locked tooltip with no page-level overflow.",
      },
    ],
  },

  animation: {
    overview:
      "Coordinated entrance path reveal and restrained restacking transitions. Never uses bouncing restacks or staggered theatrical waves.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection card showing domain coordinate, individual series contributions, percentages in percent mode, and overall stack total.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation X-coordinate.",
    legend:
      "Interactive series buttons with rectangular area fill swatches allowing real-time layer toggling and dynamic restacking.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter, and Escape shortcuts. Separate standard button tab stops for interactive legend toggles.",
    screenReader:
      "Announces domain observation coordinate, count of visible vs configured series, stack mode, individual series contributions, and computed stack total.",
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
      "Layer boundaries, rectangular fill swatches, tooltip text readouts, and off-screen structured data table provide accessible non-color differentiation.",
    reducedMotion:
      "All entrance reveal animations and restacking transitions immediately bypass when prefers-reduced-motion is detected in user system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "StackFlowArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description:
        "Coordinates data normalization, non-negative validation, missing-value policies, Recharts AreaChart stacking, and shared inspection",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and CSS token scoping",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, Cartesian grid, and Area polygon rendering with stackId",
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
              description: "Horizontal category labels and auto-padded vertical scale enclosing visible stack totals",
            },
            {
              name: "Area (multi-instance)",
              role: "Additive stacked area layers",
              description: "Renders stacked polygons with stackId='plotcn-stack', fillOpacity, and connectNulls=false",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays tabular formatted observation values, contributor breakdown, percentages, and stack total",
            },
          ],
        },
        {
          name: "StackFlowLegend",
          role: "Series identity & visibility controls",
          description: "Interactive button controls with rectangular area swatches and keyboard accessibility",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-stack-flow.tsx",
        description:
          "Complete Stack Flow Area component with additive composition, deterministic series identity, and truthful missing-data policies",
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

