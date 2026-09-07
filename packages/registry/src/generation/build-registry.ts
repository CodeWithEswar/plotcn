import { REGISTRY_SCHEMA, type ShadcnRegistry, type ShadcnRegistryItem } from "../schema/registry"

export interface BuildRegistryOptions {
  name?: string
  homepage?: string
  include?: string[]
}

/**
 * Builds the canonical root registry.json catalog from a collection of items.
 */
export function buildRegistry(
  items: readonly ShadcnRegistryItem[],
  options: BuildRegistryOptions = {}
): ShadcnRegistry {
  const registry: ShadcnRegistry = {
    $schema: REGISTRY_SCHEMA,
    name: options.name || "plotcn",
    homepage: options.homepage || "https://plotcn.vercel.app",
    items: [...items],
  }

  if (options.include && options.include.length > 0) {
    registry.include = [...options.include]
  }

  return registry
}
