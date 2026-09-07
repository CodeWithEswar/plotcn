import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const PUBLIC_R = path.join(ROOT, "public", "r")

// Ensure public/r exists
if (!fs.existsSync(PUBLIC_R)) {
  fs.mkdirSync(PUBLIC_R, { recursive: true })
}

function getFileContent(relPath) {
  const full = path.join(ROOT, relPath)
  if (!fs.existsSync(full)) {
    console.warn(`[build-registry] Warning: File not found: ${relPath}`)
    return ""
  }
  return fs.readFileSync(full, "utf-8")
}

const plotLineChartContent = getFileContent("components/charts/plot-line-chart.tsx")
const chartUiContent = getFileContent("components/ui/chart.tsx")
const d3PlotContent = getFileContent("components/charts/d3-plot.tsx")
const googleGeochartContent = getFileContent("components/charts/google/google-geochart.tsx")
const googleContainerContent = getFileContent("components/charts/google/google-chart-container.tsx")
const googleLineContent = getFileContent("components/charts/google/google-line-chart.tsx")
const googleBarContent = getFileContent("components/charts/google/google-bar-chart.tsx")

const registryItems = [
  {
    name: "line",
    type: "registry:block",
    title: "Interactive Line Chart",
    description: "Interactive Cartesian line and area chart built with Recharts and theme tokens.",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    files: [
      {
        path: "components/charts/plot-line-chart.tsx",
        content: plotLineChartContent,
        type: "registry:component",
        target: "components/charts/plot-line-chart.tsx",
      },
    ],
    categories: ["charts"],
  },
  {
    name: "line-basic",
    type: "registry:block",
    title: "Basic Line Chart",
    description: "Cartesian line chart requiring responsive container & theme observer.",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    files: [
      {
        path: "components/charts/plot-line-chart.tsx",
        content: plotLineChartContent,
        type: "registry:component",
        target: "components/charts/plot-line-chart.tsx",
      },
    ],
    categories: ["charts"],
  },
  {
    name: "chart-container",
    type: "registry:ui",
    title: "Chart Container Primitive",
    description: "Shared responsive container, ResizeObserver, and CSS token bridge.",
    dependencies: ["recharts"],
    files: [
      {
        path: "components/ui/chart.tsx",
        content: chartUiContent,
        type: "registry:ui",
        target: "components/ui/chart.tsx",
      },
    ],
    categories: ["primitives"],
  },
  {
    name: "area",
    type: "registry:block",
    title: "Layered Area Chart",
    description: "Multi-series layered area chart with smooth gradient fills and responsive tooltip.",
    dependencies: ["recharts"],
    registryDependencies: ["chart-container"],
    files: [
      {
        path: "components/charts/plot-line-chart.tsx",
        content: plotLineChartContent,
        type: "registry:component",
        target: "components/charts/plot-line-chart.tsx",
      },
    ],
    categories: ["charts"],
  },
  {
    name: "geochart",
    type: "registry:block",
    title: "Google GeoChart",
    description: "Statistical SVG choropleth visualization for regions, countries, and markers.",
    dependencies: [],
    files: [
      {
        path: "components/charts/google/google-geochart.tsx",
        content: googleGeochartContent,
        type: "registry:component",
        target: "components/charts/google/google-geochart.tsx",
      },
      {
        path: "components/charts/google/google-chart-container.tsx",
        content: googleContainerContent,
        type: "registry:component",
        target: "components/charts/google/google-chart-container.tsx",
      },
    ],
    categories: ["charts", "maps"],
  },
  {
    name: "google-line",
    type: "registry:block",
    title: "Google Line Chart",
    description: "Continuous trend visualization powered by Google Charts core engine.",
    dependencies: [],
    files: [
      {
        path: "components/charts/google/google-line-chart.tsx",
        content: googleLineContent,
        type: "registry:component",
        target: "components/charts/google/google-line-chart.tsx",
      },
      {
        path: "components/charts/google/google-chart-container.tsx",
        content: googleContainerContent,
        type: "registry:component",
        target: "components/charts/google/google-chart-container.tsx",
      },
    ],
    categories: ["charts"],
  },
  {
    name: "google-bar",
    type: "registry:block",
    title: "Google Bar Chart",
    description: "Regional and category measurements powered by Google Charts core engine.",
    dependencies: [],
    files: [
      {
        path: "components/charts/google/google-bar-chart.tsx",
        content: googleBarContent,
        type: "registry:component",
        target: "components/charts/google/google-bar-chart.tsx",
      },
      {
        path: "components/charts/google/google-chart-container.tsx",
        content: googleContainerContent,
        type: "registry:component",
        target: "components/charts/google/google-chart-container.tsx",
      },
    ],
    categories: ["charts"],
  },
  {
    name: "d3-plot",
    type: "registry:block",
    title: "D3 Plot Visualization",
    description: "Custom geometric visualization powered by D3.js algorithms.",
    dependencies: ["d3"],
    files: [
      {
        path: "components/charts/d3-plot.tsx",
        content: d3PlotContent,
        type: "registry:component",
        target: "components/charts/d3-plot.tsx",
      },
    ],
    categories: ["charts"],
  },
]

// Add catalog alias items for D3 plots
const d3Kinds = ["donut", "heatmap", "network", "candles", "treemap", "geographic", "scatter", "stream"]
for (const kind of d3Kinds) {
  registryItems.push({
    name: kind,
    type: "registry:block",
    title: `D3 ${kind.charAt(0).toUpperCase() + kind.slice(1)} Chart`,
    description: `D3.js ${kind} visualization primitive with theme integration.`,
    dependencies: ["d3"],
    files: [
      {
        path: "components/charts/d3-plot.tsx",
        content: d3PlotContent,
        type: "registry:component",
        target: "components/charts/d3-plot.tsx",
      },
    ],
    categories: ["charts"],
  })
}

// Build index
const registryIndex = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "plotcn",
  homepage: "https://plotcn.vercel.app",
  items: registryItems.map(({ files, ...meta }) => meta),
}

// Write index files
fs.writeFileSync(path.join(PUBLIC_R, "registry.json"), JSON.stringify(registryIndex, null, 2))
fs.writeFileSync(path.join(PUBLIC_R, "index.json"), JSON.stringify(registryIndex, null, 2))

// Write each individual item file
for (const item of registryItems) {
  const itemPayload = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
  }
  const filePath = path.join(PUBLIC_R, `${item.name}.json`)
  fs.writeFileSync(filePath, JSON.stringify(itemPayload, null, 2))
}

console.log(`[build-registry] Successfully generated ${registryItems.length} registry items into public/r/`)
