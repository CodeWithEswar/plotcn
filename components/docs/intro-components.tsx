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
} from "@hugeicons/core-free-icons"
import { PlotcnMark } from "@/components/brand"
import {
  FlowDiagram,
  FlowNode,
  FlowConnector,
  FlowTimeline,
} from "./flow"

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

export interface DocsDividerProps {
  className?: string
  label?: string
}

/**
 * Professional Plotcn Axis Separator with subtle coordinate ticks, hairline gradient rule,
 * and high-precision central coordinate crosshair.
 */
export function DocsDivider({ className, label }: DocsDividerProps = {}) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "my-10 sm:my-14 w-full relative not-prose select-none flex items-center justify-center",
        className
      )}
    >
      {/* Hairline rule with smooth radial/gradient falloff at both ends */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/[0.14] to-transparent" />
      </div>

      {/* Center technical element */}
      {label ? (
        <div
          className="relative z-10 flex items-center gap-2 px-3 py-0.5 rounded-full bg-background border border-zinc-200 dark:border-white/[0.1] shadow-xs text-zinc-600 dark:text-zinc-400 font-mono text-[10px] tracking-widest uppercase"
          aria-hidden="true"
        >
          <span className="size-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <span>{label}</span>
          <span className="size-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        </div>
      ) : (
        <div
          className="relative z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background border border-zinc-200 dark:border-white/[0.1] text-zinc-500 dark:text-zinc-400 shadow-xs hover:border-zinc-300 dark:hover:border-white/20 transition-colors"
          aria-hidden="true"
        >
          <span className="size-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="text-zinc-400 dark:text-zinc-500"
          >
            <path
              d="M5 1v8M1 5h8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="size-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        </div>
      )}

      {/* Coordinate axis ticks at quarter marks */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 sm:px-14 pointer-events-none text-zinc-400/80 dark:text-zinc-600/60 font-mono text-[9px]"
        aria-hidden="true"
      >
        <span className="hidden sm:inline font-mono select-none">+</span>
        <span className="hidden sm:inline font-mono select-none">+</span>
      </div>

      <hr className="sr-only" />
    </div>
  )
}

/**
 * Architecture visualization component for the introduction page.
 * Pure semantic HTML/SVG with zero heavy chart dependencies.
 */
