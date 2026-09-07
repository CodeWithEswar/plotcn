import type { ShadcnRegistryItem } from "../schema/registry"

const ALLOWED_TYPES = new Set([
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:theme",
  "registry:example",
])

export interface ItemValidationIssue {
  item: string
  field: string
  message: string
}

/**
 * Validates array of registry items for unique names, recognized types, and file definitions.
 */
export function validateRegistryItems(items: readonly ShadcnRegistryItem[]): ItemValidationIssue[] {
  const issues: ItemValidationIssue[] = []
  const seenNames = new Set<string>()

  for (const item of items) {
    // Unique item name check
    if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
      issues.push({
        item: "<unknown>",
        field: "name",
        message: "Item is missing a valid string name.",
      })
      continue
    }

    if (seenNames.has(item.name)) {
      issues.push({
        item: item.name,
        field: "name",
        message: `Duplicate item name detected: "${item.name}".`,
      })
    } else {
      seenNames.add(item.name)
    }

    // Allowed registry type check
    if (!item.type || !ALLOWED_TYPES.has(item.type)) {
      issues.push({
        item: item.name,
        field: "type",
        message: `Unrecognized registry type "${item.type}". Allowed: ${Array.from(ALLOWED_TYPES).join(", ")}.`,
      })
    }

    // Files array check
    if (!item.files || !Array.isArray(item.files) || item.files.length === 0) {
      issues.push({
        item: item.name,
        field: "files",
        message: `Item "${item.name}" must contain at least one distributable file in files array.`,
      })
    } else {
      for (let i = 0; i < item.files.length; i++) {
        const f = item.files[i]
        if (!f.path || typeof f.path !== "string") {
          issues.push({
            item: item.name,
            field: `files[${i}].path`,
            message: `File at index ${i} in "${item.name}" is missing a valid path.`,
          })
        }
      }
    }
  }

  return issues
}
