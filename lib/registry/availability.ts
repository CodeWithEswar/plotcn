import { getRegistryItemUrl } from "./registry-url"
export type RegistryAvailability = "ready" | "unpublished" | "unavailable"
const checks = new Map<
  string,
  { expires: number; result: RegistryAvailability }
>()
/** Verify the configured public endpoint before offering a runnable install command. */
export async function checkRegistryAvailability(
  name: string
): Promise<RegistryAvailability> {
  const cached = checks.get(name)
  if (cached && cached.expires > Date.now()) return cached.result
  try {
    const response = await fetch(getRegistryItemUrl(name), {
      signal: AbortSignal.timeout(6000),
    })
    const item = response.ok ? await response.json() : null
    const result: RegistryAvailability =
      response.status === 404
        ? "unpublished"
        : response.ok &&
            item?.name === name &&
            Array.isArray(item.files) &&
            item.files.length > 0
          ? "ready"
          : "unavailable"
    checks.set(name, { expires: Date.now() + 60_000, result })
    return result
  } catch {
    return "unavailable"
  }
}
