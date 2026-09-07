"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useInstallation } from "./installation/installation-context"
import {
  packageManagerTokens,
  getExecPrefix,
} from "./installation/installation-config"
import { PackageManagerIcon } from "./installation/package-manager-icons"
import { plotcnRegistry } from "@/config/registry"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  CheckIcon,
  Copy01Icon,
  Folder01Icon,
  File01Icon,
  Layers01Icon,
  ComputerTerminal01Icon,
  Alert02Icon,
  Search01Icon,
  Package01Icon,
  CloudIcon,
  SourceCodeIcon,
  ArrowRight01Icon,
  Globe02Icon,
  ChartBarLineIcon,
  GitBranchIcon,
  Download01Icon,
  Upload01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import {
  FlowDiagram,
  FlowNode,
  FlowConnector,
  FlowZone,
  FlowTimeline,
} from "./flow"

// Backward-compatible Hugeicons wrappers
function CheckmarkCircleIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={CheckmarkCircle02Icon} size={size} strokeWidth={1.8} className={className} />
}
function TickIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={CheckIcon} size={size} strokeWidth={2} className={className} />
}
function CopyIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Copy01Icon} size={size} strokeWidth={1.8} className={className} />
}
function FolderIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Folder01Icon} size={size} strokeWidth={1.8} className={className} />
}
function FileIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={File01Icon} size={size} strokeWidth={1.8} className={className} />
}
function LayersIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Layers01Icon} size={size} strokeWidth={1.8} className={className} />
}
function TerminalIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={ComputerTerminal01Icon} size={size} strokeWidth={1.8} className={className} />
}
function AlertTriangleIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Alert02Icon} size={size} strokeWidth={1.8} className={className} />
}
function SearchIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Search01Icon} size={size} strokeWidth={1.8} className={className} />
}

// ============================================================================
// 1. REGISTRY HERO
// ============================================================================

