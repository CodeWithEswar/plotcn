import fs from "node:fs"
import path from "node:path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getChartsByEngine, getChartByEngineAndSlug } from "@/config/charts"
import { getRelatedCharts } from "@/lib/charts/get-charts"
import { ChartDetailView } from "@/components/chart-detail/chart-detail-view"
import { constructPageMetadata } from "@/lib/seo/metadata"

interface PageProps {
  params: Promise<{ chart: string }>
}

export async function generateStaticParams() {
  const d3List = getChartsByEngine("d3")
  return d3List.map((c) => ({ chart: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chart: slug } = await params
  const chart = getChartByEngineAndSlug("d3", slug)
  if (!chart) return { title: "Chart Not Found — Plotcn" }

  return constructPageMetadata({
    title: `${chart.title} — D3.js Component`,
    description: chart.description,
    path: `/charts/d3/${chart.slug}`,
  })
}

export default async function D3ChartPage({ params }: PageProps) {
  const { chart: slug } = await params
  const chart = getChartByEngineAndSlug("d3", slug)

  if (!chart) {
    notFound()
  }

  let sourceCode = ""
  try {
    const fullPath = path.join(process.cwd(), chart.componentPath)
    if (fs.existsSync(fullPath)) {
      sourceCode = fs.readFileSync(fullPath, "utf-8")
    }
  } catch (err) {
    console.error(`Failed to read source for ${chart.slug}:`, err)
  }

  const related = getRelatedCharts(chart, 3)

  return <ChartDetailView chart={chart} sourceCode={sourceCode} relatedCharts={related} />
}
