import React from "react"
import type { Metadata } from "next"
import { getAllCharts } from "@/config/charts"
import { GalleryShell } from "@/components/chart-gallery/gallery-shell"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = constructPageMetadata({
  title: "Chart Gallery — Recharts, D3.js & Google Charts",
  description:
    "Explore modern, copy-paste visualization components for React. Browse through isolated Recharts, low-level D3.js, and Google Charts implementations ready to install via shadcn CLI.",
  path: "/charts",
})

export default function ChartsPage() {
  const charts = getAllCharts()

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Page Hero */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
            Visualization Discovery
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Chart Gallery
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Production-ready React visualization components. Choose between approachable{" "}
            <span className="text-sky-400 font-medium">Recharts</span>, precision{" "}
            <span className="text-amber-400 font-medium">D3.js</span>, and mature{" "}
            <span className="text-emerald-400 font-medium">Google Charts</span>.
          </p>
        </div>

        {/* Gallery Interface */}
        <GalleryShell initialCharts={charts} />
      </main>

      <SiteFooter />
    </div>
  )
}