export function VisualizationSystemPreview() {
  return (
    <FlowDiagram
      title="Plotcn Architecture System"
      eyebrow="System Overview"
      description="Visual contract connecting shared styling, specialized visualization engines, and shadcn registry distribution."
      ariaLabel="Plotcn visualization system architecture diagram"
    >
      <div className="flex flex-col items-center">
        {/* Top Node: Plotcn Architecture Core */}
        <div className="w-full max-w-md">
          <FlowNode
            variant="primary"
            icon={<PlotcnMark className="size-4 text-white" />}
            eyebrow="SHARED ARCHITECTURE"
            title="Plotcn System Core"
            description="Unified theme tokens, responsive container contract, accessible patterns, and engine adapters."
            badge="PLATFORM"
            badgeVariant="accent"
            metadata="Source Owned · CSS Variables · Zero Locked Dependencies"
          />
        </div>

        {/* Tree Branch Connectors (Desktop SVG) */}
        <div className="w-full max-w-xl h-7 hidden sm:block relative my-2" aria-hidden="true">
          <svg className="w-full h-full text-zinc-700" preserveAspectRatio="none" viewBox="0 0 400 28">
            <path
              d="M 200 0 L 200 14 M 60 28 L 60 14 L 340 14 L 340 28 M 200 14 L 200 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-500">
            engine adapters
          </div>
        </div>

        {/* Mobile Connector */}
        <div className="sm:hidden w-full">
          <FlowConnector direction="down" label="engine adapters" />
        </div>

        {/* Three Engine Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full my-2">
          {/* Recharts */}
          <FlowNode
            variant="runtime"
            icon={ChartBarLineIcon}
            eyebrow="ENGINE 01"
            title="Recharts"
            description="Declarative React SVG. Cartesian charts, lines, bars, areas, and radials."
            badge="SVG / React"
            metadata="Direct CSS/SVG · Cartesian"
          />

          {/* D3.js */}
          <FlowNode
            variant="runtime"
            icon={Layers01Icon}
            eyebrow="ENGINE 02"
            title="D3.js"
            description="Mathematical precision. Scales, coordinates, layouts, networks, and hierarchies."
            badge="Math / Geometry"
            metadata="Raw Layout · Geometry"
          />

          {/* Google Charts */}
          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="ENGINE 03"
            title="Google Charts"
            description="GeoChart choropleths and mature Google-powered core charts via singleton loader."
            badge="External Runtime"
            metadata="Typed Options · GeoChart"
          />
        </div>

        {/* Convergence Connector */}
        <div className="w-full max-w-xl h-7 hidden sm:block relative my-2" aria-hidden="true">
          <svg className="w-full h-full text-zinc-700" preserveAspectRatio="none" viewBox="0 0 400 28">
            <path
              d="M 60 0 L 60 14 L 200 14 L 340 14 L 340 0 M 200 14 L 200 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-500">
            registry distribution
          </div>
        </div>

        {/* Mobile Connector */}
        <div className="sm:hidden w-full">
          <FlowConnector direction="down" label="registry distribution" />
        </div>

        {/* Distribution Hub: shadcn Registry */}
        <div className="w-full max-w-md my-1">
          <FlowNode
            variant="registry"
            icon={Package01Icon}
            eyebrow="DISTRIBUTION PROTOCOL"
            title="shadcn Registry"
            description="CLI resolves components directly into raw TSX files: npx shadcn@latest add @plotcn/..."
            badge="REGISTRY"
            badgeVariant="accent"
            status="active"
            metadata="@plotcn/* · line-basic.json · application/json"
          />
        </div>

        {/* Flow Connector Down */}
        <FlowConnector direction="down" label="source copied" />

        {/* Destination: Your Codebase */}
        <div className="w-full max-w-md">
          <FlowNode
            variant="output"
            icon={Folder01Icon}
            eyebrow="DESTINATION PATH"
            title="components/charts/"
            description="Raw React component files placed in your project. Full inspection, editing, and evolution."
            badge="OWNED"
            badgeVariant="success"
            status="completed"
            metadata="Full Code Ownership · TypeScript · 0 Blackbox"
          />
        </div>
      </div>
    </FlowDiagram>
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
      icon: ChartBarLineIcon,
      bestFor: "React-first dashboard and product charts. Standard Cartesian and radial metrics.",
      why: "Declarative API, familiar React composition, fast implementation, strong common-chart coverage.",
      plotcnAdds: "Visual defaults, responsive structure, interaction patterns, accessibility, and source-distributed components.",
      tags: ["Cartesian", "Interactive", "React-First"],
    },
    {
      id: "02",
      name: "D3.js",
      role: "Mathematical Precision",
      icon: Layers01Icon,
      bestFor: "Custom visualization, advanced geometry, specialized data relationships, and fine interaction.",
      why: "Complete control over scales, coordinates, layouts, projections, and data transformation.",
      plotcnAdds: "React rendering patterns, reusable composition, consistent styling, accessibility, and production-ready structure.",
      tags: ["Geometry", "Hierarchy", "Network"],
    },
    {
      id: "03",
      name: "Google Charts",
      role: "GeoChart & Mature Core",
      icon: Globe02Icon,
      bestFor: "Google-powered chart types and geographic visualization (statistical choropleths).",
      why: "Mature visualization APIs and built-in GeoChart world/regional geographic boundary data.",
      plotcnAdds: "React integration, singleton loader, responsive shell, theme adaptation, lifecycle handling, and loading/error states.",
      tags: ["GeoChart", "Choropleth", "External Runtime"],
    },
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
      {engines.map((engine) => {
        const Icon = engine.icon
        return (
          <div
            key={engine.name}
            className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 flex flex-col justify-between hover:border-white/[0.16] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] mb-3">
                <span className="font-semibold text-zinc-400">ENGINE {engine.id}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300 font-mono text-[10px]">
                  {engine.role}
                </span>
              </div>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-8 rounded-lg border border-white/[0.1] bg-white/[0.05] flex items-center justify-center text-zinc-200">
                  <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.8} />
                </div>
                <h4 className="text-base font-semibold text-white tracking-tight">{engine.name}</h4>
              </div>

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
                  className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Registry Flow Pipeline visual
 */
export function RegistryFlow() {
  const steps = [
    {
      step: "01",
      title: "Discover",
      description: "Browse visual catalog, interactive demos, and code previews in Plotcn documentation.",
      icon: Layers01Icon,
      metadata: "Catalog · Previews",
    },
    {
      step: "02",
      title: "CLI Install",
      description: "Run shadcn CLI to resolve the component and its dependencies into your project.",
      icon: ComputerTerminal01Icon,
      metadata: "npx shadcn add @plotcn/...",
    },
    {
      step: "03",
      title: "Source Placed",
      description: "Complete TypeScript and CSS code is copied directly into components/charts/.",
      icon: Folder01Icon,
      metadata: "components/charts/*.tsx",
    },
    {
      step: "04",
      title: "Own & Evolve",
      description: "Customize layout geometry, tokens, interactions, and adapters without upstream lock-in.",
      icon: SourceCodeIcon,
      metadata: "100% Code Ownership",
    },
  ]

  return (
    <FlowDiagram
      title="Component Adoption Pipeline"
      eyebrow="Registry Workflow"
      description="From discovery to codebase integration: how Plotcn distributes source code using the open shadcn registry specification."
      ariaLabel="Registry workflow diagram"
    >
      <FlowTimeline steps={steps} activeStep="02" />
    </FlowDiagram>
  )
}

/**
 * Architecture block layout
 */
export function PlotcnArchitecture() {
  return (
    <FlowDiagram
      title="System Component Architecture"
      eyebrow="Layered Architecture"
      description="Plotcn decouples the presentation layer from underlying visualization engines for maximum flexibility."
      ariaLabel="Plotcn layered architecture diagram"
    >
      <div className="space-y-4">
        {/* Top Layer */}
        <FlowNode
          variant="primary"
          icon={<PlotcnMark className="size-4 text-white" />}
          eyebrow="LAYER 01 — SHARED CONTRACT"
          title="Shared Presentation Layer"
          description="Theme Tokens · Responsive Shell · Accessibility Roles · Skeletons & States · Tooltips"
          badge="SHARED"
          badgeVariant="accent"
          metadata="CSS Variables (--chart-grid, --chart-surface) · React Components"
        />

        <FlowConnector direction="down" label="adapter layer" />

        {/* Three Adapter Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FlowNode
            variant="runtime"
            icon={ChartBarLineIcon}
            eyebrow="ADAPTER 01"
            title="Recharts Adapter"
            description="Declarative React SVG. Cartesian coordinate mapping, radial charts, and smooth curves."
            metadata="Cartesian & Radial · React"
          />

          <FlowNode
            variant="runtime"
            icon={Layers01Icon}
            eyebrow="ADAPTER 02"
            title="D3.js Adapter"
            description="Mathematical coordinate precision. Custom scales, hierarchies, force layouts, and trees."
            metadata="Geometry & Scales · Math"
          />

          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="ADAPTER 03"
            title="Google Charts Adapter"
            description="External runtime adapter. Google singleton loader, chart options translation, and GeoCharts."
            metadata="External Runtime · GeoChart"
          />
        </div>
      </div>
    </FlowDiagram>
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
