"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useInstallation } from "./installation/installation-context"
import {
  frameworks,
  packageManagerTokens,
  getExecPrefix,
} from "./installation/installation-config"
import { FrameworkIcon } from "./installation/framework-icons"
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
  ArrowRight01Icon,
  Alert02Icon,
  ComputerTerminal01Icon,
  Package01Icon,
  ServerIcon,
  LaptopIcon,
  SourceCodeIcon,
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
function ArrowRightIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={ArrowRight01Icon} size={size} strokeWidth={1.8} className={className} />
}
function AlertTriangleIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Alert02Icon} size={size} strokeWidth={1.8} className={className} />
}

// ============================================================================
// 1. SHADCN SETUP HERO
// ============================================================================

export function ShadcnSetupHero() {
  return (
    <header className="docs-theme-hero relative mb-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-zinc-950 p-6 sm:p-8">
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
              REGISTRY CONFIGURATION
            </span>
            <span className="text-xs text-zinc-500 font-mono">STEP 03 OF GETTING STARTED</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <LayersIcon size={14} className="text-zinc-500" />
            <span>CLI Source Delivery</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            shadcn/ui Setup
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-300">
            Configure the source pipeline behind Plotcn. Plotcn uses the shadcn Registry model to
            install visualization source directly into your application. This page explains the
            configuration that controls where those files go and how their imports are resolved.
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="text-zinc-500 font-mono text-[11px] mr-1">TOPICS:</span>
          {[
            { label: "components.json" },
            { label: "Registry" },
            { label: "Aliases" },
            { label: "TypeScript" },
            { label: "Source ownership" },
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
// 2. SHADCN SETUP FLOW (Visual Pipeline)
// ============================================================================

export function ShadcnSetupFlow() {
  return (
    <FlowDiagram
      title="Registry Source Delivery Pipeline"
      eyebrow="Delivery Pipeline"
      description="How components.json configuration, the shadcn CLI resolver, and Plotcn remote registries deliver 100% owned source files directly into your workspace."
      ariaLabel="Registry source delivery pipeline diagram"
    >
      <div className="flex flex-col items-center">
        {/* Node 1: components.json */}
        <div className="w-full max-w-md">
          <FlowNode
            variant="file"
            icon={File01Icon}
            eyebrow="HOST MANIFEST"
            title="components.json"
            description="Declares import aliases, CSS paths, RSC mode, and registered namespaces."
            badge="CONFIG"
            metadata="Configuration File · JSON"
          />
        </div>

        <FlowConnector direction="down" label="CLI resolution" />

        {/* Node 2: shadcn CLI */}
        <div className="w-full max-w-md">
          <FlowNode
            variant="command"
            icon={ComputerTerminal01Icon}
            eyebrow="TOOLCHAIN"
            title="shadcn CLI Resolver"
            description="Resolves @plotcn namespace URL, installs required dependencies, and rewrites imports to project aliases."
            badge="RESOLVER"
            badgeVariant="accent"
            status="active"
            metadata="npx shadcn add @plotcn/... · Zero Lock-In"
          />
        </div>

        <FlowConnector direction="down" label="fetches catalog manifest" />

        {/* Node 3: Plotcn Registry */}
        <div className="w-full max-w-md">
          <FlowNode
            variant="registry"
            icon={Package01Icon}
            eyebrow="REMOTE REGISTRY"
            title="Plotcn Registry Endpoint"
            description="Supplies uncompiled TypeScript source files, metadata, and engine dependencies."
            badge="REMOTE"
            metadata="plotcn.vercel.app/r · JSON Catalog"
          />
        </div>

        <FlowConnector direction="down" label="writes source directly" />

        {/* Node 4: Local Application */}
        <div className="w-full max-w-md">
          <FlowNode
            variant="output"
            icon={Folder01Icon}
            eyebrow="DESTINATION PATH"
            title="Your Codebase: components/charts/"
            description="Raw React component files placed in your project. Full inspection, editing, and evolution."
            badge="100% OWNED"
            badgeVariant="success"
            status="completed"
            metadata="Full Code Ownership · TypeScript · 0 Blackbox"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 3. COMPONENTS.JSON EXPLORER (Interactive Signature Visual)
// ============================================================================

type JsonSection = "schema" | "style" | "rsc" | "tsx" | "tailwind" | "aliases" | "registries"

export function ComponentsJsonExplorer() {
  const { framework } = useInstallation()
  const [activeSection, setActiveSection] = useState<JsonSection>("aliases")

  const isRsc = framework === "next" || framework === "tanstack-start"
  const cssPath =
    framework === "vite"
      ? "src/index.css"
      : framework === "astro"
      ? "src/styles/globals.css"
      : framework === "laravel"
      ? "resources/css/app.css"
      : "app/globals.css"

  const sectionDetails: Record<
    JsonSection,
    { title: string; desc: string; plotcnRule: string; note: string }
  > = {
    schema: {
      title: "$schema",
      desc: "Points to the official JSON schema specification hosted on ui.shadcn.com for schema validation and IDE autocomplete.",
      plotcnRule: "Ensures your components.json adheres to the current shadcn specification without custom hacks.",
      note: "Standard: https://ui.shadcn.com/schema.json",
    },
    style: {
      title: "style",
      desc: "Defines the base shadcn component style design token ('base-nova' or 'default').",
      plotcnRule: "Plotcn adapts to whatever style your project uses. We do NOT force a specific shadcn style or border-radius.",
      note: "Important: Style cannot be modified after initial initialization without breaking shadcn primitives.",
    },
    rsc: {
      title: "rsc",
      desc: "Controls React Server Component behavior during component generation.",
      plotcnRule: isRsc
        ? "Enabled: Plotcn adds 'use client' directives specifically to interactive leaf components, keeping utilities and layout server-safe."
        : "Disabled (SPA/Client): Generates clean client code without redundant 'use client' directives.",
      note: `Current preset: ${isRsc ? "true (Server-first)" : "false (Client-only / SPA)"}`,
    },
    tsx: {
      title: "tsx",
      desc: "Instructs the CLI to output TypeScript (.tsx / .ts) rather than plain JavaScript (.jsx).",
      plotcnRule: "Plotcn is designed TypeScript-first. Strict data typing and prop validation ensure correct chart coordinates and avoid NaN rendering crashes.",
      note: "Strongly recommended: true",
    },
    tailwind: {
      title: "tailwind",
      desc: "Configures Tailwind CSS integration, pointing to your active CSS file and enabling CSS variables.",
      plotcnRule: "Plotcn reads --chart-1 through --chart-5 directly from this CSS file. cssVariables must be true for automatic dark/light theme switching.",
      note: `Points to: ${cssPath}`,
    },
    aliases: {
      title: "aliases",
      desc: "Maps logical import aliases (@/components, @/components/ui, @/lib/utils) to real folders.",
      plotcnRule: "The CLI uses these to write files directly into components/charts and rewrite imports to use your project's aliases instead of fragile relative paths.",
      note: "Must resolve in your tsconfig.json compilerOptions.paths.",
    },
    registries: {
      title: "registries",
      desc: "Configures external namespaced registries, allowing direct component installation using namespace prefixes.",
      plotcnRule: "Maps the @plotcn namespace so `shadcn add @plotcn/line-basic` fetches visualization schemas from Plotcn's registry endpoint.",
      note: `Configured namespace: ${plotcnRegistry.namespace}`,
    },
  }

  const active = sectionDetails[activeSection]

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Interactive components.json Inspector
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Click any section below to understand how it affects Plotcn installation and runtime behavior.
          </p>
        </div>
        <span className="self-start sm:self-auto rounded bg-white/[0.06] px-2 py-1 text-[11px] font-mono text-zinc-400">
          Clickable Property Map
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Code Preview with Clickable Rows */}
        <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
          <div className="text-zinc-500 mb-1 font-mono text-[10px] select-none">{"// components.json"}</div>
          <div className="text-zinc-400">{`{`}</div>

          {/* Section: $schema */}
          <div
            onClick={() => setActiveSection("schema")}
            className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
              activeSection === "schema"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <span className="text-zinc-500">  &quot;$schema&quot;:</span> &quot;https://ui.shadcn.com/schema.json&quot;,
          </div>

          {/* Section: style */}
          <div
            onClick={() => setActiveSection("style")}
            className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
              activeSection === "style"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <span className="text-zinc-500">  &quot;style&quot;:</span> &quot;base-nova&quot;,
          </div>

          {/* Section: rsc */}
          <div
            onClick={() => setActiveSection("rsc")}
            className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
              activeSection === "rsc"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <span className="text-zinc-500">  &quot;rsc&quot;:</span> <span className="text-amber-400">{isRsc ? "true" : "false"}</span>,
          </div>

          {/* Section: tsx */}
          <div
            onClick={() => setActiveSection("tsx")}
            className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
              activeSection === "tsx"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <span className="text-zinc-500">  &quot;tsx&quot;:</span> <span className="text-amber-400">true</span>,
          </div>

          {/* Section: tailwind */}
          <div
            onClick={() => setActiveSection("tailwind")}
            className={`cursor-pointer rounded px-2 py-1 transition-colors ${
              activeSection === "tailwind"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <div className="text-zinc-500">  &quot;tailwind&quot;: {`{`}</div>
            <div className="pl-4">
              <span className="text-zinc-500">&quot;css&quot;:</span> &quot;{cssPath}&quot;,
            </div>
            <div className="pl-4">
              <span className="text-zinc-500">&quot;cssVariables&quot;:</span> <span className="text-amber-400">true</span>
            </div>
            <div className="text-zinc-500">  {`}`},</div>
          </div>

          {/* Section: aliases */}
          <div
            onClick={() => setActiveSection("aliases")}
            className={`cursor-pointer rounded px-2 py-1 transition-colors ${
              activeSection === "aliases"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <div className="text-zinc-500">  &quot;aliases&quot;: {`{`}</div>
            <div className="pl-4"><span className="text-zinc-500">&quot;components&quot;:</span> &quot;@/components&quot;,</div>
            <div className="pl-4"><span className="text-zinc-500">&quot;utils&quot;:</span> &quot;@/lib/utils&quot;,</div>
            <div className="pl-4"><span className="text-zinc-500">&quot;ui&quot;:</span> &quot;@/components/ui&quot;,</div>
            <div className="pl-4"><span className="text-zinc-500">&quot;lib&quot;:</span> &quot;@/lib&quot;,</div>
            <div className="pl-4"><span className="text-zinc-500">&quot;hooks&quot;:</span> &quot;@/hooks&quot;</div>
            <div className="text-zinc-500">  {`}`},</div>
          </div>

          {/* Section: registries */}
          <div
            onClick={() => setActiveSection("registries")}
            className={`cursor-pointer rounded px-2 py-1 transition-colors ${
              activeSection === "registries"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                : "hover:bg-zinc-800/60 text-zinc-300"
            }`}
          >
            <div className="text-zinc-500">  &quot;registries&quot;: {`{`}</div>
            <div className="pl-4">
              <span className="text-emerald-400">&quot;{plotcnRegistry.namespace}&quot;:</span> &quot;{plotcnRegistry.url}&quot;
            </div>
            <div className="text-zinc-500">  {`}`}</div>
          </div>

          <div className="text-zinc-400">{`}`}</div>
        </div>

        {/* Right Column: Dynamic Explanation Panel */}
        <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <code className="text-xs font-semibold text-white font-mono">{active.title}</code>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Property Details</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-zinc-300 leading-relaxed">{active.desc}</p>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3 space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Role in Plotcn
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans">{active.plotcnRule}</p>
              </div>
            </div>
          </div>

          <div className="rounded bg-zinc-950/80 p-2 text-[11px] font-mono text-zinc-400 border border-white/[0.04]">
            {active.note}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. ALIAS MAP (Visual directory mapping)
// ============================================================================

export function AliasMap() {
  const aliases = [
    {
      alias: "@/components",
      target: "components/",
      desc: "Base destination for all installed visualization files",
      tag: "Base Components",
      badgeVariant: "accent" as const,
    },
    {
      alias: "@/components/ui",
      target: "components/ui/",
      desc: "Shared shadcn primitives (Button, Tooltip, Card, Dialog)",
      tag: "UI Primitives",
      badgeVariant: "default" as const,
    },
    {
      alias: "@/lib/utils",
      target: "lib/utils.ts",
      desc: "Exports the cn() class merger for conditional Tailwind classes",
      tag: "Class Merger",
      badgeVariant: "default" as const,
    },
    {
      alias: "@/lib",
      target: "lib/",
      desc: "Engine math helpers and theme adapters (e.g. Google Charts options)",
      tag: "Utilities",
      badgeVariant: "default" as const,
    },
  ]

  return (
    <FlowDiagram
      title="Path Alias Destination Hierarchy"
      eyebrow="Alias Resolution"
      description="How the shadcn CLI maps logical import statements in registry components to your local codebase directory structure."
      ariaLabel="Path alias destination diagram"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {aliases.map((item) => (
          <FlowNode
            key={item.alias}
            variant="folder"
            icon={Folder01Icon}
            eyebrow="IMPORT ALIAS"
            title={item.alias}
            description={item.desc}
            badge={item.target}
            badgeVariant={item.badgeVariant}
            metadata={item.tag}
          />
        ))}
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 5. RSC BOUNDARY GUIDE (Server vs Client Technical Diagram)
// ============================================================================

export function RscBoundaryGuide() {
  return (
    <FlowDiagram
      title="React Server Component (RSC) Directives"
      eyebrow="Leaf Isolation"
      description="Plotcn minimizes client bundle footprint by isolating 'use client' directives strictly to interactive chart rendering leaves."
      ariaLabel="RSC directives boundary diagram"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FlowZone
          title="Server-Safe Layer (No directive)"
          eyebrow="SERVER (RSC)"
          icon={ServerIcon}
          badge="SSR ENABLED"
          className="border-emerald-500/20 bg-emerald-950/10"
        >
          <ul className="space-y-2 font-mono text-[11px] text-zinc-300 list-none p-0 m-0">
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>Metadata & title formatting</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>D3 math scales & geometry calculations</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>Dataset slicing & aggregation</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>Static dashboard cards and layout shells</span>
            </li>
          </ul>
        </FlowZone>

        <FlowZone
          title="Client-Only Leaf ('use client')"
          eyebrow="CLIENT (ISOLATED)"
          icon={LaptopIcon}
          badge="INTERACTIVE"
          className="border-amber-500/20 bg-amber-950/10"
        >
          <ul className="space-y-2 font-mono text-[11px] text-zinc-300 list-none p-0 m-0">
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>ResizeObserver dimension measurement</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>Recharts interactive tooltips & legends</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>D3 zoom, drag, and brush interactions</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>Google Charts runtime script execution</span>
            </li>
          </ul>
        </FlowZone>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 6. REGISTRY NAMESPACE FLOW (Signature Visual)
// ============================================================================

export function RegistryNamespaceFlow() {
  const steps = [
    {
      step: "01",
      title: "Command Trigger",
      description: "Developer runs add @plotcn/line-basic in terminal.",
      icon: ComputerTerminal01Icon,
      metadata: "CLI Trigger",
    },
    {
      step: "02",
      title: "Namespace Lookup",
      description: "CLI reads components.json and extracts registries[\"@plotcn\"].",
      icon: File01Icon,
      metadata: "components.json",
    },
    {
      step: "03",
      title: "Item Schema Fetch",
      description: "CLI queries /r/line-basic.json for source files and engine packages.",
      icon: Package01Icon,
      metadata: "line-basic.json",
    },
    {
      step: "04",
      title: "Local Injection",
      description: "Files written directly into components/charts/ with rewritten import aliases.",
      icon: Folder01Icon,
      metadata: "components/charts/*",
    },
  ]

  return (
    <FlowDiagram
      title="Namespace Resolution Workflow"
      eyebrow="Registry Resolution"
      description="How the shadcn CLI maps @plotcn prefixes to remote registries and injects code into your workspace."
      ariaLabel="Namespace resolution workflow diagram"
    >
      <FlowTimeline steps={steps} activeStep="02" />
    </FlowDiagram>
  )
}

// ============================================================================
// 7. COMPONENT INSTALL FLOW (Package-manager aware copyable command)
// ============================================================================

export function ComponentInstallFlow() {
  const { packageManager } = useInstallation()
  const [copied, setCopied] = useState(false)

  const exec = getExecPrefix(packageManager)
  const installCmd = `${exec} shadcn@latest add @plotcn/line-basic`

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pkgTokens = packageManagerTokens[packageManager] || packageManagerTokens.pnpm

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Install with {pkgTokens.name}:
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-mono"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--muted)",
            color: "var(--foreground)",
          }}
        >
          <PackageManagerIcon pkg={packageManager} size={13} />
          {pkgTokens.name}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-zinc-900/80 px-4 py-3">
        <code className="font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto truncate">
          {installCmd}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded border border-white/[0.1] bg-zinc-800/80 px-3 py-1 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors shrink-0"
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

      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
        This command uses your active <code className="text-zinc-200 font-mono">{packageManager}</code> package manager to download the line chart component, install <code className="text-zinc-200 font-mono">recharts</code> if not already installed, and place the component into your <code className="text-zinc-200 font-mono">components/charts/</code> folder.
      </p>
    </div>
  )
}

// ============================================================================
// 8. REGISTRY DIFF (Before & After Visual)
// ============================================================================

export function RegistryDiff() {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
      {/* Before */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <span className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
            Before Installation
          </span>
          <span className="text-[10px] text-zinc-500">Standard shadcn</span>
        </div>
        <div className="space-y-1.5 text-zinc-400">
          <div className="text-zinc-300">components/</div>
          <div className="pl-4">└── ui/</div>
          <div className="pl-8 text-zinc-500">├── button.tsx</div>
          <div className="pl-8 text-zinc-500">├── card.tsx</div>
          <div className="pl-8 text-zinc-500">└── tooltip.tsx</div>
        </div>
      </div>

      {/* After */}
      <div className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <span className="text-emerald-400 text-[11px] uppercase tracking-wider font-semibold">
            After @plotcn Installation
          </span>
          <span className="text-[10px] text-emerald-500/80 font-mono">Source Injected</span>
        </div>
        <div className="space-y-1.5 text-zinc-400">
          <div className="text-zinc-300">components/</div>
          <div className="pl-4">├── ui/</div>
          <div className="pl-4 text-emerald-300 font-semibold">└── charts/</div>
          <div className="pl-8 text-emerald-400">
            ├── <span className="bg-emerald-500/10 px-1 rounded text-emerald-300">+ recharts/line-basic.tsx</span>
          </div>
          <div className="pl-8 text-emerald-400">
            └── shared/
          </div>
          <div className="pl-12 text-emerald-400">
            ├── <span className="bg-emerald-500/10 px-1 rounded text-emerald-300">+ chart-container.tsx</span>
          </div>
          <div className="pl-12 text-emerald-400">
            └── <span className="bg-emerald-500/10 px-1 rounded text-emerald-300">+ chart-theme.ts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. CONFIGURATION TROUBLESHOOTING (Common Mistakes Issue/Fix Grid)
// ============================================================================

export function ConfigurationTroubleshooting() {
  const mistakes = [
    {
      issue: "Alias Mismatch",
      cause: "components.json points to @/components but tsconfig.json lacks paths mappings.",
      impact: "Registry files install, but TypeScript reports 'Cannot find module' errors on imports.",
      fix: "Ensure tsconfig.json compilerOptions.paths contains \"@/*\": [\"./*\"] (or \"./src/*\").",
    },
    {
      issue: "Wrong CSS Path",
      cause: "tailwind.css in components.json points to a non-existent or inactive stylesheet.",
      impact: "Components render without error, but chart tokens (--chart-1 through --chart-5) resolve to blank.",
      fix: "Set tailwind.css to your active Tailwind entrypoint (e.g. app/globals.css or src/index.css).",
    },
    {
      issue: "Incorrect RSC Setting",
      cause: "rsc is set to true in a Vite SPA, or set to false in a Next.js App Router project.",
      impact: "Vite throws build warnings about unknown 'use client' directives; Next.js causes hydration errors.",
      fix: "Set rsc: true for Next.js App Router. Set rsc: false for Vite, React Router, or Astro SPAs.",
    },
    {
      issue: "Overwriting components.json",
      cause: "Running shadcn init from scratch in an already configured, customized codebase.",
      impact: "Overwrites custom color tokens, font configurations, and existing aliases.",
      fix: "Do not recreate components.json. Simply add the @plotcn registry entry under 'registries'.",
    },
    {
      issue: "Monolithic Dependencies",
      cause: "Manually installing Recharts, D3, and Google Charts globally at once.",
      impact: "Unnecessary bundle bloat and peer dependency conflicts.",
      fix: "Let the shadcn CLI install only the engine needed for each specific chart component.",
    },
    {
      issue: "Malformed Registry URL",
      cause: "Missing the required {name} template variable in custom registry URLs.",
      impact: "The CLI fails with 404 or cannot locate component JSON endpoints.",
      fix: "Ensure remote registry URLs end with /{name}.json or follow the provider's specification.",
    },
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {mistakes.map((m) => (
        <div
          key={m.issue}
          className="rounded-xl border border-white/[0.08] bg-zinc-950 p-4 space-y-2.5 hover:border-white/[0.14] transition-colors"
        >
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangleIcon size={16} />
            <h4 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-wider">
              {m.issue}
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            <span className="text-zinc-500 font-mono text-[11px] mr-1">CAUSE:</span>
            {m.cause}
          </p>
          <div className="rounded-lg border border-white/[0.06] bg-zinc-900/60 p-2.5 text-xs text-zinc-300 space-y-1 font-mono text-[11px]">
            <div className="text-emerald-400 font-semibold">FIX:</div>
            <div className="text-zinc-300 font-sans">{m.fix}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 10. REGISTRY SETUP STATUS (Readiness Checklist)
// ============================================================================

export function RegistrySetupStatus() {
  const defaultChecks = [
    { id: "json_exists", label: "components.json exists at the project root", checked: true },
    { id: "aliases_match", label: "aliases map correctly to tsconfig.json paths", checked: true },
    { id: "css_path", label: "tailwind.css points to the active stylesheet with chart variables", checked: true },
    { id: "rsc_matches", label: "rsc configuration matches your host framework", checked: true },
    { id: "tsx_enabled", label: "tsx is enabled for strict TypeScript generation", checked: true },
    { id: "css_vars", label: "cssVariables is set to true for theme tokens", checked: true },
    { id: "namespace_set", label: "registries[\"@plotcn\"] is configured for the CLI", checked: true },
    { id: "source_owned", label: "components/charts/ destination directory is ready", checked: true },
  ]

  const [checks, setChecks] = useState(defaultChecks)

  const toggleCheck = (id: string) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    )
  }

  const passedCount = checks.filter((c) => c.checked).length
  const allPassed = passedCount === checks.length

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            shadcn/ui Configuration Checklist
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Confirm your shadcn and registry settings before installing Plotcn charts.
          </p>
        </div>
        <span
          className={`self-start sm:self-auto font-mono text-xs px-2.5 py-1 rounded-full border ${
            allPassed
              ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
              : "border-zinc-700 bg-zinc-900 text-zinc-300"
          }`}
        >
          {passedCount} of {checks.length} Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {checks.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggleCheck(c.id)}
            className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
              c.checked
                ? "border-white/[0.1] bg-zinc-900/60 text-zinc-200"
                : "border-white/[0.04] bg-zinc-950 text-zinc-500 opacity-60"
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                c.checked
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                  : "border-zinc-700 bg-zinc-900"
              }`}
            >
              {c.checked && <TickIcon size={12} />}
            </div>
            <span className="text-xs font-mono leading-relaxed">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
