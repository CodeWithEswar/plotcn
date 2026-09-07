import { siteConfig } from "@/config/site"
import type { ChartMetadata } from "@/lib/charts/metadata"

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
  }
}

export function getChartJsonLd(chart: ChartMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: chart.title,
    description: chart.description,
    programmingLanguage: "TypeScript",
    runtimePlatform: "React",
    codeRepository: siteConfig.github,
    keywords: chart.tags.join(", "),
  }
}
