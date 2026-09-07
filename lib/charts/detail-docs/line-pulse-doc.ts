import type { ChartDetailDoc } from "./types"

export const linePulseDoc: ChartDetailDoc = {
  chartId: "recharts-line-pulse",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "High-frequency operational trend visualization for rapidly changing metrics, rolling windows, and live telemetry surfaces.",

  quickFacts: {
    bestFor: "Operational dashboards, P95/P99 latency, request throughput, CPU/memory telemetry, rolling windows",
    dataModel: "Readonly stream observations with chronological X-domain key and numeric metric value",
    interaction: "Nearest-X crosshair, latest terminal dot emphasis, compact tooltip, keyboard navigation (End jumps to live)",
    responsive: "Container-aware ResizeObserver, aggressive tick thinning on mobile, optional latest-value badge",
    animation: "Direct geometry updates (zero queue lag) or 150ms transition, respects prefers-reduced-motion",
    runtime: "Recharts SVG (source-first, zero @plotcn runtime dependencies)",
  },

  dataFormat: {
    summary: "Accepts a readonly array of objects representing chronological operational samples, telemetry, or server metrics.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing time, timestamp, or sequential event index.",
      },
      {
        field: "seriesKey",
        type: "number | null | undefined",
        required: true,
        description: "Numeric operational metric (e.g. latency in ms, QPS, memory %). Missing samples render as gaps.",
      },
    ],
    nullPolicy: "Truthful gap policy: null/undefined operational samples represent telemetry disconnects and are never coerced to zero.",
    orderingPolicy: "Caller must supply observations in chronological order. Sliced by windowSize if specified.",
    exampleRows: [
      { time: "14:20:00", latency: 42 },
      { time: "14:20:05", latency: 45 },
      { time: "14:20:10", latency: 38 },
      { time: "14:20:15", latency: 62 },
      { time: "14:20:20", latency: 54 },
      { time: "14:20:25", latency: 89 },
      { time: "14:20:30", latency: 76 },
      { time: "14:20:35", latency: null },
      { time: "14:20:40", latency: 68 },
      { time: "14:20:45", latency: 52 },
      { time: "14:20:50", latency: 49 },
      { time: "14:20:55", latency: 58 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      category: "core",
      description: "Readonly array of operational telemetry records. Caller array is never mutated.",
      bestFor: "Incoming telemetry stream or rolling buffer",
    },
    {
      name: "xKey",
      type: "keyof TData & string",
      default: "-",
      required: true,
      category: "core",
      description: "Property name for horizontal time coordinates (e.g. timestamp, time, tick).",
      bestFor: "Domain accessor",
    },
    {
      name: "seriesKey",
      type: "keyof TData & string",
      default: '"value"',
      required: false,
      category: "core",
      description: "Property name for numeric metric value.",
      bestFor: "Metric accessor",
    },
    {
      name: "windowSize",
      type: "number",
      default: "undefined",
      required: false,
      category: "core",
      description: "Rolling window size. When specified, only the latest N observations are rendered.",
      bestFor: "Keeping chart uncluttered in live streaming dashboards",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 6, label: "6 samples" },
        { value: 8, label: "8 samples" },
        { value: 12, label: "12 samples" },
      ],
    },
    {
      name: "showLatestPoint",
      type: "boolean",
      default: "true",
      required: false,
      category: "core",
      description: "Renders an active terminal marker dot with subtle concentric ring at the latest observation.",
      bestFor: "Immediate visual awareness of current signal state",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showLatestValue",
      type: "boolean",
      default: "false",
      required: false,
      category: "core",
      description: "Renders a compact header pill showing the latest formatted metric value.",
      bestFor: "High-density monitoring panels",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "curve",
      type: '"linear" | "monotone" | "step"',
      default: '"monotone"',
      required: false,
      category: "visual",
      description: "Line interpolation method. Use linear for discrete samples, monotone for smooth trajectories.",
      bestFor: "Matching telemetry physics and sampling rate",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "monotone", label: "Monotone" },
        { value: "linear", label: "Linear" },
        { value: "step", label: "Step" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "280",
      required: false,
      category: "core",
      description: "Container height in pixels or standard CSS string (e.g. 100%, 320px).",
      bestFor: "Dashboard panel height alignment",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 220, label: "Compact (220px)" },
        { value: 280, label: "Standard (280px)" },
        { value: 340, label: "Tall (340px)" },
      ],
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #10b981)"',
      required: false,
      category: "visual",
      description: "Primary stroke and terminal dot color. Supports CSS custom properties or hex codes.",
      bestFor: "Semantic operational status (emerald for normal, amber for warn)",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "var(--chart-1, #10b981)", label: "Emerald" },
        { value: "#3b82f6", label: "Blue" },
        { value: "#f59e0b", label: "Amber" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Displays subtle horizontal dashed background reference rules.",
      bestFor: "Quiet structural reference",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "connect"',
      default: '"gap"',
      required: false,
      category: "advanced",
      description: "Handling of null or disconnected observations. Gap avoids false interpolation.",
      bestFor: "Truthful reporting of telemetry outages",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap" },
        { value: "connect", label: "Connect" },
      ],
    },
    {
      name: "updateMode",
      type: '"direct" | "transition"',
      default: '"direct"',
      required: false,
      category: "advanced",
      description: "Direct applies geometry instantly without animation lag; transition interpolates over 150ms.",
      bestFor: "High-frequency streaming where animation queues must be avoided",
    },
    {
      name: "domain",
      type: '[number, number] | ["auto", "auto"]',
      default: '"auto"',
      required: false,
      category: "core",
      description: "Explicit Y-axis bounds. Single-value signals automatically expand to prevent zero-height scales.",
      bestFor: "Fixing scale bounds across multiple metric panels",
    },
    {
      name: "referenceLines",
      type: "readonly PulseReferenceLine[]",
      default: "undefined",
      required: false,
      category: "visual",
      description: "Array of horizontal threshold rules (e.g. SLO, SLA, capacity limit).",
      bestFor: "Operational threshold monitoring",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      category: "visual",
      description: "Toggles series legend. Disabled by default to save dashboard surface space.",
      bestFor: "Multi-panel consistency when required",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      category: "advanced",
      description: "Displays neutral loading skeleton while preserving chart layout footprint.",
      bestFor: "Initial stream connection",
    },
    {
      name: "error",
      type: "Error | string | null",
      default: "null",
      required: false,
      category: "advanced",
      description: "Displays actionable error state banner with optional retry trigger.",
      bestFor: "WebSocket or telemetry stream failure",
    },
    {
      name: "unavailable",
      type: "boolean | string | null",
      default: "null",
      required: false,
      category: "advanced",
      description: "Displays metric stream unavailability notice (e.g. tier limits or retention cutoffs).",
      bestFor: "Permission or stream retention boundaries",
    },
  ],

  examples: [
    {
      id: "throughput-signal",
      title: "API Request Throughput",
      description: "High-frequency operational throughput signal in QPS with rolling window and active terminal dot.",
      snippet: `<PulseLine
  data={throughputData}
  xKey="timestamp"
  seriesKey="qps"
  windowSize={30}
  showLatestPoint
  showLatestValue
  color="var(--chart-1, #10b981)"
/>`,
      props: {
        windowSize: 8,
        showLatestPoint: true,
        showLatestValue: true,
      },
    },
    {
      id: "latency-slo",
      title: "P99 Latency with SLO Threshold",
      description: "Telemetry latency signal with reference threshold rule at 100ms SLO target.",
      snippet: `<PulseLine
  data={latencyData}
  xKey="timestamp"
  seriesKey="latency"
  curve="linear"
  color="#3b82f6"
  referenceLines={[{ y: 100, label: "SLO 100ms" }]}
/>`,
      props: {
        curve: "linear",
        color: "#3b82f6",
      },
    },
    {
      id: "telemetry-outage",
      title: "Telemetry Outage (Truthful Gap)",
      description: "Demonstrating truthful missing-value handling when telemetry drops between sensors.",
      snippet: `<PulseLine
  data={sensorData}
  xKey="time"
  seriesKey="temp"
  missingValuePolicy="gap"
  color="#f59e0b"
/>`,
      props: {
        missingValuePolicy: "gap",
        color: "#f59e0b",
      },
    },
    {
      id: "queue-delta",
      title: "Signed Net Queue Delta",
      description: "Operational metric with positive and negative fluctuations around a zero baseline.",
      snippet: `<PulseLine
  data={queueDeltaData}
  xKey="minute"
  seriesKey="delta"
  color="var(--chart-1, #10b981)"
/>`,
      props: {
        color: "var(--chart-1, #10b981)",
      },
    },
  ],

  responsive: {
    overview: "Pulse Line adapts its tick intervals, latest value badge, and hit target padding dynamically based on available container width.",
    breakpoints: [
      {
        name: "Desktop (1024px+)",
        width: ">= 1024px",
        behavior: "Full horizontal interval resolution, prominent latest-value pill, spacious margin offsets.",
      },
      {
        name: "Tablet (640px - 1023px)",
        width: "640px - 1023px",
        behavior: "Adaptive tick thinning (preserving endpoints), compact latest pill, balanced axis footprint.",
      },
      {
        name: "Mobile (< 640px)",
        width: "< 640px",
        behavior: "Aggressive tick reduction (start and end ticks preserved), latest value inline rail, full touch scrub.",
      },
    ],
  },

  animation: {
    overview: "Direct updateMode applies live telemetry updates with 0ms delay to prevent animation queue buildup. Transition mode provides 150ms interpolation.",
    duration: "0ms (direct) / 150ms (transition)",
    refreshable: true,
  },

  interaction: {
    tooltip: "High-density monospace tooltip displaying exact timestamp and formatted metric value with nearest-X crosshair.",
    crosshair: "Vertical dashed stroke tracking pointer across the time domain for instant inspection.",
    legend: "Hidden by default to maximize operational dashboard surface area.",
  },

  accessibility: {
    role: "region",
    summary: "Screen-reader figure region with programmatic title, quantitative summary, and keyboard inspection.",
    screenReader: "VoiceOver and NVDA announce current value, sample count, and min/max extremes without flooding audio on every stream tick.",
    keyboardShortcuts: [
      { key: "Tab", action: "Focus chart interaction surface with visible focus ring" },
      { key: "ArrowLeft", action: "Select previous data observation" },
      { key: "ArrowRight", action: "Select next data observation" },
      { key: "Home", action: "Jump to first data point in visible window" },
      { key: "End", action: "Jump directly to latest live observation" },
      { key: "Escape", action: "Clear active selection" },
    ],
    colorIndependence: "Latest terminal dot renders distinct concentric outer ring; tooltips provide explicit numeric values.",
    reducedMotion: "Suppresses transitions and renders direct geometric positions when user requests reduced motion.",
  },

  sourceAnatomy: {
    tree: {
      name: "PulseLine",
      role: "Root figure wrapper",
      description: "Encapsulates rolling window derivation, keyboard navigation, and terminal marker rendering.",
      children: [
        {
          name: "ChartContainer",
          role: "CSS token bridge",
          description: "Scoped CSS variables for axes, grid, and crosshairs without global pollution.",
          children: [
            {
              name: "ResponsiveContainer",
              role: "Auto-sizing viewport",
              description: "Recharts container measuring width and height via ResizeObserver.",
              children: [
                { name: "LineChart", role: "SVG coordinator", description: "Calculates coordinate systems and margin offsets." },
                { name: "CartesianGrid", role: "Reference structure", description: "Subtle dashed horizontal dividers." },
                { name: "XAxis / YAxis", role: "Coordinate scales", description: "Compact tick density, zero ticklines, tabular numerals." },
                { name: "Tooltip (ChartTooltip)", role: "Interactive inspector", description: "Glassmorphic card with formatted values." },
                { name: "Line", role: "Visual data curve", description: "Operational stroke with terminal marker dot." },
              ],
            },
          ],
        },
      ],
    },
    sourceFiles: [
      { path: "components/charts/recharts/line-pulse.tsx", description: "Primary PulseLine React component implementation" },
      { path: "components/charts/shared/chart-container.tsx", description: "CSS variable token bridge and container wrapper" },
      { path: "components/charts/shared/chart-tooltip.tsx", description: "Tabular numerical inspection card" },
      { path: "components/charts/shared/chart-state.tsx", description: "Loading, empty, and error fallback states" },
      { path: "components/charts/shared/use-chart-reduced-motion.ts", description: "prefers-reduced-motion media query hook" },
    ],
    registryDependencies: ["chart-container", "chart-tooltip", "chart-state", "use-chart-reduced-motion"],
    npmDependencies: ["recharts"],
  },
}
