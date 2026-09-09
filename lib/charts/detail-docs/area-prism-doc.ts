import type { ChartDetailDoc } from "./types"

export const areaPrismDoc: ChartDetailDoc = {
  chartId: "recharts-area-prism",
  engine: "recharts",
  category: "area",
  renderer: "svg",
  status: "preview",
  blueprint: "011 / RECHARTS / AREA / PRISM AREA / PREVIEW",

  quickFacts: {
    bestFor:
      "Communicating quantitative magnitude and volume trends across an ordered domain with a restrained semantic fill and explicit baseline semantics.",
    dataModel:
      "Ordered observations containing a domain key (date, month, category) and a single quantitative numeric magnitude series.",
    interaction:
      "Nearest-X horizontal scrubbing resolving the exact observation value, persistent tooltip locking via click or Enter/Space, and accessible keyboard navigation.",
    responsive:
      "Container-driven measurement with adaptive axis tick thinning, compact gutters, and preserved area geometry across all viewports down to 320px.",
    animation:
      "Restrained entrance path draw animation; zero-lag cursor tracking during inspection; automatic bypass under prefers-reduced-motion.",
    runtime:
      "Pure Recharts Cartesian AreaChart SVG combining Area (with baseValue), Area stroke, CartesianGrid, neutral vertical crosshair, and HTML tooltip.",
  },

  dataFormat: {
    summary:
      "Accepts an ordered array of observation records where each record contains an X-domain coordinate and a single quantitative metric value.",
    fields: [
      {
        field: "xKey",
        type: "string | number",
        required: true,
        description: "Horizontal domain coordinate representing date, timestamp, month, or ordered category.",
      },
      {
        field: "series",
        type: "PrismAreaSeries<TData>",
        required: true,
        description: "Semantic series descriptor declaring key, label, and optional numeric valueFormatter.",
      },
    ],
    nullPolicy:
      "Missing observations (null, undefined, NaN, Infinity) create truthful visual breaks without coercing null to zero (null != 0).",
    orderingPolicy:
      "Observations must be ordered along the X domain sequence. Caller data is never sorted in place or mutated.",
    exampleRows: [
      { date: "May 01", requests: 12400 },
      { date: "May 05", requests: 14800 },
      { date: "May 10", requests: 13900 },
      { date: "May 15", requests: 18200 },
      { date: "May 20", requests: 21500 },
      { date: "May 25", requests: 19800 },
      { date: "May 30", requests: 24600 },
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
      type: "PrismAreaSeries<TData>",
      default: "—",
      required: true,
      description: "Single semantic series configuration mapping metric key, label, and valueFormatter.",
      category: "core",
    },
    {
      name: "baseline",
      type: '"zero" | "domain-min" | number',
      default: '"zero"',
      required: false,
      description: 'Baseline reference toward which the area fills. "zero" includes 0 in automatic domain; "domain-min" fills to domain minimum.',
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "zero", label: "Zero Baseline" },
        { value: "domain-min", label: "Domain Min" },
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
      description: "Curve interpolation algorithm for the stroke path and area polygon boundaries.",
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
      description: "Explicit Cartesian Y scale domain. Automatically encloses the active baseline to prevent false exaggeration.",
      category: "core",
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1)"',
      required: false,
      description: "Stroke line color, active marker color, and default auto-fill color identity.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "var(--chart-1, #3b82f6)", label: "Theme Blue" },
        { value: "#10b981", label: "Emerald" },
        { value: "#8b5cf6", label: "Purple" },
        { value: "#f59e0b", label: "Amber" },
      ],
    },
    {
      name: "fillColor",
      type: "string",
      default: "—",
      required: false,
      description: "Explicit area fill color override. Takes precedence over auto-fill from stroke color.",
      category: "visual",
    },
    {
      name: "fillOpacity",
      type: "number",
      default: "0.2",
      required: false,
      description: "Opacity of the translucent area fill (clamped between 0 and 1).",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: 0.15, label: "0.15 (Subtle)" },
        { value: 0.35, label: "0.35 (Medium)" },
        { value: 0.65, label: "0.65 (Solid)" },
      ],
    },
    {
      name: "gradientMode",
      type: '"none" | "fade"',
      default: '"none"',
      required: false,
      description: 'Gradient styling for the area fill. "fade" creates a subtle top-to-bottom opacity fade using collision-safe IDs.',
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "none", label: "None (Solid)" },
        { value: "fade", label: "Fade Gradient" },
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
      default: "false",
      required: false,
      description: "Whether to render the series identity legend with area swatch sample.",
      category: "visual",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: true, label: "Legend On" },
        { value: false, label: "Legend Off" },
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
      type: '"gap" | "carry"',
      default: '"gap"',
      required: false,
      description: "Policy for missing values: honest visual break (gap) or forward fill (carry).",
      category: "core",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "gap", label: "Gap (Break)" },
        { value: "carry", label: "Carry (Forward)" },
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
      title: "API Request Volume",
      description:
        "Standard single-series magnitude visualization showing daily API request volume relative to a zero baseline.",
      snippet: `<PrismArea\n  data={requestData}\n  xKey="date"\n  series={{\n    key: "requests",\n    label: "API Requests",\n    valueFormatter: (v) => \`\${v.toLocaleString()} req/s\`,\n  }}\n/>`,
      props: { height: 320 },
    },
    {
      id: "custom-fill",
      title: "Explicit Fill Color & Opacity",
      description:
        "Independent stroke and fill colors with higher fill opacity to emphasize quantitative volume.",
      snippet: `<PrismArea\n  data={requestData}\n  xKey="date"\n  series={{\n    key: "requests",\n    label: "API Requests",\n  }}\n  color="#2563eb"\n  fillColor="#93c5fd"\n  fillOpacity={0.35}\n/>`,
      props: { height: 320, color: "#2563eb", fillColor: "#93c5fd", fillOpacity: 0.35 },
    },
    {
      id: "fade-gradient",
      title: "Subtle Vertical Fade Gradient",
      description:
        "Area fill with a gentle linear opacity fade from the stroke line toward the zero baseline using collision-safe SVG defs.",
      snippet: `<PrismArea\n  data={requestData}\n  xKey="date"\n  series={{\n    key: "requests",\n    label: "API Requests",\n  }}\n  gradientMode="fade"\n  fillOpacity={0.4}\n/>`,
      props: { height: 320, gradientMode: "fade", fillOpacity: 0.4 },
    },
    {
      id: "missing-values",
      title: "Truthful Missing Value Gaps",
      description:
        "Missing observations create honest gaps in the area and stroke without collapsing to the baseline or coercing null to zero.",
      snippet: `<PrismArea\n  data={gappyData}\n  xKey="date"\n  series={{\n    key: "requests",\n    label: "API Requests",\n  }}\n/>`,
      props: { height: 320 },
    },
  ],

  responsive: {
    overview:
      "Prism Area adapts horizontal tick density and axis gutters based on container width while preserving the exact magnitude fill and baseline relationship across all viewports.",
    breakpoints: [
      {
        name: "Desktop",
        width: ">= 1024px",
        behavior:
          "Full X-axis ticks, comfortable axis margins, spacious tooltip card, and full area geometry.",
      },
      {
        name: "Tablet",
        width: "640px - 1023px",
        behavior:
          "Thinned categorical ticks, adaptive padding, and synchronized nearest-X inspection.",
      },
      {
        name: "Mobile",
        width: "< 640px",
        behavior:
          "Compact gutters, essential ticks, touch scrubbing with pan-y scroll safety, and preserved baseline geometry.",
      },
    ],
  },

  animation: {
    overview:
      "Restrained entrance path draw animation. Never animates baseline continuously or uses distracting liquid wave effects.",
    duration: "350ms ease-out",
    refreshable: true,
  },

  interaction: {
    tooltip:
      "Synchronized custom inspection card showing observation coordinate, series label, formatted magnitude, and lock status badge.",
    crosshair:
      "Shared neutral vertical crosshair aligned precisely to the active observation X-coordinate.",
  },

  accessibility: {
    role: "region",
    summary:
      "Single keyboard tab stop on root figure with ArrowLeft, ArrowRight, Home, End, Enter, and Escape shortcuts. Screen readers announce factual observation metrics and baseline relationships.",
    screenReader:
      "Announces domain time, series label, quantitative magnitude, and baseline semantics factually without speculative claims.",
    keyboardShortcuts: [
      { key: "ArrowRight", action: "Inspect next chronological observation." },
      { key: "ArrowLeft", action: "Inspect previous chronological observation." },
      { key: "Home", action: "Jump inspection to the first observation." },
      { key: "End", action: "Jump inspection to the final observation." },
      { key: "Enter / Space", action: "Lock or unlock the currently active inspection coordinate." },
      { key: "Escape", action: "Release locked selection and dismiss active tooltip." },
    ],
    colorIndependence:
      "Stroke line remains visually dominant over the translucent fill; active markers and tooltips provide non-color cues readable in monochrome.",
    reducedMotion:
      "All entrance animations immediately bypass when prefers-reduced-motion is detected in system preferences.",
  },

  sourceAnatomy: {
    tree: {
      name: "PrismArea",
      role: "Root figure element with keyboard navigation and ARIA accessibility shell",
      description: "Coordinates data normalization, safe domain calculation enclosing baseline, Recharts AreaChart composition, and shared inspection",
      children: [
        {
          name: "ChartContainer",
          role: "Responsive container wrapper",
          description: "Handles container dimension measurement and CSS token scoping",
        },
        {
          name: "AreaChart",
          role: "Recharts Cartesian SVG coordinator",
          description: "Coordinates coordinate scales, Cartesian grid, and Area polygon rendering",
          children: [
            {
              name: "defs (optional)",
              role: "SVG gradient definition",
              description: "Collision-safe linear gradient rendered only when gradientMode is fade",
            },
            {
              name: "CartesianGrid",
              role: "Reference grid lines",
              description: "Subtle horizontal reference lines rendered behind the area fill",
            },
            {
              name: "XAxis & YAxis",
              role: "Scale coordinates",
              description: "Horizontal category labels and auto-padded vertical scale enclosing the baseline",
            },
            {
              name: "Area",
              role: "Magnitude area and stroke",
              description: "Renders filled area to baseValue and stroke path along observations with connectNulls=false",
            },
            {
              name: "Tooltip",
              role: "Synchronized inspection card",
              description: "Displays tabular formatted observation value and persistent lock state indicator",
            },
          ],
        },
      ],
    },
    sourceFiles: [
      {
        path: "registry/recharts/area-prism.tsx",
        description: "Complete Prism Area component with baseline-aware scale domain, single-series magnitude fill, and nearest-X inspection",
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
