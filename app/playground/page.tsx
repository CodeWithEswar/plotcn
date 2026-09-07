import React from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PlaygroundShell } from "@/components/playground/playground-shell"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { Play } from "lucide-react"

export const metadata: Metadata = constructPageMetadata({
  title: "Playground — Interactive Visualization Sandbox",
  description:
    "Test, preview, and configure Recharts, D3.js, and Google Charts components in real time. Switch presets, tune dimensions, and inspect generated source.",
  path: "/playground",
})

export default function PlaygroundPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono text-primary">
            <Play className="size-3.5" />
            <span>Interactive Sandbox</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Visualization Playground
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Experiment with live visualization components across Recharts, D3, and Google Charts in
            an isolated environment.
          </p>
        </div>

        <PlaygroundShell />
      </main>

      <SiteFooter />
    </div>
  )
}
