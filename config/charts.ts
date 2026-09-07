import type { ChartMetadata } from "@/lib/charts/metadata"

export const charts: readonly ChartMetadata[] = [
  // Recharts Family
  {
    id: "recharts-line-signal",
    slug: "line-signal",
    registryName: "line-signal",
    title: "Signal Line",
    description:
      "Focused single-series time-series visualization with restrained active-point emphasis, accessible keyboard exploration, and Plotcn semantic tokens.",
    engine: "recharts",
    renderer: "svg",
    status: "stable",
    difficulty: "beginner",
    category: "line",
    tags: ["recharts", "line", "signal", "time-series", "trend", "analytics", "accessible"],
    componentPath: "registry/recharts/line-signal.tsx",
    exportName: "SignalLine",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container", "chart-state", "chart-tooltip", "chart-motion"],
    features: ["responsive", "animated", "interactive", "tooltip", "keyboard", "accessible-data"],
    dataShape: `interface SignalLineDatum {\n  date: string\n  value: number\n}`,
    snippet: `<SignalLine data={data} xKey="date" seriesKey="value" />`,
  },
  {
    id: "recharts-line-basic",
    slug: "line-basic",
    registryName: "line-basic",
    title: "Basic Line Chart",
    description:
      "Responsive single-series Cartesian line chart with pointer tooltips, smooth monotone curves, and keyboard exploration.",
    engine: "recharts",
    renderer: "svg",
    status: "stable",
    difficulty: "beginner",
    category: "line",
    tags: ["recharts", "line", "cartesian", "analytics", "trend"],
    componentPath: "registry/recharts/line-basic.tsx",
    exportName: "LineBasic",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container","chart-state","chart-motion","chart-tooltip"],
    features: ["responsive", "animated", "interactive", "tooltip", "keyboard"],
    dataShape: `interface LineBasicDatum {\n  label: string\n  value: number\n}`,
    snippet: `<LineBasic data={data} color="var(--chart-1)" />`,
  },
  {
    id: "recharts-line-multiple",
    slug: "line-multiple",
    registryName: "line-multiple",
    title: "Multi-Series Line Chart",
    description:
      "Multi-series line chart supporting comparisons between primary and secondary metrics with solid and dashed strokes and shared tooltips.",
    engine: "recharts",
    renderer: "svg",
    status: "stable",
    difficulty: "beginner",
    category: "line",
    tags: ["recharts", "line", "multi-series", "comparison", "trends"],
    componentPath: "registry/recharts/line-multiple.tsx",
    exportName: "LineMultiple",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container","chart-tooltip"],
    features: ["responsive", "interactive", "tooltip", "legend", "keyboard"],
    dataShape: `interface MultiSeriesDatum {\n  label: string\n  current: number\n  previous: number\n}`,
    snippet: `<LineMultiple data={data} />`,
  },
  {
    id: "recharts-area-basic",
    slug: "area-basic",
    registryName: "area-basic",
    title: "Basic Area Chart",
    description:
      "Filled gradient area chart designed for continuous volume, cumulative metrics, and bandwidth visualization with a subtle vertical gradient.",
    engine: "recharts",
    renderer: "svg",
    status: "stable",
    difficulty: "beginner",
    category: "area",
    tags: ["recharts", "area", "gradient", "volume", "metrics"],
    componentPath: "registry/recharts/area-basic.tsx",
    exportName: "AreaBasic",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container","chart-tooltip"],
    features: ["responsive", "animated", "interactive", "tooltip", "keyboard"],
    dataShape: `interface AreaBasicDatum {\n  label: string\n  value: number\n}`,
    snippet: `<AreaBasic data={data} color="var(--chart-1)" />`,
  },
  {
    id: "recharts-bar-basic",
    slug: "bar-basic",
    registryName: "bar-basic",
    title: "Basic Bar Chart",
    description:
      "Discrete category comparison bar chart with rounded tops, responsive bar widths, and subtle background tracks.",
    engine: "recharts",
    renderer: "svg",
    status: "stable",
    difficulty: "beginner",
    category: "bar",
    tags: ["recharts", "bar", "column", "comparison", "discrete"],
    componentPath: "registry/recharts/bar-basic.tsx",
    exportName: "BarBasic",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container","chart-motion","chart-tooltip"],
    features: ["responsive", "animated", "interactive", "tooltip", "keyboard"],
    dataShape: `interface BarBasicDatum {\n  label: string\n  value: number\n}`,
    snippet: `<BarBasic data={data} color="var(--chart-1)" />`,
  },

{
  "id": "recharts-donut-basic",
  "slug": "donut-basic",
  "registryName": "donut-basic",
  "title": "Basic Donut Chart",
  "description": "Proportional category breakdown with a configurable inner radius, legend, and tooltips.",
  "engine": "recharts",
  "renderer": "svg",
  "status": "stable",
  "difficulty": "beginner",
  "category": "pie",
  "tags": [
    "recharts",
    "donut",
    "composition",
    "proportions"
  ],
  "componentPath": "registry/recharts/donut-basic.tsx",
  "exportName": "DonutBasic",
  "dependencies": [
    "recharts"
  ],
  "registryDependencies": [
    "chart-container",
    "chart-motion",
    "chart-tooltip"
  ],
  "features": [
    "responsive",
    "animated",
    "interactive",
    "tooltip",
    "legend"
  ],
  "dataShape": "interface DonutDatum {\n  label: string\n  value: number\n}",
  "snippet": "<DonutBasic data={data} />"
},

  // D3.js Family
  {
    id: "d3-animated-line",
    slug: "animated-line",
    registryName: "d3-animated-line",
    title: "D3 Animated Line Plot",
    description:
      "Direct SVG path rendering powered by D3 scales and stroke-dashoffset drawing animation using native SVG.",
    engine: "d3",
    renderer: "svg",
    status: "beta",
    difficulty: "advanced",
    category: "line",
    tags: ["d3", "line", "svg", "animation", "precision", "scales"],
    componentPath: "registry/d3/d3-animated-line.tsx",
    exportName: "D3AnimatedLine",
    dependencies: ["d3-scale","d3-shape","d3-array"],
    registryDependencies: ["chart-motion"],
    features: ["responsive", "animated"],
    dataShape: `interface D3Point {\n  x: number\n  y: number\n}`,
    snippet: `<D3AnimatedLine data={points} color="#10b981" />`,
  },
  {
    id: "d3-force-network",
    slug: "force-network",
    registryName: "d3-force-network",
    title: "D3 Force-Directed Network",
    description:
      "Force-directed network with a settling physics simulation, labeled nodes, and automatic centering.",
    engine: "d3",
    renderer: "svg",
    status: "beta",
    difficulty: "advanced",
    category: "network",
    tags: [
      "d3",
      "network",
      "physics",
      "force-directed",
      "simulation",
      "topology",
    ],
    componentPath: "registry/d3/d3-force-network.tsx",
    exportName: "D3ForceNetwork",
    dependencies: ["d3-force"],
    registryDependencies: [],
    features: ["responsive", "animated"],
    dataShape: `interface NetworkData {\n  nodes: { id: string; label: string; group?: number }[]\n  links: { source: string; target: string; value?: number }[]\n}`,
    snippet: `<D3ForceNetwork nodes={nodes} links={links} />`,
  },

  // Google Charts Family
  {
    id: "google-line",
    slug: "line",
    registryName: "google-line",
    title: "Google Core Line Chart",
    description:
      "Google Visualization corechart line with dark theme styling, smooth spline interpolation, and singleton loader deduplication.",
    engine: "google",
    renderer: "google-runtime",
    status: "stable",
    difficulty: "intermediate",
    category: "line",
    tags: ["google", "line", "corechart", "hosted-runtime", "spline"],
    componentPath: "registry/google/google-line.tsx",
    exportName: "GoogleLine",
    dependencies: [],
    registryDependencies: ["google-chart-container","google-chart-loader"],
    features: ["responsive", "interactive", "tooltip"],
    dataShape: `interface GoogleLineDatum {\n  label: string\n  value: number\n}`,
    snippet: `<GoogleLine data={data} color="#10b981" />`,
  },
  {
    id: "google-bar",
    slug: "bar",
    registryName: "google-bar",
    title: "Google Column Bar Chart",
    description:
      "Google ColumnChart with clean vertical bars, transparent background, and dark theme grid lines.",
    engine: "google",
    renderer: "google-runtime",
    status: "stable",
    difficulty: "intermediate",
    category: "bar",
    tags: ["google", "bar", "column", "corechart", "metrics"],
    componentPath: "registry/google/google-bar.tsx",
    exportName: "GoogleBar",
    dependencies: [],
    registryDependencies: ["google-chart-container","google-chart-loader"],
    features: ["responsive", "interactive", "tooltip"],
    dataShape: `interface GoogleBarDatum {\n  label: string\n  value: number\n}`,
    snippet: `<GoogleBar data={data} color="#10b981" />`,
  },
  {
    id: "google-geochart",
    slug: "geochart",
    registryName: "google-geochart",
    title: "Google GeoChart Vector Map",
    description:
      "Interactive SVG choropleth world and country map with dynamic color scaling, regional hover tooltips, and click callbacks.",
    engine: "google",
    renderer: "google-runtime",
    status: "stable",
    difficulty: "intermediate",
    category: "geo",
    tags: ["google", "geo", "geochart", "map", "choropleth", "world"],
    componentPath: "registry/google/google-geochart.tsx",
    exportName: "GoogleGeoChart",
    dependencies: [],
    registryDependencies: ["google-chart-container","google-chart-loader"],
    features: ["responsive", "interactive", "tooltip", "selection"],
    dataShape: `interface GeoChartDatum {\n  region: string\n  value: number\n}`,
    snippet: `<GoogleGeoChart data={data} region="world" displayMode="regions" />`,
  },
] as const

export function getAllCharts(): readonly ChartMetadata[] {
  return charts
}

export function getChartsByEngine(
  engine: ChartMetadata["engine"]
): readonly ChartMetadata[] {
  return charts.filter((c) => c.engine === engine)
}

export function getChartByEngineAndSlug(
  engine: string,
  slug: string
): ChartMetadata | undefined {
  return charts.find((c) => c.engine === engine && c.slug === slug)
}

export function getChartById(id: string): ChartMetadata | undefined {
  return charts.find((c) => c.id === id || c.registryName === id)
}
