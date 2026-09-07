import { siteConfig } from "@/config/site"
import { getCanonicalUrl } from "./canonical"

export interface OpenGraphOptions {
  title?: string
  description?: string
  path?: string
  type?: "website" | "article"
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>
}

export function constructOpenGraph(options: OpenGraphOptions = {}) {
  const title = options.title ? `${options.title} — ${siteConfig.name}` : siteConfig.title
  const description = options.description || siteConfig.description
  const url = getCanonicalUrl(options.path || "")
  const type = options.type || "website"

  return {
    title,
    description,
    url,
    siteName: siteConfig.name,
    type,
    images: options.images || [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  }
}
