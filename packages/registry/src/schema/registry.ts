export const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json"
export const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
export const DEFAULT_REGISTRY_NAMESPACE = "@plotcn"

export type ShadcnRegistryType =
  | "registry:ui"
  | "registry:component"
  | "registry:block"
  | "registry:hook"
  | "registry:lib"
  | "registry:theme"

export interface ShadcnRegistryItemFile {
  path: string
  content?: string
  type?: string
  target?: string
}

export interface ShadcnRegistryItem {
  $schema?: string
  name: string
  type: ShadcnRegistryType | string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  devDependencies?: string[]
  files: ShadcnRegistryItemFile[]
  categories?: string[]
  meta?: Record<string, unknown>
}

export interface ShadcnRegistry {
  $schema: string
  name: string
  homepage: string
  items: ShadcnRegistryItem[]
  include?: string[]
}
