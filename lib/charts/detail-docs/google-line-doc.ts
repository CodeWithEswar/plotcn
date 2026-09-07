import type { ChartDetailDoc } from "./types"

export const googleLineDoc: ChartDetailDoc = {
  chartId: "google-line",
  engine: "google",
  category: "line",
  renderer: "google-runtime",
  status: "stable",
  blueprint: "GOOGLE / CORECHART / LINE / RESPONSIVE / STABLE",

  quickFacts: {
    bestFor: "Time-series continuous trends, financial telemetry, and Google ecosystem dashboards",
    dataModel: "Categorical / Temporal X-axis label + Numeric continuous Y value",
    interaction: "Hover datum focus crosshair, automatic dark glass tooltip",
    responsive: "Container-driven via ResizeObserver with frame-synced redraw",
    animation: "Google native easing transition on initial mount and update",
    runtime: "Google Visualization corechart (cdn.gstatic.com, lazy-loaded)",
  },

  dataFormat: {
    summary:
      "Expects an array of objects. By default, records require a label (string/date) and a value (number). Keys are fully customizable via labelKey and valueKey.",
    fields: [
      {
        field: "label",
        type: "string | number | Date",
        required: true,
        description: "Domain coordinate for the horizontal axis. Formatted as category or timestamp.",
      },
      {
        field: "value",
        type: "number",
        required: true,
        description: "Metric magnitude mapped to vertical coordinate. Finite positive or negative numbers.",
      },
      {
        field: "[key: string]",
        type: "any",
        required: false,
        description: "Additional metadata keys (e.g. metadata tooltip, category tag) passed safely without interfering.",
      },
    ],
    nullPolicy: "Null or undefined values produce a line gap. Missing points do not crash the visualization.",
    orderingPolicy: "Records should be ordered monotonically by X-axis coordinate to ensure contiguous left-to-right drawing.",
    exampleRows: [
      { label: "Jan", value: 186 },
      { label: "Feb", value: 305 },
      { label: "Mar", value: 237 },
      { label: "Apr", value: 273 },
      { label: "May", value: 309 },
      { label: "Jun", value: 414 },
    ],
  },

  props: [
    {
      name: "data",
      type: "GoogleLineDatum[]",
      default: "—",
      required: true,
      category: "core",
      description: "Array of structured data records to bind to the Google Visualization DataTable.",
      bestFor: "Primary dataset source",
    },
    {
      name: "curveType",
      type: '"function" | "none"',
      default: '"function"',
      required: false,
      category: "visual",
      description: "Controls curve interpolation geometry. 'function' produces a smooth spline; 'none' draws straight linear segments.",
      bestFor: "Continuous smooth metric trends (function) or discrete financial step trends (none)",
      values: ["function", "none"],
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "function", label: "Smooth (Spline)" },
        { value: "none", label: "Straight (Linear)" },
      ],
    },
    {
      name: "pointSize",
      type: "number",
      default: "0",
      required: false,
      category: "visual",
      description: "Radius in pixels of individual data point markers along the line. Set to 0 to show line only.",
      bestFor: "Highlighting individual discrete observations (e.g. 5) vs clean minimalist lines (0)",
      values: ["0", "5", "8"],
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0, label: "None (0px)" },
        { value: 5, label: "Medium (5px)" },
        { value: 8, label: "Large (8px)" },
      ],
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      required: false,
      category: "visual",
      description: "Toggles visibility of horizontal background gridlines on the vertical numeric axis.",
      bestFor: "Aiding value readability across wide containers",
      values: ["true", "false"],
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Grid On" },
        { value: false, label: "Grid Off" },
      ],
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #10b981)"',
      required: false,
      category: "visual",
      description: "Primary theme stroke color. Accepts CSS variables (e.g. var(--chart-2)) or valid hex/rgb strings.",
      bestFor: "Brand color harmonization and multi-chart dashboards",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#10b981", label: "Emerald" },
        { value: "#0ea5e9", label: "Sky" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#f59e0b", label: "Amber" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      category: "core",
      description: "Total height of the chart container in pixels or CSS units.",
      bestFor: "Dashboard cards and full-width analytics rows",
    },
    {
      name: "labelKey",
      type: "string",
      default: '"label"',
      required: false,
      category: "core",
      description: "Key name in data objects corresponding to the horizontal axis category or date.",
      bestFor: "Mapping custom API payloads without client-side reshaping",
    },
    {
      name: "valueKey",
      type: "string",
      default: '"value"',
      required: false,
      category: "core",
      description: "Key name in data objects corresponding to the vertical numeric value.",
      bestFor: "Selecting specific metric columns from normalized records",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      required: false,
      category: "advanced",
      description: "Tailwind CSS classes or custom stylesheet class applied to the outer figure container.",
    },
  ],

  examples: [
    {
      id: "smooth-spline",
      title: "Smooth Spline (Default)",
      description: "Continuous metric visualization using Google's function spline interpolation.",
      snippet: `<GoogleLine data={monthlyData} curveType="function" color="#10b981" />`,
      props: { curveType: "function", pointSize: 0, color: "#10b981" },
    },
    {
      id: "linear-points",
      title: "Linear Line with Point Markers",
      description: "Straight line interpolation with highlighted 5px circular markers at each observation.",
      snippet: `<GoogleLine data={monthlyData} curveType="none" pointSize={5} color="#0ea5e9" />`,
      props: { curveType: "none", pointSize: 5, color: "#0ea5e9" },
    },
    {
      id: "minimalist-gridless",
      title: "Clean Gridless Sparkline",
      description: "Minimalist presentation with gridlines suppressed for clean telemetry cards.",
      snippet: `<GoogleLine data={monthlyData} showGrid={false} color="#8b5cf6" height={220} />`,
      props: { showGrid: false, color: "#8b5cf6", height: 220 },
    },
  ],

  responsive: {
    overview:
      "Uses a ResizeObserver on the container element. When dimensions change, Google Line recalculates SVG coordinate paths to match parent bounds.",
    breakpoints: [
      {
        name: "Desktop (Wide)",
        width: "1100px+",
        behavior: "Full horizontal grid span, 85% width chart area, all categorical X-axis labels rendered.",
      },
      {
        name: "Tablet (Mid)",
        width: "768px",
        behavior: "Chart area automatically adjusts; axis labels rotate or decimate if space constraints require.",
      },
      {
        name: "Mobile (Compact)",
        width: "390px",
        behavior: "Tightened margins, touch-friendly tap targets, single-column dashboard layout compatibility.",
      },
    ],
  },

  animation: {
    overview:
      "Leverages Google Visualization native corechart transition animation on initial load and theme changes.",
    duration: "400ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Hovering over the line triggers Google Visualization's native tooltip with dark glassmorphic styling inherited from Plotcn theme CSS variables (--chart-tooltip-foreground, --chart-background).",
    crosshair:
      "Focus line follows cursor position across the chart domain to inspect exact point values.",
  },

  accessibility: {
    role: 'figure[role="region"] with aria-label',
    summary:
      "Encapsulated within semantic HTML5 <figure> with explicit region landmark, assistive screen-reader summary paragraph, and color-contrast verified typography.",
    screenReader: "Line chart rendered with Google Charts corechart package displaying trend values.",
    keyboardShortcuts: [
      { key: "Tab", action: "Focus chart container and navigate through interactive regions." },
      { key: "Escape", action: "Dismiss active tooltip overlay or popover inspector." },
    ],
    colorIndependence:
      "Line geometry is complemented by coordinate axis baseline and optional distinct point markers to avoid reliance on color hue alone.",
    reducedMotion: "Honors prefers-reduced-motion by suppressing transition duration.",
  },

  sourceAnatomy: {
    tree: {
      name: "GoogleLine",
      role: "Component Entry",
      description: "Main React wrapper; manages Google DataTable conversion, theme token extraction, and ResizeObserver.",
      children: [
        {
          name: "GoogleChartContainer",
          role: "Lifecycle Shell",
          description: "Semantic <figure> providing glassmorphic loading spinner, error fallback, and accessibility tags.",
        },
        {
          name: "google-chart-loader",
          role: "Singleton Loader",
          description: "Async loader ensuring https://www.gstatic.com/charts/loader.js is fetched at most once across the application.",
        },
        {
          name: "Google Visualization corechart",
          role: "Hosted SVG Engine",
          description: "Google's LineChart class drawing vector paths onto the measured container div.",
        },
      ],
    },
    sourceFiles: [
      { path: "registry/google/google-line.tsx", description: "Primary component source file." },
      { path: "registry/google/google-chart-container.tsx", description: "Loading, error, and frame container." },
      { path: "registry/google/google-chart-loader.ts", description: "Deduplicated Google Charts package loader." },
    ],
    registryDependencies: ["google-chart-container", "google-chart-loader"],
    npmDependencies: [],
  },
}
