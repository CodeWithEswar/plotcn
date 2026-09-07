import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { ArrowRight, LayoutDashboard } from "lucide-react"

export const metadata: Metadata = constructPageMetadata({
  title: "Examples — Real-World Visualization Dashboards",
  description:
    "Explore realistic production examples combining Recharts, D3.js, and Google Charts in real-world application architectures.",
  path: "/examples",
})

const exampleProjects = [
  {
    title: "Global SaaS Metric Console",
    description: "SaaS business monitoring screen with MRR volume (Recharts Area), subscriber trends, and Google GeoChart map.",
    chartName: "area-basic",
    tags: ["SaaS", "Financial", "Recharts + Google"],
  },
  {
    title: "Kubernetes Cluster Topology",
    description: "Live cluster health visualizer using D3 Force Simulation with animated microservice telemetry paths.",
    chartName: "d3-force-network",
    tags: ["DevOps", "D3.js", "Real-time"],
  },
  {
    title: "International Commerce Report",
    description: "E-commerce expansion tracker powered by Google GeoChart and category distribution columns.",
    chartName: "google-geochart",
    tags: ["E-Commerce", "Google Charts", "Geographic"],
  },
]

export default function ExamplesPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
            <LayoutDashboard className="size-3.5" />
            <span>Product Examples</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Real-World Dashboards
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Composite dashboard patterns combining multiple chart engines into polished product
            surfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleProjects.map((ex) => (
            <div
              key={ex.title}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                {ex.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="text-base font-semibold text-white mb-1.5">{ex.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-5">{ex.description}</p>

              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/[0.06] bg-zinc-900/60 p-3 mb-4">
                <DynamicChartRenderer registryName={ex.chartName} height={165} />
              </div>

              <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Self-contained</span>
                <Link
                  href="/charts"
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white"
                >
                  <span>Explore Charts</span>
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
