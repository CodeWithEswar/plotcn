export interface RegistryItemNode {
  name: string
  registryDependencies: readonly string[]
  dependencies: readonly string[]
}

export type DependencyGraph = Map<string, Set<string>>

/**
 * Builds a directed adjacency graph of registryDependencies.
 */
export function buildDependencyGraph(items: readonly RegistryItemNode[]): DependencyGraph {
  const graph: DependencyGraph = new Map()

  for (const item of items) {
    if (!graph.has(item.name)) {
      graph.set(item.name, new Set())
    }
    const deps = graph.get(item.name)!
    for (const dep of item.registryDependencies || []) {
      // Strip namespace if present (@plotcn/chart-container -> chart-container)
      const cleanName = dep.startsWith("@plotcn/") ? dep.replace("@plotcn/", "") : dep
      deps.add(cleanName)
    }
  }

  return graph
}
