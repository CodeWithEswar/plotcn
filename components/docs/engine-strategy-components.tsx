import React from "react"
import Link from "next/link"
import { cn } from "cn"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Layers01Icon,
  Globe02Icon,
  ChartBarLineIcon,
  Folder01Icon,
  ComputerTerminal01Icon,
  SourceCodeIcon,
  Package01Icon,
  Search01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { PlotcnMark } from "@/components/brand"
import {
  FlowDiagram,
  FlowNode,
  FlowConnector,
  FlowTimeline,
} from "./flow"

/**
 * Editorial Hero for Engine Strategy
 */
export function EngineStrategyHero({
  eyebrow = "Visualization Strategy",
  title = "Visualization Engine Strategy",
  description = "Plotcn unifies Recharts, D3.js, and Google Charts into one coherent developer ecosystem while keeping the native capabilities of each engine available.",
}: {
  eyebrow?: string
  title?: string
  description?: string
}) {
  return (
    <header className="mb-6 pt-1 not-prose">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
          {eyebrow}
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
        {title}
      </h1>
      <p className="text-lg sm:text-xl font-medium text-zinc-300 leading-snug max-w-3xl">
        {description}
      </p>
    </header>
  )
}

/**
 * Three Engines Overview Flow
 * Replaces ASCII 3-engine summary
 */
