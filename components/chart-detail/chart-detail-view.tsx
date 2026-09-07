import type { ChartMetadata } from "@/lib/charts/metadata"
import type { ChartMdxData } from "@/lib/charts/chart-mdx"
import { getChartDetailDoc } from "@/lib/charts/detail-docs"
import { ChartDetailShell } from "./chart-detail-shell"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export interface ChartDetailViewProps {
  chart: ChartMetadata
  sourceCode: string
  highlightedSourceCode?: string
  relatedCharts: readonly ChartMetadata[]
  mdxData?: ChartMdxData | null
}

export function ChartDetailView({
  chart,
  sourceCode,
  highlightedSourceCode,
  relatedCharts,
  mdxData,
}: ChartDetailViewProps) {
  const doc = getChartDetailDoc(chart)

  return (
    <>
      <SiteHeader />
      <div className="charts-surface min-h-screen" data-theme="dark">
        <main id="main" tabIndex={-1} className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <ChartDetailShell
            chart={chart}
            doc={doc}
            sourceCode={sourceCode}
            highlightedSourceCode={highlightedSourceCode}
            relatedCharts={relatedCharts}
            mdxData={mdxData}
          />
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
