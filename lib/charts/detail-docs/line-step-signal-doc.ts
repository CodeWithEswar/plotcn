import type { ChartDetailDoc } from "./types"

export const lineStepSignalDoc: ChartDetailDoc = {
  chartId: "recharts-line-step-signal",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "005 / RECHARTS / LINE / STEP SIGNAL / PREVIEW",

  quickFacts: {
    bestFor:
      "Quotas, API rate plans, server capacity allocations, feature rollout tiers, and pricing schedules where values remain in effect until a discrete transition.",
    dataModel:
      "Readonly array of observations with a horizontal temporal/categorical key and active numeric level; no gradual slope interpolation.",
    interaction:
      "Synchronized nearest-X vertical crosshair, transition indicator badge, active level display, and optional prior state delta context.",
    responsive:
      "Container-driven auto tick scaling preserving every discrete transition boundary; never simplified into a diagonal slope.",
    animation:
      "Restrained reveal preserving stepped path geometry; immediate discrete step transitions; disabled under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Line with stepAfter/stepBefore/step in SVG (source-owned, zero proprietary runtime).",
  },

  dataFormat: {
    summary:
      "Accepts a readonly array of objects containing an ordered horizontal coordinate (date, quarter, or milestone) and an active numeric state level.",
    fields: [
      {
        field: "xKey",
        type: "string | number | Date",
        required: true,
        description:
          "Horizontal domain coordinate representing time, period, or an ordered discrete configuration milestone.",
      },
      {
        field: "seriesKey",
        type: "number | null | undefined",
        required: true,
        description:
          "Active numeric level or threshold in effect from this observation onward (e.g. limit, price, quota, or seats).",
      },
    ],
    nullPolicy:
      "Truthful gap policy by default (signal breaks at unrecorded intervals). Optional carry policy to persist the last known valid state.",
    orderingPolicy:
      "Caller must supply observations in ascending chronological or ordinal sequence; caller data is never mutated.",
    exampleRows: [
      { date: "Jan 01", limit: 10000 },
      { date: "Feb 01", limit: 10000 },
      { date: "Mar 01", limit: 15000 },
      { date: "Apr 15", limit: 12000 },
      { date: "May 01", limit: 12000 },
      { date: "Jun 01", limit: 20000 },
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
      description: "Property name for the horizontal X-axis domain (e.g. date, month, or sprint).",
      bestFor: "Domain coordinates",
    },
    {
      name: "seriesKey",
      type: "keyof TData & string",
      default: '"limit"',
      required: false,
      category: "core",
      description: "Property name for the numeric state value plotted with stepped geometry.",
      bestFor: "Primary state level",
    },
    {
      name: "stepMode",
      type: '"after" | "before" | "center"',
      default: '"after"',
      required: false,
      category: "core",
      description:
        "Semantic transition mode: 'after' takes effect at X and remains active onward; 'before' jumps immediately prior; 'center' transitions halfway.",
      bestFor: "Transition timing calibration",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "after", label: "After (Default)" },
        { value: "before", label: "Before" },
        { value: "center", label: "Center" },
      ],
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "carry"',
      default: '"gap"',
      required: false,
      category: "core",
      description:
        "Handling of null/undefined values: 'gap' breaks the line truthfully; 'carry' propagates the last known valid state.",
      bestFor: "Missing state semantics",
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
      bestFor: "Dashboard slot sizing",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 260, label: "Compact (260px)" },
        { value: 340, label: "Default (340px)" },
        { value: 420, label: "Spacious (420px)" },
      ],
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #10b981)"',
      required: false,
      category: "visual",
      description: "Primary theme stroke color for the stepped signal line.",
      bestFor: "Thematic branding",
      previewable: true,
      controlType: "color",
      controlOptions: [
        { value: "#10b981", label: "Emerald" },
        { value: "#0ea5e9", label: "Sky" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#f59e0b", label: "Amber" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to render subtle horizontal background reference gridlines.",
      bestFor: "Level comparison",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Grid On" },
        { value: false, label: "Grid Off" },
      ],
    },
    {
      name: "showTransitionDelta",
      type: "boolean",
      default: "false",
      required: false,
      category: "interaction",
      description:
        "Whether to compute and display the prior state level and quantitative change in the tooltip on transitions.",
      bestFor: "Transition inspection",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: false, label: "Delta Off" },
        { value: true, label: "Delta On" },
      ],
    },
    {
      name: "domain",
      type: '[number, number] | ["auto", "auto"]',
      default: '"auto"',
      required: false,
      category: "core",
      description: "Explicit Y-axis numeric domain, or auto calculated with safe padding.",
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to display the horizontal category axis with tick thinning.",
    },
    {
      name: "showYAxis",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to display the vertical numeric scale.",
    },
    {
      name: "showLegend",
      type: "boolean",
      default: "false",
      required: false,
      category: "visual",
      description: "Whether to display the chart legend. Single-series step signals keep this off by default.",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "n => n.toLocaleString()",
      required: false,
      category: "interaction",
      description: "Custom formatter for Y-axis ticks and tooltip state numbers.",
    },
    {
      name: "xFormatter",
      type: "(value: string | number) => string",
      default: "String",
      required: false,
      category: "interaction",
      description: "Custom formatter for X-axis tick labels.",
    },
    {
      name: "referenceLines",
      type: "StepReferenceLine[]",
      default: "[]",
      required: false,
      category: "visual",
      description: "Array of static horizontal reference lines representing quotas or SLAs.",
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
      default: '"Step Signal Chart"',
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
      description: "Long-form context describing what the discrete states represent.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      category: "advanced",
      description: "Renders a neutral loading skeleton preserving container footprint without fake steps.",
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
      description: "Renders a metric unavailability notice (e.g. unconfigured plan or missing policy model).",
    },
  ],

  examples: [
    {
      id: "api-quota-plan",
      title: "API Request Quota Plan",
      description:
        "Tiered request limits by quarter with stepAfter transitions ensuring limits remain constant throughout billing periods.",
      snippet: `<StepSignal data={quotaData} xKey="period" seriesKey="limit" label="Request Limit" stepMode="after" />`,
      props: { stepMode: "after", label: "Request Limit", height: 260 },
    },
    {
      id: "pricing-progression",
      title: "SaaS Subscription Pricing History",
      description:
        "Discrete pricing tier changes over 2 years with localized currency formatting and transition delta inspection.",
      snippet: `<StepSignal data={pricingData} xKey="date" seriesKey="price" label="Monthly Subscription" color="#0ea5e9" showTransitionDelta valueFormatter={(v) => \`$\${v}/mo\`} />`,
      props: { stepMode: "after", color: "#0ea5e9", label: "Monthly Subscription", showTransitionDelta: true, height: 260 },
    },
    {
      id: "capacity-schedule",
      title: "Worker Pool Allocation (Carry Policy)",
      description:
        "Provisioned compute workers using carry policy across unobserved maintenance windows without dropping to zero.",
      snippet: `<StepSignal data={workerData} xKey="hour" seriesKey="workers" label="Allocated Workers" missingValuePolicy="carry" color="#8b5cf6" />`,
      props: { missingValuePolicy: "carry", color: "#8b5cf6", label: "Allocated Workers", height: 260 },
    },
    {
      id: "rollout-percentage",
      title: "Feature Flag Rollout Schedule",
      description:
        "Staged feature rollout percentages across deployment stages with centered step transitions.",
      snippet: `<StepSignal data={rolloutData} xKey="stage" seriesKey="rollout" label="Rollout %" stepMode="center" color="#f59e0b" valueFormatter={(v) => \`\${v}%\`} />`,
      props: { stepMode: "center", color: "#f59e0b", label: "Rollout %", height: 260 },
    },
  ],

  responsive: {
    overview:
      "Step Signal preserves every discrete transition boundary across all container widths. Responsive thinning reduces non-essential tick labels without smoothing or simplifying the stepped geometry.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full transition inspection, formatted transition delta context, all horizontal X ticks, and room for reference threshold badges.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Thinned X-axis labels, preserved step corners, compact margins, tooltip pinned within viewport boundaries.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Edge-to-edge scrub inspection, preserved state change points, zero diagonal slope simplification, touch-first scrub interaction.",
      },
    ],
  },

  animation: {
    overview:
      "Stepped paths reveal horizontally (350ms) while strictly maintaining 90° rectangular step geometry. Updates transition immediately without diagonal interpolation.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized high-contrast tooltip displays current state level and optional previous state delta upon hovering transition boundaries.",
    crosshair: "Subtle vertical dashed crosshair aligned precisely with the active observation coordinate.",
  },

  accessibility: {
    role: "region",
    summary:
      "Factual screen reader announcement reporting observation count, transition count, initial state value, and final state value.",
    screenReader:
      "Values remain level between observations and change at discrete transition points.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Advance to the next observation or transition point." },
      { key: "ArrowLeft", action: "Navigate to the previous observation or transition point." },
      { key: "Home", action: "Jump directly to the initial observation state." },
      { key: "End", action: "Jump directly to the latest observation state." },
      { key: "Escape", action: "Dismiss active tooltip inspection and reset focus." },
    ],
    colorIndependence:
      "Geometry alone communicates state persistence and transitions; zero color reliance for understanding level changes.",
    reducedMotion:
      "Animations disable automatically under prefers-reduced-motion; final stepped geometry renders instantaneously.",
  },

  sourceAnatomy: {
    tree: {
      name: "StepSignal",
      role: "Root figure wrapper with keyboard navigation and ARIA accessibility shell",
      description: "Orchestrates data normalization, transition counting, safe domain scaling, and SVG rendering",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive viewport host",
          description: "Manages container constraints and CSS variable token mapping",
        },
        {
          name: "LineChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Synchronizes horizontal X-axis, vertical Y-axis, grid, and stepped line paths",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference gridlines",
              description: "Subtle horizontal reference lines at standard domain intervals",
            },
            {
              name: "XAxis & YAxis",
              role: "Domain coordinates",
              description: "Thinned category tick labels and honest value domain scaling",
            },
            {
              name: "Line",
              role: "Stepped geometry renderer",
              description: "Draws square 90° transitions using stepAfter, stepBefore, or step curve types",
            },
            {
              name: "Tooltip",
              role: "Inspection overlay",
              description: "Displays current state value, transition indicator, and delta from prior level",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/line-step-signal.tsx",
        description: "Pure Recharts Step Signal component with data normalization, transition logic, and a11y shell",
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
