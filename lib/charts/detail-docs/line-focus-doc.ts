import type { ChartDetailDoc } from "./types"

export const lineFocusDoc: ChartDetailDoc = {
  chartId: "recharts-line-focus",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "008 / RECHARTS / LINE / FOCUS LINE / PREVIEW",

  quickFacts: {
    bestFor:
      "Precise observation inspection, keyboard-first navigation, pointer scrubbing, and persistent locked tooltips for detailed time-series exploration.",
    dataModel:
      "Ordered temporal or categorical observations for a single primary numeric series. Missing observations remain gaps truthfully without synthetic interpolation or null-to-zero conversion.",
    interaction:
      "Nearest-X horizontal scrubbing across the full plot frame, keyboard exploration via Left/Right arrows and Home/End, click or Enter to lock, Escape to release.",
    responsive:
      "Container-driven responsive layout with adaptive X ticks, safe tooltip positioning within the chart frame, and preserved locked selection across screen resizing.",
    animation:
      "Restrained entrance draw animation that never replays on interaction; instant zero-lag marker and crosshair tracking during active scrubbing.",
    runtime:
      "Pure Recharts Cartesian SVG with decoupled semantic styling: chart focus (--chart-focus), transient active point (color), and locked concentric marker (selectionColor).",
  },

  dataFormat: {
    summary:
      "Accepts ordered chronological or categorical observations with a single primary series. Missing numeric values remain explicit gaps without fabricating intermediate pixels.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing time, timestamp, or ordered category.",
      },
      {
        field: "series",
        type: "{ key: string; label: string }",
        required: true,
        description: "Single primary series descriptor declaring the numeric value key and user-facing label.",
      },
    ],
    nullPolicy:
      "Null or non-finite values create an honest visual break in the line ('gap' policy). Tooltips report the value as unavailable rather than converting to zero.",
    orderingPolicy:
      "Observations must be ordered along the domain axis. Pointer scrubbing and keyboard arrows step deterministically through the ordered sequence.",
    exampleRows: [
      { time: "09:00", latency: 122 },
      { time: "10:00", latency: 138 },
      { time: "11:00", latency: 147 },
      { time: "12:00", latency: 133 },
      { time: "13:00", latency: 164 },
      { time: "14:00", latency: 181 },
      { time: "15:00", latency: 156 },
    ],
  },

  props: [
    {
      name: "data",
      type: "readonly TData[]",
      default: "[]",
      required: true,
      category: "core",
      description: "Readonly array of ordered observation records. Caller data is never mutated.",
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
      name: "series",
      type: "FocusSeriesConfig<TData>",
      default: "—",
      required: true,
      category: "core",
      description: "Configuration for the single primary numeric series ({ key, label }).",
      bestFor: "Primary metric",
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #3b82f6)"',
      required: false,
      category: "visual",
      description: "Primary theme stroke color for the trend line, transient active marker, and tooltip identity.",
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
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection, #f59e0b)"',
      required: false,
      category: "visual",
      description: "Accent color for the locked concentric marker (───◎───) and persistent inspection highlight.",
      bestFor: "Locked selection accent",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#f59e0b", label: "Amber" },
        { value: "#ef4444", label: "Red" },
        { value: "#10b981", label: "Emerald" },
        { value: "#8b5cf6", label: "Purple" },
      ],
    },
    {
      name: "lockableTooltip",
      type: "boolean",
      default: "true",
      required: false,
      category: "interaction",
      description: "Allows users to pin the inspected observation via click, tap, or Enter/Space keys.",
      bestFor: "Persistent comparison",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "initialFocus",
      type: '"none" | "first" | "last"',
      default: '"none"',
      required: false,
      category: "interaction",
      description: "Datum selection state when the chart first receives keyboard focus.",
      bestFor: "Keyboard exploration",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "None (Wait for Arrow)" },
        { value: "first", label: "First Observation" },
        { value: "last", label: "Last Observation" },
      ],
    },
    {
      name: "curve",
      type: '"linear" | "monotone" | "step"',
      default: '"monotone"',
      required: false,
      category: "visual",
      description: "Curve interpolation algorithm for the continuous trend line.",
      bestFor: "Trend aesthetics",
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
      type: '[number, number] | ["auto", "auto"]',
      default: '["auto", "auto"]',
      required: false,
      category: "core",
      description: "Vertical Y-axis scale range. 'auto' computes a padded domain safeguarding against zero span.",
      bestFor: "Scale limits",
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      category: "core",
      description: "Container height in pixels or standard CSS dimension strings.",
      bestFor: "Viewport sizing",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 280, label: "Compact (280px)" },
        { value: 320, label: "Default (320px)" },
        { value: 400, label: "Spacious (400px)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to render subtle horizontal Cartesian grid reference lines.",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      category: "visual",
      description: "Whether to display the series legend below the chart.",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "carry"',
      default: '"gap"',
      required: false,
      category: "core",
      description: "Behavior for null or undefined observations: 'gap' breaks the line truthfully; 'carry' holds last valid value.",
    },
    {
      name: "animation",
      type: '"draw" | "fade" | "none"',
      default: '"draw"',
      required: false,
      category: "advanced",
      description: "Entry animation style. Respects user prefers-reduced-motion preferences automatically.",
    },
    {
      name: "onActiveDatumChange",
      type: "(datum: ActiveDatum<TData> | null) => void",
      default: "undefined",
      required: false,
      category: "interaction",
      description: "Callback invoked whenever the transiently inspected observation changes.",
    },
    {
      name: "onLockedDatumChange",
      type: "(datum: ActiveDatum<TData> | null) => void",
      default: "undefined",
      required: false,
      category: "interaction",
      description: "Callback invoked when an observation is pinned (locked) or released (unlocked).",
    },
    {
      name: "title",
      type: "string",
      default: '"Focus Line Chart"',
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
      description: "Accessible description detailing keyboard shortcuts and inspection instructions.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      category: "advanced",
      description: "Renders a neutral loading skeleton without fabricating artificial observations.",
    },
    {
      name: "error",
      type: "Error | string | null",
      default: "null",
      required: false,
      category: "advanced",
      description: "Displays an actionable error banner when data fails to load.",
    },
    {
      name: "unavailable",
      type: "boolean | string | null",
      default: "false",
      required: false,
      category: "advanced",
      description: "Displays an unavailability notice when metrics cannot be resolved.",
    },
  ],

  examples: [
    {
      id: "request-latency",
      title: "P95 Request Latency Inspection",
      description:
        "High-precision hourly API latency trend demonstrating nearest-X scrub inspection with neutral crosshairs.",
      snippet: `<FocusLine data={latencyData} xKey="time" series={{ key: "latency", label: "P95 latency" }} lockableTooltip />`,
      props: { height: 320, color: "#3b82f6", selectionColor: "#f59e0b" },
    },
    {
      id: "keyboard-first",
      title: "Keyboard-First Exploration",
      description:
        "Accessible single-tab-stop exploration. Tab into the chart, then navigate using Left and Right Arrow keys.",
      snippet: `<FocusLine data={latencyData} xKey="time" series={{ key: "latency", label: "P95 latency" }} initialFocus="first" lockableTooltip />`,
      props: { height: 320, color: "#0ea5e9", selectionColor: "#10b981" },
    },
    {
      id: "locked-tooltip",
      title: "Persistent Locked Observation",
      description:
        "Click or press Enter on an observation to lock it. The tooltip and concentric marker persist when moving the pointer away.",
      snippet: `<FocusLine data={latencyData} xKey="time" series={{ key: "latency", label: "P95 latency" }} lockableTooltip selectionColor="#ec4899" />`,
      props: { height: 320, color: "#8b5cf6", selectionColor: "#ec4899" },
    },
    {
      id: "missing-telemetry",
      title: "Truthful Gap Handling for Missing Data",
      description:
        "Missing observations create an honest break in the trend line without fabricating intermediate values or converting null to zero.",
      snippet: `<FocusLine data={gappyData} xKey="time" series={{ key: "latency", label: "P95 latency" }} missingValuePolicy="gap" lockableTooltip />`,
      props: { height: 320, color: "#f59e0b", selectionColor: "#ef4444" },
    },
  ],

  responsive: {
    overview:
      "Focus Line uses container-driven measurement to adapt tick frequency and tooltip sizing. Active and locked observations remain anchored cleanly across container resizes.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full X-axis ticks, spacious margins, complete tooltip readouts, and unconstrained inspection hover area.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Reduced tick frequency, compact padding, preserved crosshairs, and synchronized scrub tracking.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Single-tap inspection, pan-y touch action ensuring normal page scrolling is never blocked, and compact clamped tooltip.",
      },
    ],
  },

  animation: {
    overview:
      "Gentle entrance draw for initial page loads. During active scrubbing or keyboard navigation, marker and crosshair updates occur with zero lag. Bypassed under prefers-reduced-motion.",
    duration: "300ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection tooltip showing domain timestamp, formatted series value, and locked status badge when pinned.",
    crosshair:
      "Vertical neutral dashed crosshair aligned precisely to the active observation X-coordinate, persisting when locked.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter, and Escape shortcuts. Screen readers announce factual observation values without spamming live regions.",
    screenReader:
      "Announces domain time, series label, and metric value factually for the focused observation.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next observation in the series." },
      { key: "ArrowLeft", action: "Inspect previous observation in the series." },
      { key: "Home", action: "Jump inspection to the first observation." },
      { key: "End", action: "Jump inspection to the last observation." },
      { key: "Enter / Space", action: "Lock or unlock the currently active observation." },
      { key: "Escape", action: "Release locked selection and dismiss active tooltip." },
    ],
    colorIndependence:
      "Locked selection uses a distinctive concentric double-ring marker (───◎───) in addition to color accent, ensuring full accessibility without relying on color alone.",
    reducedMotion:
      "All entrance transitions immediately bypass when prefers-reduced-motion is detected in system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "FocusLine",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description: "Manages data normalization, safe domain calculation, tri-state interaction model, and SVG composition",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and CSS token scoping",
        },
        {
          name: "LineChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, Cartesian grid, and primary trend line",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the signal",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Category tick labels and auto-padded vertical scale",
            },
            {
              name: "Tooltip (FocusTooltipContent)",
              role: "Synchronized inspection overlay",
              description: "Displays active datum value with lock status indicator and series color marker",
            },
            {
              name: "Line",
              role: "Continuous trend signal",
              description: "Renders primary trend stroke with custom active/locked dot shapes",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/line-focus.tsx",
        description: "Complete Focus Line component with nearest-X scrubbing, lockable tooltip, and keyboard navigation",
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
