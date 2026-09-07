import type { ShadcnRegistryItem } from "../schema/registry"

export interface FileValidationIssue {
  item: string
  path: string
  message: string
}

/**
 * Validates that all files declared in registry items actually exist on disk.
 */
export function validateRegistryFiles(
  items: readonly ShadcnRegistryItem[],
  fileExists: (relativePath: string) => boolean
): FileValidationIssue[] {
  const issues: FileValidationIssue[] = []

  for (const item of items) {
    for (const f of item.files || []) {
      if (f.path && !fileExists(f.path)) {
        issues.push({
          item: item.name,
          path: f.path,
          message: `Declared file "${f.path}" for item "${item.name}" does not exist on disk.`,
        })
      }
    }
  }

  return issues
}
