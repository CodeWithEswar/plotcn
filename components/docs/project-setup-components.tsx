"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useInstallation } from "./installation/installation-context"
import {
  frameworks,
  packageManagerTokens,
} from "./installation/installation-config"
import { FrameworkIcon } from "./installation/framework-icons"
import { PackageManagerIcon } from "./installation/package-manager-icons"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Folder01Icon,
  File01Icon,
  CheckmarkCircle02Icon,
  CheckIcon,
  Copy01Icon,
  Layers01Icon,
  Shield01Icon,
  Download01Icon,
  ArrowRight01Icon,
  ComputerTerminal01Icon,
  SourceCodeIcon,
  ChartBarLineIcon,
  Globe02Icon,
  ServerIcon,
  LaptopIcon,
  Cursor01Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons"
import {
  FlowDiagram,
  FlowNode,
  FlowConnector,
  FlowZone,
  FlowTimeline,
} from "./flow"

// Backward-compatible Hugeicons wrappers
function FolderIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Folder01Icon} size={size} strokeWidth={1.8} className={className} />
}
function FileIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={File01Icon} size={size} strokeWidth={1.8} className={className} />
}
function CheckmarkCircleIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={CheckmarkCircle02Icon} size={size} strokeWidth={1.8} className={className} />
}
function TickIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={CheckIcon} size={size} strokeWidth={2} className={className} />
}
function CopyIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Copy01Icon} size={size} strokeWidth={1.8} className={className} />
}
function LayersIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Layers01Icon} size={size} strokeWidth={1.8} className={className} />
}
function ShieldIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Shield01Icon} size={size} strokeWidth={1.8} className={className} />
}
function DownloadIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={Download01Icon} size={size} strokeWidth={1.8} className={className} />
}
function ArrowRightIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return <HugeiconsIcon icon={ArrowRight01Icon} size={size} strokeWidth={1.8} className={className} />
}

// ============================================================================
// 1. PROJECT SETUP HERO
// ============================================================================

