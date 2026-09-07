import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { charts } from "@/config/charts"
import { getAllDocSlugs } from "@/lib/docs"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/docs`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/charts`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/blocks`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/playground`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/themes`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/examples`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/showcase`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.7 },
  ]

  // Implemented chart detail routes
  const chartRoutes: MetadataRoute.Sitemap = charts.map((chart) => ({
    url: `${baseUrl}/charts/${chart.engine}/${chart.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }))

  // Documentation routes
  const docSlugs = getAllDocSlugs()
  const docRoutes: MetadataRoute.Sitemap = docSlugs.map((slug) => ({
    url: `${baseUrl}/docs/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Blocks detail routes
  const blockSlugs = ["analytics-overview", "revenue-funnel", "network-topology"]
  const blockRoutes: MetadataRoute.Sitemap = blockSlugs.map((slug) => ({
    url: `${baseUrl}/blocks/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.75,
  }))

  return [...staticRoutes, ...chartRoutes, ...docRoutes, ...blockRoutes]
}
