import type { D3PlotKind } from "@/components/charts/d3-plot"
export type ChartEngine = "Recharts" | "D3.js" | "Google Charts"
export type ChartKind = D3PlotKind | "line" | "area" | "geochart" | "google-line" | "google-bar"
export type ChartEntry = { id: string; registryName?: string; title: string; description: string; engine: ChartEngine; category: string; kind: ChartKind; tags: string[] }
export const charts: ChartEntry[] = [
  { id: "line", registryName: "line-basic", title: "Interactive line", description: "Every trend has a story. Make it clear.", engine: "Recharts", category: "Cartesian", kind: "line", tags: ["Tooltip", "Responsive"] },
  { id: "area", registryName: "area-basic", title: "Layered area", description: "See the bigger picture, one series at a time.", engine: "Recharts", category: "Cartesian", kind: "area", tags: ["Comparison", "Responsive"] },
  { id: "geochart", registryName: "google-geochart", title: "World choropleth", description: "Statistical geographic distributions across nations and territories.", engine: "Google Charts", category: "Geo", kind: "geochart", tags: ["Choropleth", "GeoChart", "World"] },
  { id: "donut", registryName: "donut-basic", title: "Radial breakdown", description: "Part to whole. Nothing lost in the middle.", engine: "D3.js", category: "Statistical", kind: "donut", tags: ["Composition", "Custom arcs"] },
  { id: "google-line", registryName: "google-line", title: "Continuous trend", description: "Smooth enterprise metrics powered by Google Charts core engine.", engine: "Google Charts", category: "Cartesian", kind: "google-line", tags: ["Smooth curve", "Metrics", "Timeline"] },
  { id: "heatmap", registryName: "d3-animated-line", title: "Activity heatmap", description: "Find a rhythm in the everyday.", engine: "D3.js", category: "Statistical", kind: "heatmap", tags: ["Density", "Scale bands"] },
  { id: "network", registryName: "d3-force-network", title: "Connected ideas", description: "Make the relationships visible.", engine: "D3.js", category: "Network", kind: "network", tags: ["Relationships", "Interactive"] },
  { id: "candles", registryName: "d3-animated-line", title: "Price movement", description: "The detail behind every close.", engine: "D3.js", category: "Financial", kind: "candles", tags: ["OHLC", "Custom scales"] },
  { id: "google-bar", registryName: "google-bar", title: "Regional comparison", description: "Clean category measurements with dark theme balance.", engine: "Google Charts", category: "Cartesian", kind: "google-bar", tags: ["Comparison", "Metrics", "Columns"] },
  { id: "treemap", registryName: "d3-force-network", title: "Nested proportions", description: "A little structure for complex data.", engine: "D3.js", category: "Hierarchy", kind: "treemap", tags: ["Hierarchy", "Space filling"] },
  { id: "geographic", registryName: "google-geochart", title: "Global perspective", description: "Put your data in its place.", engine: "D3.js", category: "Geographic", kind: "geographic", tags: ["Projection", "Locations"] },
  { id: "scatter", registryName: "d3-animated-line", title: "A pattern emerges", description: "Discover what your observations share.", engine: "D3.js", category: "Statistical", kind: "scatter", tags: ["Distribution", "Observations"] },
  { id: "stream", registryName: "d3-animated-line", title: "Flow studies", description: "A different way to follow the signal.", engine: "D3.js", category: "Experimental", kind: "stream", tags: ["Curves", "Exploration"] },
]
export const chartFilters = ["All", "Recharts", "D3.js", "Google Charts", "Popular", "Geo", "Statistical", "Hierarchy", "Network", "Financial"]
export function chartCode(chart: ChartEntry): string {
  if (chart.engine === "Google Charts") {
    if (chart.kind === "geochart") {
      return `import { GoogleGeoChart } from "@/components/charts/google"\n\nconst data = [\n  { region: "US", users: 840 },\n  { region: "IN", users: 620 },\n  { region: "DE", users: 310 },\n  { region: "GB", users: 290 },\n  { region: "BR", users: 240 },\n  { region: "JP", users: 210 },\n]\n\nexport function Chart() {\n  return (\n    <GoogleGeoChart\n      data={data}\n      regionKey="region"\n      valueKey="users"\n      region="world"\n      height={320}\n    />\n  )\n}`
    }
    if (chart.kind === "google-bar") {
      return `import { GoogleBarChart } from "@/components/charts/google"\n\nconst data = [\n  ["Quarter", "Revenue", "Profit"],\n  ["Q1", 1200, 450],\n  ["Q2", 1900, 720],\n  ["Q3", 2600, 1100],\n  ["Q4", 3200, 1450],\n]\n\nexport function Chart() {\n  return <GoogleBarChart data={data} height={300} />\n}`
    }
    return `import { GoogleLineChart } from "@/components/charts/google"\n\nconst data = [\n  ["Month", "Active Users"],\n  ["Jan", 400],\n  ["Feb", 800],\n  ["Mar", 1400],\n  ["Apr", 2200],\n  ["May", 3100],\n]\n\nexport function Chart() {\n  return <GoogleLineChart data={data} smooth height={300} />\n}`
  }
  return chart.engine === "Recharts"
    ? `import { PlotLineChart } from "@/components/charts/plot-line-chart"\n\nconst data = [\n  { label: "Jan", value: 1200 },\n  { label: "Feb", value: 1800 },\n  { label: "Mar", value: 2600 },\n]\n\nexport function Chart() {\n  return (\n    <div style={{ height: 280 }}>\n      <PlotLineChart data={data} label="Sessions" area={${chart.kind === "area"}} />\n    </div>\n  )\n}`
    : `import { D3Plot } from "@/components/charts/d3-plot"\n\nexport function Chart() {\n  return (\n    <div style={{ height: 280 }}>\n      <D3Plot\n        kind="${chart.kind}"\n        values={[42, 28, 18, 12, 24, 38]}\n      />\n    </div>\n  )\n}`
}
