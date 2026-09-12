import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, SourceCodeIcon, GithubIcon } from "@hugeicons/core-free-icons"
import type { ChartMetadata } from "@/lib/charts/metadata"
import type { ChartDetailDoc } from "@/lib/charts/detail-docs/types"
import { charts } from "@/config/charts"
import { engineLabels } from "@/lib/charts/filters"
import { getCategoryLabel } from "@/lib/charts/categories"
import { InstallCommand } from "@/components/registry/install-command"
import { EngineBrandBadge } from "./engine-badge"
import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

interface ComponentHeaderProps {
  chart: ChartMetadata
  doc: ChartDetailDoc
}

export function ComponentHeader({ chart }: ComponentHeaderProps) {
  const number = String(charts.findIndex((item) => item.id === chart.id) + 1).padStart(3, "0")

  return (
    <header id="overview" className="scroll-mt-24 border-b border-border pb-8">
      <nav aria-label="Breadcrumb" className="mb-7 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/charts" className="hover:text-foreground">Charts</Link></li>
          <li aria-hidden="true"><HugeiconsIcon icon={ArrowRight01Icon} size={11} /></li>
          <li><Link href={`/charts?engine=${chart.engine}`} className="hover:text-foreground">{engineLabels[chart.engine]}</Link></li>
          <li aria-hidden="true"><HugeiconsIcon icon={ArrowRight01Icon} size={11} /></li>
          <li><Link href={`/charts?category=${chart.category}`} className="hover:text-foreground">{getCategoryLabel(chart.category)}</Link></li>
          <li aria-hidden="true"><HugeiconsIcon icon={ArrowRight01Icon} size={11} /></li>
          <li aria-current="page" className="text-foreground">{chart.title}</li>
        </ol>
      </nav>

      <div className="chart-detail-hero">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[.17em] text-muted-foreground">
            {number} / {engineLabels[chart.engine].toUpperCase()} / {getCategoryLabel(chart.category).toUpperCase()}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-[-.055em] sm:text-5xl">{chart.title}</h1>
            <EngineBrandBadge engine={chart.engine} />
          </div>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{chart.description}</p>
          
          {/* Professional Technical Specification Strip */}
          <div className="mt-6 rounded-2xl border border-border bg-card/60 p-2 sm:p-2.5 backdrop-blur-sm shadow-xs">
            <dl className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40">
                <dt className="text-[10px] text-muted-foreground font-medium tracking-wider">SPEC</dt>
                <dd className="font-semibold text-foreground">#{number}</dd>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40">
                <dt className="text-[10px] text-muted-foreground font-medium tracking-wider">ENGINE</dt>
                <dd className="text-foreground font-medium">{engineLabels[chart.engine]}</dd>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40">
                <dt className="text-[10px] text-muted-foreground font-medium tracking-wider">FAMILY</dt>
                <dd className="text-foreground font-medium">{getCategoryLabel(chart.category)}</dd>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40">
                <dt className="text-[10px] text-muted-foreground font-medium tracking-wider">RENDERER</dt>
                <dd className="text-foreground font-semibold uppercase">{chart.renderer}</dd>
              </div>

              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40"
                )}
              >
                <dt className="text-[10px] text-muted-foreground font-medium tracking-wider">STATUS</dt>
                <dd className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full shrink-0",
                      chart.status === "stable"
                        ? "bg-foreground/70"
                        : chart.status === "preview"
                        ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)] animate-pulse"
                        : "bg-purple-400"
                    )}
                  />
                  <span
                    className={cn(
                      "font-semibold uppercase tracking-tight text-[11px]",
                      chart.status === "stable"
                        ? "text-foreground"
                        : chart.status === "preview"
                        ? "text-amber-600 dark:text-amber-300"
                        : "text-purple-600 dark:text-purple-300"
                    )}
                  >
                    {chart.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <a href="#section-source" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground px-3.5 py-2 text-xs font-mono transition-colors shadow-xs">
            <HugeiconsIcon icon={SourceCodeIcon} size={14} /> Source
          </a>
          <a href={`${siteConfig.github}/blob/main/${chart.componentPath}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground px-3.5 py-2 text-xs font-mono transition-colors shadow-xs">
            <HugeiconsIcon icon={GithubIcon} size={14} /> GitHub
          </a>
        </div>
      </div>

      <div id="installation" className="mt-8 scroll-mt-24">
        <h2 className="sr-only">Installation</h2>
        <InstallCommand registryName={chart.registryName} engine={chart.engine} />
      </div>
    </header>
  )
}
