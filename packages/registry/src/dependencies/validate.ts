import type { DependencyGraph, RegistryItemNode } from "./graph"

export interface DependencyValidationIssue {
  type: "missing" | "cycle" | "excessive-depth"
  item: string
  message: string
  cyclePath?: string[]
}

/**
 * Validates registry dependency graph for cycles, missing references, and excessive depth (> 3).
 */
export function validateDependencyGraph(
  items: readonly RegistryItemNode[],
  graph: DependencyGraph,
  maxAllowedDepth = 3
): DependencyValidationIssue[] {
  const issues: DependencyValidationIssue[] = []
  const knownItems = new Set(items.map((i) => i.name))

  // 1. Check for missing dependencies
  for (const [itemName, deps] of graph.entries()) {
    for (const dep of deps) {
      if (!knownItems.has(dep)) {
        issues.push({
          type: "missing",
          item: itemName,
          message: `Item "${itemName}" references non-existent registryDependency "${dep}".`,
        })
      }
    }
  }

  // 2. Check for cycles and depth using DFS
  for (const item of items) {
    const visited = new Set<string>()
    const stack: string[] = []

    function dfs(current: string, depth: number): boolean {
      visited.add(current)
      stack.push(current)

      if (depth > maxAllowedDepth) {
        issues.push({
          type: "excessive-depth",
          item: item.name,
          message: `Item "${item.name}" exceeds maximum allowed dependency depth of ${maxAllowedDepth} (current path: ${stack.join(" -> ")}).`,
        })
      }

      const neighbors = graph.get(current)
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            if (dfs(neighbor, depth + 1)) return true
          } else if (stack.includes(neighbor)) {
            const cycle = [...stack.slice(stack.indexOf(neighbor)), neighbor]
            issues.push({
              type: "cycle",
              item: item.name,
              message: `Cyclic registry dependency detected: ${cycle.join(" -> ")}`,
              cyclePath: cycle,
            })
            return true
          }
        }
      }

      stack.pop()
      return false
    }

    dfs(item.name, 0)
  }

  return issues
}
