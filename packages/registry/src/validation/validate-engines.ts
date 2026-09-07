import type { ShadcnRegistryItem } from "../schema/registry"

export interface EngineIsolationIssue {
  item: string
  rule: string
  message: string
}

/**
 * Enforces strict engine isolation rules across registry items (sections 5.40 and 5.41).
 * Turns engine isolation conventions into automated, enforceable build-time guarantees.
 */
export function validateEngineIsolation(items: readonly ShadcnRegistryItem[]): EngineIsolationIssue[] {
  const issues: EngineIsolationIssue[] = []

  for (const item of items) {
    const isGoogle = item.name.startsWith("google-")
    const isD3 = item.name.startsWith("d3-")
    const isRecharts = !isGoogle && !isD3 && !item.name.startsWith("chart-")

    const deps = item.dependencies || []
    const regDeps = item.registryDependencies || []

    // 1. D3 Engine Rules
    if (isD3) {
      if (deps.includes("d3")) {
        issues.push({
          item: item.name,
          rule: "d3-modular-dependencies",
          message: `D3 item "${item.name}" must not use the full "d3" umbrella package. Use focused modules (e.g. d3-array, d3-scale, d3-shape).`,
        })
      }
      if (deps.includes("recharts")) {
        issues.push({
          item: item.name,
          rule: "d3-no-recharts-leakage",
          message: `D3 item "${item.name}" must not declare "recharts" dependency.`,
        })
      }
      if (regDeps.includes("google-chart-loader") || regDeps.includes("google-chart-container")) {
        issues.push({
          item: item.name,
          rule: "d3-no-google-leakage",
          message: `D3 item "${item.name}" must not declare Google registry dependencies.`,
        })
      }
    }

    // 2. Recharts Engine Rules
    if (isRecharts) {
      if (regDeps.includes("google-chart-loader") || regDeps.includes("google-chart-container")) {
        issues.push({
          item: item.name,
          rule: "recharts-no-google-leakage",
          message: `Recharts item "${item.name}" must not depend on Google loader or Google shared container.`,
        })
      }
      const d3Deps = deps.filter((d) => d.startsWith("d3-") || d === "d3")
      if (d3Deps.length > 0) {
        issues.push({
          item: item.name,
          rule: "recharts-no-d3-leakage",
          message: `Recharts item "${item.name}" must not pull D3 dependencies (${d3Deps.join(", ")}).`,
        })
      }
    }

    // 3. Google Engine Rules
    if (isGoogle) {
      if (deps.includes("recharts")) {
        issues.push({
          item: item.name,
          rule: "google-no-recharts-leakage",
          message: `Google Charts item "${item.name}" must not declare "recharts" dependency.`,
        })
      }
      const d3Deps = deps.filter((d) => d.startsWith("d3-") || d === "d3")
      if (d3Deps.length > 0) {
        issues.push({
          item: item.name,
          rule: "google-no-d3-leakage",
          message: `Google Charts item "${item.name}" must not declare D3 dependencies (${d3Deps.join(", ")}).`,
        })
      }
      const mapDeps = deps.filter((d) => d.includes("google-maps") || d.includes("@google/maps"))
      if (mapDeps.length > 0) {
        issues.push({
          item: item.name,
          rule: "google-no-maps-sdk",
          message: `Google Charts item "${item.name}" must not depend on Google Maps SDK (${mapDeps.join(", ")}).`,
        })
      }
      if (
        item.name !== "google-chart-loader" &&
        item.name !== "google-chart-container" &&
        !regDeps.includes("google-chart-loader") &&
        !regDeps.includes("google-chart-container")
      ) {
        issues.push({
          item: item.name,
          rule: "google-shared-loader-required",
          message: `Google Charts item "${item.name}" must declare "google-chart-loader" or "google-chart-container" in registryDependencies.`,
        })
      }
    }
  }

  return issues
}
