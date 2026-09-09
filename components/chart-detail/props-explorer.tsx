"use client"

import React, { useState, useMemo } from "react"
import type { PropDoc, PropCategory } from "@/lib/charts/detail-docs/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Tick02Icon,
  SparklesIcon,
  ColorsIcon,
  RefreshIcon,
  Sorting01Icon,
} from "@hugeicons/core-free-icons"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { ChartColorControl } from "./chart-color-control"
import { CustomColorDialog } from "./custom-color-dialog"
import { PropsReferenceTable } from "@/components/docs/api-table"
import { getChartColorRoles, type ChartColorRoleDef } from "@/lib/charts/chart-colors"
import { useChartColors } from "./chart-color-context"
import { cn } from "@/lib/utils"

interface PropsExplorerProps {
  propsList: readonly PropDoc[]
  chartId: string
  sampleData: readonly any[]
  registryName: string
}

const categoryLabels: Record<PropCategory, string> = {
  core: "Core",
  visual: "Appearance",
  interaction: "Interaction",
  a11y: "Accessibility",
  advanced: "Advanced",
}

function getComponentDisplayName(registryName: string): string {
  const clean = registryName.trim().toLowerCase()
  const map: Record<string, string> = {
    "line-signal": "SignalLine",
    "recharts-line-signal": "SignalLine",
    "line-pulse": "PulseLine",
    "recharts-line-pulse": "PulseLine",
    "line-twin-compare": "TwinlineCompare",
    "recharts-line-twin-compare": "TwinlineCompare",
    "line-range": "RangeLine",
    "recharts-line-range": "RangeLine",
    "line-step-signal": "StepSignal",
    "recharts-line-step-signal": "StepSignal",
    "line-milestones": "MilestoneLine",
    "recharts-line-milestones": "MilestoneLine",
    "line-threshold": "ThresholdLine",
    "recharts-line-threshold": "ThresholdLine",
    "line-focus": "FocusLine",
    "recharts-line-focus": "FocusLine",
    "line-multi-signal": "MultiSignalLine",
    "recharts-line-multi-signal": "MultiSignalLine",
    "line-forecast": "ForecastLine",
    "recharts-line-forecast": "ForecastLine",
    "area-prism": "PrismArea",
    "recharts-area-prism": "PrismArea",
    "area-stack-flow": "StackFlowArea",
    "recharts-area-stack-flow": "StackFlowArea",
    "area-percent-stream": "PercentStreamArea",
    "recharts-area-percent-stream": "PercentStreamArea",
    "area-range": "RangeArea",
    "recharts-area-range": "RangeArea",
    "area-comparison": "ComparisonArea",
    "recharts-area-comparison": "ComparisonArea",
    "area-gradient-depth": "GradientDepthArea",
    "recharts-area-gradient-depth": "GradientDepthArea",
    "area-baseline": "BaselineArea",
    "recharts-area-baseline": "BaselineArea",
    "area-interactive": "InteractiveArea",
    "recharts-area-interactive": "InteractiveArea",
    "bar-signal": "SignalBars",
    "recharts-bar-signal": "SignalBars",
    "bar-group-compare": "GroupCompareBars",
    "recharts-bar-group-compare": "GroupCompareBars",
    "bar-stack-ledger": "StackLedgerBars",
    "recharts-bar-stack-ledger": "StackLedgerBars",
    "bar-percent-stack": "PercentStackBars",
    "recharts-bar-percent-stack": "PercentStackBars",
    "bar-diverging": "DivergingBars",
    "recharts-bar-diverging": "DivergingBars",
    "bar-bullet": "BulletBars",
    "recharts-bar-bullet": "BulletBars",
    "bar-variance": "VarianceBars",
    "recharts-bar-variance": "VarianceBars",
    "bar-interval": "IntervalBars",
    "recharts-bar-interval": "IntervalBars",
    "bar-interactive": "InteractiveBars",
    "recharts-bar-interactive": "InteractiveBars",
    "line-basic": "LineBasic",
    "area-basic": "AreaBasic",
    "bar-basic": "BarBasic",
    "google-line": "GoogleLine",
    "google-bar": "GoogleBar",
    "d3-animated-line": "D3AnimatedLine",
  }
  return map[clean] || "Chart"
}

