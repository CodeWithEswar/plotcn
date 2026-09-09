/**
 * Plotcn Global Chart Color System
 * Centralized color role declarations, theme token definitions, curated palettes,
 * validation, and accessibility contrast calculations.
 */

export type ChartColorRoleKey =
  | "signal"
  | "above"
  | "below"
  | "baseline"
  | "series"
  | "primary"
  | "reference"
  | "range"
  | "milestone"
  | "threshold"
  | "selection"
  | "positive"
  | "negative"
  | "web"
  | "ios"
  | "android"
  | "actual"
  | "forecast"
  | "confidence"
  | "stroke"
  | "fill"
  | "value"
  | "compute"
  | "storage"
  | "network"
  | "current"
  | "previous"
  | "target"
  | "partner"
  | "monthly"
  | "annual"
  | "multiYear"
  | "interval"
  | "product"
  | "services"
  | "enterprise"


export interface ChartColorRoleDef {
  id: ChartColorRoleKey
  propName: string
  label: string
  defaultToken: string
  fallbackHex: string
  description: string
}

export interface ColorPresetItem {
  id: string
  label: string
  value: string // CSS token or hex
  hex: string   // Resolved representative hex for swatch preview
  isToken?: boolean
}

export interface PalettePresetGroup {
  name: string
  presets: readonly ColorPresetItem[]
}

/**
 * Canonical Plotcn theme tokens (--chart-1 through --chart-8)
 */
export const THEME_CHART_TOKENS: readonly ColorPresetItem[] = [
  { id: "chart-1", label: "Chart 1 (Primary)", value: "var(--chart-1)", hex: "#3b82f6", isToken: true },
  { id: "chart-2", label: "Chart 2 (Secondary)", value: "var(--chart-2)", hex: "#10b981", isToken: true },
  { id: "chart-3", label: "Chart 3 (Tertiary)", value: "var(--chart-3)", hex: "#8b5cf6", isToken: true },
  { id: "chart-4", label: "Chart 4 (Supporting)", value: "var(--chart-4)", hex: "#f59e0b", isToken: true },
  { id: "chart-5", label: "Chart 5 (Accent)", value: "var(--chart-5)", hex: "#ef4444", isToken: true },
  { id: "chart-6", label: "Chart 6 (Indigo)", value: "var(--chart-6)", hex: "#6366f1", isToken: true },
  { id: "chart-7", label: "Chart 7 (Teal)", value: "var(--chart-7)", hex: "#14b8a6", isToken: true },
  { id: "chart-8", label: "Chart 8 (Orange)", value: "var(--chart-8)", hex: "#f97316", isToken: true },
]

/**
 * Curated color palette groups
 */
export const CURATED_COLOR_GROUPS: readonly PalettePresetGroup[] = [
  {
    name: "Theme Tokens",
    presets: THEME_CHART_TOKENS,
  },
  {
    name: "Plotcn Signature",
    presets: [
      { id: "blue", label: "Electric Blue", value: "#3b82f6", hex: "#3b82f6" },
      { id: "emerald", label: "Emerald", value: "#10b981", hex: "#10b981" },
      { id: "violet", label: "Violet", value: "#8b5cf6", hex: "#8b5cf6" },
      { id: "amber", label: "Amber", value: "#f59e0b", hex: "#f59e0b" },
      { id: "rose", label: "Rose", value: "#f43f5e", hex: "#f43f5e" },
      { id: "cyan", label: "Cyan", value: "#06b6d4", hex: "#06b6d4" },
      { id: "sky", label: "Sky", value: "#0ea5e9", hex: "#0ea5e9" },
      { id: "lime", label: "Lime", value: "#84cc16", hex: "#84cc16" },
    ],
  },
  {
    name: "Monochrome",
    presets: [
      { id: "zinc-100", label: "Zinc 100", value: "#f4f4f5", hex: "#f4f4f5" },
      { id: "zinc-300", label: "Zinc 300", value: "#d4d4d8", hex: "#d4d4d8" },
      { id: "zinc-400", label: "Zinc 400", value: "#a1a1aa", hex: "#a1a1aa" },
      { id: "zinc-500", label: "Zinc 500", value: "#71717a", hex: "#71717a" },
      { id: "zinc-700", label: "Zinc 700", value: "#3f3f46", hex: "#3f3f46" },
      { id: "zinc-900", label: "Zinc 900", value: "#18181b", hex: "#18181b" },
    ],
  },
  {
    name: "Colorblind-Safe (Okabe-Ito)",
    presets: [
      { id: "cb-sky-blue", label: "Sky Blue", value: "#56b4e9", hex: "#56b4e9" },
      { id: "cb-orange", label: "Orange", value: "#e69f00", hex: "#e69f00" },
      { id: "cb-bluish-green", label: "Bluish Green", value: "#009e73", hex: "#009e73" },
      { id: "cb-yellow", label: "Yellow", value: "#f0e442", hex: "#f0e442" },
      { id: "cb-blue", label: "Blue", value: "#0072b2", hex: "#0072b2" },
      { id: "cb-vermilion", label: "Vermilion", value: "#d55e00", hex: "#d55e00" },
      { id: "cb-reddish-purple", label: "Reddish Purple", value: "#cc79a7", hex: "#cc79a7" },
    ],
  },
]

