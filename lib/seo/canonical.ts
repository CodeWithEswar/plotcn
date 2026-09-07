import { siteConfig } from "@/config/site"

export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${siteConfig.url}${cleanPath}`
}