export function EngineTrioSummaryFlow() {
  const engines = [
    {
      name: "Recharts",
      tagline: "Approachable React Application Charts",
      description: "Fast, declarative Cartesian charts, business analytics, and dashboard KPI trends rendered as direct SVG elements.",
      badge: "Declarative React",
      badgeColor: "text-sky-400 bg-sky-950/40 border-sky-800/40",
      icon: ChartBarLineIcon,
      deliverable: "Standard business dashboard metrics",
    },
    {
      name: "D3.js",
      tagline: "Advanced Geometric & Mathematical Control",
      description: "Custom coordinate scales, force-directed networks, hierarchical trees, and fluid physics simulations with React managing the DOM.",
      badge: "Math & Geometry",
      badgeColor: "text-purple-400 bg-purple-950/40 border-purple-800/40",
      icon: Layers01Icon,
      deliverable: "Bespoke custom data representations",
    },
    {
      name: "Google Charts",
      tagline: "Mature Google-Powered & Geographic Charts",
      description: "Enterprise core charts, Gantt timelines, Sankey flow diagrams, and vector GeoChart choropleths via a shared client-side loader.",
      badge: "Hosted Runtime",
      badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/40",
      icon: Globe02Icon,
      deliverable: "Statistical choropleths & specialized types",
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {engines.map((e) => {
          const Icon = e.icon
          return (
            <div
              key={e.name}
              className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2.5">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Icon} size={18} className="text-zinc-300" />
                    <h3 className="text-sm font-bold text-white tracking-tight">{e.name}</h3>
                  </div>
                  <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase", e.badgeColor)}>
                    {e.badge}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-200 mb-1.5">{e.tagline}</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{e.description}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                Primary role: <span className="text-zinc-300">{e.deliverable}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Recharts Design Philosophy Card
 * Replaces ASCII equation in 3.2
 */
export function RechartsPhilosophyCard() {
  const pillars = [
    { label: "Simple API", desc: "No complex configuration objects for basic charts" },
    { label: "Readable Source", desc: "Clean TypeScript JSX you can inspect and understand" },
    { label: "Good Defaults", desc: "Tailwind tokens, responsive margins, and dark mode" },
    { label: "Easy Customization", desc: "Edit the file in your repo when requirements change" },
  ]

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
        Recharts Design Philosophy
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {pillars.map((p, idx) => (
          <div key={p.label} className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40 text-center">
            <span className="text-[10px] font-mono text-sky-400 block mb-1">0{idx + 1}</span>
            <div className="text-xs font-bold text-white mb-1">{p.label}</div>
            <p className="text-[11px] text-zinc-400 leading-snug">{p.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/[0.04] flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="text-zinc-300">
          <strong className="text-white">Anti-Pattern Avoided:</strong> No monolithic <code>&lt;UniversalChart engine="recharts" ... /&gt;</code> wrappers.
        </span>
        <span className="text-[10px] font-mono text-emerald-400">Canonical: &lt;LineBasic data=&#123;data&#125; /&gt;</span>
      </div>
    </div>
  )
}

/**
 * Recharts Component Families Roadmap Card
 * Replaces ASCII list in 3.3
 */
export function RechartsRoadmapCard() {
  const families = [
    {
      name: "Line Charts",
      items: ["line-basic", "line-multiple", "line-dots", "line-stepped", "line-gradient", "line-comparison", "line-interactive"],
    },
    {
      name: "Area Charts",
      items: ["area-basic", "area-gradient", "area-stacked", "area-comparison", "area-interactive"],
    },
    {
      name: "Bar Charts",
      items: ["bar-basic", "bar-horizontal", "bar-grouped", "bar-stacked", "bar-negative", "bar-comparison", "bar-interactive"],
    },
    {
      name: "Pie & Donut",
      items: ["pie-basic", "pie-label", "pie-interactive", "donut-basic", "donut-centered-value", "donut-interactive"],
    },
    {
      name: "Dashboard Primitives",
      items: ["sparkline-line", "sparkline-area", "kpi-trend", "metric-comparison", "mini-area", "progress-ring"],
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {families.map((f) => (
          <div key={f.name} className="p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/70">
            <div className="flex items-center justify-between mb-2.5 border-b border-white/[0.05] pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{f.name}</h4>
              <span className="text-[9px] font-mono text-zinc-500">{f.items.length} items</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {f.items.map((item) => (
                <span
                  key={item}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * D3.js Core Pipeline & Responsibility Split
 * Replaces ASCII flow in 3.4 & 3.6
 */
export function D3CoreFlowCard() {
  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/[0.06] pb-3">
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">D3.js Architectural Pipeline</h4>
          <p className="text-[11px] text-zinc-400">Pure mathematical calculation separated from declarative React DOM</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
          Math ➔ React ➔ Output
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4 text-xs font-mono">
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-center w-full md:w-auto flex-1">
          Raw / Aggregated Data
        </div>
        <span className="text-zinc-600 font-bold">➔</span>
        <div className="p-2.5 rounded bg-purple-950/30 border border-purple-800/40 text-purple-300 text-center w-full md:w-auto flex-1">
          D3 Math Calculations
        </div>
        <span className="text-zinc-600 font-bold">➔</span>
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-center w-full md:w-auto flex-1">
          React DOM & State
        </div>
        <span className="text-zinc-600 font-bold">➔</span>
        <div className="p-2.5 rounded bg-purple-950/30 border border-purple-800/40 text-purple-300 text-center w-full md:w-auto flex-1 font-bold">
          SVG / Canvas Output
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
        <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="text-[11px] font-mono text-purple-400 uppercase font-bold mb-1.5">
            D3 Primarily Owns:
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Continuous scales, geometry generation, tree hierarchies, physics force simulation, interpolation math, contour paths, and geographic projections.
          </p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold mb-1.5">
            React Primarily Owns:
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Rendering SVG paths, component lifecycle, user interaction state, tooltips, accessible naming, keyboard focus rings, and composition.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * D3 Registry Dependency Isolation
 * Replaces ASCII 3.8
 */
export function D3DependencyIsolationCard() {
  const examples = [
    {
      item: "d3-animated-line",
      deps: ["d3-array", "d3-scale", "d3-shape"],
      scope: "Continuous Cartesian curves with smooth transitions",
    },
    {
      item: "d3-force-network",
      deps: ["d3-force", "d3-scale", "d3-array"],
      scope: "Physics-based node simulation and connection links",
    },
    {
      item: "d3-choropleth",
      deps: ["d3-geo", "d3-scale", "d3-array"],
      scope: "Mathematical geographic projections and value color scales",
    },
    {
      item: "d3-treemap",
      deps: ["d3-hierarchy", "d3-scale", "d3-array"],
      scope: "Hierarchical squarified proportional rectangles",
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((ex) => (
          <div key={ex.item} className="p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white">{ex.item}</span>
              <span className="text-[9px] font-mono text-zinc-500">{ex.deps.length} modules</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-2.5">{ex.scope}</p>
            <div className="flex flex-wrap gap-1 border-t border-white/[0.04] pt-2">
              {ex.deps.map((dep) => (
                <span
                  key={dep}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/20 border border-purple-800/30 text-purple-300"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Google GeoChart Collection Tree Card
 * Replaces ASCII 3.13
 */
export function GoogleGeoChartTreeCard() {
  const subcategories = [
    { title: "World Choropleth", desc: "Global country-level statistical heatmaps using ISO-3166-1 codes." },
    { title: "Country Regions", desc: "Provincial, state, or regional zoom (e.g. US states, Indian states)." },
    { title: "State / Province Regions", desc: "Sub-national territorial boundaries and statistical distributions." },
    { title: "Marker Map Mode", desc: "Specific latitude/longitude or city points with proportional radius." },
    { title: "Value-Based Color Scales", desc: "Linear gradient spectrums mapping metrics to HSL/OKLCH themes." },
    { title: "Region Selection Events", desc: "Typed onRegionSelect callbacks for interactive dashboard drill-downs." },
  ]

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Globe02Icon} size={16} className="text-amber-400" />
          <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
            Google Charts ➔ Geo Collection
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
          No Google Maps Platform Required
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {subcategories.map((sub) => (
          <div key={sub.title} className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
            <h5 className="text-xs font-semibold text-white mb-1">{sub.title}</h5>
            <p className="text-[11px] text-zinc-400 leading-snug">{sub.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Google Runtime Boundary & Ownership Card
 * Replaces ASCII 3.14
 */
export function GoogleRuntimeBoundaryCard() {
  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
        Google Charts Runtime & Ownership Boundary
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-xs font-mono mb-4">
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-center">Plotcn Source</div>
        <div className="text-center text-zinc-600 font-bold">➔</div>
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-center">Google Wrapper</div>
        <div className="text-center text-zinc-600 font-bold">➔</div>
        <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 text-center font-bold">
          Hosted Runtime
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
        <div className="p-3 rounded-lg bg-emerald-950/10 border border-emerald-500/20">
          <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold mb-1.5">
            What You Own:
          </div>
          <ul className="space-y-1 text-[11px] text-zinc-300">
            <li>• Local Plotcn wrapper component source code</li>
            <li>• CSS variable theme adapter and token mapping</li>
            <li>• Typed data transformation and props mapping</li>
            <li>• ResizeObserver container lifecycle logic</li>
            <li>• Accessible screen-reader shell & data disclosure tables</li>
            <li>• Event handlers and callback bridges</li>
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/[0.05]">
          <div className="text-[11px] font-mono text-zinc-400 uppercase font-bold mb-1.5">
            What Google Owns:
          </div>
          <ul className="space-y-1 text-[11px] text-zinc-400">
            <li>• The underlying hosted chart rendering engine</li>
            <li>• Geographic boundary datasets (UN M.49 / ISO regions)</li>
            <li>• Built-in internal vector rendering algorithms</li>
            <li>• Native Google event dispatcher</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Google Theme Adapter Flow
 * Replaces ASCII 3.19
 */
export function GoogleThemeAdapterFlow() {
  const steps = [
    { step: "App CSS Variables", desc: "Reads --background, --foreground, --chart-1 ... --chart-5" },
    { step: "Plotcn Theme Resolver", desc: "Extracts computed HSL/OKLCH color values at runtime" },
    { step: "Typed Google Options", desc: "Builds Google ChartOptions (colors, backgroundColor, fontName)" },
    { step: "chart.draw(data, options)", desc: "Draws canvas/SVG with correct theme without brittle DOM mutation" },
  ]

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
        Google Theme Translation Pipeline
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {steps.map((s, idx) => (
          <div key={s.step} className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
            <div className="text-[10px] font-mono text-amber-400 mb-1 font-bold">STEP 0{idx + 1}</div>
            <div className="text-xs font-semibold text-white mb-1">{s.step}</div>
            <p className="text-[11px] text-zinc-400 leading-snug">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Google Responsive Lifecycle Card
 * Replaces ASCII 3.20
 */
export function GoogleResponsiveLifecycleCard() {
  return (
    <div className="my-6 p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70 not-prose">
      <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
        <HugeiconsIcon icon={Shield01Icon} size={16} className="text-amber-400" />
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Google Responsive Redraw Cycle</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono text-center">
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-zinc-200">
          ResizeObserver detects width change
        </div>
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-zinc-200">
          150ms Debounced Schedule
        </div>
        <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/30 text-amber-300">
          chart.draw(data, options)
        </div>
        <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.05] text-zinc-400">
          Full Cleanup on Unmount
        </div>
      </div>
    </div>
  )
}

/**
 * Registry Naming & Dependency Isolation Card
 * Replaces Section 3.25 & 3.26
 */
export function RegistryNamingAndIsolationCard() {
  const namingPatterns = [
    { engine: "Recharts (Canonical)", prefix: "None or direct", example: "@plotcn/line-basic", desc: "Default Cartesian application charts" },
    { engine: "D3.js (Modular)", prefix: "d3-*", example: "@plotcn/d3-force-network", desc: "Explicit prefix indicating modular D3 algorithms" },
    { engine: "Google Charts", prefix: "google-*", example: "@plotcn/google-geochart", desc: "Explicit prefix indicating hosted runtime wrapper" },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5">
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
          Registry Naming Conventions & Zero Cross-Engine Leakage
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {namingPatterns.map((n) => (
            <div key={n.engine} className="p-3.5 rounded-lg border border-white/[0.05] bg-zinc-900/40">
              <div className="text-xs font-bold text-white mb-1">{n.engine}</div>
              <div className="text-[10px] font-mono text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/[0.06] inline-block mb-2">
                {n.example}
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{n.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-zinc-400 mt-4 border-t border-white/[0.05] pt-3">
          <strong className="text-white">Strict Isolation:</strong> Installing an item from one engine never installs dependencies or runtime helpers belonging to the other two engines.
        </p>
      </div>
    </div>
  )
}

/**
 * Gallery & Documentation Hierarchy Card
 * Replaces ASCII 3.27 & 3.28
 */
export function GalleryAndDocsHierarchyCard() {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
      <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
          <HugeiconsIcon icon={Folder01Icon} size={16} className="text-sky-400" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Gallery Engine Filters</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04]">
            <strong className="text-white">All</strong>: Universal catalog sorted by popularity
          </div>
          <div className="p-2 rounded bg-sky-950/20 border border-sky-800/30 text-sky-200">
            <strong>Recharts</strong>: Line • Area • Bar • Pie • Dashboard
          </div>
          <div className="p-2 rounded bg-purple-950/20 border border-purple-800/30 text-purple-200">
            <strong>D3.js</strong>: Statistical • Hierarchy • Network • Financial • Geo
          </div>
          <div className="p-2 rounded bg-amber-950/20 border border-amber-800/30 text-amber-200">
            <strong>Google Charts</strong>: Core Charts • Specialized • GeoChart
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
          <HugeiconsIcon icon={SourceCodeIcon} size={16} className="text-emerald-400" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Documentation Structure</h4>
        </div>
        <div className="space-y-2 text-xs text-zinc-300">
          <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] font-mono text-[11px]">
            /docs/recharts/* ➔ Conventional React Cartesian docs
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] font-mono text-[11px]">
            /docs/d3/* ➔ Mathematical geometry & scale guides
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] font-mono text-[11px]">
            /docs/google-charts ➔ Loader architecture & Core Charts
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] font-mono text-[11px]">
            /docs/google-geochart ➔ World & regional choropleths
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Engine Build Roadmap Flow (Phases 1 - 7)
 * Replaces ASCII 3.30
 */
export function EngineBuildRoadmapFlow() {
  const phases = [
    {
      phase: 1,
      title: "Shared Chart Foundation",
      items: ["Chart container & ResizeObserver", "Semantic CSS variable tokens", "Truthful state fallbacks (loading, empty, error)", "Accessibility shell & data disclosure tables"],
    },
    {
      phase: 2,
      title: "Recharts Core Collection",
      items: ["Line family (basic, multiple, gradient)", "Area family (basic, stacked, comparison)", "Bar family (grouped, horizontal, stacked)", "Pie & Donut families with KPI metrics"],
    },
    {
      phase: 3,
      title: "D3.js Core Collection",
      items: ["Modular math & coordinate scales", "Animated & zoomable Cartesian lines", "Hierarchical Treemap & Sunburst", "Force-directed physics networks"],
    },
    {
      phase: 4,
      title: "Google Charts Foundation",
      items: ["Singleton promise-deduped loader", "Strict GoogleChartsLoaderState machine", "On-demand package isolation map", "CSS variable theme options adapter"],
    },
    {
      phase: 5,
      title: "Google Core Charts",
      items: ["Google Line & Bar implementations", "Google Pie & Donut charts", "Debounced container redraw lifecycle", "Accessible table fallback parity"],
    },
    {
      phase: 6,
      title: "Google GeoChart Collection",
      items: ["World country choropleths (ISO-3166-1)", "State & provincial region zooming", "Value-based color scale gradients", "Typed onRegionSelect event dispatching"],
    },
    {
      phase: 7,
      title: "Specialized & Experimental",
      items: ["Google Timeline & Gantt schedules", "Google Sankey energy/data flows", "Google TreeMap density grids", "Advanced D3 experimental geometries"],
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="space-y-3">
        {phases.map((p) => (
          <div
            key={p.phase}
            className="p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                  PHASE 0{p.phase}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">{p.title}</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-white/[0.04]">
              {p.items.map((item) => (
                <div key={item} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 14 Core Engine Principles Card
 * Replaces ASCII 3.31
 */
export function EnginePrinciplesCard() {
  const principles = [
    { id: 1, title: "Recharts is the approachable application-chart engine." },
    { id: 2, title: "D3.js is the advanced geometric visualization engine." },
    { id: 3, title: "Google Charts is the mature Google-powered specialized & geographic engine." },
    { id: 4, title: "No engine should be forced through another engine." },
    { id: 5, title: "Plotcn shares the product experience, not internal rendering mechanics." },
    { id: 6, title: "Registry items remain strictly engine-isolated." },
    { id: 7, title: "D3 modules remain explicit, granular, and modular." },
    { id: 8, title: "Google packages load strictly on demand." },
    { id: 9, title: "Google Charts never loads globally or eagerly." },
    { id: 10, title: "SVG remains the preferred Plotcn-owned renderer." },
    { id: 11, title: "Canvas is added for justified high-density D3 cases." },
    { id: 12, title: "Source must remain readable after registry installation." },
    { id: 13, title: "Accessibility and responsiveness are part of every component contract." },
    { id: 14, title: "Components are implemented for real value, not to inflate catalog count." },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {principles.map((pr) => (
          <div
            key={pr.id}
            className="p-3 rounded-lg border border-white/[0.06] bg-zinc-950/60 hover:bg-zinc-900/50 transition-colors flex items-start gap-2.5"
          >
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold shrink-0 mt-0.5">
              {pr.id < 10 ? `0${pr.id}` : pr.id}
            </span>
            <span className="text-xs text-zinc-300 font-medium leading-snug">{pr.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Final Engine Strategy Mental Model Diagram
 * Replaces ASCII 3.32
 */
export function EngineStrategyMentalModelDiagram() {
  return (
    <FlowDiagram
      title="Visualization Engine Strategy Mental Model"
      eyebrow="Engine Strategy 3.32"
      description="Use Recharts when the chart should be easy. Use D3.js when the visualization needs control. Use Google Charts when specialized or geographic capabilities are the right fit."
      ariaLabel="Engine strategy mental model diagram"
    >
      <div className="flex flex-col items-center space-y-3 w-full">
        {/* Root */}
        <div className="w-full max-w-sm">
          <FlowNode
            variant="primary"
            icon={PlotcnMark}
            eyebrow="THREE ENGINES"
            title="Plotcn Ecosystem"
            description="Source-first visualization system with distinct rendering engines."
            badge="Unified Experience"
          />
        </div>

        <FlowConnector direction="down" label="branches into three specialized collections" />

        {/* Three Engines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          <FlowNode
            variant="secondary"
            icon={ChartBarLineIcon}
            eyebrow="RECHARTS COLLECTION"
            title="Approachable React Charts"
            description="Conventional business metrics, dashboards, and Cartesian lines/bars/areas."
            badge="Declarative SVG"
          />
          <FlowNode
            variant="secondary"
            icon={Layers01Icon}
            eyebrow="D3.JS COLLECTION"
            title="Complete Geometric Control"
            description="Continuous scales, physics networks, hierarchical trees, and custom projections."
            badge="Math + React DOM"
          />
          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="GOOGLE CHARTS COLLECTION"
            title="Mature & Geographic Charts"
            description="Vector GeoChart choropleths, Timelines, Sankeys, and enterprise core charts."
            badge="Hosted Runtime"
          />
        </div>

        <FlowConnector direction="down" label="wrapped by shared product layer" />

        {/* Shared Experience */}
        <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1 font-semibold">
            SHARED PLOTCN EXPERIENCE LAYER
          </span>
          <p className="text-xs text-zinc-300 font-medium">
            Container Responsiveness • Semantic Theme Tokens • Truthful States • Accessibility Shell • Tooltip & Legend Standards
          </p>
        </div>

        <FlowConnector direction="down" label="distributed via shadcn Registry" />

        {/* Output */}
        <div className="w-full max-w-sm">
          <FlowNode
            variant="secondary"
            icon={SourceCodeIcon}
            eyebrow="YOUR CODEBASE"
            title="Local Editable Source"
            description="Installed directly into components/charts/. You own every pixel and line of code."
            badge="100% Owned"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}
