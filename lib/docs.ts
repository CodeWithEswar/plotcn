import fs from "node:fs"
import path from "node:path"
import { slugify } from "./slugify"
import { getAllDocsItems, type DocsItem } from "@/config/docs"

export interface TocItem {
  id: string
  title: string
  level: 2 | 3
}

export interface DocMetadata {
  title: string
  description: string
  section: string
  slug: string
  href: string
}

export interface DocData extends DocMetadata {
  rawContent: string
  toc: TocItem[]
}

const CONTENT_DIR = path.join(process.cwd(), "content", "docs")

// Mapping from slug to relative file path in content/docs
const SLUG_TO_FILE: Record<string, string> = {
  introduction: "getting-started/introduction.mdx",
  installation: "getting-started/installation.mdx",
  "project-setup": "getting-started/project-setup.mdx",
  shadcn: "getting-started/shadcn-setup.mdx",
  registry: "getting-started/registry.mdx",
  usage: "fundamentals/usage.mdx",
  theming: "fundamentals/theming.mdx",
  accessibility: "fundamentals/accessibility.mdx",
  "google-charts": "google-charts/overview.mdx",
  "google-geochart": "google-charts/geochart.mdx",
}

/**
 * Parse frontmatter block from markdown content
 */
function parseFrontmatter(fileContent: string): {
  data: Record<string, string>
  content: string
} {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: fileContent }
  }

  const yamlBlock = match[1]
  const content = match[2]
  const data: Record<string, string> = {}

  for (const line of yamlBlock.split(/\r?\n/)) {
    const colonIndex = line.indexOf(":")
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      data[key] = value
    }
  }

  return { data, content }
}

/**
 * Extract H2 and H3 headings from markdown content for the Table of Contents
 */
export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = []
  const lines = content.split(/\r?\n/)
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) continue

    const h2Match = line.match(/^##\s+(.+)$/)
    if (h2Match) {
      const title = h2Match[1].trim().replace(/`([^`]+)`/g, "$1")
      toc.push({
        id: slugify(title),
        title,
        level: 2,
      })
      continue
    }

    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match) {
      const title = h3Match[1].trim().replace(/`([^`]+)`/g, "$1")
      toc.push({
        id: slugify(title),
        title,
        level: 3,
      })
    }
  }

  return toc
}

const docCache = new Map<string, DocData>()

/**
 * Get doc data by slug with in-memory caching
 */
export async function getDocData(slug: string): Promise<DocData | null> {
  const cached = docCache.get(slug)
  if (cached) {
    return cached
  }

  const relativePath = SLUG_TO_FILE[slug]
  if (!relativePath) {
    return null
  }

  const fullPath = path.join(CONTENT_DIR, relativePath)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8")
  const { data, content } = parseFrontmatter(fileContent)
  const toc = extractToc(content)

  const configItem = getAllDocsItems().find((item) => item.href === `/docs/${slug}`)

  const result: DocData = {
    title: data.title || configItem?.title || slug,
    description: data.description || configItem?.description || "",
    section: data.section || configItem?.section || "Documentation",
    slug,
    href: `/docs/${slug}`,
    rawContent: content,
    toc,
  }

  docCache.set(slug, result)
  return result
}

/**
 * Return all slugs for generateStaticParams
 */
export function getAllDocSlugs(): string[] {
  return Object.keys(SLUG_TO_FILE)
}
