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
  const googleList = getChartsByEngine("google")
  return googleList.map((c) => ({ chart: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chart: slug } = await params
  const chart = getChartByEngineAndSlug("google", slug)
  if (!chart) return { title: "Chart Not Found — Plotcn" }

  return constructPageMetadata({
    title: `${chart.title} — Google Charts Component`,
    description: chart.description,
    path: `/charts/google/${chart.slug}`,
  })
}

export default async function GoogleChartPage({ params }: PageProps) {
  const { chart: slug } = await params
  const chart = getChartByEngineAndSlug("google", slug)

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