export function ProjectSetupHero() {
  return (
    <header className="relative mb-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-zinc-950 p-6 sm:p-8">
      {/* Background blueprint grid decoration */}
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
              SETUP BLUEPRINT
            </span>
            <span className="text-xs text-zinc-500 font-mono">STEP 02 OF GETTING STARTED</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <LayersIcon size={14} className="text-zinc-500" />
            <span>Architecture Readiness</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Project Setup
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-300">
            Prepare your codebase for Plotcn. Configure aliases, project structure, theme tokens,
            and shared chart infrastructure before installing visualization components.
          </p>
        </div>

        {/* Requirements Row */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="text-zinc-500 font-mono text-[11px] mr-1">PREREQUISITES:</span>
          {[
            { label: "React 18 / 19", ready: true },
            { label: "TypeScript Strict", ready: true },
            { label: "shadcn/ui Initialized", ready: true },
            { label: "Tailwind CSS v4 / v3", ready: true },
            { label: "components.json", ready: true },
          ].map((req) => (
            <span
              key={req.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1 font-mono text-[11px] text-zinc-300"
            >
              <CheckmarkCircleIcon size={12} className="text-emerald-400 shrink-0" />
              {req.label}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// 2. SETUP CONTEXT HEADER (Framework & Package Manager active state)
// ============================================================================

export function SetupContextHeader() {
  const { framework, packageManager } = useInstallation()
  const activeFw = frameworks.find((f) => f.id === framework) || frameworks[0]
  const pkgTokens = packageManagerTokens[packageManager] || packageManagerTokens.pnpm

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Active Context:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Framework pill */}
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-zinc-900/90 px-2.5 py-1 text-xs font-medium text-zinc-200">
              <FrameworkIcon framework={framework} size={16} />
              <span>{activeFw.name}</span>
            </span>

            {/* Package Manager pill */}
            <span
              className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-medium"
              style={{
                borderColor: pkgTokens.borderColor,
                backgroundColor: pkgTokens.bgTint,
                color: pkgTokens.accentColor,
              }}
            >
              <PackageManagerIcon pkg={packageManager} size={15} />
              <span>{pkgTokens.name}</span>
            </span>

            {/* TypeScript pill */}
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
              <span className="font-mono font-bold text-[11px]">TS</span>
              <span>TypeScript</span>
            </span>
          </div>
        </div>

        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors self-start sm:self-auto"
        >
          <span>Change framework</span>
          <ArrowRightIcon size={12} />
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// 3. PROJECT SETUP OVERVIEW (Semantic Blueprint diagram)
// ============================================================================

export function ProjectSetupOverview() {
  return (
    <FlowDiagram
      title="Codebase Architecture Blueprint"
      eyebrow="Architecture Overview"
      description="How your application directory tree, configuration files, and Plotcn visualization folders connect together."
      ariaLabel="Plotcn codebase architecture blueprint diagram"
    >
      <div className="space-y-3">
        {/* Root: Application */}
        <FlowNode
          variant="primary"
          icon={Folder01Icon}
          eyebrow="WORKSPACE ROOT"
          title="Application Root"
          description="Houses your configuration, route tree, and visualization infrastructure."
          badge="WORKSPACE"
          badgeVariant="accent"
          metadata="Root Directory · TypeScript Project"
        />

        {/* Tree children */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-4 border-l-0 sm:border-l border-zinc-800 my-2">
          {/* Item 1: components.json */}
          <FlowNode
            variant="file"
            icon={File01Icon}
            eyebrow="REGISTRY CONFIG"
            title="components.json"
            description="Maps path aliases, styles, and CLI output destinations for chart installations."
            badge="CONFIG"
            metadata="shadcn CLI Manifest · JSON"
          />

          {/* Item 2: app or src */}
          <FlowNode
            variant="folder"
            icon={Folder01Icon}
            eyebrow="PAGES & ROUTES"
            title="app/ or src/"
            description="Server-rendered pages, routes, and dashboard layouts that consume charts."
            badge="ROUTES"
            metadata="RSC Pages · Layouts · Route Tree"
          />

          {/* Item 3: components/ (ui + charts) */}
          <FlowNode
            variant="folder"
            icon={Folder01Icon}
            eyebrow="COMPONENT TREE"
            title="components/ (ui + charts)"
            description="components/ui for shadcn primitives and components/charts for Plotcn visualizations."
            badge="COMPONENTS"
            badgeVariant="accent"
            status="active"
            metadata="Source Owned Components · TSX"
          />

          {/* Item 4: lib/ */}
          <FlowNode
            variant="folder"
            icon={Folder01Icon}
            eyebrow="UTILITIES"
            title="lib/utils.ts"
            description="Contains cn helper and engine-independent chart calculations and formatters."
            badge="UTILS"
            metadata="Utility Functions · TypeScript"
          />

          {/* Item 5: globals.css */}
          <div className="md:col-span-2">
            <FlowNode
              variant="file"
              icon={File01Icon}
              eyebrow="THEME TOKENS"
              title="globals.css / app.css"
              description="Houses --chart-1 through --chart-5, axis, surface, and grid CSS variables."
              badge="CSS"
              metadata="CSS Variables · Dark / Light Theme Tokens"
            />
          </div>
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 4. FILE TREE COMPONENT (Framework-aware, highlighted Plotcn paths)
// ============================================================================

export function FileTree() {
  const { framework } = useInstallation()

  // Derive file tree structure according to selected framework
  const getTreeData = () => {
    switch (framework) {
      case "vite":
        return {
          root: "my-app/",
          items: [
            { path: "src/components/charts/", type: "dir", plotcn: true, desc: "Plotcn visualizations" },
            { path: "src/components/charts/shared/", type: "dir", plotcn: true, desc: "Engine-independent primitives" },
            { path: "src/components/charts/recharts/", type: "dir", desc: "Recharts implementations" },
            { path: "src/components/charts/d3/", type: "dir", desc: "D3 custom geometry" },
            { path: "src/components/charts/google/", type: "dir", desc: "Google Charts wrappers" },
            { path: "src/components/ui/", type: "dir", desc: "shadcn/ui primitives" },
            { path: "src/lib/utils.ts", type: "file", desc: "cn class merger" },
            { path: "src/lib/charts/", type: "dir", plotcn: true, desc: "Shared math & token adapters" },
            { path: "src/index.css", type: "file", plotcn: true, desc: "Tailwind & --chart-* tokens" },
            { path: "components.json", type: "file", plotcn: true, desc: "shadcn CLI configuration" },
            { path: "vite.config.ts", type: "file", desc: "Vite bundler & alias config" },
            { path: "tsconfig.json", type: "file", desc: "TypeScript paths mapping" },
          ],
        }
      case "astro":
        return {
          root: "my-app/",
          items: [
            { path: "src/components/charts/", type: "dir", plotcn: true, desc: "Plotcn visualizations" },
            { path: "src/components/charts/shared/", type: "dir", plotcn: true, desc: "Engine-independent primitives" },
            { path: "src/components/charts/recharts/", type: "dir", desc: "Recharts implementations" },
            { path: "src/components/charts/d3/", type: "dir", desc: "D3 custom geometry" },
            { path: "src/components/charts/google/", type: "dir", desc: "Google Charts wrappers" },
            { path: "src/components/ui/", type: "dir", desc: "shadcn/ui primitives" },
            { path: "src/lib/utils.ts", type: "file", desc: "cn class merger" },
            { path: "src/styles/globals.css", type: "file", plotcn: true, desc: "Tailwind & --chart-* tokens" },
            { path: "components.json", type: "file", plotcn: true, desc: "shadcn CLI configuration" },
            { path: "astro.config.mjs", type: "file", desc: "Astro React integration" },
            { path: "tsconfig.json", type: "file", desc: "TypeScript paths mapping" },
          ],
        }
      case "laravel":
        return {
          root: "my-app/",
          items: [
            { path: "resources/js/components/charts/", type: "dir", plotcn: true, desc: "Plotcn visualizations" },
            { path: "resources/js/components/charts/shared/", type: "dir", plotcn: true, desc: "Engine-independent primitives" },
            { path: "resources/js/components/ui/", type: "dir", desc: "shadcn/ui primitives" },
            { path: "resources/js/lib/utils.ts", type: "file", desc: "cn class merger" },
            { path: "resources/css/app.css", type: "file", plotcn: true, desc: "Tailwind & --chart-* tokens" },
            { path: "components.json", type: "file", plotcn: true, desc: "shadcn CLI configuration" },
            { path: "vite.config.js", type: "file", desc: "Laravel Vite plugin & alias" },
            { path: "tsconfig.json", type: "file", desc: "TypeScript paths mapping" },
          ],
        }
      case "next":
      default:
        return {
          root: "my-app/",
          items: [
            { path: "app/layout.tsx", type: "file", desc: "Root layout (Server Component)" },
            { path: "app/page.tsx", type: "file", desc: "Dashboard or page route" },
            { path: "app/globals.css", type: "file", plotcn: true, desc: "Tailwind & --chart-* tokens" },
            { path: "components/charts/", type: "dir", plotcn: true, desc: "Plotcn visualizations" },
            { path: "components/charts/shared/", type: "dir", plotcn: true, desc: "Engine-independent primitives" },
            { path: "components/charts/recharts/", type: "dir", desc: "Recharts implementations" },
            { path: "components/charts/d3/", type: "dir", desc: "D3 custom geometry" },
            { path: "components/charts/google/", type: "dir", desc: "Google Charts wrappers" },
            { path: "components/ui/", type: "dir", desc: "shadcn/ui primitives" },
            { path: "lib/utils.ts", type: "file", desc: "cn class merger" },
            { path: "lib/charts/", type: "dir", plotcn: true, desc: "Shared math & token adapters" },
            { path: "components.json", type: "file", plotcn: true, desc: "shadcn CLI configuration" },
            { path: "tsconfig.json", type: "file", desc: "TypeScript paths mapping" },
          ],
        }
    }
  }

  const tree = getTreeData()

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FolderIcon size={15} className="text-zinc-400" />
          <span className="font-mono text-xs font-semibold text-zinc-200">
            {tree.root}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Plotcn paths highlighted
          </span>
        </div>
      </div>

      {/* Directory listing */}
      <div className="p-4 overflow-x-auto">
        <div className="min-w-[540px] font-mono text-xs space-y-1">
          {tree.items.map((item) => {
            const isPlotcn = item.plotcn
            return (
              <div
                key={item.path}
                className={`flex items-center justify-between gap-4 py-1 px-2 rounded transition-colors ${
                  isPlotcn
                    ? "bg-zinc-900/80 border border-zinc-700/50 text-white"
                    : "text-zinc-400 hover:bg-zinc-900/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.type === "dir" ? (
                    <FolderIcon
                      size={14}
                      className={isPlotcn ? "text-emerald-400" : "text-zinc-500"}
                    />
                  ) : (
                    <FileIcon
                      size={14}
                      className={isPlotcn ? "text-amber-400/90" : "text-zinc-500"}
                    />
                  )}
                  <span className={isPlotcn ? "font-semibold text-zinc-100" : "text-zinc-300"}>
                    {item.path}
                  </span>
                </div>

                <span
                  className={`text-[11px] truncate ${
                    isPlotcn ? "text-emerald-400 font-medium" : "text-zinc-500"
                  }`}
                >
                  {item.desc}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. FRAMEWORK-AWARE ALIAS CONFIG
// ============================================================================

export function FrameworkAwareAliasConfig() {
  const { framework } = useInstallation()

  const getAliasSnippets = () => {
    switch (framework) {
      case "vite":
        return {
          title: "tsconfig.json & vite.config.ts",
          ts: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`,
          bundlerTitle: "vite.config.ts",
          bundler: `import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`,
        }
      case "astro":
        return {
          title: "tsconfig.json",
          ts: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}`,
          bundlerTitle: null,
          bundler: null,
        }
      case "laravel":
        return {
          title: "tsconfig.json",
          ts: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["resources/js/*"]
    }
  }
}`,
          bundlerTitle: "vite.config.js",
          bundler: `import { defineConfig } from "vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [
    laravel({ input: "resources/js/app.tsx", refresh: true }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources/js"),
    },
  },
})`,
        }
      case "next":
      default:
        return {
          title: "tsconfig.json",
          ts: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}`,
          bundlerTitle: null,
          bundler: null,
        }
    }
  }

  const snippets = getAliasSnippets()

  return (
    <div className="space-y-4 my-6">
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/60 px-4 py-2.5">
          <span className="font-mono text-xs text-zinc-300 font-semibold">
            {snippets.title}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">JSON</span>
        </div>
        <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
          <code>{snippets.ts}</code>
        </pre>
      </div>

      {snippets.bundler && snippets.bundlerTitle && (
        <div className="rounded-xl border border-white/[0.08] bg-zinc-950 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/60 px-4 py-2.5">
            <span className="font-mono text-xs text-zinc-300 font-semibold">
              {snippets.bundlerTitle}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">TypeScript</span>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
            <code>{snippets.bundler}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 6. FRAMEWORK-AWARE COMPONENTS.JSON
// ============================================================================

export function FrameworkComponentsJson() {
  const { framework } = useInstallation()

  const isRsc = framework === "next" || framework === "tanstack-start"
  const cssPath =
    framework === "vite"
      ? "src/index.css"
      : framework === "astro"
      ? "src/styles/globals.css"
      : framework === "laravel"
      ? "resources/css/app.css"
      : "app/globals.css"

  const componentsJsonContent = JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "base-nova",
      rsc: isRsc,
      tsx: true,
      tailwind: {
        config: "",
        css: cssPath,
        baseColor: "neutral",
        cssVariables: true,
        prefix: "",
      },
      iconLibrary: "hugeicons",
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    },
    null,
    2
  )

  return (
    <div className="my-6 rounded-xl border border-white/[0.08] bg-zinc-950 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-200 font-semibold">
            components.json
          </span>
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
            {isRsc ? "RSC Enabled" : "SPA / Client"}
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">Registry Preset</span>
      </div>
      <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
        <code>{componentsJsonContent}</code>
      </pre>
    </div>
  )
}

// ============================================================================
// 7. CHART DIRECTORY OVERVIEW (Architecture & Isolation)
// ============================================================================

export function ChartDirectoryOverview() {
  const folders = [
    {
      name: "shared/",
      desc: "Engine-independent infrastructure. Only universal concerns belong here: responsive wrappers, loading states, accessibility summaries, and theme adapters.",
      rule: "Must NEVER import recharts, d3-*, or google.visualization.",
      tag: "Engine-Neutral",
      color: "border-emerald-500/30 text-emerald-400",
    },
    {
      name: "recharts/",
      desc: "Components and wrappers built specifically for Recharts SVG primitives (ResponsiveContainer, Line, Bar, Area, CartesianGrid).",
      rule: "No D3 or Google-specific code permitted.",
      tag: "Recharts Only",
      color: "border-blue-500/30 text-blue-400",
    },
    {
      name: "d3/",
      desc: "Custom layouts, scales, force simulations, and mathematical geometry generators. Uses modular micro-imports (d3-shape, d3-scale).",
      rule: "Avoid monolithic `import * as d3 from 'd3'`.",
      tag: "Modular D3",
      color: "border-amber-500/30 text-amber-400",
    },
    {
      name: "google/",
      desc: "Google Charts wrappers, GeoCharts, and external runtime loader scripts. Isolated because Google Charts loads an external CDN runtime script.",
      rule: "Must NEVER execute or read window.google during SSR.",
      tag: "External Runtime",
      color: "border-purple-500/30 text-purple-400",
    },
  ]

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {folders.map((f) => (
        <div
          key={f.name}
          className="rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 hover:border-white/[0.14] transition-all space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderIcon size={16} className="text-zinc-400" />
              <code className="text-sm font-semibold text-white">{f.name}</code>
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${f.color}`}
            >
              {f.tag}
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{f.desc}</p>
          <div className="rounded-lg bg-zinc-900/60 p-2 text-[11px] font-mono text-zinc-400 border border-white/[0.04]">
            <span className="text-zinc-500 font-semibold mr-1">RULE:</span>
            {f.rule}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 8. SHARED CHART ARCHITECTURE (Blueprint Diagram)
// ============================================================================

export function SharedChartArchitecture() {
  return (
    <FlowDiagram
      title="Cross-Engine Shared Architecture"
      eyebrow="Decoupled Systems"
      description="Plotcn separates universal product concerns from engine-specific rendering code, avoiding monolithic prop wrappers."
      ariaLabel="Cross-engine shared architecture diagram"
    >
      <div className="space-y-4">
        {/* Top Layer: Shared Infrastructure Zone */}
        <FlowZone
          title="Plotcn Shared Layer (components/charts/shared/)"
          eyebrow="universal infrastructure"
          icon={Layers01Icon}
          badge="100% Engine-Neutral"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <FlowNode
              variant="secondary"
              icon={Package01Icon}
              eyebrow="SHELL"
              title="ChartContainer"
              description="Responsive aspect ratio and dimensions."
              metadata="Responsive Shell"
            />
            <FlowNode
              variant="secondary"
              icon={File01Icon}
              eyebrow="TOKENS"
              title="Theme Tokens"
              description="CSS variable extraction and color roles."
              metadata="CSS Variables"
            />
            <FlowNode
              variant="secondary"
              icon={CheckmarkCircle02Icon}
              eyebrow="STATES"
              title="ChartState"
              description="Loading skeletons, empty data, and error views."
              metadata="Lifecycle States"
            />
            <FlowNode
              variant="secondary"
              icon={Shield01Icon}
              eyebrow="A11Y"
              title="Accessibility"
              description="ARIA data table and screen-reader summaries."
              metadata="ARIA & AT Fallback"
            />
          </div>
        </FlowZone>

        {/* Direction connector */}
        <FlowConnector direction="down" label="specialized engine implementations" />

        {/* Bottom Layer: Specialized Engines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <FlowNode
            variant="runtime"
            icon={ChartBarLineIcon}
            eyebrow="RECHARTS ENGINE"
            title="@/components/charts/recharts/*"
            description="Declarative React SVG. Cartesian charts, lines, bars, areas, and interactive hover tooltips."
            badge="Declarative SVG"
            metadata="React JSX Primitives"
          />

          <FlowNode
            variant="runtime"
            icon={Layers01Icon}
            eyebrow="D3.JS ENGINE"
            title="@/components/charts/d3/*"
            description="Mathematical coordinate precision. Force networks, hierarchies, radar geometry, and custom scales."
            badge="Custom Math"
            metadata="Geometry Generators"
          />

          <FlowNode
            variant="runtime"
            icon={Globe02Icon}
            eyebrow="GOOGLE CHARTS ENGINE"
            title="@/components/charts/google/*"
            description="External runtime adapter. GeoChart choropleths and mature core charts with dynamic theme translation."
            badge="CDN Runtime"
            metadata="Google Singleton Loader"
          />
        </div>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 9. CLIENT BOUNDARY GUIDE (Server vs Client Diagram)
// ============================================================================

export function ClientBoundaryGuide() {
  return (
    <FlowDiagram
      title="Server & Client Execution Boundary Strategy"
      eyebrow="App Router & SSR Architecture"
      description="Plotcn isolates client execution boundaries strictly to interactive visualization shells, keeping pages and utilities server-safe."
      ariaLabel="Server vs client boundary diagram"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Server Zone */}
        <FlowZone
          title="Server-Safe Domain (Default)"
          eyebrow="SERVER (RSC)"
          icon={ServerIcon}
          badge="NO 'USE CLIENT'"
          className="border-emerald-500/20 bg-emerald-950/10"
        >
          <ul className="space-y-2 font-mono text-[11px] text-zinc-300 list-none p-0 m-0">
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>Doc pages, dashboard layouts, and route handlers</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>Data transformation, normalization & math utilities</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>TypeScript chart interfaces, contracts & Zod schemas</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-400 shrink-0" />
              <span>Static CSS theme token and variable declarations</span>
            </li>
          </ul>
        </FlowZone>

        {/* Client Zone */}
        <FlowZone
          title="Client-Only Domain (Interactive)"
          eyebrow="CLIENT (ISOLATED)"
          icon={LaptopIcon}
          badge="'USE CLIENT'"
          className="border-amber-500/20 bg-amber-950/10"
        >
          <ul className="space-y-2 font-mono text-[11px] text-zinc-300 list-none p-0 m-0">
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>Interactive chart render shells and SVG viewport</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>ResizeObserver & responsive dimension measurement</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>Google Charts runtime loader (window.google client script)</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-amber-400 shrink-0" />
              <span>Hover tooltips, pointer focus, legends, and animations</span>
            </li>
          </ul>
        </FlowZone>
      </div>
    </FlowDiagram>
  )
}

// ============================================================================
// 10. REGISTRY OUTPUT FLOW
// ============================================================================

export function RegistryOutputFlow() {
  const steps = [
    {
      step: "01",
      title: "Plotcn Registry",
      description: "Uncompiled, typed source code hosted in the open registry catalog.",
      icon: Package01Icon,
      metadata: "Remote Catalog",
    },
    {
      step: "02",
      title: "shadcn CLI",
      description: "Reads your components.json aliases and determines local destination paths.",
      icon: ComputerTerminal01Icon,
      metadata: "Path Resolution",
    },
    {
      step: "03",
      title: "Files Injected",
      description: "Components are written directly into your components/charts directory.",
      icon: Folder01Icon,
      metadata: "components/charts/*",
    },
    {
      step: "04",
      title: "Engine Dependencies",
      description: "Only the required library (recharts or d3) is added to package.json.",
      icon: Layers01Icon,
      metadata: "Scoped Packages",
    },
    {
      step: "05",
      title: "100% Owned Code",
      description: "No opaque wrapper. Customize CSS, SVGs, and interactions without limits.",
      icon: SourceCodeIcon,
      metadata: "Complete Ownership",
    },
  ]

  return (
    <FlowDiagram
      title="How Components Enter Your Codebase"
      eyebrow="Distribution Flow"
      description="The end-to-end path from the remote Plotcn catalog directly into your local Git repository."
      ariaLabel="Registry distribution flow diagram"
    >
      <FlowTimeline steps={steps} activeStep="03" />
    </FlowDiagram>
  )
}

// ============================================================================
// 11. PROJECT SETUP CHECKLIST (Interactive & Real Verification Commands)
// ============================================================================

export function ProjectSetupChecklist() {
  const { packageManager } = useInstallation()

  const defaultItems = [
    { id: "aliases", label: "TypeScript path aliases resolve (@/*)", checked: true },
    { id: "components_json", label: "components.json exists and aliases match tsconfig", checked: true },
    { id: "shadcn_ui", label: "shadcn/ui primitives folder (components/ui/) is configured", checked: true },
    { id: "charts_dir", label: "components/charts/ directory is created", checked: true },
    { id: "shared_folder", label: "shared/ chart infrastructure folder is ready", checked: true },
    { id: "theme_tokens", label: "--chart-1 through --chart-5 variables defined in CSS", checked: true },
    { id: "isolation", label: "No chart engine is globally imported into shared utilities", checked: true },
    { id: "boundaries", label: "Client boundaries ('use client') isolated to interactive charts", checked: true },
  ]

  const [items, setItems] = useState(defaultItems)

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    )
  }

  const completedCount = items.filter((i) => i.checked).length
  const isAllReady = completedCount === items.length

  // Real package manager commands
  const getCommands = () => {
    switch (packageManager) {
      case "npm":
        return {
          typecheck: "npx tsc --noEmit",
          lint: "npm run lint",
          build: "npm run build",
        }
      case "yarn":
        return {
          typecheck: "yarn tsc --noEmit",
          lint: "yarn lint",
          build: "yarn build",
        }
      case "bun":
        return {
          typecheck: "bunx tsc --noEmit",
          lint: "bun run lint",
          build: "bun run build",
        }
      case "pnpm":
      default:
        return {
          typecheck: "pnpm dlx tsc --noEmit",
          lint: "pnpm lint",
          build: "pnpm build",
        }
    }
  }

  const cmds = getCommands()
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  return (
    <div className="my-8 rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-sm space-y-6">
      {/* Header & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Readiness Checklist
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verify every architectural requirement before installing your first visualization.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`font-mono text-xs px-2.5 py-1 rounded-full border ${
              isAllReady
                ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-300"
            }`}
          >
            {completedCount} of {items.length} Ready
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => toggleItem(it.id)}
            className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
              it.checked
                ? "border-white/[0.1] bg-zinc-900/60 text-zinc-200"
                : "border-white/[0.04] bg-zinc-950 text-zinc-500 opacity-60"
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                it.checked
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                  : "border-zinc-700 bg-zinc-900"
              }`}
            >
              {it.checked && <TickIcon size={12} />}
            </div>
            <span className="text-xs font-mono leading-relaxed">{it.label}</span>
          </button>
        ))}
      </div>

      {/* Real Verification Commands */}
      <div className="pt-2 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Verification Commands ({packageManager})
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Direct CLI check</span>
        </div>

        <div className="space-y-2">
          {[
            { label: "1. Typecheck aliases & imports", cmd: cmds.typecheck },
            { label: "2. Lint configuration", cmd: cmds.lint },
            { label: "3. Verify production build", cmd: cmds.build },
          ].map((c) => (
            <div
              key={c.cmd}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                  {c.label}:
                </span>
                <code className="text-xs font-mono text-emerald-400 truncate">
                  {c.cmd}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(c.cmd)}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd === c.cmd ? (
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
          ))}
        </div>
      </div>
    </div>
  )
}
