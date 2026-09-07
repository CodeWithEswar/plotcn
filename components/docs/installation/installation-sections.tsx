"use client"

import React, { useState } from "react"
import { useInstallation } from "./installation-context"
import {
  getFramework,
  getCreateCommand,
  getShadcnInitCommand,
  getFirstComponentCommand,
} from "./installation-config"
import { plotcnRegistry } from "@/config/registry"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  CheckmarkCircle01Icon,
  ComputerTerminal01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  SparklesIcon,
  TextWrapIcon,
  LaptopIcon,
  Package01Icon,
  ChartBarLineIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

export function InstallationHero() {
  const steps = [
    { num: "01", title: "Framework", icon: LaptopIcon, status: "active" },
    { num: "02", title: "shadcn/ui", icon: ComputerTerminal01Icon, status: "default" },
    { num: "03", title: "Plotcn Registry", icon: Package01Icon, status: "default" },
    { num: "04", title: "First Chart", icon: ChartBarLineIcon, status: "default" },
  ]

  return (
    <div className="relative mb-8 pb-6 border-b border-white/[0.08]">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border border-white/[0.12] bg-white/[0.03] text-zinc-300">
          <HugeiconsIcon icon={SparklesIcon} size={13} className="text-zinc-400" />
          Interactive Setup
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
        Installation
      </h1>
      <p className="text-base text-zinc-400 max-w-2xl leading-relaxed">
        Set up Plotcn for your stack. Choose your framework and package manager. Plotcn will show
        only the commands and configuration required for your project.
      </p>

      {/* Responsive Technical Flow Rail */}
      <div className="mt-6 w-full rounded-xl border border-white/[0.08] bg-zinc-950/60 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isActive = step.status === "active"
            return (
              <div
                key={step.num}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                  isActive
                    ? "border-white/[0.18] bg-zinc-900/90 shadow-sm"
                    : "border-white/[0.06] bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`size-7 rounded-md border flex items-center justify-center shrink-0 ${
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    <HugeiconsIcon icon={Icon} size={15} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block leading-none mb-0.5">
                      STEP {step.num}
                    </span>
                    <span
                      className={`text-xs font-semibold block truncate ${
                        isActive ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={13}
                    className="hidden lg:block text-zinc-600 shrink-0 ml-2"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function SetupSummary() {
  const { framework, packageManager } = useInstallation()
  const fwInfo = getFramework(framework)

  return (
    <div className="my-5 p-3 px-4 rounded-xl border border-white/[0.08] bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">Your configuration:</span>
        <span className="text-white font-semibold bg-white/[0.08] px-2 py-0.5 rounded border border-white/[0.1]">
          {fwInfo.name}
        </span>
        <span className="text-zinc-600">+</span>
        <span className="text-white font-semibold bg-white/[0.08] px-2 py-0.5 rounded border border-white/[0.1]">
          {packageManager}
        </span>
      </div>

      <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
        <span>TypeScript</span>
        <span className="text-zinc-700">·</span>
        <span>Tailwind CSS</span>
        <span className="text-zinc-700">·</span>
        <span>shadcn/ui</span>
      </div>
    </div>
  )
}

export function FrameworkRequirements() {
  const { framework } = useInstallation()
  const fwInfo = getFramework(framework)

  return (
    <div className="my-4 space-y-3">
      <ul className="grid gap-2 text-sm text-zinc-300 pl-1">
        {fwInfo.requirements.map((req, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="mt-1 text-emerald-400/90 shrink-0">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2} />
            </span>
            <span className="leading-relaxed">{req}</span>
          </li>
        ))}
      </ul>

      {fwInfo.notes && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-white/[0.08] bg-zinc-900/40 text-xs text-zinc-400 mt-3">
          <span className="mt-0.5 text-zinc-400 shrink-0">
            <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.8} />
          </span>
          <span className="leading-relaxed">{fwInfo.notes}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Reusable command viewer with copy and wrap
 */
function CommandCard({
  command,
  title,
  subtitle,
}: {
  command: string
  title?: string
  subtitle?: string
}) {
  const [copied, setCopied] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2 bg-zinc-900/40 text-xs select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="text-zinc-500 shrink-0">
            <HugeiconsIcon icon={ComputerTerminal01Icon} size={15} strokeWidth={1.8} />
          </span>
          <span className="font-mono text-zinc-300 truncate text-[12px]">
            {title || "Terminal"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsWrapped(!isWrapped)}
            aria-label={isWrapped ? "Disable wrap" : "Enable wrap"}
            className={`h-7 px-2 flex items-center gap-1 rounded text-[11px] font-mono transition-colors ${
              isWrapped
                ? "text-zinc-100 bg-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
            }`}
          >
            <HugeiconsIcon icon={TextWrapIcon} size={14} strokeWidth={1.8} />
            <span className="hidden sm:inline">{isWrapped ? "Wrapped" : "Wrap"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy command"
            className="h-7 px-2 flex items-center gap-1 rounded text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              size={14}
              strokeWidth={1.8}
              className={copied ? "text-emerald-400" : ""}
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div
        className={`p-4 text-[13px] font-mono leading-relaxed text-zinc-200 selection:bg-zinc-800 overflow-x-auto ${
          isWrapped ? "whitespace-pre-wrap overflow-x-hidden" : "whitespace-pre"
        }`}
      >
        <code>{command}</code>
      </div>

      {subtitle && (
        <div className="border-t border-white/[0.06] px-4 py-2 bg-zinc-950/40 text-[11px] text-zinc-500 font-mono">
          {subtitle}
        </div>
      )}
    </div>
  )
}

export function CreateProjectCommand() {
  const { framework, packageManager } = useInstallation()
  const fwInfo = getFramework(framework)
  const createCmd = getCreateCommand(framework, packageManager)

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400">
        Run the initialization command below to scaffold your{" "}
        <strong className="text-zinc-200 font-medium">{fwInfo.name}</strong> project configured
        with TypeScript, Tailwind CSS, and shadcn/ui:
      </p>

      <CommandCard
        command={createCmd.command}
        title={`${fwInfo.name} scaffold (${packageManager})`}
        subtitle={createCmd.note}
      />
    </div>
  )
}

export function InitializeShadcnCommand() {
  const { packageManager } = useInstallation()
  const initCmd = getShadcnInitCommand(packageManager)

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400">
        If you already have an existing project and only need to initialize shadcn/ui, execute:
      </p>

      <CommandCard
        command={initCmd}
        title={`shadcn/ui init (${packageManager})`}
        subtitle="Generates components.json and configures CSS theme variables."
      />

      <div className="my-3 p-3.5 rounded-xl border border-white/[0.08] bg-zinc-950/60 text-xs text-zinc-400 space-y-2">
        <span className="font-semibold text-zinc-200 block">Recommended setup preferences:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
          <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.05]">
            <span className="text-zinc-500 block">Style</span>
            <span className="text-white font-medium">Default or Nova</span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.05]">
            <span className="text-zinc-500 block">Base Color</span>
            <span className="text-white font-medium">Zinc or Neutral</span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded border border-white/[0.05]">
            <span className="text-zinc-500 block">CSS Variables</span>
            <span className="text-emerald-400 font-medium">Yes (required)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ConfigurePlotcnSection() {
  const [copied, setCopied] = useState(false)
  const jsonSnippet = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "registries": {
    "@plotcn": "${plotcnRegistry.template}"
  }
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonSnippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400 leading-relaxed">
        Plotcn follows shadcn/ui's open registry specification. Add the Plotcn registry to your{" "}
        <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-white/[0.08]">
          components.json
        </code>{" "}
        file under the <code className="text-zinc-200 font-mono text-xs">registries</code> property:
      </p>

      <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2 bg-zinc-900/40 text-xs select-none">
          <span className="font-mono text-zinc-300 text-[12px]">components.json</span>
          <button
            type="button"
            onClick={handleCopy}
            className="h-7 px-2 flex items-center gap-1 rounded text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              size={14}
              strokeWidth={1.8}
              className={copied ? "text-emerald-400" : ""}
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="p-4 text-[13px] font-mono leading-relaxed text-zinc-200 selection:bg-zinc-800 overflow-x-auto whitespace-pre">
          <code>{jsonSnippet}</code>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-white/[0.08] bg-zinc-900/40 text-xs text-zinc-400">
        <span className="mt-0.5 text-zinc-400 shrink-0">
          <HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.8} />
        </span>
        <span className="leading-relaxed">
          During local development or preview testing, you can also add components directly by registry URL:{" "}
          <code className="text-zinc-300 font-mono">shadcn add {plotcnRegistry.getItemUrl("line")}</code>
        </span>
      </div>
    </div>
  )
}

export function FirstVisualizationCommand() {
  const { packageManager } = useInstallation()
  const firstCmd = getFirstComponentCommand(packageManager)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">
          Install the interactive Cartesian line chart into your codebase:
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 border border-white/[0.1] text-zinc-300">
          Engine: Recharts
        </span>
      </div>

      <CommandCard
        command={firstCmd}
        title={`Install Line Chart (${packageManager})`}
        subtitle="Copies source to components/charts/line.tsx with full code ownership."
      />
    </div>
  )
}

export function VerificationSection() {
  const [copied, setCopied] = useState(false)
  const importCode = `import { PlotLineChart } from "@/components/charts/plot-line-chart"

const data = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 1800 },
  { label: "Mar", value: 2600 },
]

export function OverviewChart() {
  return (
    <div className="h-[280px] w-full">
      <PlotLineChart data={data} label="Sessions" />
    </div>
  )
}`

  const checklist = [
    "Component source copied to components/charts/plot-line-chart.tsx",
    "Visualization engine (Recharts / D3) dependency installed",
    "Chart responds to system theme tokens (--plot-grid, --plot-surface)",
    "TypeScript compiles cleanly without any errors",
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Verify that the component renders and resolves theme tokens in your page:
      </p>

      <div className="my-3 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2 bg-zinc-900/40 text-xs select-none">
          <span className="font-mono text-zinc-300 text-[12px]">app/page.tsx (or component)</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(importCode).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              })
            }}
            className="h-7 px-2 flex items-center gap-1 rounded text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              size={14}
              strokeWidth={1.8}
              className={copied ? "text-emerald-400" : ""}
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="p-4 text-[13px] font-mono leading-relaxed text-zinc-200 selection:bg-zinc-800 overflow-x-auto whitespace-pre">
          <code>{importCode}</code>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 space-y-2.5">
        <span className="text-xs font-semibold text-white block mb-1">
          Verification Checklist
        </span>
        <div className="grid gap-2 text-xs text-zinc-300">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <span className="text-emerald-400 shrink-0">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
