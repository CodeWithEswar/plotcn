import React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Layers01Icon,
  Globe02Icon,
  ChartBarLineIcon,
  Folder01Icon,
  TerminalIcon,
  CpuIcon,
} from "@hugeicons/core-free-icons"
import { PlotcnMark } from "@/components/brand"

/**
 * Docs-level intro hero matching editorial hierarchy
 */
export function DocsIntroHero({
  eyebrow = "Introduction",
  title = "Plotcn",
  description = "Beautiful React visualizations you can actually own.",
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
      <p className="text-lg sm:text-xl font-medium text-zinc-300 leading-snug max-w-2xl">
        {description}
      </p>
    </header>
  )
}

/**
 * Metadata tags row under hero description
 */
export function DocsMeta() {
  const tags = [
    { label: "Recharts", variant: "default" },
    { label: "D3.js", variant: "default" },
    { label: "Google Charts", variant: "default" },
    { label: "TypeScript", variant: "mono" },
    { label: "shadcn Registry", variant: "mono" },
    { label: "Source Owned", variant: "highlight" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 not-prose">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
            tag.variant === "highlight"
              ? "bg-zinc-800 text-zinc-100 border border-zinc-700 font-mono"
              : tag.variant === "mono"
              ? "bg-zinc-900/90 text-zinc-400 border border-zinc-800/80 font-mono"
              : "bg-zinc-900/60 text-zinc-300 border border-white/[0.08]"
          }`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  )
}

/**
 * Subtle Plotcn Axis Divider with coordinate ticks
 */
export function DocsDivider() {
  return (
    <div className="my-10 w-full relative not-prose select-none" aria-hidden="true">
      <div className="h-px w-full bg-zinc-800/80" />
      <div className="absolute inset-x-0 top-0 -translate-y-1/2 flex justify-between px-8 text-zinc-600 font-mono text-[9px]">
        <span>+</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">|</span>
        <span>+</span>
      </div>
    </div>
  )
}

/**
 * Architecture visualization component for the introduction page.
 * Pure semantic HTML/SVG with zero heavy chart dependencies.
 */
export function VisualizationSystemPreview() {
  return (
    <figure
      className="my-8 w-full rounded-xl border border-white/[0.08] bg-zinc-950/70 p-6 sm:p-8 relative overflow-hidden shadow-2xl not-prose"
      aria-label="Plotcn visualization system architecture diagram"
      role="region"
    >
      {/* Background coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Top Node: Plotcn */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/[0.14] bg-zinc-900/90 shadow-lg mb-6">
          <div className="size-6 rounded bg-white/[0.08] flex items-center justify-center text-white">
            <PlotcnMark className="size-4" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-tight text-white flex items-center gap-1.5">
              Plotcn System
              <span className="text-[9px] font-mono font-normal px-1.5 py-0.2 rounded bg-white/[0.08] text-zinc-400">
                Core
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400">Shared Visual Language & Architecture</div>
          </div>
        </div>

        {/* Tree Branch Connectors (Desktop SVG) */}
        <div className="w-full max-w-xl h-6 hidden sm:block relative mb-3" aria-hidden="true">
          <svg className="w-full h-full text-zinc-700" preserveAspectRatio="none" viewBox="0 0 400 24">
            <path
              d="M 200 0 L 200 12 M 60 24 L 60 12 L 340 12 L 340 24 M 200 12 L 200 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Three Engine Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mb-6">
          {/* Recharts */}
          <div className="flex flex-col p-3.5 rounded-lg border border-white/[0.08] bg-zinc-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                <HugeiconsIcon icon={ChartBarLineIcon} size={13} className="text-zinc-400" />
                Recharts
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">React SVG</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
              Dashboard-ready Cartesian charts, lines, bars, areas, and radials.
            </p>
            <div className="mt-auto text-[10px] font-mono text-zinc-500">React-first composition</div>
          </div>

          {/* D3.js */}
          <div className="flex flex-col p-3.5 rounded-lg border border-white/[0.08] bg-zinc-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                <HugeiconsIcon icon={Layers01Icon} size={13} className="text-zinc-400" />
                D3.js
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Math & Geometry</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
              Custom layout geometry, force networks, voronoi, and hierarchies.
            </p>
            <div className="mt-auto text-[10px] font-mono text-zinc-500">Full mathematical control</div>
          </div>

          {/* Google Charts */}
          <div className="flex flex-col p-3.5 rounded-lg border border-white/[0.08] bg-zinc-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                <HugeiconsIcon icon={Globe02Icon} size={13} className="text-zinc-400" />
                Google Charts
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Geo & Core</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
              Mature chart engines and worldwide statistical choropleths via GeoChart.
            </p>
            <div className="mt-auto text-[10px] font-mono text-zinc-500">Mature visualization API</div>
          </div>
        </div>

        {/* Convergence Connector */}
        <div className="w-full max-w-xl h-6 hidden sm:block relative mb-3" aria-hidden="true">
          <svg className="w-full h-full text-zinc-700" preserveAspectRatio="none" viewBox="0 0 400 24">
            <path
              d="M 60 0 L 60 12 L 200 12 L 340 12 L 340 0 M 200 12 L 200 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Distribution Hub: shadcn Registry */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-md border border-zinc-800 bg-zinc-900/70 text-zinc-300 text-xs font-mono mb-3">
          <span className="size-2 rounded-full bg-white/70 animate-pulse motion-reduce:animate-none" />
          <span>Distributed via shadcn Registry</span>
        </div>

        {/* Arrow Down */}
        <div className="text-zinc-600 mb-3 text-xs" aria-hidden="true">↓</div>

        {/* Destination: Your Codebase */}
        <div className="flex items-center justify-between w-full max-w-sm px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Folder01Icon} size={15} className="text-zinc-400" />
            <span className="font-mono text-zinc-200">components/charts/</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
            Source Owned
          </span>
        </div>
      </div>
    </figure>
  )
}

/**
 * Three Engines Grid
 */
export function EngineGrid() {
  const engines = [
    {
      id: "01",
      name: "Recharts",
      role: "Declarative React SVG",
      bestFor: "React-first dashboard and product charts. Standard Cartesian and radial metrics.",
      why: "Declarative API, familiar React composition, fast implementation, strong common-chart coverage.",
      plotcnAdds: "Visual defaults, responsive structure, interaction patterns, accessibility, and source-distributed components.",
      tags: ["Cartesian", "Interactive", "React-First"],
    },
    {
      id: "02",
      name: "D3.js",
      role: "Mathematical Precision",
      bestFor: "Custom visualization, advanced geometry, specialized data relationships, and fine interaction.",
      why: "Complete control over scales, coordinates, layouts, projections, and data transformation.",
      plotcnAdds: "React rendering patterns, reusable composition, consistent styling, accessibility, and production-ready structure.",
      tags: ["Geometry", "Hierarchy", "Network"],
    },
    {
      id: "03",
      name: "Google Charts",
      role: "GeoChart & Mature Core",
      bestFor: "Google-powered chart types and geographic visualization (statistical choropleths).",
      why: "Mature visualization APIs and built-in GeoChart world/regional geographic boundary data.",
      plotcnAdds: "React integration, singleton loader, responsive shell, theme adaptation, lifecycle handling, and loading/error states.",
      tags: ["GeoChart", "Choropleth", "External Runtime"],
    },
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
      {engines.map((engine) => (
        <div
          key={engine.name}
          className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 flex flex-col justify-between hover:border-white/[0.16] transition-colors"
        >
          <div>
            <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] mb-2.5">
              <span>ENGINE {engine.id}</span>
              <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400">{engine.role}</span>
            </div>
            <h4 className="text-base font-semibold text-white tracking-tight mb-3">{engine.name}</h4>
            <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <div>
                <span className="text-zinc-200 font-medium block mb-0.5">Best for:</span>
                {engine.bestFor}
              </div>
              <div>
                <span className="text-zinc-200 font-medium block mb-0.5">Why use it:</span>
                {engine.why}
              </div>
              <div>
                <span className="text-zinc-200 font-medium block mb-0.5">Plotcn adds:</span>
                {engine.plotcnAdds}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/[0.06]">
            {engine.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Registry Flow Pipeline visual
 */
export function RegistryFlow() {
  const steps = [
    {
      num: "01",
      title: "Discover",
      desc: "Browse visual catalog in Plotcn",
      icon: Layers01Icon,
    },
    {
      num: "02",
      title: "CLI Install",
      desc: "npx shadcn@latest add @plotcn/...",
      icon: TerminalIcon,
    },
    {
      num: "03",
      title: "Source Placed",
      desc: "Directly in components/charts/",
      icon: Folder01Icon,
    },
    {
      num: "04",
      title: "Own & Evolve",
      desc: "Customize logic, styling, and tokens",
      icon: CpuIcon,
    },
  ]

  return (
    <div className="my-6 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 sm:p-6 overflow-hidden not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div
              key={step.num}
              className="flex flex-col p-4 rounded-lg border border-white/[0.06] bg-zinc-900/40 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/40">
                  STEP {step.num}
                </span>
                {idx < steps.length - 1 && (
                  <span className="hidden lg:block text-zinc-600 text-xs" aria-hidden="true">→</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <HugeiconsIcon icon={Icon} size={15} className="text-zinc-400" />
                <div className="text-xs font-semibold text-zinc-100">{step.title}</div>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 leading-snug">{step.desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Architecture block layout
 */
export function PlotcnArchitecture() {
  return (
    <div className="my-6 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 sm:p-6 font-mono text-xs text-zinc-300 not-prose">
      <div className="rounded-lg border border-white/[0.12] bg-zinc-900/70 p-4 text-center mb-4">
        <span className="text-white font-semibold text-xs block tracking-wide">
          SHARED PRESENTATION LAYER
        </span>
        <span className="text-[11px] text-zinc-400 block mt-1">
          Theme Tokens · Responsive Container · Accessibility · Loading / Empty / Error Skeletons · Tooltips
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3.5 text-center">
          <span className="text-zinc-200 font-semibold block">Recharts Adapter</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Cartesian & Radial</span>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3.5 text-center">
          <span className="text-zinc-200 font-semibold block">D3.js Adapter</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Geometry & Math</span>
        </div>
        <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3.5 text-center">
          <span className="text-zinc-200 font-semibold block">Google Charts Adapter</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Core & GeoChart</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Truthful Project Status breakdown
 */
export function ProjectStatus() {
  const milestones = [
    { name: "Architecture Foundation", status: "Ready", badge: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40" },
    { name: "Documentation Shell", status: "Ready", badge: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40" },
    { name: "Recharts Components", status: "Available", badge: "bg-zinc-800 text-zinc-200 border-zinc-700" },
    { name: "D3.js Components", status: "Available", badge: "bg-zinc-800 text-zinc-200 border-zinc-700" },
    { name: "Google Charts / GeoChart", status: "Available", badge: "bg-zinc-800 text-zinc-200 border-zinc-700" },
    { name: "shadcn Registry Distribution", status: "Staged", badge: "bg-zinc-900 text-zinc-400 border-zinc-800" },
  ]

  return (
    <div className="my-6 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 sm:p-6 not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {milestones.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40"
          >
            <span className="text-xs text-zinc-300 font-medium">{item.name}</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badge}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Next Steps Navigation Grid
 */
export function DocsNextSteps({
  items,
}: {
  items?: Array<{ title: string; description: string; href: string }>
}) {
  const defaultItems = [
    {
      title: "Installation",
      description: "Prepare a React or Next.js project and install required dependencies.",
      href: "/docs/installation",
    },
    {
      title: "shadcn/ui Setup",
      description: "Configure components.json and integrate Plotcn with the shadcn Registry.",
      href: "/docs/shadcn",
    },
    {
      title: "Registry Workflow",
      description: "Learn how visualization components enter your local source tree.",
      href: "/docs/registry",
    },
  ]

  const list = items || defaultItems

  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 not-prose">
      {list.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col justify-between p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 hover:bg-zinc-900/50 hover:border-white/[0.18] transition-all no-underline"
        >
          <div>
            <div className="flex items-center justify-between text-zinc-200 font-medium text-sm mb-1.5">
              <span>{item.title}</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed m-0">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