export function PropsExplorer({ propsList, registryName }: PropsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Global color customization state shared across the page
  const colorContext = useChartColors()
  const fallbackRoles = useMemo(() => getChartColorRoles(registryName), [registryName])
  const colorRoles = colorContext.colorRoles.length > 0 ? colorContext.colorRoles : fallbackRoles
  const customColors = colorContext.customColors
  const [copiedCode, setCopiedCode] = useState(false)

  const handleColorChange = colorContext.setColor
  const handleResetColors = colorContext.resetAllColors
  const handleSwapColors = colorContext.swapColors

  // Filtered props list for the reference table
  const filteredProps = propsList.filter((prop) => {
    const matchesCategory = selectedCategory === "all" || prop.category === selectedCategory
    const matchesSearch =
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Visual previewable props for the Prop Preview Lab
  const previewableProps = propsList.filter((p) => p.previewable)

  // Dynamically generate code snippet reflecting active custom colors and props
  const generatedCodeSnippet = useMemo(() => {
    const componentName = getComponentDisplayName(registryName)
    const isBarSignal = registryName === "bar-signal" || registryName === "recharts-bar-signal"
    const isBarGroupCompare = registryName === "bar-group-compare" || registryName === "recharts-bar-group-compare"
    const isBarStackLedger = registryName === "bar-stack-ledger" || registryName === "recharts-bar-stack-ledger"
    const isBarPercentStack = registryName === "bar-percent-stack" || registryName === "recharts-bar-percent-stack"
    const isBarDiverging = registryName === "bar-diverging" || registryName === "recharts-bar-diverging"
    const isBarBullet = registryName === "bar-bullet" || registryName === "recharts-bar-bullet"
    const isBarVariance = registryName === "bar-variance" || registryName === "recharts-bar-variance"
    const isBarInterval = registryName === "bar-interval" || registryName === "recharts-bar-interval"
    const isBarInteractive = registryName === "bar-interactive" || registryName === "recharts-bar-interactive"
    const lines = [`<${componentName}`, `  data={data}`]

    if (isBarSignal) {
      lines.push(`  categoryKey="region"`)
      lines.push(`  series={[`)
      lines.push(`    { key: "web", label: "Web"${customColors.color && customColors.color !== "theme" ? `, color: "${customColors.color}"` : ""} },`)
      lines.push(`    { key: "mobile", label: "Mobile"${customColors.referenceColor && customColors.referenceColor !== "theme" ? `, color: "${customColors.referenceColor}"` : ""} },`)
      lines.push(`  ]}`)
    } else if (isBarGroupCompare) {
      lines.push(`  categoryKey="quarter"`)
      lines.push(`  series={[`)
      lines.push(`    { key: "current", label: "Current Year"${customColors.color_current && customColors.color_current !== "theme" ? `, color: "${customColors.color_current}"` : ""} },`)
      lines.push(`    { key: "previous", label: "Previous Year"${customColors.color_previous && customColors.color_previous !== "theme" ? `, color: "${customColors.color_previous}"` : ""} },`)
      lines.push(`  ]}`)
    } else if (isBarStackLedger) {
      lines.push(`  categoryKey="quarter"`)
      lines.push(`  series={[`)
      lines.push(`    { key: "compute", label: "Compute"${customColors.color_compute && customColors.color_compute !== "theme" ? `, color: "${customColors.color_compute}"` : ""} },`)
      lines.push(`    { key: "storage", label: "Storage"${customColors.color_storage && customColors.color_storage !== "theme" ? `, color: "${customColors.color_storage}"` : ""} },`)
      lines.push(`    { key: "network", label: "Network"${customColors.color_network && customColors.color_network !== "theme" ? `, color: "${customColors.color_network}"` : ""} },`)
      lines.push(`  ]}`)
    } else if (isBarPercentStack) {
      lines.push(`  categoryKey="segment"`)
      lines.push(`  series={[`)
      lines.push(`    { key: "monthly", label: "Monthly"${customColors.color_monthly && customColors.color_monthly !== "theme" ? `, color: "${customColors.color_monthly}"` : ""} },`)
      lines.push(`    { key: "annual", label: "Annual"${customColors.color_annual && customColors.color_annual !== "theme" ? `, color: "${customColors.color_annual}"` : ""} },`)
      lines.push(`    { key: "multiYear", label: "Multi-year"${customColors.color_multiYear && customColors.color_multiYear !== "theme" ? `, color: "${customColors.color_multiYear}"` : ""} },`)
      lines.push(`  ]}`)
    } else if (isBarDiverging) {
      lines.push(`  categoryKey="region"`)
      lines.push(`  series={{ key: "variance", label: "Variance from Plan" }}`)
      lines.push(`  baseline={0}`)
      if (customColors.aboveColor && customColors.aboveColor !== "theme") {
        lines.push(`  aboveColor="${customColors.aboveColor}"`)
      }
      if (customColors.belowColor && customColors.belowColor !== "theme") {
        lines.push(`  belowColor="${customColors.belowColor}"`)
      }
      if (customColors.selectionColor && customColors.selectionColor !== "theme") {
        lines.push(`  selectionColor="${customColors.selectionColor}"`)
      }
    } else if (isBarBullet) {
      lines.push(`  categoryKey="service"`)
      lines.push(`  series={{`)
      lines.push(`    valueKey: "actual",`)
      lines.push(`    targetKey: "target",`)
      lines.push(`    label: "Availability",`)
      lines.push(`  }}`)
      if (customColors.valueColor && customColors.valueColor !== "theme") {
        lines.push(`  valueColor="${customColors.valueColor}"`)
      }
      if (customColors.targetColor && customColors.targetColor !== "theme") {
        lines.push(`  targetColor="${customColors.targetColor}"`)
      }
      if (customColors.selectionColor && customColors.selectionColor !== "theme") {
        lines.push(`  selectionColor="${customColors.selectionColor}"`)
      }
    } else if (isBarVariance) {
      lines.push(`  categoryKey="segment"`)
      lines.push(`  series={{`)
      lines.push(`    actualKey: "actual",`)
      lines.push(`    planKey: "plan",`)
      lines.push(`    label: "Revenue Variance",`)
      lines.push(`  }}`)
      if (customColors.positiveColor && customColors.positiveColor !== "theme") {
        lines.push(`  positiveColor="${customColors.positiveColor}"`)
      }
      if (customColors.negativeColor && customColors.negativeColor !== "theme") {
        lines.push(`  negativeColor="${customColors.negativeColor}"`)
      }
      if (customColors.selectionColor && customColors.selectionColor !== "theme") {
        lines.push(`  selectionColor="${customColors.selectionColor}"`)
      }
    } else if (isBarInterval) {
      lines.push(`  categoryKey="service"`)
      lines.push(`  series={{`)
      lines.push(`    startKey: "start",`)
      lines.push(`    endKey: "end",`)
      lines.push(`    label: "Maintenance Window",`)
      lines.push(`  }}`)
      if (customColors.color && customColors.color !== "theme") {
        lines.push(`  color="${customColors.color}"`)
      }
      if (customColors.selectionColor && customColors.selectionColor !== "theme") {
        lines.push(`  selectionColor="${customColors.selectionColor}"`)
      }
    } else if (isBarInteractive) {
      lines.push(`  categoryKey="quarter"`)
      lines.push(`  series={[`)
      lines.push(`    { key: "product", label: "Product"${customColors.series1Color && customColors.series1Color !== "theme" ? `, color: "${customColors.series1Color}"` : ""} },`)
      lines.push(`    { key: "services", label: "Services"${customColors.series2Color && customColors.series2Color !== "theme" ? `, color: "${customColors.series2Color}"` : ""} },`)
      lines.push(`    { key: "enterprise", label: "Enterprise"${customColors.series3Color && customColors.series3Color !== "theme" ? `, color: "${customColors.series3Color}"` : ""} },`)
      lines.push(`  ]}`)
      if (customColors.selectionColor && customColors.selectionColor !== "theme") {
        lines.push(`  selectionColor="${customColors.selectionColor}"`)
      }
    } else {
      lines.push(`  xKey="date"`)

      if (registryName.includes("twin-compare")) {
        lines.push(`  series={{`)
        lines.push(`    primary: { key: "current", label: "Current" },`)
        lines.push(`    reference: { key: "previous", label: "Previous" },`)
        lines.push(`  }}`)
      } else if (registryName.includes("multi-signal")) {
        lines.push(`  series={[`)
        lines.push(`    { key: "web", label: "Web"${customColors.color_web && customColors.color_web !== "theme" ? `, color: "${customColors.color_web}"` : ""} },`)
        lines.push(`    { key: "ios", label: "iOS"${customColors.color_ios && customColors.color_ios !== "theme" ? `, color: "${customColors.color_ios}"` : ""} },`)
        lines.push(`    { key: "android", label: "Android"${customColors.color_android && customColors.color_android !== "theme" ? `, color: "${customColors.color_android}"` : ""} },`)
        lines.push(`  ]}`)
      } else if (registryName.includes("forecast")) {
        lines.push(`  series={{`)
        lines.push(`    actualKey: "actual",`)
        lines.push(`    forecastKey: "forecast",`)
        lines.push(`    lowerKey: "lower",`)
        lines.push(`    upperKey: "upper",`)
        lines.push(`  }}`)
      } else if (registryName.includes("prism")) {
        lines.push(`  series={{`)
        lines.push(`    key: "requests",`)
        lines.push(`    label: "API Requests",`)
        lines.push(`  }}`)
      } else if (registryName === "area-range" || registryName === "recharts-area-range") {
        lines.push(`  series={{`)
        lines.push(`    lowerKey: "min",`)
        lines.push(`    upperKey: "max",`)
        lines.push(`    valueKey: "median",`)
        lines.push(`    label: "Latency envelope",`)
        lines.push(`  }}`)
      } else if (registryName === "area-comparison" || registryName === "recharts-area-comparison") {
        lines.push(`  series={{`)
        lines.push(`    primary: { key: "current", label: "Current year" },`)
        lines.push(`    reference: { key: "previous", label: "Previous year" },`)
        lines.push(`  }}`)
      } else if (registryName.includes("range")) {
        lines.push(`  valueKey="value"`)
        lines.push(`  lowerKey="lower"`)
        lines.push(`  upperKey="upper"`)
      } else if (registryName.includes("step-signal")) {
        lines.push(`  seriesKey="limit"`)
      } else if (registryName.includes("milestones")) {
        lines.push(`  series={{ key: "users", label: "Active users" }}`)
        lines.push(`  milestones={milestones}`)
      } else {
        lines.push(`  seriesKey="value"`)
      }
    }

    // Append explicit custom colors (omitting default theme tokens and series-embedded colors)
    colorRoles.forEach((role) => {
      if (role.propName.startsWith("color_")) return
      const val = customColors[role.propName]
      if (val && val !== "theme" && val !== role.defaultToken) {
        lines.push(`  ${role.propName}="${val}"`)
      }
    })

    lines.push(`/>`)
    return lines.join("\n")
  }, [registryName, colorRoles, customColors])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCodeSnippet)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const hasCustomizedColors = Object.keys(customColors).some(
    (k) => customColors[k] && customColors[k] !== "theme"
  )

  return (
    <section id="section-props" className="space-y-8 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          03 / Component API & Styling
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Props Reference & Interactive Prop Explorer
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Inspect every component property, customize semantic color roles live with instant visual feedback, and copy production-ready code with active prop configurations.
        </p>
      </div>

      {/* ── Section A: Global Appearance & Color Customization ────────────── */}
      {colorRoles.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4.5 sm:p-5 space-y-4 backdrop-blur-md shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <HugeiconsIcon icon={ColorsIcon} size={14} />
              </span>
              <div>
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-zinc-200">
                  Colors & Appearance Configuration
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  Customize primary, reference, or annotation series colors. Defaults derive from Plotcn theme tokens.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {colorRoles.length >= 2 && (
                <button
                  type="button"
                  onClick={handleSwapColors}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-300 transition-colors cursor-pointer"
                  title="Swap primary and reference colors"
                >
                  <HugeiconsIcon icon={Sorting01Icon} size={13} />
                  <span>Swap</span>
                </button>
              )}

              {hasCustomizedColors && (
                <button
                  type="button"
                  onClick={handleResetColors}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={RefreshIcon} size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>

          {/* Color Swatch Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {colorRoles.map((role) => (
              <div key={role.id} className="space-y-1">
                <ChartColorControl
                  role={role}
                  value={customColors[role.propName]}
                  onChange={(val) => handleColorChange(role.propName, val)}
                  onReset={() => colorContext.resetColor(role.propName)}
                />
              </div>
            ))}
          </div>

          {/* Generated Usage Code with Live Props */}
          <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Generated Usage Code (Live Props):</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <HugeiconsIcon icon={copiedCode ? Tick02Icon : Copy01Icon} size={12} />
                <span>{copiedCode ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-mono text-emerald-300/90 overflow-x-auto selection:bg-emerald-500/20 leading-relaxed">
              <code>{generatedCodeSnippet}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ── Section B: Interactive Prop Preview Lab ───────────────────────── */}
      {previewableProps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-medium uppercase tracking-wider">
            <HugeiconsIcon icon={SparklesIcon} size={14} className="text-emerald-400" />
            <span>Interactive Prop Preview Lab</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-w-0 w-full max-w-full">
            {previewableProps.map((prop) => (
              <PropLabCard
                key={prop.name}
                prop={prop}
                registryName={registryName}
                activeCustomColors={customColors}
                cssVariables={colorContext.cssVariables}
                onColorChange={handleColorChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Section C: Complete Props Reference Table ─────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-300 font-medium uppercase tracking-wider">
            All Properties ({filteredProps.length}
            {filteredProps.length !== propsList.length ? ` / ${propsList.length}` : ""})
          </div>

          {/* Category Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900/80 border border-white/[0.06] text-xs overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap",
                  selectedCategory === "all" ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                All
              </button>
              {(["core", "visual", "advanced"] as PropCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap",
                    selectedCategory === cat ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Filter props..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-zinc-950 text-xs text-zinc-200 placeholder:text-zinc-500 font-mono outline-none focus:border-white/20 w-full sm:w-44 transition-colors"
            />
          </div>
        </div>

        {/* Standardized Responsive Props Table */}
        <PropsReferenceTable
          props={filteredProps}
          emptyMessage="No properties found matching your filter. Try another name or category."
        />
      </div>
    </section>
  )
}

function PropLabCard({
  prop,
  registryName,
  activeCustomColors,
  cssVariables,
  onColorChange,
}: {
  prop: PropDoc
  registryName: string
  activeCustomColors: Record<string, string>
  cssVariables: React.CSSProperties
  onColorChange: (propName: string, val: string) => void
}) {
  const resolvedControlOptions = useMemo(() => {
    if (prop.controlOptions && prop.controlOptions.length > 0) {
      return prop.controlOptions
    }
    if (prop.controlType === "switch" || prop.type === "boolean") {
      return [
        { value: true, label: "On" },
        { value: false, label: "Off" },
      ]
    }
    return undefined
  }, [prop])

  const initialVal = useMemo(() => {
    if (resolvedControlOptions && resolvedControlOptions.length > 0) {
      const cleanDefault = prop.default?.replace(/['"]/g, "")
      const match = resolvedControlOptions.find(
        (o) => String(o.value) === cleanDefault || o.value === (cleanDefault === "true")
      )
      if (match) return match.value
      return resolvedControlOptions[0].value
    }
    return prop.name === "showGrid" ? true : prop.name === "pointSize" ? 5 : "function"
  }, [prop, resolvedControlOptions])

  const [currentVal, setCurrentVal] = useState<any>(initialVal)
  const [copied, setCopied] = useState(false)
  const [customColorOpen, setCustomColorOpen] = useState(false)

  const isColorProp =
    prop.name === "color" ||
    prop.name === "primaryColor" ||
    prop.name === "referenceColor" ||
    prop.name === "rangeColor" ||
    prop.name === "milestoneColor"

  const propSnippet = typeof currentVal === "string" ? `${prop.name}="${currentVal}"` : `${prop.name}={${currentVal}}`

  const handleCopy = () => {
    navigator.clipboard.writeText(propSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Construct prop overrides for live chart rendering
  const sampleDataWithGap = prop.name === "missingValuePolicy"
    ? [
        {
          label: "Jan",
          date: "Jan",
          time: "00:00",
          month: "Jan",
          day: "Day 01",
          value: 180,
          latency: 40,
          current: 180,
          previous: 120,
          lower: 105,
          upper: 138,
          users: 45000,
          limit: 10000,
          requests: 12000,
          web: 120,
          ios: 80,
          android: 95,
          actual: 82,
          forecast: 82,
          min: 18,
          max: 26,
          median: 22,
          utilization: 68,
          segment: "Startup",
          quarter: "Q1",
          target: 140,
          monthly: 620,
          annual: 310,
          multiYear: 70,
        },
        {
          label: "Feb",
          date: "Feb",
          time: "04:00",
          month: "Feb",
          day: "Day 03",
          value: 240,
          latency: 55,
          current: 240,
          previous: 190,
          lower: 118,
          upper: 152,
          users: 52000,
          limit: 10000,
          requests: 15000,
          web: 130,
          ios: 94,
          android: 103,
          actual: 91,
          forecast: 91,
          min: 19,
          max: 28,
          median: 23,
          utilization: 84,
          segment: "Growth",
          quarter: "Q2",
          target: 210,
          monthly: 840,
          annual: 920,
          multiYear: 240,
        },
        {
          label: "Mar",
          date: "Mar",
          time: "08:00",
          month: "Mar",
          day: "Day 05",
          value: null,
          latency: null,
          current: null,
          previous: null,
          lower: null,
          upper: null,
          users: null,
          limit: null,
          requests: null,
          web: null,
          ios: null,
          android: null,
          actual: null,
          forecast: null,
          min: null,
          max: null,
          median: null,
          utilization: null,
          segment: "Scale",
          quarter: "Q3",
          target: null,
          monthly: null,
          annual: 200,
          multiYear: 100,
        },
        {
          label: "Apr",
          date: "Apr",
          time: "12:00",
          month: "Apr",
          day: "Day 07",
          value: 280,
          latency: 45,
          current: 280,
          previous: 260,
          lower: 115,
          upper: 168,
          users: 63000,
          limit: 12000,
          requests: 18000,
          web: 149,
          ios: 123,
          android: 131,
          actual: 104,
          forecast: 104,
          min: 20,
          max: 36,
          median: 28,
          utilization: 89,
          segment: "Enterprise",
          quarter: "Q4",
          target: 270,
          monthly: 90,
          annual: 215,
          multiYear: 195,
        },
        {
          label: "May",
          date: "May",
          time: "16:00",
          month: "May",
          day: "Day 09",
          value: 390,
          latency: 70,
          current: 390,
          previous: 310,
          lower: 132,
          upper: 204,
          users: 78000,
          limit: 12000,
          requests: 21000,
          web: 162,
          ios: 135,
          android: 142,
          actual: 112,
          forecast: 112,
          min: 17,
          max: 29,
          median: 21,
          utilization: 66,
          segment: "MidMarket",
          quarter: "Q5",
          target: 350,
          monthly: 300,
          annual: 400,
          multiYear: 150,
        },
        {
          label: "Jun",
          date: "Jun",
          time: "20:00",
          month: "Jun",
          day: "Day 11",
          value: 460,
          latency: 85,
          current: 460,
          previous: 380,
          lower: 145,
          upper: 225,
          users: 84000,
          limit: 20000,
          requests: 25000,
          web: 175,
          ios: 148,
          android: 156,
          actual: 119,
          forecast: 119,
          min: 18,
          max: 25,
          median: 21,
          utilization: 82,
          segment: "Global",
          quarter: "Q6",
          target: 410,
          monthly: 500,
          annual: 600,
          multiYear: 300,
        },
        {
          label: "Jul",
          date: "Jul",
          time: "23:59",
          month: "Jul",
          day: "Day 13",
          value: 520,
          latency: 95,
          current: 520,
          previous: 410,
          lower: 155,
          upper: 242,
          users: 95000,
          limit: 20000,
          requests: 29000,
          web: 190,
          ios: 160,
          android: 170,
          actual: 126,
          forecast: 126,
          min: 21,
          max: 32,
          median: 25,
          utilization: 71,
          segment: "Corporate",
          quarter: "Q7",
          target: 460,
          monthly: 400,
          annual: 500,
          multiYear: 250,
        },
      ]
    : undefined

  const isHeightProp = prop.name === "height" && typeof currentVal === "number"
  const previewHeight = isHeightProp ? currentVal : 220

  const chartPropsOverride: Record<string, any> = {
    height: previewHeight,
    ...activeCustomColors,
    [prop.name]: currentVal,
    ...(sampleDataWithGap ? { data: sampleDataWithGap } : {}),
  }

  const handleApplyColor = (color: string) => {
    setCurrentVal(color)
    onColorChange(prop.name, color)
  }

  return (
    <div className="flex flex-col justify-between w-full min-w-0 max-w-full rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-3.5 backdrop-blur-sm shadow-md transition-all hover:border-white/[0.12] overflow-hidden">
      {/* Card Header: Prop Name + Type Badge + Copy Action */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-emerald-400">{prop.name}</span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.2 rounded">
              {prop.type}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{prop.description}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${prop.name} prop snippet`}
          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-mono text-zinc-300 transition-colors shrink-0 cursor-pointer"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} className={copied ? "text-emerald-400" : ""} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Interactive Controls (Segmented Pill Switcher + Optional Color Customizer) */}
      {resolvedControlOptions && (
        <div className="space-y-1.5 min-w-0 w-full">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Select value to preview live:</span>
            {isColorProp && (
              <span className="text-zinc-400 normal-case flex items-center gap-1">
                <span
                  className="size-2 rounded-full inline-block border border-white/30"
                  style={{ backgroundColor: typeof currentVal === "string" ? currentVal : "#10b981" }}
                />
                {String(currentVal)}
              </span>
            )}
          </div>

          <div
            className="flex flex-nowrap items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/[0.06] overflow-x-auto no-scrollbar w-full min-w-0 scroll-smooth whitespace-nowrap"
            role="group"
            aria-label={`${prop.name} options`}
          >
            {resolvedControlOptions.map((opt) => {
              const active = currentVal === opt.value
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCurrentVal(opt.value)
                    if (isColorProp) {
                      onColorChange(prop.name, String(opt.value))
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap",
                    active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  {isColorProp && (
                    <span
                      className="size-2.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: String(opt.value) }}
                    />
                  )}
                  <span>{opt.label}</span>
                </button>
              )
            })}

            {/* Professional Customize Color Button */}
            {isColorProp && (
              <button
                type="button"
                onClick={() => setCustomColorOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-all cursor-pointer shrink-0 whitespace-nowrap ml-auto"
              >
                <HugeiconsIcon icon={ColorsIcon} size={12} className="text-emerald-400" />
                <span>Custom Color...</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live Mini Preview Canvas */}
      <div className="space-y-1">
        <div
          className="charts-surface w-full min-w-0 max-w-full rounded-xl border border-white/[0.06] bg-black/50 p-2 overflow-hidden flex flex-col items-stretch justify-center transition-[height,min-height] duration-200"
          style={{ minHeight: previewHeight + 16, height: previewHeight + 16, ...cssVariables }}
        >
          <DynamicChartRenderer
            key={`${registryName}-${prop.name}-${String(currentVal)}`}
            registryName={registryName}
            height={previewHeight}
            className="w-full h-full min-w-0"
            motion={false}
            color={
              isColorProp
                ? currentVal
                : activeCustomColors["color"] ||
                  activeCustomColors["primaryColor"] ||
                  activeCustomColors["positiveColor"] ||
                  activeCustomColors["valueColor"]
            }
            chartProps={chartPropsOverride}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1 pt-1">
          <span>Active: <code className="text-zinc-300 font-semibold">{propSnippet}</code></span>
          <span>Default: {prop.default}</span>
        </div>
      </div>

      {/* Professional Custom Color Dialog */}
      {isColorProp && (
        <CustomColorDialog
          open={customColorOpen}
          onOpenChange={setCustomColorOpen}
          currentColor={String(currentVal)}
          onApplyColor={handleApplyColor}
        />
      )}
    </div>
  )
}
