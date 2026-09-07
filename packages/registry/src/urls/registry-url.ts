export const siteConfig = {
  name: "Plotcn",
  url: typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://plotcn.vercel.app",
} as const

export const registryConfig = {
  namespace: "@plotcn",
  basePath: "/r",
} as const

/**
 * Returns the public JSON endpoint URL for a given registry item name.
 * e.g. "https://plotcn.vercel.app/r/line-basic.json"
 */
export function getRegistryItemUrl(name: string, baseUrl: string = siteConfig.url): string {
  const cleanName = name.startsWith("@plotcn/") ? name.replace("@plotcn/", "") : name
  const cleanBase = baseUrl.replace(/\/$/, "")
  return `${cleanBase}${registryConfig.basePath}/${cleanName}.json`
}

/**
 * Returns the public JSON endpoint URL for the global registry index.
 */
export function getRegistryIndexUrl(baseUrl: string = siteConfig.url): string {
  const cleanBase = baseUrl.replace(/\/$/, "")
  return `${cleanBase}${registryConfig.basePath}/registry.json`
}