/**
 * Declarative mapping of semantic color roles owned by each chart in the catalog.
 * A chart declares ONLY the color roles it actually implements in its public API.
 */
const CHART_COLOR_ROLES_MAP: Record<string, readonly ChartColorRoleDef[]> = {
  // 001 Signal Line
  "line-signal": [
    {
      id: "primary",
      propName: "color",
      label: "Signal Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Primary stroke color for the trend line, active points, and tooltip markers.",
    },
  ],
  "recharts-line-signal": [
    {
      id: "primary",
      propName: "color",
      label: "Signal Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Primary stroke color for the trend line, active points, and tooltip markers.",
    },
  ],

  // 002 Pulse Line
  "line-pulse": [
    {
      id: "primary",
      propName: "color",
      label: "Pulse Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#0ea5e9",
      description: "Color for the live telemetry line, latest-point pulse marker, and active indicators.",
    },
  ],
  "recharts-line-pulse": [
    {
      id: "primary",
      propName: "color",
      label: "Pulse Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#0ea5e9",
      description: "Color for the live telemetry line, latest-point pulse marker, and active indicators.",
    },
  ],

  // 003 Twinline Compare
  "line-twin-compare": [
    {
      id: "primary",
      propName: "primaryColor",
      label: "Primary Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Solid line color for the primary series, active dots, and legend sample.",
    },
    {
      id: "reference",
      propName: "referenceColor",
      label: "Reference Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#64748b",
      description: "Muted dashed line color for the benchmark or historical comparison series.",
    },
  ],
  "recharts-line-twin-compare": [
    {
      id: "primary",
      propName: "primaryColor",
      label: "Primary Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Solid line color for the primary series, active dots, and legend sample.",
    },
    {
      id: "reference",
      propName: "referenceColor",
      label: "Reference Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#64748b",
      description: "Muted dashed line color for the benchmark or historical comparison series.",
    },
  ],

  // 004 Range Line
  "line-range": [
    {
      id: "primary",
      propName: "color",
      label: "Signal Trend",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Stroke color for the central quantitative forecast or baseline signal line.",
    },
    {
      id: "range",
      propName: "rangeColor",
      label: "Range Envelope",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#93c5fd",
      description: "Tint color for the upper-to-lower confidence interval or tolerance envelope fill.",
    },
  ],
  "recharts-line-range": [
    {
      id: "primary",
      propName: "color",
      label: "Signal Trend",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Stroke color for the central quantitative forecast or baseline signal line.",
    },
    {
      id: "range",
      propName: "rangeColor",
      label: "Range Envelope",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#93c5fd",
      description: "Tint color for the upper-to-lower confidence interval or tolerance envelope fill.",
    },
  ],

  // 005 Step Signal
  "line-step-signal": [
    {
      id: "primary",
      propName: "color",
      label: "Step Level",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Stroke color for the stepped signal line, discrete transition corners, and level indicator.",
    },
  ],
  "recharts-line-step-signal": [
    {
      id: "primary",
      propName: "color",
      label: "Step Level",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Stroke color for the stepped signal line, discrete transition corners, and level indicator.",
    },
  ],

  // 006 Milestone Line
  "line-milestones": [
    {
      id: "primary",
      propName: "color",
      label: "Trend Line",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Stroke color for the primary quantitative time-series trend.",
    },
    {
      id: "milestone",
      propName: "milestoneColor",
      label: "Milestone Markers",
      defaultToken: "var(--chart-milestone-pin)",
      fallbackHex: "#71717a",
      description: "Color for milestone pins, grouped count badges, and vertical reference guides.",
    },
  ],
  "recharts-line-milestones": [
    {
      id: "primary",
      propName: "color",
      label: "Trend Line",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Stroke color for the primary quantitative time-series trend.",
    },
    {
      id: "milestone",
      propName: "milestoneColor",
      label: "Milestone Markers",
      defaultToken: "var(--chart-milestone-pin)",
      fallbackHex: "#71717a",
      description: "Color for milestone pins, grouped count badges, and vertical reference guides.",
    },
  ],

  // 007 Threshold Line
  "line-threshold": [
    {
      id: "primary",
      propName: "color",
      label: "Signal Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary stroke color for the trend line, active points, and tooltip indicators.",
    },
    {
      id: "threshold",
      propName: "thresholdColor",
      label: "Threshold Color",
      defaultToken: "var(--chart-4)",
      fallbackHex: "#f59e0b",
      description: "Default color for threshold boundary reference lines, region fills, and threshold markers.",
    },
  ],
  "recharts-line-threshold": [
    {
      id: "primary",
      propName: "color",
      label: "Signal Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary stroke color for the trend line, active points, and tooltip indicators.",
    },
    {
      id: "threshold",
      propName: "thresholdColor",
      label: "Threshold Color",
      defaultToken: "var(--chart-4)",
      fallbackHex: "#f59e0b",
      description: "Default color for threshold boundary reference lines, region fills, and threshold markers.",
    },
  ],

  // 008 Focus Line
  "line-focus": [
    {
      id: "primary",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary stroke color for the continuous signal line, active point, and tooltip series indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Color for persistent locked observation marker, selection ring, and locked tooltip emphasis.",
    },
  ],
  "recharts-line-focus": [
    {
      id: "primary",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary stroke color for the continuous signal line, active point, and tooltip series indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Color for persistent locked observation marker, selection ring, and locked tooltip emphasis.",
    },
  ],

  // 009 Multi-Signal Line
  "line-multi-signal": [
    {
      id: "web",
      propName: "color_web",
      label: "Web Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the Web platform signal line, active marker, and legend indicator.",
    },
    {
      id: "ios",
      propName: "color_ios",
      label: "iOS Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the iOS mobile signal line, active marker, and legend indicator.",
    },
    {
      id: "android",
      propName: "color_android",
      label: "Android Series",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Color for the Android mobile signal line, active marker, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and locked inspection point.",
    },
  ],
  "recharts-line-multi-signal": [
    {
      id: "web",
      propName: "color_web",
      label: "Web Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the Web platform signal line, active marker, and legend indicator.",
    },
    {
      id: "ios",
      propName: "color_ios",
      label: "iOS Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the iOS mobile signal line, active marker, and legend indicator.",
    },
    {
      id: "android",
      propName: "color_android",
      label: "Android Series",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Color for the Android mobile signal line, active marker, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and locked inspection point.",
    },
  ],

  // 010 Forecast Line
  "line-forecast": [
    {
      id: "actual",
      propName: "actualColor",
      label: "Actual History",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Solid stroke color for observed historical observations and past active markers.",
    },
    {
      id: "forecast",
      propName: "forecastColor",
      label: "Forecast Trajectory",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Dashed stroke color for predicted forecast periods and future active markers.",
    },
    {
      id: "confidence",
      propName: "confidenceColor",
      label: "Confidence Interval",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Shaded fill color for the forecast uncertainty and prediction envelope band.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Color for persistent locked inspection marker and locked vertical crosshair.",
    },
  ],
  "recharts-line-forecast": [
    {
      id: "actual",
      propName: "actualColor",
      label: "Actual History",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Solid stroke color for observed historical observations and past active markers.",
    },
    {
      id: "forecast",
      propName: "forecastColor",
      label: "Forecast Trajectory",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Dashed stroke color for predicted forecast periods and future active markers.",
    },
    {
      id: "confidence",
      propName: "confidenceColor",
      label: "Confidence Interval",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Shaded fill color for the forecast uncertainty and prediction envelope band.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Color for persistent locked inspection marker and locked vertical crosshair.",
    },
  ],

  // 011 Prism Area
  "area-prism": [
    {
      id: "stroke",
      propName: "color",
      label: "Stroke Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary stroke color for the quantitative trend line, active observation marker, and tooltip indicator.",
    },
    {
      id: "fill",
      propName: "fillColor",
      label: "Fill Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Area fill color communicating magnitude relative to baseline. Defaults automatically to stroke color.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Color for persistent locked inspection marker and locked vertical crosshair.",
    },
  ],
  "recharts-area-prism": [
    {
      id: "stroke",
      propName: "color",
      label: "Stroke Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary stroke color for the quantitative trend line, active observation marker, and tooltip indicator.",
    },
    {
      id: "fill",
      propName: "fillColor",
      label: "Fill Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Area fill color communicating magnitude relative to baseline. Defaults automatically to stroke color.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Color for persistent locked inspection marker and locked vertical crosshair.",
    },
  ],

  // 012 Stack Flow Area
  "area-stack-flow": [
    {
      id: "web",
      propName: "color_web",
      label: "Web Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the Web platform layer fill, stroke, and legend indicator.",
    },
    {
      id: "ios",
      propName: "color_ios",
      label: "iOS Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the iOS mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "android",
      propName: "color_android",
      label: "Android Series",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Color for the Android mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],
  "recharts-area-stack-flow": [
    {
      id: "web",
      propName: "color_web",
      label: "Web Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the Web platform layer fill, stroke, and legend indicator.",
    },
    {
      id: "ios",
      propName: "color_ios",
      label: "iOS Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the iOS mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "android",
      propName: "color_android",
      label: "Android Series",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Color for the Android mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],

  // 013 Percent Stream Area
  "area-percent-stream": [
    {
      id: "web",
      propName: "color_web",
      label: "Web Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the Web platform layer fill, stroke, and legend indicator.",
    },
    {
      id: "ios",
      propName: "color_ios",
      label: "iOS Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the iOS mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "android",
      propName: "color_android",
      label: "Android Series",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Color for the Android mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],
  "recharts-area-percent-stream": [
    {
      id: "web",
      propName: "color_web",
      label: "Web Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the Web platform layer fill, stroke, and legend indicator.",
    },
    {
      id: "ios",
      propName: "color_ios",
      label: "iOS Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the iOS mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "android",
      propName: "color_android",
      label: "Android Series",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Color for the Android mobile layer fill, stroke, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],

  // 014 Range Area
  "area-range": [
    {
      id: "range",
      propName: "color",
      label: "Range Envelope",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#6366f1",
      description: "Color for the bounded envelope fill, boundary strokes, and legend indicator.",
    },
    {
      id: "value",
      propName: "valueColor",
      label: "Center Line",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Stroke color for the central signal line.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],
  "recharts-area-range": [
    {
      id: "range",
      propName: "color",
      label: "Range Envelope",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#6366f1",
      description: "Color for the bounded envelope fill, boundary strokes, and legend indicator.",
    },
    {
      id: "value",
      propName: "valueColor",
      label: "Center Line",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Stroke color for the central signal line.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],

  // 015 Comparison Area
  "area-comparison": [
    {
      id: "primary",
      propName: "primaryColor",
      label: "Primary Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the primary series fill, solid boundary stroke, and legend indicator.",
    },
    {
      id: "reference",
      propName: "referenceColor",
      label: "Reference Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the reference series fill, dashed boundary stroke, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],
  "recharts-area-comparison": [
    {
      id: "primary",
      propName: "primaryColor",
      label: "Primary Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Color for the primary series fill, solid boundary stroke, and legend indicator.",
    },
    {
      id: "reference",
      propName: "referenceColor",
      label: "Reference Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Color for the reference series fill, dashed boundary stroke, and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#8b5cf6",
      description: "Color for the persistent locked crosshair indicator and inspection point.",
    },
  ],

  // 016 Gradient Depth Area
  "area-gradient-depth": [
    {
      id: "series",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary series color applied to stroke, active marker, and all gradient stops.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#38bdf8",
      description: "Color for the persistent locked crosshair indicator and locked inspection marker.",
    },
  ],
  "recharts-area-gradient-depth": [
    {
      id: "series",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary series color applied to stroke, active marker, and all gradient stops.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#38bdf8",
      description: "Color for the persistent locked crosshair indicator and locked inspection marker.",
    },
  ],

  // 017 Baseline Area
  "area-baseline": [
    {
      id: "signal",
      propName: "color",
      label: "Signal Stroke",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary signal stroke and active observation marker color.",
    },
    {
      id: "above",
      propName: "aboveColor",
      label: "Above Baseline",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Area fill color for observations exceeding the reference baseline.",
    },
    {
      id: "below",
      propName: "belowColor",
      label: "Below Baseline",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Area fill color for observations falling below the reference baseline.",
    },
    {
      id: "baseline",
      propName: "baselineColor",
      label: "Reference Line",
      defaultToken: "var(--chart-axis)",
      fallbackHex: "#71717a",
      description: "Stroke color for the constant horizontal reference baseline.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#38bdf8",
      description: "Color for the persistent locked crosshair indicator and locked inspection marker.",
    },
  ],
  "recharts-area-baseline": [
    {
      id: "signal",
      propName: "color",
      label: "Signal Stroke",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary signal stroke and active observation marker color.",
    },
    {
      id: "above",
      propName: "aboveColor",
      label: "Above Baseline",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Area fill color for observations exceeding the reference baseline.",
    },
    {
      id: "below",
      propName: "belowColor",
      label: "Below Baseline",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Area fill color for observations falling below the reference baseline.",
    },
    {
      id: "baseline",
      propName: "baselineColor",
      label: "Reference Line",
      defaultToken: "var(--chart-axis)",
      fallbackHex: "#71717a",
      description: "Stroke color for the constant horizontal reference baseline.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#38bdf8",
      description: "Color for the persistent locked crosshair indicator and locked inspection marker.",
    },
  ],

  // 018 Interactive Area
  "area-interactive": [
    {
      id: "series",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary series stroke, area fill, active observation marker, and tooltip dot.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Accent color for persistent locked marker ring, locked tooltip badge, and locked crosshair.",
    },
  ],
  "recharts-area-interactive": [
    {
      id: "series",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Primary series stroke, area fill, active observation marker, and tooltip dot.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection Color",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Accent color for persistent locked marker ring, locked tooltip badge, and locked crosshair.",
    },
  ],

  // 019 Signal Bars
  "bar-signal": [
    {
      id: "primary",
      propName: "color",
      label: "Primary Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for primary series bars, tooltip marker, and legend indicator.",
    },
    {
      id: "reference",
      propName: "referenceColor",
      label: "Secondary Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for secondary peer series bars, tooltip marker, and legend indicator.",
    },
  ],
  "recharts-bar-signal": [
    {
      id: "primary",
      propName: "color",
      label: "Primary Series",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for primary series bars, tooltip marker, and legend indicator.",
    },
    {
      id: "reference",
      propName: "referenceColor",
      label: "Secondary Series",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for secondary peer series bars, tooltip marker, and legend indicator.",
    },
  ],

  // 021 Group Compare Bars
  "bar-group-compare": [
    {
      id: "current",
      propName: "color_current",
      label: "Current Year",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for current year bars, tooltip marker, and legend indicator.",
    },
    {
      id: "previous",
      propName: "color_previous",
      label: "Previous Year",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for previous year bars, tooltip marker, and legend indicator.",
    },
    {
      id: "target",
      propName: "color_target",
      label: "Target",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Fill color for target benchmark bars, tooltip marker, and legend indicator.",
    },
  ],
  "recharts-bar-group-compare": [
    {
      id: "current",
      propName: "color_current",
      label: "Current Year",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for current year bars, tooltip marker, and legend indicator.",
    },
    {
      id: "previous",
      propName: "color_previous",
      label: "Previous Year",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for previous year bars, tooltip marker, and legend indicator.",
    },
    {
      id: "target",
      propName: "color_target",
      label: "Target",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Fill color for target benchmark bars, tooltip marker, and legend indicator.",
    },
  ],

  // 022 Stack Ledger Bars
  "bar-stack-ledger": [
    {
      id: "compute",
      propName: "color_compute",
      label: "Compute",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for compute contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "storage",
      propName: "color_storage",
      label: "Storage",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for storage contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "network",
      propName: "color_network",
      label: "Network",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#8b5cf6",
      description: "Fill color for network contributor segment, tooltip marker, and legend indicator.",
    },
  ],
  "recharts-bar-stack-ledger": [
    {
      id: "compute",
      propName: "color_compute",
      label: "Compute",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for compute contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "storage",
      propName: "color_storage",
      label: "Storage",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for storage contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "network",
      propName: "color_network",
      label: "Network",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#8b5cf6",
      description: "Fill color for network contributor segment, tooltip marker, and legend indicator.",
    },
  ],

  // 023 Percent Stack Bars
  "bar-percent-stack": [
    {
      id: "monthly",
      propName: "color_monthly",
      label: "Monthly",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for monthly subscription contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "annual",
      propName: "color_annual",
      label: "Annual",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for annual subscription contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "multiYear",
      propName: "color_multiYear",
      label: "Multi-year",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#8b5cf6",
      description: "Fill color for multi-year enterprise contributor segment, tooltip marker, and legend indicator.",
    },
  ],
  "recharts-bar-percent-stack": [
    {
      id: "monthly",
      propName: "color_monthly",
      label: "Monthly",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for monthly subscription contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "annual",
      propName: "color_annual",
      label: "Annual",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for annual subscription contributor segment, tooltip marker, and legend indicator.",
    },
    {
      id: "multiYear",
      propName: "color_multiYear",
      label: "Multi-year",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#8b5cf6",
      description: "Fill color for multi-year enterprise contributor segment, tooltip marker, and legend indicator.",
    },
  ],

  // 024 Diverging Bars
  "bar-diverging": [
    {
      id: "above",
      propName: "aboveColor",
      label: "Above reference",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for bars deviating above the neutral baseline reference and directional legend.",
    },
    {
      id: "below",
      propName: "belowColor",
      label: "Below reference",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#f97316",
      description: "Fill color for bars deviating below the neutral baseline reference and directional legend.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#2563eb",
      description: "Stroke emphasis color for the currently inspected category bar.",
    },
  ],
  "recharts-bar-diverging": [
    {
      id: "above",
      propName: "aboveColor",
      label: "Above reference",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for bars deviating above the neutral baseline reference and directional legend.",
    },
    {
      id: "below",
      propName: "belowColor",
      label: "Below reference",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#f97316",
      description: "Fill color for bars deviating below the neutral baseline reference and directional legend.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#2563eb",
      description: "Stroke emphasis color for the currently inspected category bar.",
    },
  ],

  // 025 Bullet Bars
  "bar-bullet": [
    {
      id: "value",
      propName: "valueColor",
      label: "Actual",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Fill color for the actual observed measure bar, legend indicator, and tooltip marker.",
    },
    {
      id: "target",
      propName: "targetColor",
      label: "Target",
      defaultToken: "var(--chart-foreground)",
      fallbackHex: "#fafafa",
      description: "Stroke color for the per-category target marker rule and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Stroke emphasis color for the currently active scorecard row.",
    },
  ],
  "recharts-bar-bullet": [
    {
      id: "value",
      propName: "valueColor",
      label: "Actual",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Fill color for the actual observed measure bar, legend indicator, and tooltip marker.",
    },
    {
      id: "target",
      propName: "targetColor",
      label: "Target",
      defaultToken: "var(--chart-foreground)",
      fallbackHex: "#fafafa",
      description: "Stroke color for the per-category target marker rule and legend indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#f59e0b",
      description: "Stroke emphasis color for the currently active scorecard row.",
    },
  ],

  // 026 Variance Bars
  "bar-variance": [
    {
      id: "positive",
      propName: "positiveColor",
      label: "Positive variance",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for bars where actual is numerically above plan, tooltip indicator, and legend mark.",
    },
    {
      id: "negative",
      propName: "negativeColor",
      label: "Negative variance",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#f97316",
      description: "Fill color for bars where actual is numerically below plan, tooltip indicator, and legend mark.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#eab308",
      description: "Stroke emphasis color for the currently inspected category bar.",
    },
  ],
  "recharts-bar-variance": [
    {
      id: "positive",
      propName: "positiveColor",
      label: "Positive variance",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for bars where actual is numerically above plan, tooltip indicator, and legend mark.",
    },
    {
      id: "negative",
      propName: "negativeColor",
      label: "Negative variance",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#f97316",
      description: "Fill color for bars where actual is numerically below plan, tooltip indicator, and legend mark.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#eab308",
      description: "Stroke emphasis color for the currently inspected category bar.",
    },
  ],
  "recharts-bar-interval": [
    {
      id: "interval",
      propName: "color",
      label: "Interval",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for floating interval bars and zero-width markers.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#eab308",
      description: "Stroke emphasis color for the currently inspected category row.",
    },
  ],
  "bar-interactive": [
    {
      id: "product",
      propName: "series1Color",
      label: "Product",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for the primary series bars and tooltip indicator.",
    },
    {
      id: "services",
      propName: "series2Color",
      label: "Services",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for the secondary series bars and tooltip indicator.",
    },
    {
      id: "enterprise",
      propName: "series3Color",
      label: "Enterprise",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Fill color for the tertiary series bars and tooltip indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#eab308",
      description: "Stroke emphasis color for the currently inspected category band or active bar.",
    },
  ],
  "recharts-bar-interactive": [
    {
      id: "product",
      propName: "series1Color",
      label: "Product",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#3b82f6",
      description: "Fill color for the primary series bars and tooltip indicator.",
    },
    {
      id: "services",
      propName: "series2Color",
      label: "Services",
      defaultToken: "var(--chart-2)",
      fallbackHex: "#10b981",
      description: "Fill color for the secondary series bars and tooltip indicator.",
    },
    {
      id: "enterprise",
      propName: "series3Color",
      label: "Enterprise",
      defaultToken: "var(--chart-3)",
      fallbackHex: "#f59e0b",
      description: "Fill color for the tertiary series bars and tooltip indicator.",
    },
    {
      id: "selection",
      propName: "selectionColor",
      label: "Selection outline",
      defaultToken: "var(--chart-selection)",
      fallbackHex: "#eab308",
      description: "Stroke emphasis color for the currently inspected category band or active bar.",
    },
  ],

  // Generic & Basic Line / Area / Bar
  "line-basic": [
    {
      id: "primary",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Stroke color for the line and markers.",
    },
  ],
  "area-basic": [
    {
      id: "primary",
      propName: "color",
      label: "Area Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Stroke and gradient fill color for the area volume.",
    },
  ],
  "bar-basic": [
    {
      id: "primary",
      propName: "color",
      label: "Bar Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Fill color for vertical bars and tooltip indicator.",
    },
  ],

  // Google Charts
  "google-line": [
    {
      id: "primary",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Stroke color for the Google Line series.",
    },
  ],
  "google-bar": [
    {
      id: "primary",
      propName: "color",
      label: "Bar Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Bar color for Google Bar visualization.",
    },
  ],

  // D3 Charts
  "d3-animated-line": [
    {
      id: "primary",
      propName: "color",
      label: "Stroke Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Stroke color for the animated D3 path.",
    },
  ],
}

/**
 * Returns the declared semantic color roles for a given chart registry name or slug.
 * Falls back to a standard primary series role if not explicitly mapped.
 */
export function getChartColorRoles(registryName: string): readonly ChartColorRoleDef[] {
  const cleanKey = registryName.trim().toLowerCase()
  if (CHART_COLOR_ROLES_MAP[cleanKey]) {
    return CHART_COLOR_ROLES_MAP[cleanKey]
  }

  // Fallback default: single primary series color
  return [
    {
      id: "primary",
      propName: "color",
      label: "Series Color",
      defaultToken: "var(--chart-1)",
      fallbackHex: "#10b981",
      description: "Primary visual color for the series.",
    },
  ]
}

/**
 * Validates whether a given string is a syntactically valid CSS color or hex code.
 */
export function isValidColor(val: string): boolean {
  if (!val || typeof val !== "string") return false
  const trimmed = val.trim()

  // Hex: #rgb, #rgba, #rrggbb, #rrggbbaa
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return true
  }

  // CSS variables: var(--...)
  if (/^var\(--[a-zA-Z0-9_-]+(\s*,\s*[^)]+)?\)$/.test(trimmed)) {
    return true
  }

  // Functional CSS colors: rgb(), rgba(), hsl(), hsla(), oklch()
  if (/^(rgb|rgba|hsl|hsla|oklch)\([^)]+\)$/.test(trimmed)) {
    return true
  }

  // Named CSS colors
  const basicNamed = ["currentColor", "transparent", "inherit"]
  if (basicNamed.includes(trimmed)) return true

  return false
}

/**
 * Calculates relative luminance for an sRGB component.
 */
function getLuminanceComponent(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

/**
 * Parses a hex string into [r, g, b].
 */
export function parseHexToRgb(hex: string): [number, number, number] | null {
  let clean = hex.replace(/^#/, "").trim()
  if (clean.length === 3 || clean.length === 4) {
    clean = clean
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("")
  }
  if (clean.length < 6) return null

  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return [r, g, b]
}

/**
 * Computes WCAG 2.1 relative luminance for a given hex color.
 */
export function calculateLuminance(hex: string): number {
  const rgb = parseHexToRgb(hex)
  if (!rgb) return 0.5
  const [r, g, b] = rgb
  return (
    0.2126 * getLuminanceComponent(r) +
    0.7152 * getLuminanceComponent(g) +
    0.0722 * getLuminanceComponent(b)
  )
}

/**
 * Calculates contrast ratio between two hex colors (e.g. 4.5:1).
 */
export function calculateContrastRatio(foregroundHex: string, backgroundHex: string = "#09090b"): number {
  const l1 = calculateLuminance(foregroundHex)
  const l2 = calculateLuminance(backgroundHex)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Resolves a representative hex value from either an explicit hex, a CSS variable, or fallback.
 */
export function resolveDisplayHex(
  val: string | undefined,
  fallbackToken: string = "var(--chart-1)",
  isDark: boolean = true
): string {
  if (!val || val === "theme" || val.startsWith("var(")) {
    const token = val && val !== "theme" ? val : fallbackToken
    // Map standard tokens to representative hex values
    if (token.includes("--chart-1")) return isDark ? "#3b82f6" : "#2563eb"
    if (token.includes("--chart-2")) return isDark ? "#10b981" : "#059669"
    if (token.includes("--chart-3")) return isDark ? "#8b5cf6" : "#7c3aed"
    if (token.includes("--chart-4")) return isDark ? "#f59e0b" : "#d97706"
    if (token.includes("--chart-5")) return isDark ? "#ef4444" : "#dc2626"
    if (token.includes("--chart-milestone-pin") || token.includes("--chart-muted")) return isDark ? "#a1a1aa" : "#71717a"
    return isDark ? "#3b82f6" : "#2563eb"
  }

  if (val.startsWith("#")) {
    return val
  }

  return "#3b82f6"
}
