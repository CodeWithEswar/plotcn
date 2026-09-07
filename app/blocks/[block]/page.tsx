import React from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { ArrowLeft, Terminal, Copy } from "lucide-react"

interface PageProps {
  params: Promise<{ block: string }>
}

const blocksData: Record<
  string,
  {
    title: string
    description: string
    category: string
    charts: Array<{ name: string; title: string }>
  }
> = {
  "analytics-overview": {
    title: "Analytics Overview Dashboard",
    description:
      "A complete metrics dashboard section featuring concurrent trend lines, category volume comparisons, and geographical user density.",
    category: "Dashboard",
    charts: [
      { name: "line-basic", title: "Monthly Growth Trend" },
      { name: "bar-basic", title: "Traffic by Channel" },
      { name: "google-geochart", title: "Global User Distribution" },
    ],
  },
  "revenue-funnel": {
    title: "Revenue & Conversion Funnel",
    description:
      "Financial overview block comparing gross recurring revenue volume against dual retention series.",
    category: "Financial",
    charts: [
      { name: "area-basic", title: "Gross Recurring Revenue" },
      { name: "line-multiple", title: "New vs Returning Customers" },
    ],
  },
  "network-topology": {
    title: "Infrastructure Topology Monitor",
    description:
      "Force simulation clustering for service discovery and latency monitoring across microservices.",
    category: "Operations",
    charts: [
      { name: "d3-force-network", title: "Service Mesh Graph" },
      { name: "d3-animated-line", title: "Latency Telemetry" },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(blocksData).map((block) => ({ block }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { block } = await params
  const data = blocksData[block]
  if (!data) return { title: "Block Not Found — Plotcn" }

  return constructPageMetadata({
    title: `${data.title} — Plotcn Blocks`,
    description: data.description,
    path: `/blocks/${block}`,
  })
}

export default async function BlockDetailPage({ params }: PageProps) {
  const { block } = await params
  const data = blocksData[block]

  if (!data) {
    notFound()
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/blocks"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Blocks</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {data.category} Block
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {data.title}
          </h1>
          <p className="text-base text-zinc-400 max-w-3xl leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Dashboard Composite Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {data.charts.map((c, i) => (
            <div
              key={c.name}
              className={`flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 backdrop-blur-md ${
                i === 0 && data.charts.length === 3 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono font-medium text-zinc-300">{c.title}</h3>
                <span className="text-[10px] font-mono text-zinc-500">{c.name}</span>
              </div>
              <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900/60 p-3">
                <DynamicChartRenderer registryName={c.name} height={200} />
              </div>
            </div>
          ))}
        </div>

        {/* Components Included List */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <h2 className="text-sm font-mono font-semibold text-white mb-4">Required Registry Items</h2>
          <div className="flex flex-col gap-2">
            {data.charts.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400">{c.name}</span>
                  <span className="text-xs text-zinc-400 hidden sm:inline">— {c.title}</span>
                </div>
                <Link
                  href={`/r/${c.name}.json`}
                  target="_blank"
                  className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4"
                >
                  View JSON
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
