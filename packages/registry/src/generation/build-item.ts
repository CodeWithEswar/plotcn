import type { ChartMetadata } from "../schema/metadata"
import {
  REGISTRY_ITEM_SCHEMA,
  type ShadcnRegistryItem,
  type ShadcnRegistryItemFile,
} from "../schema/registry"

export interface BuildRegistryItemOptions {
  /** Optional file content loader: takes relative path and returns file string */
  readFileContent?: (relativePath: string) => string
}

/**
 * Translates an internal Plotcn ChartMetadata definition into an official shadcn Registry Item.
 * Enforces the demo file policy (section 5.27): demo-only files are stripped from consumer files payload.
 */
export function buildRegistryItem(
  metadata: ChartMetadata,
  options: BuildRegistryItemOptions = {}
): ShadcnRegistryItem {
  const distributableFiles: ShadcnRegistryItemFile[] = []

  for (const file of metadata.files || []) {
    // Exclude demo/mock files unless explicitly flagged as source
    if (file.role === "demo" || file.path.includes(".demo.") || file.path.endsWith(".demo.tsx")) {
      continue
    }

    const content = options.readFileContent ? options.readFileContent(file.path) : undefined

    distributableFiles.push({
      path: file.target || file.path,
      content,
      type: file.type || "registry:component",
      target: file.target,
    })
  }

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: metadata.registryName,
    type: "registry:component",
    title: metadata.title,
    description: metadata.description,
    dependencies: [...metadata.dependencies],
    registryDependencies: metadata.registryDependencies ? [...metadata.registryDependencies] : [],
    files: distributableFiles,
    categories: [metadata.category, metadata.engine],
  }
}
