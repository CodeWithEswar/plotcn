/**
 * Serializes any registry object to a clean, deterministic, 2-space indented JSON string with trailing newline.
 */
export function serializeRegistryJson(data: unknown): string {
  return JSON.stringify(data, null, 2) + "\n"
}
