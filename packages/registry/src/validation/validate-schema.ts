import { REGISTRY_SCHEMA, type ShadcnRegistry } from "../schema/registry"

export interface SchemaValidationIssue {
  field: string
  message: string
}

/**
 * Validates root registry catalog object against shadcn registry schema standards.
 */
export function validateRegistrySchema(registry: unknown): SchemaValidationIssue[] {
  const issues: SchemaValidationIssue[] = []

  if (!registry || typeof registry !== "object") {
    return [{ field: "root", message: "Registry must be a non-null object." }]
  }

  const reg = registry as Partial<ShadcnRegistry>

  if (!reg.$schema || reg.$schema !== REGISTRY_SCHEMA) {
    issues.push({
      field: "$schema",
      message: `Expected $schema to be "${REGISTRY_SCHEMA}", received "${reg.$schema}".`,
    })
  }

  if (!reg.name || typeof reg.name !== "string" || reg.name.trim() === "") {
    issues.push({
      field: "name",
      message: 'Registry must specify a non-empty "name" field (e.g. "plotcn").',
    })
  }

  if (!reg.homepage || typeof reg.homepage !== "string" || !reg.homepage.startsWith("http")) {
    issues.push({
      field: "homepage",
      message: 'Registry must specify a valid "homepage" URL.',
    })
  }

  if (!reg.items || !Array.isArray(reg.items)) {
    issues.push({
      field: "items",
      message: 'Registry must contain an "items" array.',
    })
  }

  return issues
}
