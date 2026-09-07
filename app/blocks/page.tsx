import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { ArrowRight, LayoutDashboard, Layers, Sparkles } from "lucide-react"

export const metadata: Metadata = constructPageMetadata({
  title: "Blocks — Pre-built Visualization Sections",
  description:
    "Production dashboard blocks combining Recharts, D3, and Google Charts. Copy and paste whole analytics sections, revenue overview cards, and monitoring blocks.",
  path: "/blocks",
})

const blocksList = [
  {
    slug: "analytics-overview",
    title: "Analytics Overview Dashboard",
    description: "Composite analytics metrics block with real-time trend line, volume breakdown, and regional user distribution.",
    category: "Dashboard",
    engine: "Composite",
    previewChart: "line-basic",
    chartsIncluded: ["line-basic", "bar-basic", "google-geochart"],
  },
  {
    slug: "revenue-funnel",
    title: "Revenue & Conversion Funnel",
    description: "Multi-tier conversion funnel comparing monthly recurring revenue and active subscriber volume.",
    category: "Financial",
    engine: "Recharts",
    previewChart: "area-basic",
    chartsIncluded: ["area-basic", "line-multiple"],
  },
  {
    slug: "network-topology",
    title: "Infrastructure Topology Monitor",
    description: "Force-directed cluster monitoring block visualizing distributed microservices, cache nodes, and database nodes.",
    category: "Operations",
    engine: "D3.js",
    previewChart: "d3-force-network",
    chartsIncluded: ["d3-force-network", "d3-animated-line"],
  },
]

export default function BlocksPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
            <Layers className="size-3.5" />
            <span>Pre-composed Layouts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Visualization Blocks
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Ready-to-use application sections combining multiple charts, responsive stat summaries,
            and contextual data headers into cohesive dashboards.
          </p>
        </div>

        {/* Blocks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blocksList.map((block) => (
            <div
              key={block.slug}
              className="group flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {block.engine}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                      {block.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {block.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {block.description}
              </p>

              {/* Preview */}
              <div className="relative mb-6 flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900/60 p-4">
                <DynamicChartRenderer registryName={block.previewChart} height={190} />
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">Includes:</span>
                  {block.chartsIncluded.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blocks/${block.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white group-hover:translate-x-0.5 transition-all"
                >
                  <span>Explore Block</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
