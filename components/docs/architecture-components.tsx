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
 * Editorial Hero for System Design & Architecture
 */
export function ArchitectureHero({
  eyebrow = "System Design",
  title = "Plotcn Architecture",
  description = "A source-first visualization system composed of three engines, a shared experience layer, and shadcn-compatible registry distribution.",
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
 * High-Level System Architecture SVG Flow Diagram
 * Replaces ASCII diagram 62mxqc
 */
export function HighLevelArchitectureDiagram() {
  return (
    <FlowDiagram
      title="High-Level System Architecture"
      eyebrow="System Design 2.1"
      description="Three engines, shared visualization experience, shadcn-compatible registry distribution, and local consumer ownership."
      ariaLabel="High level system architecture diagram"
    >
      <div className="flex flex-col items-center space-y-3.5 w-full">
        {/* Tier 1: Plotcn Root */}
        <div className="w-full max-w-sm">
          <FlowNode
            variant="primary"
            icon={PlotcnMark}
            eyebrow="ROOT SYSTEM"
            title="Plotcn Ecosystem"
            description="Source-first visualization platform for modern React applications."
            badge="Three Engines"
          />
        </div>

        <FlowConnector direction="down" label="branches into public site & registry" />

        {/* Tier 2: Website & Registry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <HugeiconsIcon icon={Globe02Icon} size={16} className="text-zinc-400" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Product Website</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.05] text-center">
                <span className="text-[11px] font-medium text-zinc-300">Docs</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.05] text-center">
                <span className="text-[11px] font-medium text-zinc-300">Gallery</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.05] text-center">
                <span className="text-[11px] font-medium text-zinc-300">Playground</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Package01Icon} size={16} className="text-emerald-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Plotcn Registry</h4>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">shadcn-compatible</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Distributes complete component source, dependencies, and Tailwind tokens as JSON items.
            </p>
          </div>
        </div>

        <FlowConnector direction="down" label="delivers source components" />

        {/* Tier 3: Three Engines */}
        <div className="w-full">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2 text-center">
            Three Independent Visualization Engines
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FlowNode
              variant="secondary"
              icon={ChartBarLineIcon}
              eyebrow="PRIMARY REACT ENGINE"
              title="Recharts"
              description="Conventional dashboard, business metrics, Cartesian line/bar/area, and analytics."
              badge="Declarative React"
              metadata="Direct SVG Rendering"
            />
            <FlowNode
              variant="secondary"
              icon={Layers01Icon}
              eyebrow="GEOMETRIC ENGINE"
              title="D3.js"
              description="Advanced custom math, scales, force-directed layouts, hierarchy, and continuous domains."
              badge="Math & Coordinates"
              metadata="React DOM + SVG/Canvas"
            />
            <FlowNode
              variant="runtime"
              icon={Globe02Icon}
              eyebrow="HOSTED RUNTIME"
              title="Google Charts"
              description="Enterprise core charts and vector GeoChart choropleths via hosted client loader."
              badge="Hosted Runtime"
              metadata="Core Charts & GeoChart"
            />
          </div>
        </div>

        <FlowConnector direction="down" label="unified through shared chart experience" />

        {/* Tier 4: Shared Chart Experience */}
        <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-white/[0.06] pb-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Shield01Icon} size={16} className="text-emerald-400" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Shared Visualization Experience</h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Consistency outside • Freedom inside</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-300">
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Responsive Container</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Theme Tokens & CSS Vars</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Truthful States</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Accessibility & Tables</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Tooltip Conventions</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Legend Conventions</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Formatting Helpers</div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center">Reduced Motion</div>
          </div>
        </div>

        <FlowConnector direction="down" label="renders to browser output" />

        {/* Tier 5: Rendering Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-950/10 text-center">
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-semibold block mb-1">Recharts Output</span>
            <span className="text-xs text-zinc-200 font-medium">Inspectable SVG Elements</span>
          </div>
          <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10 text-center">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold block mb-1">D3.js Output</span>
            <span className="text-xs text-zinc-200 font-medium">SVG Paths or Canvas Surface</span>
          </div>
          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-950/10 text-center">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold block mb-1">Google Charts Output</span>
            <span className="text-xs text-zinc-200 font-medium">Hosted Runtime Managed DOM</span>
          </div>
        </div>
      </div>
    </FlowDiagram>
  )
}

/**
 * Product Equation Card
 * Replaces ASCII equation qlgug4
 */
export function ProductEquationCard() {
  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
        The Plotcn Product Formulation
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 items-center">
        <div className="p-3.5 rounded-lg border border-white/[0.06] bg-zinc-900/40 text-center md:col-span-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Specialized Power</div>
          <div className="text-sm font-semibold text-white">Engine Capability</div>
          <div className="text-[11px] text-zinc-400 mt-1">Recharts, D3, or Google Charts</div>
        </div>

        <div className="text-center text-zinc-500 font-bold text-lg md:col-span-1">+</div>

        <div className="p-3.5 rounded-lg border border-white/[0.06] bg-zinc-900/40 text-center md:col-span-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Plotcn Standards</div>
          <div className="text-sm font-semibold text-white">Shared Experience</div>
          <div className="text-[11px] text-zinc-400 mt-1">Responsive, theme, a11y, states</div>
        </div>

        <div className="text-center text-zinc-500 font-bold text-lg md:col-span-1">+</div>

        <div className="p-3.5 rounded-lg border border-white/[0.06] bg-zinc-900/40 text-center md:col-span-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Distribution</div>
          <div className="text-sm font-semibold text-white">shadcn Registry</div>
          <div className="text-[11px] text-zinc-400 mt-1">Direct CLI source delivery</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400">=</span>
          <span className="text-sm font-bold text-white">Source-Owned Visualization Component</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          No black-box packages • You own every line
        </span>
      </div>
    </div>
  )
}

/**
 * Five Architectural Domains Card
 * Replaces ASCII tree w0q8ap
 */
export function ArchitecturalDomainsCard() {
  const domains = [
    {
      domain: "1. Product Application",
      badge: "HOSTING",
      color: "text-sky-400 border-sky-800/40 bg-sky-950/20",
      description: "Public user-facing surfaces built with Next.js App Router.",
      items: ["Documentation", "Component Gallery", "Interactive Playground", "Registry Static Hosting"],
      icon: Globe02Icon,
    },
    {
      domain: "2. Shared Visualization Layer",
      badge: "STANDARDS",
      color: "text-emerald-400 border-emerald-800/40 bg-emerald-950/20",
      description: "Engine-independent product concerns wrapping each chart.",
      items: ["Responsive Container", "Truthful States", "Semantic Theming", "Accessibility Shell", "Interaction Conventions"],
      icon: Shield01Icon,
    },
    {
      domain: "3. Visualization Engines",
      badge: "POWER",
      color: "text-amber-400 border-amber-800/40 bg-amber-950/20",
      description: "Three distinct rendering technologies with isolated scopes.",
      items: ["Recharts (Declarative SVG)", "D3.js (Math & Geometry)", "Google Charts (Hosted Runtime)"],
      icon: Layers01Icon,
    },
    {
      domain: "4. Registry Distribution",
      badge: "DISTRIBUTION",
      color: "text-indigo-400 border-indigo-800/40 bg-indigo-950/20",
      description: "Static JSON metadata consumed by the official shadcn CLI.",
      items: ["Item Catalog", "Registry Item Manifests", "NPM Dependencies", "Registry Dependencies"],
      icon: Package01Icon,
    },
    {
      domain: "5. Consumer Application",
      badge: "DESTINATION",
      color: "text-teal-400 border-teal-800/40 bg-teal-950/20",
      description: "Your local codebase where source code is installed and modified.",
      items: ["Installed TypeScript Files", "Direct Component Tweaks", "Local Styling Overrides", "No Upstream Lock-in"],
      icon: SourceCodeIcon,
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {domains.map((d) => {
          const Icon = d.icon
          return (
            <div
              key={d.domain}
              className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Icon} size={16} className="text-zinc-400" />
                  <h4 className="text-xs font-semibold text-white tracking-tight">{d.domain}</h4>
                </div>
                <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase", d.color)}>
                  {d.badge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">{d.description}</p>
              <ul className="space-y-1 border-t border-white/[0.04] pt-2">
                {d.items.map((item) => (
                  <li key={item} className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Three Engine Pipelines Comparison Card
 * Replaces ASCII flows nq0fym, x12zzw, smy3id, tx4w3o
 */
export function EnginePipelinesCard() {
  return (
    <div className="my-6 space-y-4 not-prose">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recharts Pipeline */}
        <div className="rounded-xl border border-sky-500/20 bg-zinc-950/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={ChartBarLineIcon} size={16} className="text-sky-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recharts Pipeline</h4>
              </div>
              <span className="text-[9px] font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/30">
                Declarative React
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                1. Typed application data
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                2. Plotcn Recharts component
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                3. Recharts primitives
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                4. React DOM reconciler
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-sky-950/30 border border-sky-800/40 text-[11px] text-sky-300 font-semibold text-center">
                5. Vector SVG Output
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-3 border-t border-white/[0.04] pt-2">
            Preserves declarative React conventions without extra proprietary wrappers.
          </p>
        </div>

        {/* D3 Pipeline */}
        <div className="rounded-xl border border-purple-500/20 bg-zinc-950/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Layers01Icon} size={16} className="text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">D3.js Pipeline</h4>
              </div>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/30">
                Math ➔ React DOM
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                1. Raw or aggregated data
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-purple-950/20 border border-purple-800/30 text-[11px] text-purple-200">
                2. D3 calculations (scale, layout, geometry, path)
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                3. React component manages DOM & state
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-300 font-semibold text-center">
                4. SVG Paths or Canvas Surface
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-3 border-t border-white/[0.04] pt-2">
            Avoids imperative `d3.select(...)` mutations inside React component lifecycles.
          </p>
        </div>

        {/* Google Charts Pipeline */}
        <div className="rounded-xl border border-amber-500/20 bg-zinc-950/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Globe02Icon} size={16} className="text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Google Charts Pipeline</h4>
              </div>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/30">
                Hosted Runtime
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                1. Typed application data
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                2. Plotcn wrapper (transforms, theme, a11y)
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                3. Shared Google loader (dedup, ready state)
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-[11px] text-zinc-300">
                4. Google runtime `chart.draw(...)`
              </div>
              <div className="text-center text-zinc-600 text-[10px]">↓</div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 font-semibold text-center">
                5. Google-Managed Chart Output
              </div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-3 border-t border-white/[0.04] pt-2">
            Protected behind narrow client boundary. Never loaded in root layout or docs shell.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Google Loader Architecture & Package Isolation Card
 * Replaces ASCII 8jxkq5, 9k64th, ql2bnn, 7igp0h
 */
export function GoogleLoaderArchitectureCard() {
  const packages = [
    { chart: "Google Line / Bar / Area", pkg: "corechart", desc: "Core 2D business Cartesian charts" },
    { chart: "Google GeoChart", pkg: "geochart", desc: "Vector world and regional choropleths" },
    { chart: "Google Timeline", pkg: "timeline", desc: "Temporal spans and Gantt schedules" },
    { chart: "Google Sankey", pkg: "sankey", desc: "Multi-stage energy and data flow paths" },
    { chart: "Google Org Chart", pkg: "orgchart", desc: "Hierarchical reporting structures" },
    { chart: "Google Table", pkg: "table", desc: "Interactive statistical data grid" },
  ]

  const states = [
    { state: "idle", desc: "Component unmounted or script not yet requested." },
    { state: "loading", desc: "Script or package Promise is actively pending." },
    { state: "ready", desc: "google.visualization API is ready to call .draw()." },
    { state: "error", desc: "Script blocked by CSP, network offline, or timeout." },
  ]

  return (
    <div className="my-6 space-y-4 not-prose">
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/[0.06] pb-3">
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">Shared Google Loader Guarantees</h4>
            <p className="text-[11px] text-zinc-400">Located at `@/lib/google-charts/loader.ts`</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
            Singleton Runtime Boundary
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
          {states.map((s) => (
            <div key={s.state} className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-emerald-400">"{s.state}"</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
            On-Demand Package Isolation (`googleChartPackages`)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {packages.map((p) => (
              <div key={p.chart} className="p-2.5 rounded-lg border border-white/[0.04] bg-zinc-900/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{p.chart}</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/30 px-1 rounded border border-amber-800/30">
                    {p.pkg}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Rendering Models Comparison Card
 * Replaces ASCII w05sv5
 */
export function RenderingModelsComparison() {
  const models = [
    {
      engine: "Recharts",
      model: "Declarative React SVG",
      chain: ["React Component", "Recharts Primitives", "SVG DOM Elements"],
      color: "border-sky-500/20 text-sky-400",
      notes: "Direct declarative React JSX rendering with built-in SVG transitions.",
    },
    {
      engine: "D3.js",
      model: "Math-Driven React SVG/Canvas",
      chain: ["Raw Data", "D3 Scale & Geometry", "React SVG Paths / Canvas"],
      color: "border-purple-500/20 text-purple-400",
      notes: "React owns state and DOM lifecycle. D3 computes coordinates and paths.",
    },
    {
      engine: "Google Charts",
      model: "Hosted Client Runtime",
      chain: ["Plotcn React Wrapper", "Singleton Loader", "Google Runtime Output"],
      color: "border-amber-500/20 text-amber-400",
      notes: "Isolated behind client-side wrapper. Redraws managed via ResizeObserver.",
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {models.map((m) => (
          <div key={m.engine} className={cn("p-4 rounded-xl border bg-zinc-950/70", m.color)}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider">{m.engine}</h4>
              <span className="text-[9px] font-mono text-zinc-400">{m.model}</span>
            </div>
            <div className="space-y-1.5 my-3">
              {m.chain.map((step, idx) => (
                <React.Fragment key={step}>
                  <div className="p-2 rounded bg-zinc-900/60 border border-white/[0.04] text-xs text-zinc-300 text-center font-mono">
                    {step}
                  </div>
                  {idx < m.chain.length - 1 && (
                    <div className="text-center text-zinc-600 text-[10px]">↓</div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-3 border-t border-white/[0.04] pt-2">
              {m.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Shared Layer Scope Card (Included vs Excluded)
 * Replaces ASCII 5rw3th & 7jpw55
 */
export function SharedLayerScopeCard() {
  const included = [
    "ChartContainer & ResizeObserver measurement",
    "Truthful states (loading, empty, error, offline)",
    "Semantic CSS variable theme tokens",
    "Accessibility shell & screen-reader data tables",
    "Number & currency formatting utilities",
    "Tooltip & Legend visual design conventions",
    "Reduced-motion-aware interaction conventions",
    "Standardized registry item metadata",
  ]

  const excluded = [
    "Recharts-specific primitives (e.g. <XAxis>, <Tooltip>)",
    "D3 scale calculations or force simulation engines",
    "Google ChartOptions or google.visualization globals",
    "Google loader internals or external network calls",
    "Engine-specific event types or proprietary wrappers",
    "Monolithic 'universal chart' abstractions",
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-zinc-950/70">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-400" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">What the Shared Layer Owns</h4>
        </div>
        <ul className="space-y-2">
          {included.map((item) => (
            <li key={item} className="text-xs text-zinc-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 rounded-xl border border-rose-500/20 bg-zinc-950/70">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
          <HugeiconsIcon icon={Shield01Icon} size={16} className="text-rose-400" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">What the Shared Layer Excludes</h4>
        </div>
        <ul className="space-y-2">
          {excluded.map((item) => (
            <li key={item} className="text-xs text-zinc-400 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * Architectural Boundary Rules (12 Rules)
 * Replaces Section 2.11
 */
export function ArchitecturalBoundaryRulesCard() {
  const rules = [
    {
      num: 1,
      title: "Never force D3 through Recharts",
      summary: "D3 stays idiomatic React + modular D3. Do not create artificial Recharts adapters.",
    },
    {
      num: 2,
      title: "Never force Google Charts through Recharts",
      summary: "Google Charts retains its native loader, data model, and option semantics.",
    },
    {
      num: 3,
      title: "Do not create one universal chart API",
      summary: "Universal <Chart engine='google' /> abstractions hide engine strengths. Keep APIs engine-specific.",
    },
    {
      num: 4,
      title: "shadcn/ui is not a visualization engine",
      summary: "shadcn/ui provides surrounding dialogs, tabs, and registry conventions—not mathematical chart algorithms.",
    },
    {
      num: 5,
      title: "Registry code must remain readable",
      summary: "Installed components should be clean, readable TypeScript with zero obscure build helpers.",
    },
    {
      num: 6,
      title: "Prefer SVG as default renderer",
      summary: "SVG is responsive, accessible, inspectable, and CSS-friendly for normal chart densities.",
    },
    {
      num: 7,
      title: "Canvas is an optimization path",
      summary: "Introduce Canvas only when data point density and framerates genuinely justify it.",
    },
    {
      num: 8,
      title: "WebGL requires justification",
      summary: "Never add WebGL overhead unless extreme visual volume or 3D coordinate space demands it.",
    },
    {
      num: 9,
      title: "React owns component state",
      summary: "D3 computes geometry and scales; React owns rendering, state, and DOM lifecycle.",
    },
    {
      num: 10,
      title: "Google owns its runtime DOM",
      summary: "Google Charts controls its inner chart surface. React owns wrapper, container, and accessibility.",
    },
    {
      num: 11,
      title: "Google must never become a global dependency",
      summary: "The root layout, docs shell, and Recharts gallery must never load the Google script.",
    },
    {
      num: 12,
      title: "No cross-engine dependency leakage",
      summary: "Installing Recharts items never installs D3 or Google packages, and vice versa.",
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rules.map((r) => (
          <div
            key={r.num}
            className="p-3.5 rounded-xl border border-white/[0.07] bg-zinc-950/60 hover:bg-zinc-900/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-emerald-400 font-bold">
                RULE {r.num}
              </span>
              <h5 className="text-xs font-semibold text-white tracking-tight">{r.title}</h5>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed pl-1">{r.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Server vs Client Boundaries & Google Hydration
 * Replaces ASCII x6ac0e & 6kxlt3
 */
export function ClientServerBoundaryCard() {
  return (
    <div className="my-6 space-y-4 not-prose">
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-950/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Server Environment</h4>
              <span className="text-[9px] font-mono text-zinc-400">SSR / RSC</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-zinc-300">
              <li>• Documentation prose & headings</li>
              <li>• Server-rendered Shiki syntax highlighting</li>
              <li>• Registry item catalog & manifests</li>
              <li>• SEO metadata & OpenGraph tags</li>
              <li>• Static layout skeletons & navigation</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-950/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Client Environment</h4>
              <span className="text-[9px] font-mono text-zinc-400">"use client"</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-zinc-300">
              <li>• Interactive chart hover & tooltips</li>
              <li>• Brush, pan, and zoom gestures</li>
              <li>• Container ResizeObserver callbacks</li>
              <li>• Google Charts runtime initialization</li>
              <li>• Playground state & code preview tabs</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 font-semibold">
            Google Charts SSR Hydration Sequence
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="p-1.5 px-2.5 rounded bg-zinc-900 border border-white/[0.05] text-zinc-300">
              Server Render: Stable Container Skeleton
            </span>
            <span className="text-zinc-600">➔</span>
            <span className="p-1.5 px-2.5 rounded bg-zinc-900 border border-white/[0.05] text-zinc-300">
              Client Hydration: Mount Trigger
            </span>
            <span className="text-zinc-600">➔</span>
            <span className="p-1.5 px-2.5 rounded bg-zinc-900 border border-white/[0.05] text-zinc-300">
              Shared Loader: Fetch Script & Package
            </span>
            <span className="text-zinc-600">➔</span>
            <span className="p-1.5 px-2.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 font-medium">
              Runtime Draw: SVG Output Rendered
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Responsive Architecture & Google Redraw Lifecycle
 * Replaces ASCII brr1dr, 1od1an, aayr8u
 */
export function ResponsiveArchitectureFlow() {
  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/[0.06] pb-3">
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">Container-First Responsiveness</h4>
          <p className="text-[11px] text-zinc-400">Charts adapt to their bounding parent, not merely viewport width</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300">
          ResizeObserver
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
        <div className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Margins</span>
          <span className="text-zinc-200 font-medium">Dynamic Padding</span>
        </div>
        <div className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Ticks</span>
          <span className="text-zinc-200 font-medium">Auto Density</span>
        </div>
        <div className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Labels</span>
          <span className="text-zinc-200 font-medium">Rotate / Hide</span>
        </div>
        <div className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Legends</span>
          <span className="text-zinc-200 font-medium">Top / Bottom / Wrap</span>
        </div>
        <div className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Annotations</span>
          <span className="text-zinc-200 font-medium">Collapsible Notes</span>
        </div>
        <div className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Touch</span>
          <span className="text-zinc-200 font-medium">Touch-Friendly Hitboxes</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-zinc-900/50 border border-white/[0.04]">
        <div className="text-[11px] font-mono text-amber-400 mb-1 font-semibold">Google Charts Redraw Policy:</div>
        <p className="text-[11px] text-zinc-400">
          ResizeObserver detects width change ➔ Debounces 150ms to prevent thrashing ➔ Invokes `chart.draw(data, options)` ➔ Clean up listener on unmount.
        </p>
      </div>
    </div>
  )
}

/**
 * Theme & Accessibility Architecture
 * Replaces ASCII 5fhnl8 & k3n05i
 */
export function ThemeAndA11yArchitectureCard() {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
      {/* Theme Flow */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
          <HugeiconsIcon icon={Shield01Icon} size={16} className="text-emerald-400" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Semantic Theme Flow</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded bg-zinc-900/60 border border-white/[0.05] text-zinc-200">
            1. Application CSS Variables (`--chart-1` ... `--chart-5`, `--background`)
          </div>
          <div className="text-center text-zinc-600 text-[10px]">↓</div>
          <div className="p-2.5 rounded bg-zinc-900/60 border border-white/[0.05] text-zinc-200">
            2. Plotcn Semantic Role Tokens (`primary`, `accent`, `muted`, `grid`)
          </div>
          <div className="text-center text-zinc-600 text-[10px]">↓</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded bg-sky-950/30 border border-sky-800/30 text-center text-[11px] text-sky-300">
              Recharts (CSS/SVG)
            </div>
            <div className="p-2 rounded bg-purple-950/30 border border-purple-800/30 text-center text-[11px] text-purple-300">
              D3 (CSS/SVG)
            </div>
            <div className="p-2 rounded bg-amber-950/30 border border-amber-800/30 text-center text-[11px] text-amber-300">
              Google (Options)
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Flow */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70">
        <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
          <HugeiconsIcon icon={Shield01Icon} size={16} className="text-emerald-400" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Universal Accessibility Contract</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded bg-zinc-900/60 border border-white/[0.05] text-zinc-200">
            1. Visualization Component Root (`role="region"`, `aria-label`)
          </div>
          <div className="text-center text-zinc-600 text-[10px]">↓</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center text-[11px] text-zinc-300">
              Accessible Name
            </div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center text-[11px] text-zinc-300">
              Live Summary
            </div>
            <div className="p-2 rounded bg-zinc-900/50 border border-white/[0.04] text-center text-[11px] text-zinc-300">
              Data Table
            </div>
          </div>
          <div className="text-center text-zinc-600 text-[10px]">↓</div>
          <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/30 text-emerald-300 text-center font-medium">
            Full Screen-Reader & Keyboard Accessibility
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Registry & Dependency Direction Architecture
 * Replaces ASCII j4vqye, ebl2e1, n65yc5, cbd9sr
 */
export function RegistryAndDependencyFlow() {
  return (
    <div className="my-6 space-y-4 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registry Distribution Flow */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70">
          <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
            <HugeiconsIcon icon={Package01Icon} size={16} className="text-emerald-400" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Registry Distribution Flow</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-zinc-900/60 border border-white/[0.05] text-zinc-300">
              Remote: {'plotcn.vercel.app/r/{name}.json'}
            </div>
            <div className="text-center text-zinc-600 text-[10px]">↓</div>
            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-800/30 text-emerald-200">
              Local: {'npx shadcn@latest add @plotcn/{name}'}
            </div>
            <div className="text-center text-zinc-600 text-[10px]">↓</div>
            <div className="p-2.5 rounded bg-zinc-900/60 border border-white/[0.05] text-zinc-300">
              Consumer Repo: `@/components/charts/...` (You own every line)
            </div>
          </div>
        </div>

        {/* Sibling Engine Model */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70">
          <div className="flex items-center gap-2 mb-3 border-b border-white/[0.06] pb-2">
            <HugeiconsIcon icon={Layers01Icon} size={16} className="text-indigo-400" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Engine Sibling Model</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-zinc-900/60 border border-white/[0.05] text-center text-zinc-200">
              Shared Chart Experience Layer
            </div>
            <div className="text-center text-zinc-600 text-[10px]">/ | \ (Siblings, Not Layers)</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-sky-950/30 border border-sky-800/30 text-center text-[10px] text-sky-300 font-mono">
                Recharts (SVG)
              </div>
              <div className="p-2 rounded bg-purple-950/30 border border-purple-800/30 text-center text-[10px] text-purple-300 font-mono">
                D3 (SVG/Canvas)
              </div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-800/30 text-center text-[10px] text-amber-300 font-mono">
                Google (Hosted)
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              Never stacked Recharts → D3 → Google. Each engine is an independent peer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 18 Core Architectural Invariants Card
 * Replaces Section 2.27 (ASCII gsy30s)
 */
export function ArchitecturalInvariantsCard() {
  const invariants = [
    { id: 1, title: "Registry is distribution, not runtime." },
    { id: 2, title: "Installed source remains understandable." },
    { id: 3, title: "Recharts, D3.js and Google Charts remain independent engines." },
    { id: 4, title: "Shared code contains engine-independent product concerns." },
    { id: 5, title: "Engine-specific capabilities remain accessible." },
    { id: 6, title: "React owns Plotcn component state and composition." },
    { id: 7, title: "D3 primarily owns visualization math." },
    { id: 8, title: "Google owns its hosted rendering runtime." },
    { id: 9, title: "SVG remains the default Plotcn-owned renderer." },
    { id: 10, title: "Canvas is introduced only where density justifies it." },
    { id: 11, title: "Accessibility is part of the component contract." },
    { id: 12, title: "Responsiveness follows the container." },
    { id: 13, title: "Theme begins with semantic application tokens." },
    { id: 14, title: "No engine is loaded globally without need." },
    { id: 15, title: "Registry items install only required dependencies." },
    { id: 16, title: "Documentation never advertises nonexistent components or commands." },
    { id: 17, title: "Google GeoChart remains Google Charts, not Google Maps." },
    { id: 18, title: "The future Plotcn domain can replace the current Vercel origin centrally." },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {invariants.map((inv) => (
          <div
            key={inv.id}
            className="p-3 rounded-lg border border-white/[0.06] bg-zinc-950/60 hover:bg-zinc-900/50 transition-colors flex items-start gap-2.5"
          >
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold shrink-0 mt-0.5">
              {inv.id}
            </span>
            <span className="text-xs text-zinc-300 font-medium leading-snug">{inv.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Final System Mental Model Diagram
 * Replaces ASCII 3phdbm
 */
export function FinalSystemMentalModelDiagram() {
  return (
    <FlowDiagram
      title="Final System Mental Model"
      eyebrow="System Design 2.28"
      description="Three visualization engines. One shared product experience. No unnecessary cross-engine abstraction."
      ariaLabel="Final system mental model diagram"
    >
      <div className="flex flex-col items-center space-y-3 w-full">
        {/* Root */}
        <div className="w-full max-w-sm">
          <FlowNode
            variant="primary"
            icon={PlotcnMark}
            eyebrow="PLOTCN SYSTEM"
            title="Plotcn Architecture"
            description="Source-first visualization ecosystem for modern React applications."
            badge="Three Engines"
          />
        </div>

        <FlowConnector direction="down" label="originates from" />

        {/* Dual Branches: Product Site & Registry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          <div className="p-3 rounded-lg border border-white/[0.08] bg-zinc-900/50 text-center">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Product Site</span>
            <span className="text-xs font-semibold text-white">Docs • Gallery • Playground</span>
          </div>
          <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-center">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">Registry</span>
            <span className="text-xs font-semibold text-white">shadcn CLI Source Distribution</span>
          </div>
        </div>

        <FlowConnector direction="down" label="delivers" />

        {/* Chart Components */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FlowNode
              variant="secondary"
              icon={ChartBarLineIcon}
              eyebrow="RECHARTS"
              title="Conventional React"
              description="Line, Bar, Area, Pie, Scatter, Radar, Composed."
              badge="Declarative SVG"
            />
            <FlowNode
              variant="secondary"
              icon={Layers01Icon}
              eyebrow="D3.JS"
              title="Mathematical Geometry"
              description="Continuous scales, force layouts, hierarchy, brush/zoom."
              badge="React DOM + SVG/Canvas"
            />
            <FlowNode
              variant="runtime"
              icon={Globe02Icon}
              eyebrow="GOOGLE CHARTS"
              title="Enterprise & Geo"
              description="Core charts, GeoChart choropleths via shared loader."
              badge="Hosted Runtime"
            />
          </div>
        </div>

        <FlowConnector direction="down" label="standardized by" />

        {/* Shared Plotcn Experience */}
        <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1 font-semibold">
            SHARED PLOTCN EXPERIENCE
          </span>
          <p className="text-xs text-zinc-300 font-medium">
            Semantic Tokens • Responsive Measurement • Truthful States • Accessibility Shell • Tooltip & Legend Standards
          </p>
        </div>

        <FlowConnector direction="down" label="installed into" />

        {/* Developer Source */}
        <div className="w-full max-w-sm">
          <FlowNode
            variant="secondary"
            icon={SourceCodeIcon}
            eyebrow="CONSUMER CODEBASE"
            title="Your Git Repository"
            description="Complete, editable TypeScript source code. 100% owned and customized by you."
            badge="Full Ownership"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}
