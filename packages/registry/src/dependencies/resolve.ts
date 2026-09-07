import type { DependencyGraph } from "./graph"

/**
 * Resolves all transitive registryDependencies for an item in topological order (deepest dependency first).
 */
export function resolveTransitiveDependencies(
  itemName: string,
  graph: DependencyGraph,
  visited: Set<string> = new Set()
): string[] {
  const cleanName = itemName.startsWith("@plotcn/") ? itemName.replace("@plotcn/", "") : itemName
  const directDeps = graph.get(cleanName)

  if (!directDeps || directDeps.size === 0) {
    return []
  }

  const result: string[] = []

  for (const dep of directDeps) {
    if (!visited.has(dep)) {
      visited.add(dep)
      const subDeps = resolveTransitiveDependencies(dep, graph, visited)
      for (const s of subDeps) {
        if (!result.includes(s)) {
          result.push(s)
        }
      }
      if (!result.includes(dep)) {
        result.push(dep)
      }
    }
  }

  return result
}
