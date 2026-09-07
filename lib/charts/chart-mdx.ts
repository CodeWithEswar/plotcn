import fs from "node:fs"
import path from "node:path"
import { slugify } from "@/lib/slugify"

export interface ChartTocItem {
  id: string
  title: string
  level: 2 | 3
}

export interface ChartMdxData {
  frontmatter: Record<string, string>
  rawContent: string
  toc: ChartTocItem[]
}

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

export function extractChartToc(content: string): ChartTocItem[] {
  const toc: ChartTocItem[] = []
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
      const title = h2Match[1].trim()
      const cleanTitle = title.replace(/`([^`]+)`/g, "$1")
      const id = slugify(cleanTitle)
      toc.push({ id, title, level: 2 })
      continue
    }

    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match) {
      const title = h3Match[1].trim()
      const cleanTitle = title.replace(/`([^`]+)`/g, "$1")
      const id = slugify(cleanTitle)
      toc.push({ id, title, level: 3 })
    }
  }

  return toc
}

export function getChartMdx(engine: string, slug: string): ChartMdxData | null {
  try {
    const mdxPath = path.join(process.cwd(), "content", "charts", engine, `${slug}.mdx`)
    if (!fs.existsSync(mdxPath)) {
      return null
    }

    const raw = fs.readFileSync(mdxPath, "utf-8")
    const { data: frontmatter, content: rawContent } = parseFrontmatter(raw)
    const toc = extractChartToc(rawContent)

    return {
      frontmatter,
      rawContent,
      toc,
    }
  } catch (err) {
    console.error(`Failed to read MDX for chart ${engine}/${slug}:`, err)
    return null
  }
}
