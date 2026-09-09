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
    { name: "Architecture Foundation", status: "Ready" },
    { name: "Documentation Shell", status: "Ready" },
    { name: "Recharts Components", status: "Available" },
    { name: "D3.js Components", status: "Available" },
    { name: "Google Charts / GeoChart", status: "Available" },
    { name: "shadcn Registry Distribution", status: "Staged" },
  ]

  return (
    <div className="my-6 w-full rounded-xl border border-border bg-card p-5 sm:p-6 not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {milestones.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background"
          >
            <span className="text-xs text-foreground font-medium">{item.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground">
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

/**
 * Visual Ecosystem Hierarchy Map
 */
export function PlotcnEcosystemMap() {
  const sections = [
    {
      category: "01 / THREE VISUALIZATION ENGINES",
      badge: "Engines",
      items: [
        { name: "Recharts Collection", desc: "Dashboard, business analytics, Cartesian & radial metrics.", icon: ChartBarLineIcon, tag: "React-First" },
        { name: "D3.js Collection", desc: "Advanced custom geometry, scales, force layouts & hierarchies.", icon: Layers01Icon, tag: "Math & Layout" },
        { name: "Google Charts Collection", desc: "Core charts, Timeline, Sankey, TreeMap, Table & GeoChart.", icon: Globe02Icon, tag: "Geo & Enterprise" },
      ],
    },
    {
      category: "02 / SHARED VISUALIZATION EXPERIENCE",
      badge: "Shared Layer",
      items: [
        { name: "Theme & Tokens", desc: "Semantic CSS variables with dark-mode adaptation.", icon: Layers01Icon, tag: "Theme Native" },
        { name: "Adaptive Responsiveness", desc: "Container-driven resizing with fluid decluttering.", icon: ChartBarLineIcon, tag: "Container Query" },
        { name: "Accessible By Default", desc: "ARIA roles, live regions, and natural-language summaries.", icon: Shield01Icon, tag: "WCAG 2.2 AA" },
        { name: "Truthful States", desc: "Explicit loading, empty, and actionable error states.", icon: CheckmarkCircle02Icon, tag: "State Machine" },
      ],
    },
    {
      category: "03 / DISTRIBUTION & ECOSYSTEM",
      badge: "Delivery",
      items: [
        { name: "shadcn Registry", desc: "Direct source delivery via CLI — zero runtime lock-in.", icon: Package01Icon, tag: "@plotcn" },
        { name: "Blocks & Templates", desc: "Complete analytics, dashboards, and reporting sections.", icon: Folder01Icon, tag: "Pre-Built" },
        { name: "Interactive Docs & Playground", desc: "Live preview, theme toggling, and code generation.", icon: ComputerTerminal01Icon, tag: "Zero-Lag" },
      ],
    },
  ]

  return (
    <div className="my-6 space-y-4 not-prose">
      {sections.map((section) => (
        <div key={section.category} className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.04] pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">{section.category}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300">{section.badge}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="p-3 rounded-lg border border-white/[0.05] bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Icon} size={15} className="text-emerald-400" />
                      <h5 className="text-xs font-semibold text-white tracking-tight">{item.name}</h5>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">{item.tag}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Product Delivery Architecture Timeline
 */
export function ProductDeliveryFlow() {
  const steps = [
    {
      step: 1,
      title: "Three Visualization Engines",
      description: "Recharts (React), D3.js (Math/Geometry), Google Charts (Geo & Enterprise).",
      icon: Layers01Icon,
      status: "completed" as const,
      tag: "ENGINES",
    },
    {
      step: 2,
      title: "Plotcn Shared Layer",
      description: "Standardizes theme tokens, responsiveness, accessibility summaries, and interaction conventions.",
      icon: Shield01Icon,
      status: "completed" as const,
      tag: "SHARED SYSTEM",
    },
    {
      step: 3,
      title: "Plotcn Registry",
      description: "Distributes static JSON item manifests conforming to official shadcn registry schema.",
      icon: Package01Icon,
      status: "completed" as const,
      tag: "REGISTRY",
    },
    {
      step: 4,
      title: "Developer-Owned Source",
      description: "Source code copied directly into your components/charts/ directory under Git control.",
      icon: SourceCodeIcon,
      status: "active" as const,
      tag: "LOCAL CODE",
    },
    {
      step: 5,
      title: "Consumer Application",
      description: "Direct compilation inside Next.js, Vite, or Remix with zero third-party runtime package lock-in.",
      icon: ComputerTerminal01Icon,
      status: "completed" as const,
      tag: "YOUR APP",
    },
  ]

  return (
    <FlowDiagram
      title="Product Delivery Architecture"
      eyebrow="Delivery Pipeline"
      description="How visualization engines flow through Plotcn's shared system and registry directly into your codebase."
      ariaLabel="Product delivery flow diagram"
    >
      <FlowTimeline steps={steps} activeStep="04" />
    </FlowDiagram>
  )
}

/**
 * D3.js vs React Responsibility Boundary
 */
export function D3BoundaryCard() {
  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
      {/* Left: D3 Responsibilities */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Layers01Icon} size={16} className="text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">D3.js Domain</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Math & Layout</span>
        </div>
        <ul className="space-y-2 text-xs text-zinc-300">
          <li className="flex items-start gap-2"><span className="text-amber-400 font-mono">→</span><span><strong>Scales & Domains</strong>: Linear, logarithmic, time, and ordinal mappings</span></li>
          <li className="flex items-start gap-2"><span className="text-amber-400 font-mono">→</span><span><strong>Geometric Curves</strong>: Spline curves, areas, arc math, voronoi tessellation</span></li>
          <li className="flex items-start gap-2"><span className="text-amber-400 font-mono">→</span><span><strong>Complex Layouts</strong>: Force-directed physics simulations, hierarchical trees</span></li>
          <li className="flex items-start gap-2"><span className="text-amber-400 font-mono">→</span><span><strong>Data Transformations</strong>: Bins, cross-filtering, and geographic projections</span></li>
        </ul>
      </div>

      {/* Right: React Responsibilities */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SourceCodeIcon} size={16} className="text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">React Domain</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">DOM & Lifecycle</span>
        </div>
        <ul className="space-y-2 text-xs text-zinc-300">
          <li className="flex items-start gap-2"><span className="text-emerald-400 font-mono">→</span><span><strong>SVG Element Rendering</strong>: Declarative JSX &lt;path&gt;, &lt;rect&gt;, &lt;circle&gt; nodes</span></li>
          <li className="flex items-start gap-2"><span className="text-emerald-400 font-mono">→</span><span><strong>Component Lifecycle</strong>: State hooks, props reactivity, and resize observers</span></li>
          <li className="flex items-start gap-2"><span className="text-emerald-400 font-mono">→</span><span><strong>Accessibility (a11y)</strong>: ARIA attributes, live regions, table disclosures</span></li>
          <li className="flex items-start gap-2"><span className="text-emerald-400 font-mono">→</span><span><strong>Interactive Events</strong>: React onClick, hover states, keyboard :focus-visible</span></li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Google Charts Taxonomy (Core, Specialized, Geo)
 */
export function GoogleChartsTaxonomy() {
  const groups = [
    {
      title: "Core Charts",
      subtitle: "Mature standard charts",
      badge: "corechart",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      items: ["Line Chart", "Area Chart", "Bar & Column", "Combo Chart", "Pie & Donut", "Scatter Plot", "Bubble Chart", "Histogram", "Stepped Area"],
    },
    {
      title: "Specialized Visualizations",
      subtitle: "Time, flow & hierarchy",
      badge: "specialized",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      items: ["Timeline / Gantt", "Sankey Diagram", "TreeMap Density", "Gauge Metrics", "Org Hierarchy", "Interactive Data Table"],
    },
    {
      title: "Geographic Visualization",
      subtitle: "Statistical choropleths",
      badge: "geochart",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      items: ["World Regional Maps", "Country Breakdown", "State / Province Level", "Marker Bubble Maps", "Color Scale Gradients", "Region Select Handlers"],
    },
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
      {groups.map((group) => (
        <div key={group.title} className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3">
              <div>
                <h4 className="text-xs font-semibold text-white tracking-tight">{group.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">{group.subtitle}</p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${group.badgeColor}`}>{group.badge}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="px-2 py-1 rounded bg-zinc-900 border border-white/[0.05] text-[11px] text-zinc-300 font-sans">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Engine Isolation Overview
 */
export function EngineIsolationOverview() {
  const items = [
    {
      pkg: "@plotcn/line-basic",
      engine: "Recharts",
      installs: ["recharts"],
      isolation: "Zero D3 or Google code installed",
    },
    {
      pkg: "@plotcn/d3-force-network",
      engine: "D3.js",
      installs: ["d3-force", "d3-scale"],
      isolation: "Modular micro-packages only; zero Recharts or Google code",
    },
    {
      pkg: "@plotcn/google-geochart",
      engine: "Google Charts",
      installs: ["Plotcn Google loader"],
      isolation: "Zero npm bundle bloat; loads runtime from Google CDN on demand",
    },
  ]

  return (
    <div className="my-6 space-y-3 not-prose">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.pkg} className="p-4 rounded-xl border border-border bg-card space-y-2.5">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-mono text-xs text-foreground font-semibold">{item.pkg}</span>
              <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border">{item.engine}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Installed Dependencies</span>
              <div className="flex flex-wrap gap-1">
                {item.installs.map((dep) => (
                  <span key={dep} className="px-1.5 py-0.5 rounded bg-muted text-foreground border border-border font-mono text-[10px]">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug pt-1 border-t border-border">{item.isolation}</p>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-lg border border-border bg-muted/50 flex items-center gap-2 text-xs text-foreground">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="shrink-0 text-muted-foreground" />
        <span><strong>Bundle Cleanliness</strong>: Plotcn components never install monolithic packages or cross-engine code. Your production bundle only pays for the exact charts you mount.</span>
      </div>
    </div>
  )
}

/**
 * Google Runtime Pipeline
 */
export function GoogleRuntimePipeline() {
  const steps = [
    { step: 1, title: "Plotcn Installed Source", description: "Your local component in components/charts/google/ with full customization freedom.", icon: SourceCodeIcon, status: "completed" as const, tag: "LOCAL REPO" },
    { step: 2, title: "React Chart Wrapper", description: "Manages container ref, resize observers, theme token mapping, and loading/error states.", icon: Folder01Icon, status: "completed" as const, tag: "WRAPPER" },
    { step: 3, title: "Shared Google Loader", description: "Singleton script injector deduplicating CDN requests and managing package promises.", icon: Package01Icon, status: "completed" as const, tag: "SINGLETON" },
    { step: 4, title: "Google Charts Runtime", description: "External google.visualization library loaded securely from gstatic CDN.", icon: Globe02Icon, status: "completed" as const, tag: "GOOGLE CDN" },
    { step: 5, title: "Rendered Visualization", description: "Hardware-accelerated SVG or Canvas rendered into the accessible Plotcn container.", icon: ChartBarLineIcon, status: "active" as const, tag: "BROWSER" },
  ]

  return (
    <FlowDiagram
      title="Google Charts Hosted Runtime Architecture"
      eyebrow="Runtime Pipeline"
      description="How Plotcn coordinates local React wrapper source with Google's externally hosted charting engine."
      ariaLabel="Google Charts runtime pipeline diagram"
    >
      <FlowTimeline steps={steps} activeStep="01" />
    </FlowDiagram>
  )
}

/**
 * Target Developer Journey
 */
export function TargetDeveloperJourney() {
  const steps = [
    { step: 1, title: "Discover Visualization", description: "Browse catalog for Cartesian, statistical, network, or geographic charts.", icon: Search01Icon, status: "completed" as const, tag: "BROWSE" },
    { step: 2, title: "Choose Engine", description: "Select Recharts (React), D3.js (custom geometry), or Google Charts (Geo/enterprise).", icon: Layers01Icon, status: "completed" as const, tag: "ENGINE" },
    { step: 3, title: "Inspect Source", description: "Review raw TypeScript file, theme tokens, dependencies, and a11y disclosure tables.", icon: SourceCodeIcon, status: "completed" as const, tag: "INSPECT" },
    { step: 4, title: "Install via shadcn CLI", description: "Run shadcn add @plotcn/<item> to pull source directly into your codebase.", icon: ComputerTerminal01Icon, status: "active" as const, tag: "CLI ADD" },
    { step: 5, title: "Import & Connect Data", description: "Import the local component, pass typed props, and customize styling to match your brand.", icon: Package01Icon, status: "completed" as const, tag: "CONNECT" },
    { step: 6, title: "Ship with Ownership", description: "Deploy with zero third-party chart package runtime lock-in or recurring dependencies.", icon: CheckmarkCircle02Icon, status: "completed" as const, tag: "SHIP" },
  ]

  return (
    <FlowDiagram
      title="Target Developer Journey"
      eyebrow="Developer Experience"
      description="The 6-stage lifecycle from discovering a chart to shipping customizable source code."
      ariaLabel="Target developer journey diagram"
    >
      <FlowTimeline steps={steps} activeStep="04" />
    </FlowDiagram>
  )
}

/**
 * Full Product Architecture & Mental Model
 */
export function FullProductModel() {
  return (
    <FlowDiagram
      title="Full Product Architecture & Mental Model"
      eyebrow="Ecosystem Architecture"
      description="Three visualization engines. One coherent ecosystem. Source you own."
      ariaLabel="Full product architecture diagram"
    >
      <div className="space-y-4">
        {/* Top: Plotcn Ecosystem Brand */}
        <FlowNode
          variant="primary"
          icon={<PlotcnMark className="size-4 text-white" />}
          eyebrow="PLOTCN ECOSYSTEM"
          title="Plotcn Visualization Platform"
          description="Source-first visualization architecture for modern React applications."
          badge="ROOT"
          badgeVariant="accent"
        />

        <FlowConnector direction="down" label="branches into three specialized engine collections" />

        {/* Level 2: Three Engine Collections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FlowNode
            variant="runtime"
            icon={ChartBarLineIcon}
            eyebrow="COLLECTION 01"
            title="Recharts Collection"
            description="Declarative dashboard & business charts. Line, Area, Bar, Pie, Radar."
            badge="React-First"
            metadata="Standard Dashboards"
          />
          <FlowNode
            variant="runtime"
            icon={Layers01Icon}
            eyebrow="COLLECTION 02"
            title="D3.js Collection"
            description="Advanced custom geometry, force networks, hierarchies, custom continuous scales."
            badge="Bespoke Math"
            metadata="Geometric Control"
          />
          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="COLLECTION 03"
            title="Google Charts Collection"
            description="Core enterprise charts, Timeline, Sankey, TreeMap, Table, and GeoChart."
            badge="External CDN"
            metadata="Geo & Enterprise"
          />
        </div>

        <FlowConnector direction="down" label="unified through shared chart layer" />

        {/* Level 3: Shared Chart Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FlowNode
            variant="secondary"
            icon={Layers01Icon}
            eyebrow="SHARED CAPABILITY"
            title="Theme & Tokens"
            description="Semantic CSS variables with dark-mode adaptation."
            metadata="CSS Custom Properties"
          />
          <FlowNode
            variant="secondary"
            icon={ChartBarLineIcon}
            eyebrow="SHARED CAPABILITY"
            title="Fluid Responsiveness"
            description="Container-driven resizing with automatic tick & label decluttering."
            metadata="ResizeObserver Container"
          />
          <FlowNode
            variant="secondary"
            icon={Shield01Icon}
            eyebrow="SHARED CAPABILITY"
            title="Built-In Accessibility"
            description="Screen-reader data tables, ARIA roles, and reduced-motion enforcement."
            metadata="WCAG 2.2 AA Compliant"
          />
        </div>

        <FlowConnector direction="down" label="distributed through open registry" />

        {/* Level 4: Registry & Local Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FlowNode
            variant="registry"
            icon={Package01Icon}
            eyebrow="DISTRIBUTION LAYER"
            title="Plotcn Registry (@plotcn)"
            description="Static JSON item manifests containing verified source files and dependencies."
            badge="shadcn Registry"
            metadata="https://plotcn.vercel.app/r"
          />
          <FlowNode
            variant="output"
            icon={SourceCodeIcon}
            eyebrow="DEVELOPER CODEBASE"
            title="Direct Source Ownership"
            description="Raw TypeScript code copied into components/charts/ under full Git control."
            badge="100% Editable"
            badgeVariant="success"
            metadata="Zero Runtime Lock-In"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

/**
 * Google Charts Engine Architecture SVG Flow Diagram
 */
export function GoogleChartsArchDiagram() {
  return (
    <FlowDiagram
      title="Three-Engine Unified Architecture"
      eyebrow="Engine Architecture"
      description="Plotcn isolates visualization engines while standardizing container shells, themes, and accessibility."
      ariaLabel="Google Charts architecture flow diagram"
    >
      <div className="space-y-4">
        {/* Level 1: Root System */}
        <FlowNode
          variant="primary"
          icon={<PlotcnMark className="size-4 text-white" />}
          eyebrow="VISUALIZATION SYSTEM"
          title="Plotcn Multi-Engine Foundation"
          description="Shared container shell, token adapters, ResizeObserver, and accessibility summaries."
          badge="SHARED"
          badgeVariant="accent"
        />

        <FlowConnector direction="down" label="strictly isolated engine branches" />

        {/* Level 2: Three Engines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FlowNode
            variant="runtime"
            icon={ChartBarLineIcon}
            eyebrow="ENGINE 01"
            title="Recharts"
            description="Composable React SVG charts for dashboard & business KPIs."
            badge="React Native"
            metadata="Bundled npm"
          />
          <FlowNode
            variant="runtime"
            icon={Layers01Icon}
            eyebrow="ENGINE 02"
            title="D3.js"
            description="Custom geometric calculations, layouts, and continuous scales."
            badge="Custom Math"
            metadata="Micro-packages"
          />
          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="ENGINE 03"
            title="Google Charts"
            description="Mature Google-powered standard charts and geographic choropleths."
            badge="External CDN"
            metadata="GeoChart + Core"
          />
        </div>

        <FlowConnector direction="down" label="Google Charts package categories" />

        {/* Level 3: Google Sub-branches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FlowNode
            variant="secondary"
            icon={ChartBarLineIcon}
            eyebrow="PACKAGE: corechart"
            title="Core Standard Charts"
            description="Line, Bar, Column, Area, Combo, Pie, Donut, Scatter, and Stepped Area."
            badge="Standard"
            metadata="google.charts.load('corechart')"
          />
          <FlowNode
            variant="secondary"
            icon={Globe02Icon}
            eyebrow="PACKAGE: geochart"
            title="GeoChart Choropleths"
            description="World regions, countries, states/provinces, and statistical color scales."
            badge="Choropleth"
            metadata="google.charts.load('geochart')"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

/**
 * Google GeoChart Features SVG Flow Diagram
 */
export function GeoChartFeatureFlow() {
  return (
    <FlowDiagram
      title="Google GeoChart Capabilities"
      eyebrow="Engine Features"
      description="Statistical SVG choropleth mapping powered by Google Charts' built-in geographic boundary datasets."
      ariaLabel="GeoChart feature flow diagram"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FlowNode
          variant="runtime"
          icon={Globe02Icon}
          eyebrow="CHOROPLETH MAPS"
          title="Statistical Heatmaps"
          description="Values mapped proportionally to regional color spectrums with dataless region fallbacks."
          badge="Color Scales"
          metadata="SVG Gradient Rendering"
        />
        <FlowNode
          variant="runtime"
          icon={Layers01Icon}
          eyebrow="MULTI-REGION RESOLUTION"
          title="World, Countries & Provinces"
          description="Zoom into continents (UN M.49), countries (ISO-3166-1), or state/provincial territories."
          badge="Hierarchical"
          metadata="resolution='provinces'"
        />
        <FlowNode
          variant="runtime"
          icon={SourceCodeIcon}
          eyebrow="TYPED REACT INTEGRATION"
          title="Typed Object Arrays"
          description="Pass standard JavaScript arrays with regionKey, valueKey, and typed onRegionSelect callbacks."
          badge="React API"
          metadata="data={userRecords}"
        />
        <FlowNode
          variant="runtime"
          icon={Shield01Icon}
          eyebrow="ACCESSIBILITY & SEMANTICS"
          title="Accessible Screen-Reader Shell"
          description="Automatic data table disclosure, ARIA labeling, and keyboard region navigation."
          badge="WCAG 2.2"
          metadata="Accessible Data Table"
        />
      </div>
    </FlowDiagram>
  )
}

/**
 * Installed Components File Placement Flow
 */
export function InstalledFilesCard() {
  const files = [
    {
      engine: "Recharts",
      path: "components/charts/recharts/line-chart-basic.tsx",
      badge: "recharts",
      badgeColor: "text-sky-400 bg-sky-950/40 border-sky-800/30",
      description: "Local editable component source for standard business line chart.",
      icon: SourceCodeIcon,
    },
    {
      engine: "Google Charts",
      path: "components/charts/google/google-geochart.tsx",
      badge: "google",
      badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/30",
      description: "Local editable choropleth component for regional heatmaps.",
      icon: SourceCodeIcon,
    },
    {
      engine: "Google Charts Runtime",
      path: "components/charts/google/google-chart-container.tsx",
      badge: "runtime wrapper",
      badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/30",
      description: "Singleton loader and client-side lifecycle container.",
      icon: Layers01Icon,
    },
    {
      engine: "Shared System",
      path: "components/charts/shared/chart-container.tsx",
      badge: "shared / a11y",
      badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/30",
      description: "Engine-independent responsive wrapper, theme tokens, and accessible summary.",
      icon: Shield01Icon,
    },
  ]

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <HugeiconsIcon icon={Folder01Icon} size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">Local File Tree Structure</h4>
            <p className="text-[11px] text-zinc-400">Example placement inside your project after installation</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300">
          Source In Your Repo
        </span>
      </div>

      <div className="space-y-2.5">
        {files.map((file) => {
          const Icon = file.icon
          return (
            <div
              key={file.path}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-white/[0.06] bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <HugeiconsIcon icon={Icon} size={15} className="text-zinc-400 mt-0.5 sm:mt-0 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-medium text-emerald-300 truncate">{file.path}</span>
                    <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase", file.badgeColor)}>
                      {file.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{file.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
