import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { PlotcnMark } from "@/components/brand/plotcn-mark"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = constructPageMetadata({
  title: "About — Source-First Visualization Architecture",
  description:
    "Learn why Plotcn was built: to give developers source ownership over React visualizations across Recharts, D3.js, and Google Charts without rigid package abstractions.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex items-center gap-3 mb-6">
          <PlotcnMark className="size-10 text-emerald-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            The Plotcn Story
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Visualizations you own, not packages that hold your design hostage.
        </h1>

        <div className="space-y-6 text-zinc-300 leading-relaxed text-sm sm:text-base mb-12">
          <p>
            For years, front-end engineers building analytics features faced an impossible choice:
            either install bloated, black-box npm packages that are impossible to customize, or
            spend weeks writing low-level SVG drawing routines from scratch.
          </p>
          <p>
            <strong className="text-white font-semibold">Plotcn</strong> bridges this divide.
            Following the paradigm popularized by shadcn/ui, Plotcn distributes complete, editable
            component source code directly into your repository via a canonical shadcn-compatible
            registry.
          </p>
          <p>
            By supporting three intentionally different visualization engines—
            <span className="text-sky-400 font-medium">Recharts</span> for fast React dashboards,{" "}
            <span className="text-amber-400 font-medium">D3.js</span> for advanced math & geometry, and{" "}
            <span className="text-emerald-400 font-medium">Google Charts</span> for robust
            geography—Plotcn gives you the right tool for every visualization problem without forcing
            a universal abstraction layer.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/charts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-all shadow-lg"
          >
            <span>Explore Chart Registry</span>
            <ArrowRight className="size-4" />
          </Link>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900 text-white font-medium text-xs transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub Repository</span>
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
