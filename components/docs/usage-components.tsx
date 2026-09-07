"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useInstallation } from "./installation/installation-context"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  CheckIcon,
  Copy01Icon,
  ArrowRight01Icon,
  Folder01Icon,
  File01Icon,
  Layers01Icon,
  ChartBarLineIcon,
  Globe02Icon,
  Download01Icon,
  SourceCodeIcon,
  ComputerTerminal01Icon,
  Shield01Icon,
  Alert02Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons"
import {
  FlowDiagram,
  FlowNode,
  FlowConnector,
  FlowZone,
  FlowTimeline,
} from "./flow"

// ============================================================================
// HUGEICONS WRAPPERS
// ============================================================================

function CheckmarkCircleIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={CheckmarkCircle02Icon} size={size} strokeWidth={1.8} className={className} />
}

function TickIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={CheckIcon} size={size} strokeWidth={2} className={className} />
}

function CopyIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Copy01Icon} size={size} strokeWidth={1.8} className={className} />
}

function ArrowRightIcon({ size = 13, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={ArrowRight01Icon} size={size} strokeWidth={1.8} className={className} />
}

function FolderIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Folder01Icon} size={size} strokeWidth={1.8} className={className} />
}

function FileIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={File01Icon} size={size} strokeWidth={1.8} className={className} />
}

function AlertTriangleIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Alert02Icon} size={size} strokeWidth={1.8} className={className} />
}

// ============================================================================
// 1. USAGE HERO
// ============================================================================

