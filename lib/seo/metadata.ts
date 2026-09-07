import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { getCanonicalUrl } from "./canonical"
import { constructOpenGraph } from "./open-graph"

export interface PageMetadataOptions {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

export function constructPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const title = options.title ? `${options.title} — ${siteConfig.name}` : siteConfig.title
  const description = options.description || siteConfig.description
  const canonical = getCanonicalUrl(options.path || "")

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: constructOpenGraph({
      title: options.title,
      description,
      path: options.path,
    }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@codewitheswar",
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
