import fs from "node:fs"
import path from "node:path"
import type { RegistryItemManifest } from "./metadata"

export async function getRegistryItem(name: string): Promise<RegistryItemManifest | null> {
  const cleanName = name.replace(/\.json$/, "")
  try {
    const filePath = path.join(process.cwd(), "public", "r", `${cleanName}.json`)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8")
      return JSON.parse(content) as RegistryItemManifest
    }
  } catch (err) {
    console.error(`Error loading registry item ${name}:`, err)
  }
  return null
}
