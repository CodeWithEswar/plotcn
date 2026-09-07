import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { Sparkles, ArrowRight } from "lucide-react"

export const metadata: Metadata = constructPageMetadata({
  title: "Showcase — Visualizations Built With Plotcn",
  description:
    "Discover high-performance dashboards, analytics portals, and interactive scientific charts powered by Plotcn.",
  path: "/showcase",
})

const showcaseItems = [
  {
    title: "Apex Cloud Metrics",
    desc: "Multi-tenant Kubernetes cloud metrics dashboard tracking CPU throughput and memory saturation.",
    engine: "Recharts",
    chart: "line-basic",
  },
  {
    title: "Bioinformatics Cell Topology",
    desc: "Single-cell genetic clustering graph rendering 5,000+ interactive nodes in real time.",
    engine: "D3.js",
    chart: "d3-force-network",
  },
  {
    title: "Sovereign Logistics Map",
    desc: "Cross-border maritime trade routes and shipping corridor volume breakdown.",
    engine: "Google Charts",
    chart: "google-geochart",
  },
]

export default function ShowcasePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
            <Sparkles className="size-3.5" />
            <span>Community & Production</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built with Plotcn
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            From modern SaaS dashboards to deep scientific tools, see how teams are shipping fast
            with Plotcn source-first visualizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {showcaseItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-md hover:border-white/20 transition-all"
            >
              <span className="text-[10px] font-mono text-emerald-400 mb-2">{item.engine}</span>
              <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">{item.desc}</p>

              <div className="h-44 w-full rounded-xl overflow-hidden border border-white/[0.06] bg-zinc-900/60 p-3 mb-4">
                <DynamicChartRenderer registryName={item.chart} height={150} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
