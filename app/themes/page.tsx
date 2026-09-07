import React from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { Palette } from "lucide-react"

export const metadata: Metadata = constructPageMetadata({
  title: "Themes — Semantic Chart Token System",
  description:
    "Universal color palettes and semantic tokens for Recharts, D3.js, and Google Charts. Consistent data visualization across light, dark, and system themes.",
  path: "/themes",
})

const palettes = [
  {
    name: "Emerald Neon (Default)",
    description: "High-contrast cyber emerald paired with neutral slate gridlines.",
    colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669"],
  },
  {
    name: "Sky Horizon",
    description: "Cool blue palette ideal for SaaS dashboards and telemetry metrics.",
    colors: ["#0284c7", "#38bdf8", "#7dd3fc", "#bae6fd", "#0369a1"],
  },
  {
    name: "Amber Flame",
    description: "Vibrant warm hues for alert states, activity density, and financial volumes.",
    colors: ["#d97706", "#fbbf24", "#fde68a", "#fef3c7", "#b45309"],
  },
  {
    name: "Purple Velvet",
    description: "Deep amethyst gradients for luxury analytics and executive views.",
    colors: ["#9333ea", "#c084fc", "#e9d5ff", "#f3e8ff", "#7e22ce"],
  },
]

export default function ThemesPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
            <Palette className="size-3.5" />
            <span>Design Tokens</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Semantic Chart Themes
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            One unified design token model. CSS variables map smoothly to Recharts stroke props, D3
            scale ranges, and Google Charts option dictionaries.
          </p>
        </div>

        {/* Palettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {palettes.map((p) => (
            <div
              key={p.name}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-md"
            >
              <h3 className="text-base font-semibold text-white mb-1">{p.name}</h3>
              <p className="text-xs text-zinc-400 mb-6">{p.description}</p>

              {/* Color Swatches */}
              <div className="grid grid-cols-5 gap-2 h-14 w-full rounded-xl overflow-hidden p-1 bg-white/[0.03] border border-white/[0.06] mb-6">
                {p.colors.map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    className="h-full rounded-lg flex items-end p-1.5 shadow-sm"
                  >
                    <span className="text-[9px] font-mono font-bold text-black/80 bg-white/70 px-1 py-0.2 rounded backdrop-blur-xs">
                      {c}
                    </span>
                  </div>
                ))}
              </div>

              {/* Token definition preview */}
              <div className="rounded-xl border border-white/[0.06] bg-zinc-900/60 p-3 font-mono text-[11px] text-zinc-300">
                <span className="text-zinc-500">// CSS Variable Assignment</span>
                <div className="text-emerald-400 mt-1">--chart-1: {p.colors[0]};</div>
                <div className="text-sky-400">--chart-2: {p.colors[1]};</div>
                <div className="text-amber-400">--chart-3: {p.colors[2]};</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Theme Preview */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-8 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-2">Live Themed Visualization</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Preview the default responsive ChartContainer adapting automatically to system theme variables.
          </p>
          <div className="h-64 rounded-xl border border-white/[0.06] bg-zinc-900/50 p-4">
            <DynamicChartRenderer registryName="line-basic" height={220} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
