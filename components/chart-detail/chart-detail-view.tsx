import type { ChartMetadata } from "@/lib/charts/metadata"
import type { ChartMdxData } from "@/lib/charts/chart-mdx"
import { getChartDetailDoc } from "@/lib/charts/detail-docs"
import { ChartDetailShell } from "./chart-detail-shell"
import { SiteHeader } from "@/components/site/site-header"

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
      <div className="charts-surface min-h-[calc(100dvh-80px)]" data-theme="system">
        <main id="main" tabIndex={-1} className="chart-detail-page">
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
    </>
  )
}
