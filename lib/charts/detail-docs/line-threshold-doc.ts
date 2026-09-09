import type { ChartDetailDoc } from "./types"

export const lineThresholdDoc: ChartDetailDoc = {
  chartId: "recharts-line-threshold",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "007 / RECHARTS / LINE / THRESHOLD LINE / PREVIEW",

  quickFacts: {
    bestFor:
      "SLA limits, target operating bands, budget ceilings, sensor thresholds, quality boundaries, and compliance ranges relative to a quantitative continuous signal.",
    dataModel:
      "Continuous time-series observation records evaluated against declarative horizontal boundary lines (kind: 'line') and bounded operating bands (kind: 'region').",
    interaction:
      "Nearest-X scrub inspection with synchronized tooltip reporting primary metric value, active operating band, or distance to nearest limit; keyboard scrubbing supported.",
    responsive:
      "Fluid SVG scaling with collision-safe reference labels positioned inside the Cartesian coordinate frame to prevent overflow on narrow screens.",
    animation:
      "Calm entry reveal for the trend line with instant background region and threshold lines; completely bypassed under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Cartesian SVG layering ReferenceArea (regions) below CartesianGrid, followed by ReferenceLine (boundaries) and primary Line (signal).",
  },

  dataFormat: {
    summary:
      "Separates continuous quantitative observations from contextual horizontal threshold boundaries and regions, ensuring clean decoupled data contracts.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing time, timestamp, sprint, or category.",
      },
      {
        field: "seriesKey",
        type: "number | null | undefined",
        required: true,
        description: "Numeric observation value representing the active continuous signal.",
      },
      {
        field: "thresholds",
        type: "ThresholdDefinition[]",
        required: false,
        description:
          "Array of boundary lines ({ id, kind: 'line', value, label }) and operating regions ({ id, kind: 'region', from, to, label }).",
      },
    ],
    nullPolicy:
      "Missing observations create an honest visual break in the trend line ('gap' policy), while threshold boundaries and regions span uninterrupted across the entire domain.",
    orderingPolicy:
      "Observations should be chronologically ordered. Threshold definitions are validated for numeric finiteness and sorted into correct SVG layering order.",
    exampleRows: [
      { time: "00:00", latency: 142 },
      { time: "04:00", latency: 158 },
      { time: "08:00", latency: 245 },
      { time: "12:00", latency: 285 },
      { time: "16:00", latency: 198 },
      { time: "20:00", latency: 172 },
      { time: "23:59", latency: 155 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      category: "core",
      description: "Readonly array of structured observation records. Caller data is never mutated.",
      bestFor: "Primary dataset",
    },
    {
      name: "xKey",
      type: "keyof TData & string",
      default: "—",
      required: true,
      category: "core",
      description: "Property name for the horizontal X-axis domain coordinate.",
      bestFor: "Domain coordinates",
    },
    {
      name: "seriesKey",
      type: "keyof TData & string",
      default: '"value"',
      required: false,
      category: "core",
      description: "Property name for the quantitative metric value plotted as the continuous signal.",
      bestFor: "Quantitative trend series",
    },
    {
      name: "thresholds",
      type: "readonly ThresholdDefinition[]",
      default: "[]",
      required: false,
      category: "core",
      description:
        "Collection of horizontal boundary lines (kind: 'line') or bounded regions (kind: 'region').",
      bestFor: "Contextual boundaries",
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #3b82f6)"',
      required: false,
      category: "visual",
      description: "Primary theme stroke color for the continuous signal line.",
      bestFor: "Brand identity",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#3b82f6", label: "Blue" },
        { value: "#10b981", label: "Emerald" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#0ea5e9", label: "Sky" },
      ],
    },
    {
      name: "thresholdColor",
      type: "string",
      default: '"var(--chart-4, #f59e0b)"',
      required: false,
      category: "visual",
      description: "Default fallback color for threshold lines, region fills, and threshold badges.",
      bestFor: "Threshold boundary accent",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#f59e0b", label: "Amber" },
        { value: "#ef4444", label: "Red" },
        { value: "#10b981", label: "Emerald" },
        { value: "#6366f1", label: "Indigo" },
      ],
    },
    {
      name: "regionOpacity",
      type: "number",
      default: "0.12",
      required: false,
      category: "visual",
      description: "Opacity for threshold region fills, ensuring the primary trend line remains prominent.",
      bestFor: "Background band contrast",
    },
    {
      name: "curve",
      type: '"linear" | "monotone" | "step"',
      default: '"monotone"',
      required: false,
      category: "visual",
      description: "Curve interpolation algorithm for the continuous trend line.",
      bestFor: "Signal smoothing",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "monotone", label: "Monotone (Smooth)" },
        { value: "linear", label: "Linear" },
        { value: "step", label: "Step" },
      ],
    },
    {
      name: "domain",
      type: '[number, number] | ["auto", "auto"]',
      default: '["auto", "auto"]',
      required: false,
      category: "core",
      description:
        "Vertical Y-axis scale range. 'auto' computes a safe domain encompassing both observations and active thresholds.",
      bestFor: "Scale bounds & threshold visibility",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "carry"',
      default: '"gap"',
      required: false,
      category: "core",
      description:
        "Handling of null/undefined values: 'gap' creates an honest break; 'carry' holds the previous level.",
      bestFor: "Missing telemetry integrity",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Default)" },
        { value: "carry", label: "Carry Forward" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "340",
      required: false,
      category: "core",
      description: "Container height in pixels or standard CSS dimension strings.",
      bestFor: "Viewport sizing",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 280, label: "Compact (280px)" },
        { value: 340, label: "Default (340px)" },
        { value: 420, label: "Spacious (420px)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to display subtle horizontal reference grid lines.",
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to render the horizontal category scale.",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to render the vertical numeric scale.",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      category: "visual",
      description: "Whether to render the threshold and signal legend below the chart.",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "n => n.toLocaleString()",
      required: false,
      category: "interaction",
      description: "Custom formatter for Y-axis scale numbers and tooltip metric values.",
    },
    {
      name: "xFormatter",
      type: "(value: string | number) => string",
      default: "String",
      required: false,
      category: "interaction",
      description: "Custom formatter for X-axis coordinate labels.",
    },
    {
      name: "motion",
      type: "boolean | { duration?: number }",
      default: "true",
      required: false,
      category: "advanced",
      description: "Controls entry reveal animations, respecting user reduced motion preferences.",
    },
    {
      name: "title",
      type: "string",
      default: '"Threshold Line Chart"',
      required: false,
      category: "a11y",
      description: "Accessible heading announced by screen readers.",
    },
    {
      name: "description",
      type: "string",
      default: "undefined",
      required: false,
      category: "a11y",
      description: "Long-form accessibility description explaining signal context and boundaries.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      category: "advanced",
      description: "Renders a neutral loading skeleton without fake threshold boundaries.",
    },
    {
      name: "error",
      type: "Error | string | null",
      default: "null",
      required: false,
      category: "advanced",
      description: "Renders an actionable error state banner with optional retry trigger.",
    },
    {
      name: "unavailable",
      type: "boolean | string | null",
      default: "false",
      required: false,
      category: "advanced",
      description: "Renders a metric unavailability notice when data cannot be computed.",
    },
  ],

  examples: [
    {
      id: "sla-boundary",
      title: "API Latency & SLA Ceilings",
      description:
        "High-frequency latency monitoring evaluating response times against warning and hard SLA ceiling lines.",
      snippet: `<ThresholdLine data={latencyData} xKey="time" seriesKey="latency" label="P95 Latency (ms)" thresholds={[{ id: "sla", kind: "line", value: 300, label: "SLA Limit (300ms)" }]} valueFormatter={(v) => \`\${v}ms\`} />`,
      props: { height: 340, color: "#3b82f6" },
    },
    {
      id: "target-region",
      title: "Target Operating Band",
      description:
        "Continuous metric evaluated against a bounded horizontal comfort range rendered as a soft reference area.",
      snippet: `<ThresholdLine data={tempData} xKey="time" seriesKey="temperature" label="Core Temp (°C)" thresholds={[{ id: "band", kind: "region", from: 45, to: 75, label: "Optimal Band (45-75°C)" }]} valueFormatter={(v) => \`\${v}°C\`} />`,
      props: { height: 340, color: "#10b981" },
    },
    {
      id: "multiple-thresholds",
      title: "Combined Multi-Tier Limits & Ranges",
      description:
        "Complex operational dashboard combining a target operating zone with distinct soft and hard boundary lines.",
      snippet: `<ThresholdLine data={latencyData} xKey="time" seriesKey="latency" thresholds={sampleThresholdsList} />`,
      props: { height: 340, color: "#8b5cf6" },
    },
    {
      id: "missing-data",
      title: "Gaps in Telemetry with Unbroken Thresholds",
      description:
        "Demonstrates honest gap rendering when sensor data drops out; threshold lines remain completely unbroken across the frame.",
      snippet: `<ThresholdLine data={gappyData} xKey="time" seriesKey="latency" missingValuePolicy="gap" thresholds={sampleThresholdsList} />`,
      props: { height: 340, color: "#f59e0b" },
    },
  ],

  responsive: {
    overview:
      "Threshold Line employs fluid Cartesian SVG scaling. Threshold labels are rendered inside the plot coordinate frame so they never clip on narrow mobile screens.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full coordinate labels, complete threshold descriptions in tooltip, and generous axis padding.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Thinned X-axis intervals, compact threshold label badges, and synchronized scrub inspection.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Single-tap inspection, compact tooltip positioned safely within viewport boundaries, and internal label alignment.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance reveal for the continuous signal line while reference regions and threshold lines render immediately without flashing. Fully respects prefers-reduced-motion.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Nearest-X scrub inspection displays the exact primary series value along with the active threshold region or nearest boundary distance.",
    crosshair: "Thin vertical dashed crosshair aligned precisely with the active domain coordinate.",
  },

  accessibility: {
    role: "region",
    summary:
      "Factual screen reader announcement reporting observation count and threshold limits without subjective value judgements.",
    screenReader:
      "Announces trend observations alongside defined boundary values factually.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next observation point along the timeline." },
      { key: "ArrowLeft", action: "Inspect previous observation point along the timeline." },
      { key: "Home", action: "Jump inspection to the first observation." },
      { key: "End", action: "Jump inspection to the latest observation." },
      { key: "Escape", action: "Dismiss active inspection focus." },
    ],
    colorIndependence:
      "Dashed stroke patterns for lines and filled areas with distinct labels ensure boundaries are easily understood without relying on color alone.",
    reducedMotion:
      "All animations immediately bypass when prefers-reduced-motion is detected in user system settings.",
  },

  sourceAnatomy: {
    tree: {
      name: "ThresholdLine",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description: "Manages data normalization, safe domain calculation, threshold validation, and SVG composition",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Provides responsive sizing and CSS custom variable scoping",
        },
        {
          name: "LineChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate axes, grid, reference shapes, and trend line",
          children: [
            {
              name: "ReferenceArea (Regions)",
              role: "Bounded operating band fills",
              description: "Renders horizontal region fills layered under the Cartesian grid",
            },
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines at standard intervals",
            },
            {
              name: "ReferenceLine (Boundaries)",
              role: "Horizontal threshold boundaries",
              description: "Renders dashed horizontal limit lines with inside top-right text labels",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Category tick labels and auto-padded Y scale covering all thresholds",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection overlay",
              description: "Displays primary metric value and contextual threshold proximity",
            },
            {
              name: "Line",
              role: "Continuous trend signal",
              description: "Draws the primary signal stroke on top of all reference layers",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/line-threshold.tsx",
        description: "Complete Threshold Line component with data normalization, safe auto-domain, and a11y shell",
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
