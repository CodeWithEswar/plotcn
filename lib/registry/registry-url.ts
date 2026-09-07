import { siteConfig } from "@/config/site"

export function getRegistryItemUrl(name: string): string {
  const cleanName = name.replace(/\.json$/, "")
  return `${siteConfig.url}/r/${cleanName}.json`
}

export function getRegistryRawUrl(name: string): string {
  return `/r/${name.replace(/\.json$/, "")}.json`
}
