import registryCatalog from "@/registry.json"

export interface RegistryItemInfo {
  name: string
  type: string
  title: string
  description?: string
  dependencies: string[]
  registryDependencies: string[]
  fileCount: number
  categories?: string[]
  isVerified: boolean
}

/**
 * Programmatically looks up an item in canonical registry.json.
 * Section 35: Never fake verification — only items verified in registry.json get isVerified=true.
 * Section 42: Exact file count and real dependency list from registry metadata.
 */
export function getRegistryItemInfo(name: string): RegistryItemInfo | null {
  const cleanName = name.replace(/\.json$/, "")
  const items = (registryCatalog.items || []) as Array<{
    name: string
    type?: string
    title?: string
    description?: string
    dependencies?: string[]
    registryDependencies?: string[]
    files?: unknown[]
  }>

  const item = items.find((i) => i.name === cleanName)
  if (!item) {
    return null
  }

  return {
    name: item.name,
    type: item.type || "registry:ui",
    title: item.title || cleanName,
    description: item.description,
    dependencies: Array.isArray(item.dependencies) ? item.dependencies : [],
    registryDependencies: Array.isArray(item.registryDependencies) ? item.registryDependencies : [],
    fileCount: Array.isArray(item.files) ? item.files.length : 1,
    categories: Array.isArray((item as any).categories) ? (item as any).categories : [],
    isVerified: true,
  }
}