export function RegistryHero() {
  const { packageManager } = useInstallation()
  const [copied, setCopied] = useState(false)

  const exec = getExecPrefix(packageManager)
  // Reflect actual development / local command truthfully
  const sampleCmd = `${exec} shadcn@latest add @plotcn/line-basic`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pkgTokens = packageManagerTokens[packageManager] || packageManagerTokens.pnpm

  return (
    <header className="relative mb-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-zinc-950 p-6 sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Eyebrow & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-zinc-900/90 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SOURCE SPECIFICATION
            </span>
            <span className="text-xs text-zinc-500 font-mono">STEP 04 OF GETTING STARTED</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-300 border border-amber-500/20">
              Registry: {plotcnRegistry.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Plotcn Registry
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-300">
            Source distribution for visualization components. The Plotcn Registry packages charts,
            shared primitives, utilities, dependencies, and metadata into installable source items that
            can be resolved by the shadcn CLI and copied directly into your application.
          </p>
        </div>

        {/* Quick Command Bar */}
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px]"
              style={{
                borderColor: pkgTokens.borderColor,
                backgroundColor: pkgTokens.bgTint,
                color: pkgTokens.accentColor,
              }}
            >
              <PackageManagerIcon pkg={packageManager} size={12} />
              {pkgTokens.name}
            </span>
            <code className="text-emerald-400 truncate">{sampleCmd}</code>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded border border-white/[0.1] bg-zinc-800 px-3 py-1 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors shrink-0 self-start sm:self-auto"
          >
            {copied ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <TickIcon size={12} /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CopyIcon size={12} /> Copy
              </span>
            )}
          </button>
        </div>

        {/* Metadata Strip */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="text-zinc-500 font-mono text-[11px] mr-1">ATTRIBUTES:</span>
          {[
            { label: "Source-first" },
            { label: "shadcn Registry" },
            { label: "TypeScript" },
            { label: "Composable" },
            { label: "Inspectable" },
            { label: "Engine-aware" },
          ].map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1 font-mono text-[11px] text-zinc-300"
            >
              <CheckmarkCircleIcon size={12} className="text-emerald-400 shrink-0" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// 2. PLOTCN REGISTRY FLOW (Signature Visual)
// ============================================================================

export function PlotcnRegistryFlow() {
  return (
    <FlowDiagram
      title="Plotcn Registry Distribution Architecture"
      eyebrow="Registry Architecture"
      description="How registry manifests, npm packages, and shared primitives flow from the remote catalog directly into your local codebase."
      ariaLabel="Plotcn registry distribution architecture diagram"
    >
      <div className="space-y-4">
        {/* Remote Zone */}
        <FlowZone
          title="Remote Plotcn Registry Catalog"
          eyebrow="REMOTE SPECIFICATION"
          icon={CloudIcon}
          badge="plotcn.vercel.app/r"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FlowNode
              variant="registry"
              icon={Package01Icon}
              eyebrow="ITEM: @plotcn/line-basic"
              title="line-basic.json"
              description="Declares recharts npm package + chart-container registry dependency."
              badge="Recharts"
              metadata="dependencies: ['recharts']"
            />
            <FlowNode
              variant="registry"
              icon={Package01Icon}
              eyebrow="ITEM: @plotcn/google-geochart"
              title="google-geochart.json"
              description="Declares Google singleton loader helper + theme adapter. Zero Recharts/D3 bloat."
              badge="Google Charts"
              metadata="dependencies: [] (client loader)"
            />
          </div>
        </FlowZone>

        {/* Connector down to CLI */}
        <FlowConnector direction="down" label="resolved by shadcn CLI" />

        {/* CLI Execution Zone */}
        <FlowZone
          title="shadcn CLI Execution & Dependency Resolution"
          eyebrow="RESOLVER TOOLCHAIN"
          icon={ComputerTerminal01Icon}
          badge="npx shadcn add @plotcn/..."
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FlowNode
              variant="file"
              icon={File01Icon}
              eyebrow="01. SOURCE FILES"
              title="components/charts/recharts/"
              description="Writes raw line-basic.tsx source file and rewrites imports to local project aliases."
              metadata="Raw TSX File"
            />

            <FlowNode
              variant="package"
              icon={Package01Icon}
              eyebrow="02. PACKAGE DEPS"
              title="npm dependencies"
              description="Installs only recharts into your project's package.json. No unnecessary packages."
              metadata="pnpm / npm / yarn / bun"
            />

            <FlowNode
              variant="secondary"
              icon={Layers01Icon}
              eyebrow="03. REGISTRY DEPS"
              title="Shared Primitives"
              description="Recursively resolves chart-container into components/charts/shared/."
              metadata="Source-to-Source Reuse"
            />
          </div>
        </FlowZone>

        {/* Connector down to Local Application */}
        <FlowConnector direction="down" label="injected into Git repository" />

        {/* Destination: Local Codebase */}
        <FlowNode
          variant="output"
          icon={Folder01Icon}
          eyebrow="YOUR APPLICATION WORKSPACE"
          title="components/charts/"
          description="Zero external Plotcn runtime. 100% editable source code directly under your project's version control."
          badge="100% OWNED"
          badgeVariant="success"
          status="completed"
          metadata="Local Codebase · TypeScript · Zero Lock-In"
        />
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 3. REGISTRY MENTAL MODEL
// ============================================================================

export function RegistryMentalModel() {
  const steps = [
    {
      step: 1,
      title: "Discovery & Catalog",
      description: "Browse chart primitives or query registry catalog index for Cartesian, D3, or Google choropleths.",
      icon: Search01Icon,
      status: "completed" as const,
      tag: "REMOTE CATALOG",
    },
    {
      step: 2,
      title: "shadcn CLI Resolution",
      description: "CLI parses @plotcn/<item>, fetches static manifest from https://plotcn.vercel.app/r/{name}.json, and audits dependencies.",
      icon: ComputerTerminal01Icon,
      status: "completed" as const,
      tag: "CLI RESOLVER",
    },
    {
      step: 3,
      title: "Local Materialization",
      description: "Writes pure TypeScript source to components/charts/, resolves chart-container primitive, and rewrites aliases.",
      icon: File01Icon,
      status: "active" as const,
      tag: "LOCAL REPO",
    },
    {
      step: 4,
      title: "Native App Compilation",
      description: "Your Next.js or Vite bundler compiles standard React components. Zero telemetry or ongoing server dependency.",
      icon: Layers01Icon,
      status: "completed" as const,
      tag: "BUNDLER",
    },
  ]

  return (
    <FlowDiagram
      title="Source Delivery Lifecycle"
      eyebrow="Mental Model"
      description="Understanding the shift from external node_modules package dependencies to direct Git-tracked source code adoption."
      ariaLabel="Plotcn source delivery lifecycle diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}

// ============================================================================
// 4. NAMESPACE RESOLVER (Visual breakdown of @plotcn/item)
// ============================================================================

export function NamespaceResolver() {
  return (
    <FlowDiagram
      title="Namespace Anatomy & CLI URL Resolution"
      eyebrow="Resolution Pipeline"
      description="How the shadcn CLI maps the namespaced command to the remote manifest endpoint."
      ariaLabel="Namespace resolution pipeline diagram"
    >
      <div className="space-y-4">
        {/* Step 1: Input CLI command */}
        <FlowNode
          variant="command"
          icon={ComputerTerminal01Icon}
          eyebrow="INPUT COMMAND"
          title="shadcn add @plotcn/line-basic"
          description="The developer executes the namespaced CLI command in their local project terminal."
          badge="CLI Invocation"
        />

        <FlowConnector direction="down" label="CLI parses namespace & item identifier" />

        {/* Step 2: Two parallel lookup components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FlowNode
            variant="registry"
            icon={CloudIcon}
            eyebrow="01. NAMESPACE (@plotcn)"
            title="components.json Lookup"
            description="Matched against registries dictionary: '@plotcn': 'https://plotcn.vercel.app/r/{name}.json'"
            metadata="registries['@plotcn']"
          />
          <FlowNode
            variant="file"
            icon={Package01Icon}
            eyebrow="02. ITEM NAME (line-basic)"
            title="URL Template Substitution"
            description="Replaces the {name} placeholder to construct the exact manifest URL: /r/line-basic.json"
            metadata="{name} -> line-basic"
          />
        </div>

        <FlowConnector direction="down" label="fetches over secure HTTPS" />

        {/* Step 3: Resolved Endpoint */}
        <FlowNode
          variant="output"
          icon={File01Icon}
          eyebrow="RESOLVED MANIFEST ENDPOINT"
          title="https://plotcn.vercel.app/r/line-basic.json"
          description="Downloads the verified JSON specification containing TypeScript source, npm dependencies, and shared primitives."
          badge="JSON Manifest"
          metadata="HTTP 200 · application/json"
        />
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 5. REGISTRY CLI EXPLORER (List, Search, View, Add)
// ============================================================================

type CliTab = "add" | "view" | "list" | "search"

export function RegistryCliExplorer() {
  const { packageManager } = useInstallation()
  const [activeTab, setActiveTab] = useState<CliTab>("add")
  const [copied, setCopied] = useState(false)

  const exec = getExecPrefix(packageManager)

  const commands: Record<CliTab, { cmd: string; desc: string; output: string }> = {
    add: {
      cmd: `${exec} shadcn@latest add @plotcn/line-basic`,
      desc: "Installs the line chart component source and required Recharts dependency directly into your application.",
      output: `✔ Resolving @plotcn/line-basic
✔ Installing dependencies: recharts
✔ Creating components/charts/recharts/line-basic.tsx
✔ Creating components/charts/shared/chart-container.tsx
✔ Installation complete.`,
    },
    view: {
      cmd: `${exec} shadcn@latest view @plotcn/line-basic`,
      desc: "Inspects the raw registry manifest, dependencies, and file definitions before copying code into your project.",
      output: `{
  "name": "line-basic",
  "type": "registry:component",
  "dependencies": ["recharts"],
  "registryDependencies": ["chart-container"],
  "files": [{ "path": "line-basic.tsx", "type": "registry:component" }]
}`,
    },
    list: {
      cmd: `${exec} shadcn@latest list @plotcn`,
      desc: "Lists available chart components and primitives registered under the @plotcn namespace.",
      output: `@plotcn/line-basic        Basic cartesian line chart (Recharts)
@plotcn/bar-stacked       Stacked categorical bar chart (Recharts)
@plotcn/d3-force-network  Force-directed graph layout (D3.js)
@plotcn/google-geochart   Choropleth world map (Google Charts)
@plotcn/chart-container   Responsive shared container primitive`,
    },
    search: {
      cmd: `${exec} shadcn@latest search @plotcn --query line`,
      desc: "Searches for specific visualization variants matching a query across the Plotcn registry index.",
      output: `Matching components for query 'line':
- @plotcn/line-basic (Recharts)
- @plotcn/line-gradient (Recharts)
- @plotcn/google-line (Google Charts)`,
    },
  }

  const active = commands[activeTab]

  const handleCopy = () => {
    navigator.clipboard.writeText(active.cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pkgTokens = packageManagerTokens[packageManager] || packageManagerTokens.pnpm

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-zinc-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
            shadcn CLI Registry Commands
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {(["add", "view", "list", "search"] as CliTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white/[0.1] text-white font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 font-sans leading-relaxed">{active.desc}</p>

      {/* Command Box */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-zinc-900/80 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0 font-mono text-xs sm:text-sm">
          <span className="text-zinc-500 select-none">$</span>
          <code className="text-emerald-400 truncate">{active.cmd}</code>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded border border-white/[0.1] bg-zinc-800 px-3 py-1 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors shrink-0"
        >
          {copied ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <TickIcon size={12} /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <CopyIcon size={12} /> Copy
            </span>
          )}
        </button>
      </div>

      {/* Simulated Output Preview */}
      <div className="rounded-lg border border-white/[0.06] bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400 overflow-x-auto leading-relaxed">
        <div className="text-zinc-600 text-[10px] mb-1 select-none">// Terminal output simulation</div>
        <pre className="text-zinc-300">
          <code>{active.output}</code>
        </pre>
      </div>
    </div>
  )
}

// ============================================================================
// 6. REGISTRY ITEM EXPLORER (Signature Inspector)
// ============================================================================

type ItemField = "name" | "type" | "dependencies" | "registryDependencies" | "files"

export function RegistryItemExplorer() {
  const [selectedField, setSelectedField] = useState<ItemField>("dependencies")

  const explanations: Record<ItemField, { label: string; desc: string; plotcnRule: string }> = {
    name: {
      label: "name",
      desc: "The unique identifier of the registry resource (e.g. 'line-basic'). Combined with the namespace to form '@plotcn/line-basic'.",
      plotcnRule: "Names are strictly descriptive and engine-prefixed when non-cartesian (e.g. d3-force-network, google-geochart).",
    },
    type: {
      label: "type",
      desc: "Specifies the shadcn resource category ('registry:component', 'registry:ui', or 'registry:lib').",
      plotcnRule: "Visualizations declare 'registry:component' to ensure they are copied into your components/charts/ directory.",
    },
    dependencies: {
      label: "dependencies",
      desc: "Standard npm packages that must be installed in package.json for this chart to run.",
      plotcnRule: "Strictly isolated per engine. A Recharts chart installs 'recharts' only. D3 charts install granular packages like 'd3-shape'.",
    },
    registryDependencies: {
      label: "registryDependencies",
      desc: "Dependencies on other Plotcn registry items (source-to-source reuse).",
      plotcnRule: "Allows components to share ChartContainer and theme utilities without duplicating source files in every registry payload.",
    },
    files: {
      label: "files",
      desc: "Array of local source file definitions, content, and target destination paths.",
      plotcnRule: "Files are typed TypeScript (.tsx) and reference project aliases (@/*) rewritten at install time.",
    },
  }

  const active = explanations[selectedField]

  const itemJson = `{
  "name": "line-basic",
  "type": "registry:component",
  "description": "Responsive cartesian line chart with tooltip and hover state.",
  "dependencies": ["recharts"],
  "registryDependencies": ["chart-container", "chart-theme"],
  "files": [
    {
      "path": "components/charts/recharts/line-basic.tsx",
      "type": "registry:component",
      "target": "components/charts/recharts/line-basic.tsx"
    }
  ]
}`

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Registry Item JSON Schema Explorer
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Click any field to inspect its role in dependency resolution and file copying.
          </p>
        </div>
        <span className="self-start sm:self-auto rounded bg-white/[0.06] px-2 py-1 text-[11px] font-mono text-zinc-400">
          Official shadcn format
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: JSON Explorer */}
        <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-zinc-500 mb-1 text-[10px] select-none">// /r/line-basic.json</div>
          <pre className="text-zinc-300">
            <code>{itemJson}</code>
          </pre>
        </div>

        {/* Right: Property Details */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4 sm:p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {(["name", "type", "dependencies", "registryDependencies", "files"] as ItemField[]).map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedField(f)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                      selectedField === f
                        ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                        : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {f}
                  </button>
                )
              )}
            </div>

            <div className="border-t border-white/[0.06] pt-3 space-y-2">
              <div className="font-mono text-xs font-semibold text-white">
                Field: <span className="text-emerald-400">&quot;{active.label}&quot;</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{active.desc}</p>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3 space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Plotcn Rule
                </div>
                <p className="text-xs text-zinc-200 font-sans leading-relaxed">{active.plotcnRule}</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            Complies with official shadcn Registry item specification.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6B. REGISTRY FILE DIFF
// ============================================================================

export function RegistryFileDiff() {
  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
          Filesystem Evolution (Pre vs Post Install)
        </h4>
        <span className="text-[11px] font-mono text-emerald-400">Zero Framework Bloat</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Before */}
        <div className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-white/[0.04] pb-2">
            <span>BEFORE INSTALL</span>
            <span className="text-zinc-500">Standard shadcn project</span>
          </div>
          <div className="space-y-1 text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <FolderIcon size={14} className="text-zinc-500" />
              <span>components/</span>
            </div>
            <div className="pl-4 flex items-center gap-1.5 text-zinc-400">
              <FolderIcon size={14} className="text-zinc-600" />
              <span>ui/</span>
            </div>
            <div className="pl-8 text-zinc-500 text-[11px]">
              └── button.tsx, card.tsx, ...
            </div>
          </div>
        </div>

        {/* After */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 border-b border-emerald-500/20 pb-2">
            <span>AFTER INSTALL (@plotcn/line-basic)</span>
            <span className="text-emerald-400">+2 files added</span>
          </div>
          <div className="space-y-1 text-zinc-300">
            <div className="flex items-center gap-1.5 text-zinc-200">
              <FolderIcon size={14} className="text-zinc-500" />
              <span>components/</span>
            </div>
            <div className="pl-4 flex items-center gap-1.5 text-zinc-400">
              <FolderIcon size={14} className="text-zinc-600" />
              <span>ui/</span>
            </div>
            <div className="pl-4 flex items-center gap-1.5 text-emerald-300 font-semibold">
              <FolderIcon size={14} className="text-emerald-400" />
              <span>charts/</span>
            </div>
            <div className="pl-8 flex items-center gap-1.5 text-zinc-300">
              <FolderIcon size={14} className="text-zinc-600" />
              <span>shared/</span>
            </div>
            <div className="pl-12 flex items-center gap-1.5 text-emerald-400">
              <FileIcon size={14} className="text-emerald-400" />
              <span>chart-container.tsx</span>
              <span className="text-[10px] text-zinc-500 font-sans">(shared primitive)</span>
            </div>
            <div className="pl-8 flex items-center gap-1.5 text-zinc-300">
              <FolderIcon size={14} className="text-zinc-600" />
              <span>recharts/</span>
            </div>
            <div className="pl-12 flex items-center gap-1.5 text-emerald-400">
              <FileIcon size={14} className="text-emerald-400" />
              <span>line-basic.tsx</span>
              <span className="text-[10px] text-zinc-500 font-sans">(chart source)</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-1">
        Target aliases resolve directly from your <code className="text-zinc-200 font-mono">components.json</code> configuration. Source files are written directly into your designated directory, never into an inaccessible node_modules package.
      </p>
    </div>
  )
}

// ============================================================================
// 6B. REGISTRY PATH MAPPING (Alias resolution)
// ============================================================================

export function RegistryPathMapping() {
  const [activeTab, setActiveTab] = useState<"all" | "chart" | "primitive">("all")

  const mappings = [
    {
      id: "chart",
      label: "01 · Chart Component",
      aliasKey: "aliases.charts",
      aliasTarget: "@/components/charts",
      source: {
        eyebrow: "REGISTRY MANIFEST SOURCE",
        path: "registry/recharts/line-basic.tsx",
        badge: "Manifest Payload",
        description: "Pure React + SVG chart implementation declared in registry manifest.",
        metadata: "plotcn.vercel.app/r/line-basic.json",
      },
      target: {
        eyebrow: "CONSUMER PROJECT TARGET",
        path: "components/charts/recharts/line-basic.tsx",
        badge: "Direct Local Source",
        description: "Editable source file inside your application. Completely customizable.",
        metadata: "@/components/charts/recharts/line-basic.tsx",
      },
    },
    {
      id: "primitive",
      label: "02 · Shared Primitive",
      aliasKey: "aliases.ui / shared",
      aliasTarget: "@/components/charts/shared",
      source: {
        eyebrow: "REGISTRY MANIFEST SOURCE",
        path: "registry/base/chart-container.tsx",
        badge: "Primitive Payload",
        description: "Responsive ResizeObserver container & CSS bridge declared as registry dependency.",
        metadata: "plotcn.vercel.app/r/chart-container.json",
      },
      target: {
        eyebrow: "CONSUMER PROJECT TARGET",
        path: "components/charts/shared/chart-container.tsx",
        badge: "Shared Local Code",
        description: "Shared primitive reused across all installed Plotcn charts with zero duplicate code.",
        metadata: "@/components/charts/shared/chart-container.tsx",
      },
    },
  ]

  const visibleMappings = activeTab === "all" ? mappings : mappings.filter((m) => m.id === activeTab)

  return (
    <FlowDiagram
      title="File Destination & Alias Path Mapping"
      eyebrow="Path Resolution"
      description="The shadcn CLI maps registry manifest source paths to your local project structure based on your components.json aliases."
      ariaLabel="Registry path mapping diagram"
    >
      <div className="space-y-6">
        {/* Filter / Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900/80 border border-white/[0.06] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                activeTab === "all"
                  ? "bg-zinc-800 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Mappings (2)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chart")}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                activeTab === "chart"
                  ? "bg-zinc-800 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Chart Source
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("primitive")}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                activeTab === "primitive"
                  ? "bg-zinc-800 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Shared Primitive
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
            <span>Resolves via</span>
            <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/[0.06]">
              components.json
            </code>
          </div>
        </div>

        {/* Pairwise Path Mapping Cards */}
        <div className="space-y-5">
          {visibleMappings.map((mapping) => (
            <div
              key={mapping.id}
              className="rounded-xl border border-white/[0.08] bg-zinc-900/30 p-4 sm:p-5 space-y-3.5"
            >
              {/* Pair Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.04] pb-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  {mapping.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <span>{mapping.aliasKey}</span>
                  <span className="text-zinc-500">→</span>
                  <span>{mapping.aliasTarget}</span>
                </span>
              </div>

              {/* Source Node (Remote) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
                  <span>{mapping.source.eyebrow}</span>
                  <span className="hidden sm:inline">{mapping.source.metadata}</span>
                </div>
                <FlowNode
                  variant="file"
                  icon={File01Icon}
                  title={mapping.source.path}
                  description={mapping.source.description}
                  badge={mapping.source.badge}
                />
              </div>

              {/* Connector Bridge */}
              <div className="relative py-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-zinc-800" />
                </div>
                <div className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 border border-white/[0.08] text-[10px] font-mono text-zinc-400 shadow-xs">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={11} className="text-emerald-400 rotate-90" />
                  <span>CLI alias rewrite:</span>
                  <span className="text-emerald-400 font-semibold">{mapping.aliasTarget}</span>
                </div>
              </div>

              {/* Target Node (Local Codebase) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
                  <span className="text-emerald-400 font-semibold">{mapping.target.eyebrow}</span>
                  <span className="hidden sm:inline">{mapping.target.metadata}</span>
                </div>
                <FlowNode
                  variant="output"
                  icon={File01Icon}
                  title={mapping.target.path}
                  description={mapping.target.description}
                  badge={mapping.target.badge}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Informational Footer Bar */}
        <div className="p-3.5 rounded-lg border border-white/[0.06] bg-zinc-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-zinc-400 font-sans">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Folder01Icon} size={15} className="text-emerald-400 shrink-0" />
            <span>Files are written directly into your designated workspace, not into an opaque runtime package.</span>
          </div>
          <Link
            href="/docs/shadcn"
            className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] whitespace-nowrap underline underline-offset-4"
          >
            Configure aliases in components.json →
          </Link>
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 7. DEPENDENCY GRAPH (Dependencies vs RegistryDependencies)
// ============================================================================

export function DependencyGraph({ mode }: { mode?: "packages" | "registry" }) {
  const isRegistry = mode === "registry"

  return (
    <FlowDiagram
      title={isRegistry ? "Shared Primitive Reuse Architecture" : "Modular Engine Dependencies"}
      eyebrow={isRegistry ? "Registry Dependencies" : "Package Dependencies"}
      description={
        isRegistry
          ? "How multiple charts share chart-container without duplicated files or deep dependency chains."
          : "Strict engine isolation: each chart declares only the minimal npm packages required for its runtime."
      }
      ariaLabel={isRegistry ? "Registry dependencies diagram" : "Package dependencies diagram"}
    >
      {isRegistry ? (
        <div className="space-y-4">
          {/* Top: Two installed charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FlowNode
              variant="registry"
              icon={Package01Icon}
              eyebrow="CHART 01"
              title="@plotcn/line-basic"
              description="Cartesian line chart requiring responsive container & theme observer."
              badge="Recharts"
              metadata="registryDependencies: ['chart-container']"
            />
            <FlowNode
              variant="registry"
              icon={Package01Icon}
              eyebrow="CHART 02"
              title="@plotcn/d3-force-network"
              description="D3 force layout simulation requiring same responsive viewport bridge."
              badge="D3.js"
              metadata="registryDependencies: ['chart-container']"
            />
          </div>

          <FlowConnector direction="down" label="both declare single shared primitive" />

          {/* Bottom: Resolved once */}
          <FlowNode
            variant="file"
            icon={File01Icon}
            eyebrow="SHARED SOURCE PRIMITIVE"
            title="components/charts/shared/chart-container.tsx"
            description="Materialized once in your local codebase. No duplicate files, no monolithic node_modules runtime wrapper."
            badge="Resolved Once"
            metadata="Direct Local Source · Shared Viewport"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <FlowNode
            variant="package"
            icon={ChartBarLineIcon}
            eyebrow="RECHARTS CHARTS"
            title="Single Package"
            description="Declares only 'recharts'. Never imports D3 selection or Google CDN scripts."
            badge="recharts ^2.15"
            metadata="1 npm dependency"
          />
          <FlowNode
            variant="package"
            icon={Layers01Icon}
            eyebrow="D3.JS CHARTS"
            title="Granular Micro-Modules"
            description="Only imports 'd3-shape', 'd3-scale', or 'd3-force'. Avoids 500KB+ monolithic d3 package."
            badge="d3-* micro-pkgs"
            metadata="2-3 focused modules"
          />
          <FlowNode
            variant="package"
            icon={Globe02Icon}
            eyebrow="GOOGLE CHARTS"
            title="Zero npm Packages"
            description="Google loader script loaded asynchronously on-demand from secure Google CDN. Zero npm bundle bloat."
            badge="0 npm packages"
            metadata="Dynamic client loader"
          />
        </div>
      )}
    </FlowDiagram>
  )
}

// ============================================================================
// 8. ENGINE ISOLATION DIAGRAM
// ============================================================================

export function EngineIsolationDiagram() {
  return (
    <FlowDiagram
      title="Strict Engine Boundary Enforcement"
      eyebrow="Engine Isolation"
      description="Plotcn components never leak dependencies across engines. Each visualization stack remains completely independent."
      ariaLabel="Engine isolation architecture diagram"
    >
      <div className="space-y-4">
        {/* Three Isolated Engines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <FlowNode
            variant="runtime"
            icon={ChartBarLineIcon}
            eyebrow="ISOLATED STACK 01"
            title="Recharts Stack"
            description="Pure React SVG. Only imports recharts. Never touches D3 DOM or Google CDN."
            badge="SVG / React"
            metadata="recharts only"
          />
          <FlowNode
            variant="runtime"
            icon={Layers01Icon}
            eyebrow="ISOLATED STACK 02"
            title="D3.js Stack"
            description="Mathematical calculations. Only uses modular d3-* micro-packages. Zero Recharts dependencies."
            badge="Math / SVG"
            metadata="d3-* only"
          />
          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="ISOLATED STACK 03"
            title="Google Charts"
            description="Client-side dynamic loader. Fully encapsulated, zero Recharts or D3 dependencies."
            badge="CDN Loader"
            metadata="0 npm bloat"
          />
        </div>

        <FlowConnector direction="down" label="unified through engine-agnostic contracts" />

        {/* Shared Foundation */}
        <FlowZone
          title="Engine-Agnostic Plotcn Foundation"
          eyebrow="SHARED ARCHITECTURE"
          icon={Layers01Icon}
          badge="Zero Engine Coupling"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FlowNode
              variant="file"
              icon={File01Icon}
              eyebrow="SHARED PRIMITIVE"
              title="chart-container.tsx"
              description="Provides ResizeObserver viewport dimensions and CSS variable bridge to all 3 engines."
              metadata="Native React DOM"
            />
            <FlowNode
              variant="theme"
              icon={SourceCodeIcon}
              eyebrow="SHARED TOKENS"
              title="CSS Variables (--chart-1..5)"
              description="Consistent semantic color variables and typography inherited from Tailwind CSS."
              metadata="hsl(var(--chart-*))"
            />
          </div>
        </FlowZone>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 9. REGISTRY INSTALL LIFECYCLE
// ============================================================================

export function RegistryInstallLifecycle() {
  const steps = [
    {
      step: 1,
      title: "Parse Item Address",
      description: "CLI parses '@plotcn/line-basic' into namespace '@plotcn' and name 'line-basic'.",
      icon: Search01Icon,
      status: "completed" as const,
      tag: "CLI PARSER",
    },
    {
      step: 2,
      title: "Resolve Registry Endpoint",
      description: "Matches @plotcn in components.json to generate URL: https://plotcn.vercel.app/r/line-basic.json.",
      icon: CloudIcon,
      status: "completed" as const,
      tag: "CONFIG",
    },
    {
      step: 3,
      title: "Fetch JSON Manifest",
      description: "Downloads verified component manifest payload over secure HTTPS.",
      icon: Download01Icon,
      status: "completed" as const,
      tag: "NETWORK",
    },
    {
      step: 4,
      title: "Resolve registryDependencies",
      description: "Recursively downloads shared primitives (e.g. chart-container) to assemble full file list.",
      icon: Layers01Icon,
      status: "completed" as const,
      tag: "PRIMITIVES",
    },
    {
      step: 5,
      title: "Audit Package Dependencies",
      description: "Compares manifest 'dependencies' against local package.json to identify missing packages.",
      icon: Package01Icon,
      status: "active" as const,
      tag: "AUDIT",
    },
    {
      step: 6,
      title: "Map Target Paths",
      description: "Resolves destination directory paths using configured aliases (@/components/charts/...).",
      icon: Folder01Icon,
      status: "active" as const,
      tag: "FILESYSTEM",
    },
    {
      step: 7,
      title: "Materialize Source Files",
      description: "Writes pure TypeScript files directly to your repo and rewrites import statements.",
      icon: SourceCodeIcon,
      status: "active" as const,
      tag: "LOCAL WRITE",
    },
    {
      step: 8,
      title: "Install npm Packages",
      description: "Executes detected package manager (pnpm, npm, yarn, bun) to install missing engine dependencies.",
      icon: ComputerTerminal01Icon,
      status: "completed" as const,
      tag: "PACKAGE MGR",
    },
  ]

  return (
    <FlowDiagram
      title="Deterministic 8-Step CLI Installation Sequence"
      eyebrow="Installation Lifecycle"
      description="The deterministic, step-by-step execution path executed by the shadcn CLI when installing a Plotcn chart."
      ariaLabel="Registry installation lifecycle diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}

// ============================================================================
// 9B. REGISTRY MODIFICATION SUMMARY
// ============================================================================

export function RegistryModificationSummary() {
  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <span className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <HugeiconsIcon icon={ComputerTerminal01Icon} size={14} className="text-emerald-400" />
          Project Modification Summary (@plotcn/line-basic)
        </span>
        <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
          Clean Materialization
        </span>
      </div>

      <div className="space-y-2 pt-1">
        {/* File 1 */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-zinc-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 shrink-0">
              NEW FILE
            </span>
            <HugeiconsIcon icon={File01Icon} size={14} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-200 font-medium truncate">
              components/charts/recharts/line-basic.tsx
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 shrink-0 font-mono">142 lines</span>
        </div>

        {/* File 2 */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-zinc-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 shrink-0">
              NEW FILE
            </span>
            <HugeiconsIcon icon={File01Icon} size={14} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-200 font-medium truncate">
              components/charts/shared/chart-container.tsx
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 shrink-0 font-mono">88 lines</span>
        </div>

        {/* Package */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-blue-500/20 bg-blue-950/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-semibold text-blue-400 px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/50 shrink-0">
              PACKAGE
            </span>
            <HugeiconsIcon icon={Package01Icon} size={14} className="text-blue-400 shrink-0" />
            <span className="text-zinc-200 font-medium truncate">
              recharts <span className="text-zinc-500">^2.15.0 added to package.json</span>
            </span>
          </div>
          <span className="text-[10px] text-blue-400 shrink-0 font-mono">npm dependency</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px] text-zinc-400 font-sans">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <HugeiconsIcon icon={CheckIcon} size={12} strokeWidth={2} />
            2 files written
          </span>
          <span className="flex items-center gap-1 text-blue-400 font-mono text-[10px]">
            <HugeiconsIcon icon={CheckIcon} size={12} strokeWidth={2} />
            1 package installed
          </span>
          <span className="flex items-center gap-1 text-zinc-400 font-mono text-[10px]">
            <HugeiconsIcon icon={CheckIcon} size={12} strokeWidth={2} />
            0 telemetry scripts
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">Zero runtime overhead</span>
      </div>
    </div>
  )
}

// ============================================================================
// 9C. SOURCE OWNERSHIP FLOW
// ============================================================================

export function SourceOwnershipFlow() {
  return (
    <FlowDiagram
      title="The Source Ownership Model"
      eyebrow="Ownership Transition"
      description="Components move from the remote registry into your Git repository as native source code with 100% developer control."
      ariaLabel="Source ownership transition diagram"
    >
      <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
        {/* Left: Registry Distribution */}
        <div className="sm:col-span-5">
          <FlowNode
            variant="registry"
            icon={CloudIcon}
            eyebrow="DISTRIBUTION SPECIFICATION"
            title="Plotcn Registry Catalog"
            description="Remote catalog delivering static JSON manifests and clean TypeScript source over HTTPS."
            badge="Distribution Only"
            metadata="plotcn.vercel.app/r"
          />
        </div>

        {/* Center Connector */}
        <div className="sm:col-span-1 flex justify-center py-2 sm:py-0">
          <FlowConnector direction="responsive" label="shadcn add" />
        </div>

        {/* Right: Local Codebase */}
        <div className="sm:col-span-5">
          <FlowNode
            variant="output"
            icon={Folder01Icon}
            eyebrow="YOUR APPLICATION REPOSITORY"
            title="Your Codebase (Full Ownership)"
            description="Native React files in components/charts/. Commit to Git, edit styles, customize SVG, zero vendor lock-in."
            badge="100% Owned"
            metadata="Git Versioned · No Telemetry"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 9D. UPDATE PHILOSOPHY FLOW (Intentional Adoption)
// ============================================================================

export function UpdatePhilosophyFlow() {
  const steps = [
    {
      step: 1,
      title: "01. Install",
      description: "CLI downloads verified TypeScript source directly into components/charts/.",
      icon: Download01Icon,
      status: "completed" as const,
      tag: "CLI ADD",
    },
    {
      step: 2,
      title: "02. Own",
      description: "Source becomes part of your Git repository. Zero external runtime dependencies or callbacks.",
      icon: Shield01Icon,
      status: "completed" as const,
      tag: "GIT TRACKED",
    },
    {
      step: 3,
      title: "03. Modify",
      description: "Freely change SVG layout, theme tokens, animations, or data interfaces to fit your product.",
      icon: SourceCodeIcon,
      status: "active" as const,
      tag: "FULL FREEDOM",
    },
    {
      step: 4,
      title: "04. Review Upstream",
      description: "Use shadcn view to compare upstream improvements, diff changes, and cherry-pick enhancements.",
      icon: GitBranchIcon,
      status: "completed" as const,
      tag: "INTENTIONAL ADOPTION",
    },
  ]

  return (
    <FlowDiagram
      title="The Update Philosophy: Intentional Adoption"
      eyebrow="Lifecycle Model"
      description="Plotcn never silently overwrites your production code. You intentionally inspect and adopt upstream improvements."
      ariaLabel="Update philosophy intentional adoption flow diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}

// ============================================================================
// 10. REGISTRY CONTRIBUTOR FLOW (Local Development)
// ============================================================================

export function RegistryContributorFlow() {
  const steps = [
    {
      step: 1,
      title: "Author Source Component",
      description: "Develop chart inside registry/recharts/ or registry/d3/ with strict TypeScript and accessibility attributes.",
      icon: SourceCodeIcon,
      status: "completed" as const,
      tag: "SOURCE AUTHORING",
    },
    {
      step: 2,
      title: "Compile Static Manifests",
      description: "Execute pnpm build:registry to extract metadata, audit dependencies, and output public/r/*.json.",
      icon: Package01Icon,
      status: "completed" as const,
      tag: "BUILD COMPILER",
    },
    {
      step: 3,
      title: "Serve Locally",
      description: "Run pnpm dev to expose local registry endpoint at http://localhost:3000/r for testing.",
      icon: CloudIcon,
      status: "active" as const,
      tag: "LOCAL SERVER",
    },
    {
      step: 4,
      title: "Fresh App Verification",
      description: "Run shadcn add http://localhost:3000/r/line-basic.json in clean consumer project to verify install & compilation.",
      icon: CheckmarkCircle02Icon,
      status: "completed" as const,
      tag: "CONSUMER QA",
    },
  ]

  return (
    <FlowDiagram
      title="Local Contributor & Registry Testing Pipeline"
      eyebrow="Local Development"
      description="How contributors and teams author, build, serve, and test Plotcn registry items locally before release."
      ariaLabel="Registry contributor workflow diagram"
    >
      <FlowTimeline steps={steps} />
    </FlowDiagram>
  )
}

// ============================================================================
// 10B. REGISTRY PUBLISHING FLOW
// ============================================================================

export function RegistryPublishingFlow() {
  return (
    <FlowDiagram
      title="Registry Build & Publishing Architecture"
      eyebrow="Publishing Pipeline"
      description="How raw chart source code in the monorepo compiles into static JSON artifacts deployed to the global CDN."
      ariaLabel="Registry build and publishing pipeline diagram"
    >
      <div className="space-y-4">
        {/* Phase 1: Source Files */}
        <FlowZone
          title="Monorepo Source Code"
          eyebrow="PHASE 01: AUTHORING"
          icon={Folder01Icon}
          badge="registry/"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FlowNode
              variant="file"
              icon={File01Icon}
              eyebrow="SHARED PRIMITIVES"
              title="registry/base/"
              description="ChartContainer, state boundaries, theme bridges, and accessibility helpers."
            />
            <FlowNode
              variant="file"
              icon={ChartBarLineIcon}
              eyebrow="RECHARTS CHARTS"
              title="registry/recharts/"
              description="Cartesian line, bar, area, radar, and radial components."
            />
            <FlowNode
              variant="file"
              icon={Layers01Icon}
              eyebrow="D3 & GOOGLE"
              title="registry/d3/ & google/"
              description="Force simulations, tree hierarchies, and Google GeoChart wrappers."
            />
          </div>
        </FlowZone>

        <FlowConnector direction="down" label="pnpm build:registry compile pipeline" />

        {/* Phase 2: Compiler & Validation */}
        <FlowNode
          variant="command"
          icon={ComputerTerminal01Icon}
          eyebrow="PHASE 02: AUTOMATED CI BUILD"
          title="Static Manifest Compiler & Quality Gates"
          description="Extracts source files, parses AST dependencies, enforces shadcn JSON schema, and runs strict TypeScript check."
          badge="CI / Build Step"
          metadata="Zero Schema Violations · AST Verified"
        />

        <FlowConnector direction="down" label="deploys static JSON payloads" />

        {/* Phase 3: Static CDN Output */}
        <FlowZone
          title="Global CDN Distribution"
          eyebrow="PHASE 03: STATIC HOSTING"
          icon={CloudIcon}
          badge="plotcn.vercel.app/r"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FlowNode
              variant="registry"
              icon={File01Icon}
              eyebrow="INDEX CATALOG"
              title="public/r/registry.json"
              description="Searchable catalog index of all available visualization components and tags."
              badge="Catalog Index"
            />
            <FlowNode
              variant="output"
              icon={Package01Icon}
              eyebrow="ITEM MANIFESTS"
              title="public/r/*.json"
              description="Self-contained JSON manifests resolved and downloaded by shadcn add commands."
              badge="Item Payloads"
            />
          </div>
        </FlowZone>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 11. REGISTRY TROUBLESHOOTING
// ============================================================================

export function RegistryTroubleshooting() {
  const issues = [
    {
      title: "Unknown Registry Namespace",
      cause: "components.json does not register the @plotcn namespace.",
      fix: "Add \"@plotcn\": \"https://plotcn.vercel.app/r/{name}.json\" under \"registries\" in components.json.",
    },
    {
      title: "Item Not Found (404)",
      cause: "The component name is misspelled or not yet published to the registry catalog.",
      fix: "Run `shadcn list @plotcn` or verify the component name in docs.",
    },
    {
      title: "Missing Package Dependency",
      cause: "The component imports an npm package (e.g. recharts) not declared in item dependencies.",
      fix: "Install the missing dependency manually or report it as a Plotcn registry manifest bug.",
    },
    {
      title: "Broken Registry Dependency",
      cause: "A shared primitive (e.g. chart-container) failed to resolve or download.",
      fix: "Run `shadcn add @plotcn/chart-container` explicitly to restore the missing shared file.",
    },
    {
      title: "TypeScript Alias Resolution Error",
      cause: "Target component was copied into components/charts/ but tsconfig.json lacks @/* mapping.",
      fix: "Configure \"@/*\": [\"./*\"] in compilerOptions.paths in tsconfig.json.",
    },
    {
      title: "Cross-Engine Package Leakage",
      cause: "Installing a Recharts component unexpectedly pulls D3 packages.",
      fix: "Ensure the component registry manifest does not declare unneeded packages. Report as a bug.",
    },
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {issues.map((i) => (
        <div
          key={i.title}
          className="rounded-xl border border-white/[0.08] bg-zinc-950 p-4 space-y-2.5 hover:border-white/[0.14] transition-colors"
        >
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangleIcon size={16} />
            <h4 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-wider">
              {i.title}
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            <span className="text-zinc-500 font-mono text-[11px] mr-1">CAUSE:</span>
            {i.cause}
          </p>
          <div className="rounded-lg border border-white/[0.06] bg-zinc-900/60 p-2.5 text-xs text-zinc-300 font-mono text-[11px]">
            <span className="text-emerald-400 font-semibold mr-1">FIX:</span>
            <span className="font-sans">{i.fix}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 12. REGISTRY VERIFICATION MATRIX
// ============================================================================

export function RegistryVerificationMatrix() {
  const criteria = [
    { category: "Manifest Schema", desc: "JSON adheres to official shadcn schema with valid types and URLs." },
    { category: "Clean Install", desc: "Installs in a brand new project without manual file movement." },
    { category: "Typecheck", desc: "TypeScript compiles with zero errors on strict mode." },
    { category: "Engine Isolation", desc: "Does not install or import unrelated visualization engines." },
    { category: "Theme Coherence", desc: "Reads --chart-1 through --chart-5 CSS variables correctly in dark/light mode." },
    { category: "Accessibility", desc: "Includes ARIA roles, descriptive summaries, and keyboard focus states." },
  ]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-sm space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs uppercase tracking-wider text-zinc-200 font-semibold">
          Plotcn Registry Quality & Validation Standards
        </h4>
        <span className="text-[11px] text-emerald-400">Quality Invariants</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans">
        {criteria.map((c) => (
          <div key={c.category} className="rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 space-y-1">
            <div className="font-mono text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <CheckmarkCircleIcon size={13} className="text-emerald-400 shrink-0" />
              <span>{c.category}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
