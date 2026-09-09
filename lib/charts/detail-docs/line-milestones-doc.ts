import type { ChartDetailDoc } from "./types"

export const lineMilestonesDoc: ChartDetailDoc = {
  chartId: "recharts-line-milestones",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "006 / RECHARTS / LINE / MILESTONE LINE / PREVIEW",

  quickFacts: {
    bestFor:
      "Product launches, major version releases, incident annotations, marketing campaigns, and policy changes along a quantitative time-series trend.",
    dataModel:
      "Separated architecture: readonly observation series records alongside a sparse, intentional milestone collection with stable IDs.",
    interaction:
      "Standard nearest-X trend inspection plus direct milestone pin hover/focus with detailed event context, same-X event grouping, and mobile detail surfaces.",
    responsive:
      "Container-driven deterministic collision algorithm: collapses dense text labels into compact pins on mobile while preserving 100% of event positions.",
    animation:
      "Calm entrance reveal with subtle milestone fade; zero bouncing or neon pins; immediate rendering under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Cartesian SVG with native ReferenceLine guides and React-owned top annotation lane (source-first, zero D3 or layout engine dependencies).",
  },

  dataFormat: {
    summary:
      "Separates numeric trend observations from contextual milestone records so events can exist independently without polluting observation rows.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description:
          "Horizontal domain coordinate representing time, period, or month.",
      },
      {
        field: "seriesKey",
        type: "number | null | undefined",
        required: true,
        description:
          "Numeric series value representing the quantitative metric trend.",
      },
      {
        field: "milestones",
        type: "Milestone[]",
        required: false,
        description:
          "Sparse collection of event markers: { id: string, x: XValue, label: string, description?: string }.",
      },
    ],
    nullPolicy:
      "Missing metric values create an honest gap in the trend line; milestone guides and pins at that X coordinate remain completely visible and discoverable without fabricating data.",
    orderingPolicy:
      "Observations should be chronologically ordered. Milestones are automatically sorted by resolved domain position for deterministic collision handling while preserving caller input order.",
    exampleRows: [
      { date: "Jan", users: 45000 },
      { date: "Feb", users: 52000 },
      { date: "Mar", users: 58000 },
      { date: "Apr", users: 63000 },
      { date: "May", users: 78000 },
      { date: "Jun", users: 84000 },
      { date: "Jul", users: 95000 },
      { date: "Aug", users: 104000 },
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
      default: '"users"',
      required: false,
      category: "core",
      description: "Property name for the numeric metric value plotted as the trend line.",
      bestFor: "Quantitative trend series",
    },
    {
      name: "milestones",
      type: "readonly Milestone<XVal>[]",
      default: "[]",
      required: false,
      category: "core",
      description:
        "Sparse contextual milestone moments: { id: string, x: XVal, label: string, description?: string }.",
      bestFor: "Contextual events",
    },
    {
      name: "curve",
      type: '"monotone" | "linear" | "natural" | "step"',
      default: '"monotone"',
      required: false,
      category: "visual",
      description: "Interpolation curve applied to the quantitative trend line.",
      bestFor: "Line geometry aesthetic",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "monotone", label: "Monotone (Smooth)" },
        { value: "linear", label: "Linear" },
        { value: "natural", label: "Natural" },
        { value: "step", label: "Step" },
      ],
    },
    {
      name: "missingValuePolicy",
      type: '"gap" | "connect"',
      default: '"gap"',
      required: false,
      category: "core",
      description:
        "Handling of null/undefined series values: 'gap' leaves an honest break; 'connect' bridges across missing points.",
      bestFor: "Missing value integrity",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Default)" },
        { value: "connect", label: "Connect" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "360",
      required: false,
      category: "core",
      description: "Container height in pixels or standard CSS dimension strings.",
      bestFor: "Slot sizing",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 280, label: "Compact (280px)" },
        { value: 360, label: "Default (360px)" },
        { value: 440, label: "Spacious (440px)" },
      ],
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #3b82f6)"',
      required: false,
      category: "visual",
      description: "Primary theme stroke color for the trend line.",
      bestFor: "Brand identity",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#3b82f6", label: "Blue" },
        { value: "#10b981", label: "Emerald" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#f59e0b", label: "Amber" },
      ],
    },
    {
      name: "showMilestoneGuides",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to render thin vertical dashed reference guides from the top annotation lane.",
      bestFor: "Event alignment clarity",
      previewable: true,
      controlType: "switch",
    },
    {
      name: "milestoneColor",
      type: "string",
      default: '"var(--chart-milestone-pin, #71717a)"',
      required: false,
      category: "visual",
      description: "Stroke and pin color for contextual milestone markers and guides.",
      bestFor: "Event marker styling",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#71717a", label: "Zinc" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#f59e0b", label: "Amber" },
        { value: "#f43f5e", label: "Rose" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to display subtle horizontal background reference gridlines.",
    },
    {
      name: "showXAxis",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Whether to display the horizontal category scale.",
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
      description: "Whether to display the chart legend. Single-series milestone charts keep this off by default.",
    },
    {
      name: "valueFormatter",
      type: "(value: number) => string",
      default: "n => n.toLocaleString()",
      required: false,
      category: "interaction",
      description: "Custom formatter for Y-axis ticks and tooltip metric values.",
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
      default: '"Milestone Line Chart"',
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
      description: "Long-form context describing the trend and milestones.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      required: false,
      category: "advanced",
      description: "Renders a neutral loading skeleton without fake milestone pins.",
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
      id: "product-growth",
      title: "Product Growth & Milestones",
      description:
        "Monthly active users with sparse event pins for pricing changes, mobile releases, and enterprise launches.",
      snippet: `<MilestoneLine data={growthData} xKey="date" series={{ key: "users", label: "Active users" }} milestones={growthMilestones} />`,
      props: { height: 360, color: "#3b82f6" },
    },
    {
      id: "latency-incidents",
      title: "API Latency & Operational Interventions",
      description:
        "P99 latency trend annotated with infrastructure migration and cache deployment milestones without asserting causality.",
      snippet: `<MilestoneLine data={latencyData} xKey="hour" seriesKey="latency" label="P99 Latency (ms)" color="#f59e0b" milestones={incidentMilestones} valueFormatter={(v) => \`\${v}ms\`} />`,
      props: { height: 360, color: "#f59e0b" },
    },
    {
      id: "marketing-campaigns",
      title: "Organic Signups & Marketing Campaigns",
      description:
        "Signups trajectory alongside major marketing pushes and seasonal campaign activations.",
      snippet: `<MilestoneLine data={campaignData} xKey="week" seriesKey="signups" label="Signups" color="#10b981" milestones={campaignMilestones} />`,
      props: { height: 360, color: "#10b981" },
    },
    {
      id: "same-date-grouping",
      title: "Same-Date Grouped Milestones",
      description:
        "Demonstrates automatic grouped badge handling (● 2) and combined inspection when multiple events occur on the same date.",
      snippet: `<MilestoneLine data={growthData} xKey="date" seriesKey="users" milestones={sameDateMilestones} color="#8b5cf6" />`,
      props: { height: 360, color: "#8b5cf6" },
    },
  ],

  responsive: {
    overview:
      "Milestone Line uses container-driven deterministic collision handling. On narrow viewports, dense text labels collapse into compact pins, preserving 100% of event positions and interaction discoverability without clipping or overlapping.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Persistent text labels in top annotation lane with 2-lane staggering if helpful, full event guides, nearest-X trend tooltips, and rich milestone inspection.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Thinned X-axis labels, preserved milestone pins, selective label display, tooltip pinned within viewport boundaries.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Pin markers preserved across all events, dense labels collapsed, touch-first selection opens dedicated below-chart active event detail strip.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance reveal for the line followed by a subtle fade for milestone markers. Respects prefers-reduced-motion by rendering instantaneously.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Dual inspection architecture: standard scrub reveals nearest-X metric datum; hovering or focusing a milestone pin prioritizes event details and date context.",
    crosshair: "Thin vertical dashed crosshair aligned precisely with the active domain coordinate.",
  },

  accessibility: {
    role: "region",
    summary:
      "Factual screen reader announcement reporting observation count and milestone event details without inferring causal links.",
    screenReader:
      "Announces trend observations alongside sparse event moments factually.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next observation along the timeline." },
      { key: "ArrowLeft", action: "Inspect previous observation along the timeline." },
      { key: "Tab", action: "Focus individual milestone pin markers in the annotation lane." },
      { key: "Enter / Space", action: "Activate and lock the focused milestone details." },
      { key: "Escape", action: "Dismiss active milestone inspection and reset focus." },
    ],
    colorIndependence:
      "Geometric pin markers and text badges communicate milestone identity; zero reliance on color alone to convey meaning.",
    reducedMotion:
      "Transitions disable automatically under prefers-reduced-motion; final trend and milestones render immediately.",
  },

  sourceAnatomy: {
    tree: {
      name: "MilestoneLine",
      role: "Root figure wrapper with keyboard navigation and ARIA accessibility shell",
      description: "Orchestrates observation normalization, milestone grouping, collision resolution, and SVG layout",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive viewport host",
          description: "Manages container constraints and ResizeObserver width updates for collision resolution",
        },
        {
          name: "LineChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Synchronizes horizontal X-axis, vertical Y-axis, grid, and trend line paths",
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
              name: "RechartsReferenceLine (Milestones)",
              role: "Event guides & pins",
              description: "Computes exact pixel X coordinates and renders vertical guide lines with interactive pins",
            },
            {
              name: "Line",
              role: "Trend line renderer",
              description: "Draws the quantitative trend line with optional honest gap handling for missing data",
            },
            {
              name: "Tooltip",
              role: "Dual inspection overlay",
              description: "Displays series metric value or prioritized milestone event details on hover/selection",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/line-milestones.tsx",
        description: "Pure Recharts Milestone Line component with data normalization, collision logic, and a11y shell",
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
