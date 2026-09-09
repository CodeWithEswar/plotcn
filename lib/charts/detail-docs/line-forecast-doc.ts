import type { ChartDetailDoc } from "./types"

export const lineForecastDoc: ChartDetailDoc = {
  chartId: "recharts-line-forecast",
  engine: "recharts",
  category: "line",
  renderer: "svg",
  status: "preview",
  blueprint: "010 / RECHARTS / LINE / FORECAST LINE / PREVIEW",

  quickFacts: {
    bestFor:
      "Visualizing observed historical trends transitioning into predicted future values with explicit non-color styling and optional uncertainty confidence bands.",
    dataModel:
      "Ordered chronological or categorical observations containing an observed actual series, a predicted forecast series, and optional lower/upper prediction interval bounds.",
    interaction:
      "Nearest-X horizontal scrubbing resolving actual and forecast metrics simultaneously, persistent tooltip pinning via click or Enter/Space, and interactive role visibility toggling in the legend.",
    responsive:
      "Container-driven responsive layout that preserves the solid vs. dashed distinction and confidence range across all viewport sizes without dropping uncertainty data.",
    animation:
      "Restrained entrance draw animation with smooth transition across the historical and predicted timeline; zero-lag cursor and crosshair updates during pointer exploration.",
    runtime:
      "Pure Recharts Cartesian ComposedChart SVG combining Area (confidence band), solid Line (observed history), dashed Line (forecast trajectory), and neutral vertical crosshair.",
  },

  dataFormat: {
    summary:
      "Accepts ordered chronological records where each row contains the domain coordinate, actual observed value, predicted forecast value, and optional lower/upper bounds.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing date, month, quarter, or time point.",
      },
      {
        field: "series",
        type: "ForecastLineSeries<TData>",
        required: true,
        description: "Semantic series descriptor declaring actualKey, forecastKey, optional lowerKey, upperKey, and display labels.",
      },
    ],
    nullPolicy:
      "Missing actual or forecast values create truthful visual breaks without coercing null to zero (null != 0). Missing bounds locally omit the confidence area without fabricating fake ranges.",
    orderingPolicy:
      "Observations must be ordered along the domain timeline. The transition boundary is derived factually from the first forecast observation.",
    exampleRows: [
      { month: "Jan", actual: 82, forecast: null, lower: null, upper: null },
      { month: "Feb", actual: 91, forecast: null, lower: null, upper: null },
      { month: "Mar", actual: 98, forecast: null, lower: null, upper: null },
      { month: "Apr", actual: 104, forecast: 104, lower: 104, upper: 104 },
      { month: "May", actual: null, forecast: 112, lower: 102, upper: 122 },
      { month: "Jun", actual: null, forecast: 119, lower: 106, upper: 132 },
      { month: "Jul", actual: null, forecast: 126, lower: 110, upper: 142 },
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
      type: "ForecastLineSeries<TData>",
      default: "—",
      required: true,
      category: "core",
      description: "Semantic configuration object specifying actualKey, forecastKey, optional lowerKey, upperKey, and labels.",
      bestFor: "Semantic role mapping",
    },
    {
      name: "actualColor",
      type: "string",
      default: '"var(--chart-1, #3b82f6)"',
      required: false,
      category: "visual",
      description: "Stroke color for the solid observed historical line and past observation markers.",
    },
    {
      name: "forecastColor",
      type: "string",
      default: '"var(--chart-2, #10b981)"',
      required: false,
      category: "visual",
      description: "Stroke color for the dashed predicted forecast line and future observation markers.",
    },
    {
      name: "confidenceColor",
      type: "string",
      default: '"var(--chart-2, #10b981)"',
      required: false,
      category: "visual",
      description: "Fill color for the shaded forecast uncertainty and prediction interval band.",
    },
    {
      name: "confidenceOpacity",
      type: "number",
      default: "0.18",
      required: false,
      category: "visual",
      description: "Fill opacity applied to the uncertainty prediction band (0.0 to 1.0).",
    },
    {
      name: "selectionColor",
      type: "string",
      default: '"var(--chart-selection, #f59e0b)"',
      required: false,
      category: "visual",
      description: "Accent color for the locked vertical crosshair and persistent inspection selection.",
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
      description: "Curve interpolation algorithm applied consistently across actual and forecast lines.",
    },
    {
      name: "domain",
      type: '[number, number] | ["auto", "auto"]',
      default: '["auto", "auto"]',
      required: false,
      category: "visual",
      description: "Vertical Y scale range calculated safely across actual, forecast, and confidence bounds.",
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
      description: "Whether to render the series identity legend showing stroke samples.",
    },
    {
      name: "interactiveLegend",
      type: "boolean",
      default: "true",
      required: false,
      category: "interaction",
      description: "Enables interactive button controls in the legend to toggle actual, forecast, or confidence visibility.",
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
      description: "Default formatter for tooltip metric values and vertical scale ticks.",
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
      default: '"Forecast Line Chart"',
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
      description: "Accessible description detailing historical duration, forecast horizon, and keyboard shortcuts.",
    },
  ],

  examples: [
    {
      id: "platform-users-forecast",
      title: "Monthly Active Users Forecast",
      description:
        "Four months of observed historical metrics transitioning at April into a three-month forecast with supplied confidence bounds.",
      snippet: `<ForecastLine\n  data={forecastData}\n  xKey="month"\n  series={{\n    actualKey: "actual",\n    forecastKey: "forecast",\n    lowerKey: "lower",\n    upperKey: "upper",\n  }}\n  lockableTooltip\n/>`,
      props: { height: 320 },
    },
    {
      id: "custom-colors",
      title: "Custom Brand Color Encodings",
      description:
        "Explicit brand colors assigned to actual history and forecast trajectory while preserving the solid vs. dashed non-color distinction.",
      snippet: `<ForecastLine\n  data={forecastData}\n  xKey="month"\n  series={seriesConfig}\n  actualColor="#18181b"\n  forecastColor="#7c3aed"\n  confidenceColor="#c4b5fd"\n/>`,
      props: { height: 320, actualColor: "#18181b", forecastColor: "#7c3aed", confidenceColor: "#c4b5fd" },
    },
    {
      id: "no-bridge-transition",
      title: "Discontinuous Transition Gap",
      description:
        "Demonstrates truthful separation when history ends before forecast begins without inventing artificial bridge data.",
      snippet: `<ForecastLine\n  data={gapData}\n  xKey="month"\n  series={{\n    actualKey: "actual",\n    forecastKey: "forecast",\n  }}\n/>`,
      props: { height: 320 },
    },
    {
      id: "missing-confidence-bounds",
      title: "Missing Uncertainty Bounds",
      description:
        "Demonstrates truthful confidence treatment: when lower or upper bounds are missing, the band gaps without fabricating fake intervals.",
      snippet: `<ForecastLine\n  data={partialRangeData}\n  xKey="month"\n  series={{\n    actualKey: "actual",\n    forecastKey: "forecast",\n    lowerKey: "lower",\n    upperKey: "upper",\n  }}\n/>`,
      props: { height: 320 },
    },
  ],

  responsive: {
    overview:
      "Forecast Line adapts legend presentation and horizontal axis ticks based on container width. The solid vs. dashed distinction and confidence range area remain visible across all viewports.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full horizontal legend with stroke samples, complete X-axis ticks, and spacious shared tooltip readouts.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Wrapped multi-row legend, thinned categorical ticks, and synchronized nearest-X inspection.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact wrapped controls with 32px touch targets, pan-y page scroll safety, and viewport-clamped tooltip positioning.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance draw animation synchronized across observed history and predicted continuation. Bypassed automatically under prefers-reduced-motion.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection tooltip showing observation coordinate, actual value, forecast value, and forecast range with transition status indicator.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation X-coordinate.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter, and Escape shortcuts. Screen readers announce factual observation metrics and distinguish historical actuals from predicted forecasts.",
    screenReader:
      "Announces domain time, actual observed value, predicted forecast value, and supplied forecast range factually without speculative probability claims.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next observation along the timeline." },
      { key: "ArrowLeft", action: "Inspect previous observation along the timeline." },
      { key: "Home", action: "Jump inspection to the first historical observation." },
      { key: "End", action: "Jump inspection to the final forecast observation." },
      { key: "Enter / Space", action: "Lock or unlock the currently active inspection coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active tooltip." },
      { key: "Tab", action: "Move focus to interactive legend series toggle buttons." },
    ],
    colorIndependence:
      "Observed history is rendered as a solid stroke, forecast is rendered as a dashed stroke, and uncertainty is rendered as a filled area. The distinction remains fully readable in monochrome.",
    reducedMotion:
      "All entrance transitions immediately bypass when prefers-reduced-motion is detected in system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "ForecastLine",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description: "Coordinates semantic role normalization, safe domain calculation, Recharts ComposedChart composition, and shared inspection",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and CSS token scoping",
        },
        {
          name: "ComposedChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, Cartesian grid, Area, and multiple Line elements",
          children: [
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the signal curves",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Category tick labels and auto-padded vertical scale covering actual, forecast, and bounds",
            },
            {
              name: "Area (__range)",
              role: "Confidence prediction band",
              description: "Renders translucent filled area between lower and upper bounds only where both bounds exist",
            },
            {
              name: "Line (__actual)",
              role: "Observed history signal",
              description: "Renders solid continuous line for historical observations with past active markers",
            },
            {
              name: "Line (__forecast)",
              role: "Predicted trajectory signal",
              description: "Renders dashed line for forecast periods with future active markers",
            },
            {
              name: "Tooltip (ForecastTooltipContent)",
              role: "Synchronized inspection overlay",
              description: "Displays observation status, actual value, forecast value, and forecast range with lock indicators",
            },
          ],
        },
        {
          name: "Legend Controls",
          role: "Responsive interactive legend controls",
          description: "Semantic button controls allowing users to toggle actual, forecast, and confidence visibility",
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/line-forecast.tsx",
        description: "Complete Forecast Line component with observed vs forecast rendering, confidence band, and truthful missing handling",
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