export function UsageHero() {
  const [copied, setCopied] = useState(false)
  const sampleImport = `import { PlotLineChart } from "@/components/charts/plot-line-chart"`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleImport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tags = ["React", "TypeScript", "Source-owned", "Engine-aware", "Composable"]

  return (
    <div className="mb-10 space-y-6">
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/docs/introduction" className="hover:text-zinc-300 transition-colors">
          Docs
        </Link>
        <span>/</span>
        <span className="text-zinc-400">Fundamentals</span>
        <span>/</span>
        <span className="text-white">Usage</span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Usage
          </h1>
          <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono font-medium text-zinc-400">
            Fundamentals
          </span>
        </div>
        <p className="text-base sm:text-lg text-zinc-300 font-medium">
          Build with Plotcn.
        </p>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
          Install a visualization, import the source into your application, connect it to your data, and customize the implementation as deeply as your product requires.
        </p>
      </div>

      {/* Compact Metadata Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1 text-[11px] font-mono text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Quick-Start Code Callout */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-3.5 sm:p-4 shadow-sm space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-white/[0.04]">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <CheckmarkCircleIcon size={13} className="text-emerald-400 shrink-0" />
            <span>Local Source Import Contract</span>
          </span>
          <span className="text-zinc-500 hidden sm:inline">zero runtime wrapper</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <code className="text-emerald-300 overflow-x-auto whitespace-nowrap py-1">
            {sampleImport}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-zinc-900/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-white/[0.2] hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Copy sample import"
          >
            {copied ? (
              <>
                <TickIcon size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon size={11} className="text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. USAGE FLOW
// ============================================================================

export function UsageFlow() {
  const steps = [
    {
      step: 1,
      title: "Install Source",
      description: "Run shadcn add @plotcn/<item> to copy pure TypeScript into your application.",
      icon: Download01Icon,
      status: "completed" as const,
      tag: "CLI ADD",
    },
    {
      step: 2,
      title: "Import Locally",
      description: "Import the source component from @/components/charts/ using project aliases.",
      icon: SourceCodeIcon,
      status: "completed" as const,
      tag: "LOCAL IMPORT",
    },
    {
      step: 3,
      title: "Pass Typed Data",
      description: "Feed strongly-typed application data arrays matching the component contract.",
      icon: File01Icon,
      status: "completed" as const,
      tag: "TYPED CONTRACT",
    },
    {
      step: 4,
      title: "Responsive Shell",
      description: "Render inside an explicit height container (e.g. h-[320px] or aspect-video).",
      icon: Layers01Icon,
      status: "active" as const,
      tag: "LAYOUT",
    },
    {
      step: 5,
      title: "Customize Locally",
      description: "Adjust SVG geometry, tooltips, axis formats, or animations directly in source.",
      icon: Folder01Icon,
      status: "active" as const,
      tag: "OWN SOURCE",
    },
    {
      step: 6,
      title: "Ship to Production",
      description: "Compile standard React code with zero third-party Plotcn runtime lock-in.",
      icon: Shield01Icon,
      status: "completed" as const,
      tag: "ZERO RUNTIME",
    },
  ]

  return (
    <FlowDiagram
      title="Plotcn Visualization Lifecycle"
      eyebrow="Lifecycle Model"
      description="The 6-step developer workflow from source installation to production deployment."
      ariaLabel="Plotcn visualization lifecycle diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}

// ============================================================================
// 3. IMPORT PATH MAP
// ============================================================================

export function ImportPathMap() {
  return (
    <FlowDiagram
      title="Source Path Resolution Hierarchy"
      eyebrow="Import Architecture"
      description="How your components.json configuration maps physical chart source files to clean application imports."
      ariaLabel="Source path resolution hierarchy diagram"
    >
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
        {/* Left: Filesystem Tree */}
        <div className="md:col-span-5 space-y-2.5">
          <FlowNode
            variant="file"
            icon={File01Icon}
            eyebrow="LOCAL FILE PATH"
            title="components/charts/recharts/plot-line-chart.tsx"
            description="Component source file stored directly in your Git repository."
            badge="Direct Source"
            metadata="Local File"
          />
          <FlowNode
            variant="file"
            icon={File01Icon}
            eyebrow="SHARED PRIMITIVE"
            title="components/charts/shared/chart-container.tsx"
            description="ResizeObserver container & CSS theme variable observer."
            badge="Shared Shell"
            metadata="Local File"
          />
        </div>

        {/* Center: Connector */}
        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
          <FlowConnector direction="responsive" label="resolves via @/* alias" />
        </div>

        {/* Right: Application Import */}
        <div className="md:col-span-5 space-y-2.5">
          <FlowNode
            variant="output"
            icon={SourceCodeIcon}
            eyebrow="APPLICATION PAGE / COMPONENT"
            title='import { PlotLineChart } from "@/components/charts/..."'
            description="Clean root-relative import without fragile relative paths (../../). Zero barrel files, zero runtime proxies."
            badge="Root Alias"
            metadata="TypeScript TSX"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 4. RESPONSIVE CHART GUIDE
// ============================================================================

export function ResponsiveChartGuide() {
  const steps = [
    {
      step: 1,
      title: "Parent Container",
      description: "Application sets explicit height: <div className=\"h-[320px] w-full\">.",
      icon: Folder01Icon,
      status: "completed" as const,
      tag: "EXPLICIT HEIGHT",
    },
    {
      step: 2,
      title: "ChartContainer Shell",
      description: "Observes parent box dimensions via native ResizeObserver or SVG viewBox.",
      icon: Layers01Icon,
      status: "completed" as const,
      tag: "RESIZE OBSERVER",
    },
    {
      step: 3,
      title: "Measured Dimensions",
      description: "Width: 640px, Height: 320px non-zero dimensions computed for coordinate scales.",
      icon: ComputerTerminal01Icon,
      status: "active" as const,
      tag: "GEOMETRY MATH",
    },
    {
      step: 4,
      title: "Crisp SVG Marks",
      description: "Lines, grids, areas, and tooltips render pixel-perfect vectors with zero layout shift.",
      icon: ChartBarLineIcon,
      status: "completed" as const,
      tag: "ZERO CLS",
    },
  ]

  return (
    <FlowDiagram
      title="Responsive Sizing & Container Hierarchy"
      eyebrow="Parent Height Contract"
      description="Visualizations dynamically fill the parent box. Always reserve vertical space with an explicit height."
      ariaLabel="Responsive chart sizing hierarchy diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}

// ============================================================================
// 5. CHART STATE GUIDE
// ============================================================================

export function ChartStateGuide() {
  const [activeTab, setActiveTab] = useState<"loading" | "empty" | "error" | "ready">("loading")

  const stateDetails = {
    loading: {
      label: "Loading",
      badge: "In Flight",
      badgeColor: "text-amber-400 border-amber-500/20 bg-amber-950/20",
      rule: "Render an accessible skeleton or fallback with role='status'. Never render fake metrics or dummy graphs that mislead users.",
      snippet: `if (isLoading) {\n  return <div className="chart-fallback" role="status">Loading visualization…</div>\n}`,
    },
    empty: {
      label: "Empty",
      badge: "Zero Records",
      badgeColor: "text-zinc-400 border-white/[0.1] bg-zinc-900/60",
      rule: "Provide actionable guidance when an array is empty (e.g. 'No data for this time period'). Avoid leaving a blank canvas.",
      snippet: `if (!data.length) {\n  return <div className="chart-fallback" role="status">No activity recorded for this period.</div>\n}`,
    },
    error: {
      label: "Error",
      badge: "Exception",
      badgeColor: "text-rose-400 border-rose-500/20 bg-rose-950/20",
      rule: "Use an error alert or ChartBoundary to contain failures locally without crashing the entire dashboard page.",
      snippet: `if (error) {\n  return <div className="chart-fallback" role="alert">{error}</div>\n}`,
    },
    ready: {
      label: "Ready",
      badge: "Rendered",
      badgeColor: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
      rule: "When validated data is present, render the visualization with ARIA roles and descriptive screen-reader text.",
      snippet: `<PlotLineChart data={validData} label="Monthly Revenue" />`,
    },
  }

  const current = stateDetails[activeTab]

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Component Lifecycle State Machine
        </h4>
        <span className="text-[11px] font-mono text-zinc-400">Truthful Representation</span>
      </div>

      {/* State Switcher Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(["loading", "empty", "error", "ready"] as const).map((key) => {
          const s = stateDetails[key]
          const isSelected = activeTab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-all ${
                isSelected
                  ? "border-emerald-500/40 bg-emerald-950/20 text-white"
                  : "border-white/[0.06] bg-zinc-900/40 text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{s.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected State Explanation */}
      <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-white">State: {current.label}</span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Evaluation Priority</span>
        </div>

        <p className="text-xs text-zinc-300 font-sans leading-relaxed">{current.rule}</p>

        <div className="rounded-md border border-white/[0.08] bg-zinc-950 p-3 font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto">
          {current.snippet}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. ENGINE API COMPARISON
// ============================================================================

export function EngineApiComparison() {
  const rows = [
    { concern: "Responsive Shell", shared: "Standard container pattern", recharts: "ResponsiveContainer", d3: "SVG viewBox aspect ratio", google: "GoogleChartContainer adapter" },
    { concern: "Loading / Fallback", shared: "Standard skeleton states", recharts: "Local fallback shell", d3: "Local fallback shell", google: "Script loader status bridge" },
    { concern: "Theme System", shared: "CSS tokens (--chart-1..5)", recharts: "Reads CSS variables directly", d3: "Interpolates CSS tokens", google: "Colors array in options" },
    { concern: "Tooltip Behavior", shared: "Accessible conventions", recharts: "Custom Recharts Tooltip", d3: "React DOM overlay", google: "HTML tooltip option" },
    { concern: "Geometry Math", shared: "Engine-specific", recharts: "Recharts Cartesian layout", d3: "d3-scale, d3-shape, d3-force", google: "Google DataTable algorithms" },
    { concern: "Runtime Library", shared: "None (zero Plotcn runtime)", recharts: "recharts npm package", d3: "Modular d3-* npm packages", google: "Google CDN hosted runtime" },
    { concern: "Data Transform", shared: "Typed application data", recharts: "Array of records", d3: "Normalized numeric series", google: "DataTable or 2D array" },
  ]

  return (
    <div className="my-8 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Shared Experience vs Engine-Specific APIs
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Architectural Invariant</span>
      </div>

      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
        Plotcn unifies the developer experience <em>around</em> the chart—theming, responsive sizing, loading fallbacks, and accessibility—while preserving the raw power and idiomatic APIs of the underlying visualization engine.
      </p>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-[11px] text-zinc-400">
              <th className="py-2.5 pr-4 font-semibold">Concern</th>
              <th className="py-2.5 px-3 font-semibold text-emerald-400">Shared Standard</th>
              <th className="py-2.5 px-3 font-semibold text-zinc-200">Recharts</th>
              <th className="py-2.5 px-3 font-semibold text-zinc-200">D3.js</th>
              <th className="py-2.5 pl-3 font-semibold text-zinc-200">Google Charts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-[11px]">
            {rows.map((r) => (
              <tr key={r.concern} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 pr-4 font-medium text-zinc-300">{r.concern}</td>
                <td className="py-2.5 px-3 text-emerald-300 font-sans">{r.shared}</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans">{r.recharts}</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans">{r.d3}</td>
                <td className="py-2.5 pl-3 text-zinc-400 font-sans">{r.google}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// 7. USAGE TROUBLESHOOTING (Common Mistakes)
// ============================================================================

export function UsageTroubleshooting() {
  const mistakes = [
    {
      title: "Importing from Wrong Path",
      problem: "Installed source exists in project but TypeScript compiler throws 'Cannot find module'.",
      cause: "Import statement uses incorrect alias or does not match components.json target paths.",
      fix: "Verify tsconfig.json paths '@/*' mapping and ensure import points to '@/components/charts/...'.",
    },
    {
      title: "Zero-Height Container",
      problem: "Chart appears blank, throws ResizeObserver loop limit errors, or collapses to 0px.",
      cause: "Parent layout lacks an explicit height (e.g. unmeasured flex container or collapsed accordion).",
      fix: "Set an explicit height class such as 'h-[320px] w-full' or 'aspect-video' on the parent element.",
    },
    {
      title: "Passing Raw API Responses",
      problem: "Chart becomes deeply coupled to backend database schemas and breaks on minor API changes.",
      cause: "Directly passing nested database entities instead of a focused, typed chart data array.",
      fix: "Transform API responses into an explicit data contract (e.g. PlotDatum[]) before passing to the chart.",
    },
    {
      title: "Over-Generalizing Component Props",
      problem: "A simple chart accumulates 35 configuration props to support every bespoke styling variation.",
      cause: "Treating installed Plotcn source like an inflexible third-party npm package.",
      fix: "Edit the local component source directly. Customize SVG defs, tick formatting, or margins in code.",
    },
    {
      title: "Mixing Engine Dependencies",
      problem: "Installing a Recharts component pulls D3 packages or causes bundle size bloat.",
      cause: "Importing an internal D3 helper inside a Recharts chart rather than using the shared layer.",
      fix: "Keep engine boundaries strict. Move cross-engine utilities into '@/components/charts/shared/'.",
    },
    {
      title: "Making the Entire Route 'use client'",
      problem: "Adding one chart causes the entire Next.js page, headers, and data loaders to run client-side.",
      cause: "Placing 'use client' at the top of page.tsx rather than isolating the interactive visualization.",
      fix: "Keep page.tsx as a React Server Component. Render the chart as a focused client component leaf.",
    },
    {
      title: "Fake Loading Metrics",
      problem: "Placeholder chart displays dummy values during data fetching that users mistake for real data.",
      cause: "Rendering a mock dataset during loading rather than a truthful loading skeleton or fallback.",
      fix: "Use a clean fallback state (role='status' with an animated skeleton) until real metrics resolve.",
    },
    {
      title: "Hardcoding Hex Colors in SVG",
      problem: "Chart looks crisp in dark mode but becomes illegible or invisible when toggled to light mode.",
      cause: "Hardcoding '#18181b' or '#fafafa' in SVG fill/stroke attributes instead of CSS tokens.",
      fix: "Use 'currentColor' or CSS variables like 'var(--chart-1)' through 'var(--chart-5)' for all marks.",
    },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Common Pitfalls & Architectural Solutions
        </h4>
        <span className="text-[11px] font-mono text-rose-400">Diagnostic Checklist</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
        {mistakes.map((m) => (
          <div
            key={m.title}
            className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-2.5 transition-colors hover:border-white/[0.12]"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <h5 className="font-mono text-xs font-semibold text-zinc-100 uppercase tracking-wider">
                {m.title}
              </h5>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              <span className="text-zinc-500 font-mono mr-1">PROBLEM:</span>
              {m.problem}
            </p>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              <span className="text-zinc-500 font-mono mr-1">CAUSE:</span>
              {m.cause}
            </p>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-2.5 font-mono text-[11px] text-zinc-300">
              <span className="text-emerald-400 font-semibold mr-1">FIX:</span>
              <span className="font-sans">{m.fix}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 8. USAGE WORKFLOW
// ============================================================================

// ============================================================================
// 7B. D3 PIPELINE FLOW (Math -> Data -> React JSX)
// ============================================================================

export function D3PipelineFlow() {
  return (
    <FlowDiagram
      title="D3.js + React Separation of Concerns"
      eyebrow="Architectural Pattern"
      description="D3 calculates the mathematics and layout geometry; React renders the SVG elements directly with native virtual DOM reconciliation."
      ariaLabel="D3.js mathematical pipeline diagram"
    >
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
        {/* Step 1: D3 Math */}
        <div className="lg:col-span-3">
          <FlowNode
            variant="package"
            icon={Layers01Icon}
            eyebrow="01. D3 MATHEMATICS"
            title="D3 Micro-Modules"
            description="Modular packages (d3-shape, d3-scale) compute coordinates, angles, and curves."
            badge="Pure Math"
            metadata="Zero DOM Mutation"
          />
        </div>

        {/* Connector 1 */}
        <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
          <FlowConnector direction="responsive" label="emits paths" />
        </div>

        {/* Step 2: Intermediate Data */}
        <div className="lg:col-span-3">
          <FlowNode
            variant="data"
            icon={SourceCodeIcon}
            eyebrow="02. GEOMETRY STATE"
            title="Computed Geometry Data"
            description="Pure serializable SVG path strings (M... Z) and coordinate arrays."
            badge="Geometry Data"
            metadata="Serializable Array"
          />
        </div>

        {/* Connector 2 */}
        <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
          <FlowConnector direction="responsive" label="consumed by JSX" />
        </div>

        {/* Step 3: React JSX */}
        <div className="lg:col-span-3">
          <FlowNode
            variant="output"
            icon={File01Icon}
            eyebrow="03. VIRTUAL DOM RENDER"
            title="React JSX (<path />)"
            description="React renders SVG nodes with standard props, state, transitions, and SSR."
            badge="Native React"
            metadata="Zero d3.select() Hacks"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 8. USAGE WORKFLOW
// ============================================================================

export function UsageWorkflow() {
  const steps = [
    {
      step: 1,
      title: "Choose Engine",
      description: "Recharts for dashboards, D3 for custom geometry, Google for GeoCharts.",
      icon: ChartBarLineIcon,
      status: "completed" as const,
      tag: "ENGINE CHOICE",
    },
    {
      step: 2,
      title: "Install Source",
      description: "Run `shadcn add @plotcn/<chart>` to copy component source into your app.",
      icon: Download01Icon,
      status: "completed" as const,
      tag: "CLI ADD",
    },
    {
      step: 3,
      title: "Inspect Code",
      description: "Review local source in @/components/charts/ to understand props and markup.",
      icon: SourceCodeIcon,
      status: "completed" as const,
      tag: "INSPECT",
    },
    {
      step: 4,
      title: "Type Your Data",
      description: "Define explicit TypeScript interfaces for all data series and records.",
      icon: File01Icon,
      status: "completed" as const,
      tag: "TYPES",
    },
    {
      step: 5,
      title: "Set Layout Height",
      description: "Wrap chart in a container with measurable dimensions (e.g. h-[320px]).",
      icon: Layers01Icon,
      status: "active" as const,
      tag: "CONTAINER",
    },
    {
      step: 6,
      title: "Handle States",
      description: "Implement loading, empty, and error fallback states explicitly.",
      icon: Alert02Icon,
      status: "active" as const,
      tag: "FALLBACKS",
    },
    {
      step: 7,
      title: "Customize Locally",
      description: "Adjust tooltips, axis tick formatting, and margins directly in source.",
      icon: Folder01Icon,
      status: "active" as const,
      tag: "CUSTOMIZE",
    },
    {
      step: 8,
      title: "Test Interactions",
      description: "Verify keyboard navigation, focus outlines, and tooltip hit targets.",
      icon: ComputerTerminal01Icon,
      status: "completed" as const,
      tag: "ACCESSIBILITY",
    },
    {
      step: 9,
      title: "Verify Theming",
      description: "Confirm charts adapt seamlessly between dark and light color modes.",
      icon: Globe02Icon,
      status: "completed" as const,
      tag: "THEME",
    },
    {
      step: 10,
      title: "Ship with Confidence",
      description: "Commit source into Git alongside the rest of your application code.",
      icon: Shield01Icon,
      status: "completed" as const,
      tag: "PRODUCTION",
    },
  ]

  return (
    <FlowDiagram
      title="10-Step Production Development Workflow"
      eyebrow="Workflow Protocol"
      description="The standard engineering sequence for building, styling, and shipping production visualizations with Plotcn."
      ariaLabel="Production development workflow diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}
