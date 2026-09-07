import type { ChartMetadata } from "@/lib/charts/metadata"

export const charts: readonly ChartMetadata[] = [
  // Recharts Family
  {
    id: "recharts-line-basic",
    slug: "line-basic",
    registryName: "line-basic",
    title: "Basic Line Chart",
    description: "Responsive single-series Cartesian line chart with custom glassmorphic tooltips, smooth monotone curves, and accessible gridlines.",
    engine: "recharts",
    category: "line",
    tags: ["recharts", "line", "cartesian", "analytics", "trend"],
    componentPath: "registry/recharts/line-basic.tsx",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    features: ["ResponsiveContainer", "Curved Spline", "Glassmorphic Tooltip", "Accessible Axis"],
    dataShape: `interface LineBasicDatum {\n  label: string\n  value: number\n}`,
    snippet: `<LineBasic data={data} color="hsl(var(--chart-1))" />`,
  },
  {
    id: "recharts-line-multiple",
    slug: "line-multiple",
    registryName: "line-multiple",
    title: "Multi-Series Line Chart",
    description: "Multi-series line chart supporting comparisons between primary and secondary metrics with contrasting neon strokes and synchronized tooltips.",
    engine: "recharts",
    category: "line",
    tags: ["recharts", "line", "multi-series", "comparison", "trends"],
    componentPath: "registry/recharts/line-multiple.tsx",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    features: ["Dual Series", "Interactive Legend", "Custom Dots", "Synchronized Tooltips"],
    dataShape: `interface MultiSeriesDatum {\n  label: string\n  primary: number\n  secondary: number\n}`,
    snippet: `<LineMultiple data={data} series={[{ key: "primary", color: "#10b981" }, { key: "secondary", color: "#3b82f6" }]} />`,
  },
  {
    id: "recharts-area-basic",
    slug: "area-basic",
    registryName: "area-basic",
    title: "Basic Area Chart",
    description: "Filled gradient area chart designed for continuous volume, cumulative metrics, and bandwidth visualization with glowing accents.",
    engine: "recharts",
    category: "area",
    tags: ["recharts", "area", "gradient", "volume", "metrics"],
    componentPath: "registry/recharts/area-basic.tsx",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    features: ["Vertical Gradient Fill", "Stroke Glow", "Minimal Cartesian Grid", "Responsive"],
    dataShape: `interface AreaBasicDatum {\n  label: string\n  value: number\n}`,
    snippet: `<AreaBasic data={data} color="#10b981" />`,
  },
  {
    id: "recharts-bar-basic",
    slug: "bar-basic",
    registryName: "bar-basic",
    title: "Basic Bar Chart",
    description: "Discrete category comparison bar chart with rounded tops, responsive bar widths, and subtle background tracks.",
    engine: "recharts",
    category: "bar",
    tags: ["recharts", "bar", "column", "comparison", "discrete"],
    componentPath: "registry/recharts/bar-basic.tsx",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    features: ["Rounded Bar Caps", "Category Tick Formatter", "Dynamic Hover Tint", "Dark Theme"],
    dataShape: `interface BarBasicDatum {\n  label: string\n  value: number\n}`,
    snippet: `<BarBasic data={data} color="hsl(var(--chart-1))" />`,
  },

  // D3.js Family
  {
    id: "d3-animated-line",
    slug: "animated-line",
    registryName: "d3-animated-line",
    title: "D3 Animated Line Plot",
    description: "Direct SVG path rendering powered by D3 scales and stroke-dashoffset drawing animation with precision crosshair snapping.",
    engine: "d3",
    category: "line",
    tags: ["d3", "line", "svg", "animation", "precision", "scales"],
    componentPath: "registry/d3/d3-animated-line.tsx",
    dependencies: ["d3"],
    registryDependencies: ["chart-container"],
    features: ["D3 Linear Scales", "Path Interpolation", "Stroke Animation", "Native SVG"],
    dataShape: `interface D3Point {\n  x: number\n  y: number\n}`,
    snippet: `<D3AnimatedLine data={points} color="#10b981" />`,
  },
  {
    id: "d3-force-network",
    slug: "force-network",
    registryName: "d3-force-network",
    title: "D3 Force-Directed Network",
    description: "Interactive topological network graph with physics simulation, draggable nodes, edge tension, and automatic centering.",
    engine: "d3",
    category: "network",
    tags: ["d3", "network", "physics", "force-directed", "simulation", "interactive"],
    componentPath: "registry/d3/d3-force-network.tsx",
    dependencies: ["d3"],
    registryDependencies: ["chart-container"],
    features: ["Force Simulation", "Draggable Nodes", "Zoom & Pan Ready", "Node Glow"],
    dataShape: `interface NetworkData {\n  nodes: { id: string; group?: number }[]\n  links: { source: string; target: string; value?: number }[]\n}`,
    snippet: `<D3ForceNetwork nodes={nodes} links={links} />`,
  },

  // Google Charts Family
  {
    id: "google-line",
    slug: "line",
    registryName: "google-line",
    title: "Google Core Line Chart",
    description: "Google Visualization corechart line with dark theme styling, smooth spline interpolation, and singleton loader deduplication.",
    engine: "google",
    category: "line",
    tags: ["google", "line", "corechart", "hosted-runtime", "spline"],
    componentPath: "registry/google/google-line.tsx",
    dependencies: [],
    registryDependencies: ["google-chart-loader", "google-chart-container"],
    features: ["Singleton Script Loader", "DataTable Mapping", "Smooth Spline", "SSR Safe"],
    dataShape: `interface GoogleLineDatum {\n  label: string\n  value: number\n}`,
    snippet: `<GoogleLine data={data} color="#10b981" />`,
  },
  {
    id: "google-bar",
    slug: "bar",
    registryName: "google-bar",
    title: "Google Column Bar Chart",
    description: "Google ColumnChart with clean vertical bars, transparent background, and dark theme grid lines.",
    engine: "google",
    category: "bar",
    tags: ["google", "bar", "column", "corechart", "metrics"],
    componentPath: "registry/google/google-bar.tsx",
    dependencies: [],
    registryDependencies: ["google-chart-loader", "google-chart-container"],
    features: ["ColumnChart API", "Automatic Axis Ticks", "Singleton Loader", "Responsive"],
    dataShape: `interface GoogleBarDatum {\n  label: string\n  value: number\n}`,
    snippet: `<GoogleBar data={data} color="#10b981" />`,
  },
  {
    id: "google-geochart",
    slug: "geochart",
    registryName: "google-geochart",
    title: "Google GeoChart Vector Map",
    description: "Interactive SVG choropleth world and country map with dynamic color scaling, regional hover tooltips, and click callbacks.",
    engine: "google",
    category: "geo",
    tags: ["google", "geo", "geochart", "map", "choropleth", "world"],
    componentPath: "registry/google/google-geochart.tsx",
    dependencies: [],
    registryDependencies: ["google-chart-loader", "google-chart-container"],
    features: ["Vector Map", "Color Axis Interpolation", "Region Select Event", "Country Codes"],
    dataShape: `interface GeoChartDatum {\n  region: string\n  value: number\n}`,
    snippet: `<GoogleGeoChart data={data} region="world" displayMode="regions" />`,
  },
] as const

export function getAllCharts(): readonly ChartMetadata[] {
  return charts
}

export function getChartsByEngine(engine: ChartMetadata["engine"]): readonly ChartMetadata[] {
  return charts.filter((c) => c.engine === engine)
}

export function getChartByEngineAndSlug(engine: string, slug: string): ChartMetadata | undefined {
  return charts.find((c) => c.engine === engine && c.slug === slug)
}

export function getChartById(id: string): ChartMetadata | undefined {
  return charts.find((c) => c.id === id || c.registryName === id)
}
