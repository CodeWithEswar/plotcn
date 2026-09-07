import type { ChartMetadata } from "../metadata"
import type { ChartDetailDoc, PropDoc } from "./types"
import { googleLineDoc } from "./google-line-doc"
import { lineSignalDoc } from "./line-signal-doc"
import { linePulseDoc } from "./line-pulse-doc"

const specializedDocs: Record<string, ChartDetailDoc> = {
  "google-line": googleLineDoc,
  "recharts-line-signal": lineSignalDoc,
  "line-signal": lineSignalDoc,
  "recharts-line-pulse": linePulseDoc,
  "line-pulse": linePulseDoc,
}

export function getChartDetailDoc(chart: ChartMetadata): ChartDetailDoc {
  if (specializedDocs[chart.id]) {
    return specializedDocs[chart.id]
  }

  // Synthesize truthful default documentation from canonical metadata
  const isGoogle = chart.engine === "google"
  const isD3 = chart.engine === "d3"
  const isRecharts = chart.engine === "recharts"

  const engineName = isGoogle ? "Google Charts" : isD3 ? "D3.js" : "Recharts"

  const defaultProps: PropDoc[] = [
    {
      name: "data",
      type: "Record<string, any>[]",
      default: "—",
      required: true,
      category: "core",
      description: "Array of structured observations or datum objects to visualize.",
      bestFor: "Primary dataset",
    },
    {
      name: "color",
      type: "string",
      default: '"var(--chart-1, #10b981)"',
      required: false,
      category: "visual",
      description: "Primary theme stroke or fill color. Accepts CSS variables or color values.",
      bestFor: "Theming and visual branding",
      previewable: true,
      controlType: "segmented",
      controlOptions: [
        { value: "#10b981", label: "Emerald" },
        { value: "#0ea5e9", label: "Sky" },
        { value: "#8b5cf6", label: "Purple" },
      ],
    },
    {
      name: "height",
      type: "number | string",
      default: "320",
      required: false,
      category: "core",
      description: "Container height in pixels or standard CSS dimension strings.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      required: false,
      category: "advanced",
      description: "Tailwind CSS classes or custom stylesheet class applied to container wrapper.",
    },
  ]

  return {
    chartId: chart.id,
    engine: chart.engine,
    category: chart.category,
    renderer: chart.renderer,
    status: chart.status,
    blueprint: `${chart.engine.toUpperCase()} / ${chart.category.toUpperCase()} / ${chart.renderer.toUpperCase()} / ${chart.status.toUpperCase()}`,
    quickFacts: {
      bestFor: `${chart.title} visual analytics and ${chart.category} category telemetry.`,
      dataModel: `Normalized ${chart.category} records matching canonical dataShape.`,
      interaction: chart.features.includes("interactive") ? "Pointer hover and focus crosshairs" : "Static presentation",
      responsive: chart.features.includes("responsive") ? "Container-aware ResizeObserver" : "Fixed dimension layout",
      animation: chart.features.includes("animated") ? "Interpolated transitions" : "Static immediate draw",
      runtime: `${engineName} ${chart.renderer}`,
    },
    dataFormat: {
      summary: `Input data format for ${chart.title}. Records should provide required coordinates and metrics.`,
      fields: [
        { field: "label", type: "string", required: true, description: "Category label or horizontal axis timestamp" },
        { field: "value", type: "number", required: true, description: "Metric numerical magnitude" },
      ],
      nullPolicy: "Missing values are gracefully handled or skipped depending on interpolation rules.",
      orderingPolicy: "Records should follow monotonic sorting for sequential coordinate plots.",
      exampleRows: [
        { label: "Jan", value: 186 },
        { label: "Feb", value: 305 },
        { label: "Mar", value: 237 },
      ],
    },
    props: defaultProps,
    examples: [
      {
        id: "default",
        title: `${chart.title} (Default)`,
        description: `Standard presentation with Plotcn dark theme tokens.`,
        snippet: chart.snippet || `<${chart.exportName} />`,
        props: { color: "#10b981" },
      },
    ],
    responsive: {
      overview: `Scales gracefully according to container width, recalculating layout bounds.`,
      breakpoints: [
        { name: "Desktop", width: "1100px+", behavior: "Full horizontal scale and complete axis tick labeling." },
        { name: "Tablet", width: "768px", behavior: "Tighter margins with optimized coordinate grid spacing." },
        { name: "Mobile", width: "390px", behavior: "Compact labels and touch-friendly interaction." },
      ],
    },
    animation: {
      overview: chart.features.includes("animated")
        ? "Smooth entry and update transitions utilizing engine-native animation pipelines."
        : "Direct immediate rendering without decorative delay.",
      duration: chart.features.includes("animated") ? "350ms" : "0ms",
      refreshable: chart.features.includes("animated"),
    },
    interaction: {
      tooltip: "Hover overlays displaying datum coordinates and values.",
    },
    accessibility: {
      role: 'figure[role="region"]',
      summary: `Accessible visualization presenting ${chart.title} data with semantic contrast.`,
      screenReader: `${chart.title} data visualization`,
      keyboardShortcuts: [
        { key: "Tab", action: "Focus chart container and navigate through interactive regions." },
      ],
      colorIndependence: "Coordinate baselines and labels preserve data legibility regardless of color perception.",
      reducedMotion: "Suppresses transitions when user prefers reduced motion.",
    },
    sourceAnatomy: {
      tree: {
        name: chart.exportName,
        role: "Component Entry",
        description: `Primary React component declared in ${chart.componentPath}.`,
        children: [
          {
            name: `${engineName} Engine Layer`,
            role: chart.renderer,
            description: `Visualization calculations and rendering via ${engineName}.`,
          },
        ],
      },
      sourceFiles: [
        { path: chart.componentPath, description: "Primary component source implementation." },
      ],
      registryDependencies: chart.registryDependencies,
      npmDependencies: chart.dependencies,
    },
  }
}

export * from "./types"
export * from "./google-line-doc"
