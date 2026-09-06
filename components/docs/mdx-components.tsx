import React from "react"
import Link from "next/link"
import { HeadingAnchor } from "./heading-anchor"
import { DocsCallout, type CalloutType } from "./docs-callout"
import { PackageManagerTabs } from "./package-manager-tabs"
import { CodeBlock } from "./code-block"
import { slugify } from "@/lib/slugify"
import {
  DocsIntroHero,
  DocsMeta,
  DocsDivider,
  VisualizationSystemPreview,
  EngineGrid,
  RegistryFlow,
  PlotcnArchitecture,
  ProjectStatus,
  DocsNextSteps,
} from "./intro-components"
import { DocsArticleActions } from "./docs-article-actions"

interface MDXRendererProps {
  content: string
  slug?: string
  rawContent?: string
}

export async function MDXRenderer({ content, slug, rawContent }: MDXRendererProps) {
  const elements = await parseMarkdownToReact(content, { slug, rawContent })
  return <div className="docs-content max-w-none text-zinc-300">{elements}</div>
}

interface ParseContext {
  slug?: string
  rawContent?: string
}

/**
 * Parses markdown body into a structured array of React server elements.
 */
async function parseMarkdownToReact(
  markdown: string,
  context?: ParseContext
): Promise<React.ReactNode[]> {
  const lines = markdown.split(/\r?\n/)
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      i++
      continue
    }

    // 1. Package Manager block: :::package-manager ... :::
    if (trimmed === ":::package-manager") {
      i++
      const cmdLines: string[] = []
      while (i < lines.length && lines[i].trim() !== ":::") {
        cmdLines.push(lines[i])
        i++
      }
      i++ // skip closing :::
      const fullCmd = cmdLines.join("\n").trim()
      elements.push(
        <PackageManagerTabs key={`pkg-${i}`} command={fullCmd} />
      )
      continue
    }

    // 2. Code Block: ```[lang] [title="..."]
    if (trimmed.startsWith("```")) {
      const info = trimmed.slice(3).trim()
      // Extract title if present e.g. ```json title="components.json"
      let language = info
      let title: string | undefined

      const titleMatch = info.match(/title="([^"]+)"/)
      if (titleMatch) {
        title = titleMatch[1]
        language = info.replace(titleMatch[0], "").trim()
      } else {
        const parts = info.split(/\s+/)
        language = parts[0] || "text"
      }

      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      const rawCode = codeLines.join("\n")

      elements.push(
        <CodeBlock
          key={`code-${i}`}
          code={rawCode}
          language={language || "typescript"}
          title={title}
        />
      )
      continue
    }

    // 3. GitHub Alert / Callout block: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
    const alertMatch = trimmed.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i)
    if (alertMatch) {
      const calloutType = alertMatch[1].toLowerCase() as CalloutType
      i++
      const calloutLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        calloutLines.push(lines[i].replace(/^>\s?/, ""))
        i++
      }
      const calloutText = calloutLines.join(" ").trim()
      elements.push(
        <DocsCallout key={`callout-${i}`} type={calloutType}>
          {renderInlineFormatting(calloutText)}
        </DocsCallout>
      )
      continue
    }

    // 4. Standard Blockquote: > text
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""))
        i++
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-4 border-l-2 border-zinc-700 pl-4 italic text-zinc-400 text-sm leading-relaxed"
        >
          {renderInlineFormatting(quoteLines.join(" ").trim())}
        </blockquote>
      )
      continue
    }

    // 5. Custom Docs Component Tags
    if (trimmed.startsWith("<DocsIntroHero")) {
      const tagLines: string[] = []
      while (i < lines.length) {
        tagLines.push(lines[i])
        if (lines[i].includes("/>") || lines[i].includes("</DocsIntroHero>")) {
          i++
          break
        }
        i++
      }
      const fullTag = tagLines.join(" ")
      const eyebrowMatch = fullTag.match(/eyebrow="([^"]*)"/)
      const titleMatch = fullTag.match(/title="([^"]*)"/)
      const descMatch = fullTag.match(/description="([^"]*)"/)

      elements.push(
        <DocsIntroHero
          key={`hero-${i}`}
          eyebrow={eyebrowMatch ? eyebrowMatch[1] : undefined}
          title={titleMatch ? titleMatch[1] : undefined}
          description={descMatch ? descMatch[1] : undefined}
        />
      )
      continue
    }

    if (trimmed.startsWith("<DocsMeta")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DocsMeta>")) {
        i++
      }
      i++
      elements.push(<DocsMeta key={`meta-${i}`} />)
      if (context?.slug === "introduction" && context?.rawContent) {
        elements.push(
          <div key={`meta-actions-${i}`} className="my-2 not-prose">
            <DocsArticleActions rawContent={context.rawContent} slug={context.slug} />
          </div>
        )
      }
      continue
    }

    if (trimmed.startsWith("<VisualizationSystemPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VisualizationSystemPreview>")) {
        i++
      }
      i++
      elements.push(<VisualizationSystemPreview key={`vis-prev-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineGrid")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineGrid>")) {
        i++
      }
      i++
      elements.push(<EngineGrid key={`engine-grid-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryFlow key={`reg-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PlotcnArchitecture")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PlotcnArchitecture>")) {
        i++
      }
      i++
      elements.push(<PlotcnArchitecture key={`arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProjectStatus")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProjectStatus>")) {
        i++
      }
      i++
      elements.push(<ProjectStatus key={`proj-status-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DocsDivider")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DocsDivider>")) {
        i++
      }
      i++
      elements.push(<DocsDivider key={`divider-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DocsNextSteps")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DocsNextSteps>")) {
        i++
      }
      i++
      elements.push(<DocsNextSteps key={`next-steps-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DocsCallout")) {
      const openLine = trimmed
      const titleMatch = openLine.match(/title="([^"]*)"/)
      const typeMatch = openLine.match(/type="([^"]*)"/)
      const title = titleMatch ? titleMatch[1] : undefined
      const calloutType = (typeMatch ? typeMatch[1] : "note") as CalloutType

      i++
      const bodyLines: string[] = []
      while (i < lines.length && !lines[i].includes("</DocsCallout>")) {
        bodyLines.push(lines[i])
        i++
      }
      i++ // skip closing </DocsCallout>

      const calloutBody = bodyLines.join("\n").trim()
      elements.push(
        <DocsCallout key={`callout-${i}`} title={title} type={calloutType}>
          {renderInlineFormatting(calloutBody)}
        </DocsCallout>
      )
      continue
    }

    if (trimmed.startsWith("<")) {
      // Skip unhandled HTML/JSX opening tag
      i++
      continue
    }

    // 6. Headings: ## and ###
    const h2Match = line.match(/^##\s+(.+)$/)
    if (h2Match) {
      const title = h2Match[1].trim()
      const cleanTitle = title.replace(/`([^`]+)`/g, "$1")
      const id = slugify(cleanTitle)
      elements.push(
        <HeadingAnchor key={`h2-${i}-${id}`} level={2} id={id}>
          {renderInlineFormatting(title)}
        </HeadingAnchor>
      )
      i++
      continue
    }

    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match) {
      const title = h3Match[1].trim()
      const cleanTitle = title.replace(/`([^`]+)`/g, "$1")
      const id = slugify(cleanTitle)
      elements.push(
        <HeadingAnchor key={`h3-${i}-${id}`} level={3} id={id}>
          {renderInlineFormatting(title)}
        </HeadingAnchor>
      )
      i++
      continue
    }

    // 7. Markdown Table: | col | col |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        elements.push(renderTable(tableLines, `table-${i}`))
      }
      continue
    }

    // 7. Unordered List: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 ml-5 list-disc space-y-2 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // 8. Ordered List: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 ml-5 list-decimal space-y-2 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // 9. Standard Paragraph
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("<") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim())
      i++
    }

    if (paragraphLines.length > 0) {
      const paragraphText = paragraphLines.join(" ")
      elements.push(
        <p key={`p-${i}`} className="my-4 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
          {renderInlineFormatting(paragraphText)}
        </p>
      )
    }
  }

  return elements
}

/**
 * Render Markdown table to responsive HTML table
 */
function renderTable(tableLines: string[], key: string): React.ReactNode {
  const headerRow = tableLines[0]
  const rows = tableLines.slice(2) // Skip header and separator

  const parseCells = (line: string) =>
    line
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim())

  const headers = parseCells(headerRow)

  return (
    <div key={key} className="my-6 w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-zinc-950/60 shadow-sm">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08] bg-zinc-900/40 text-zinc-200 font-mono text-[11px] uppercase tracking-wider">
            {headers.map((h, idx) => (
              <th key={idx} className="px-4 py-3 font-semibold">
                {renderInlineFormatting(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {rows.map((rowLine, rIdx) => {
            const cells = parseCells(rowLine)
            return (
              <tr key={rIdx} className="hover:bg-zinc-900/30 transition-colors">
                {cells.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 text-zinc-300">
                    {renderInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Formats inline Markdown: **bold**, `code`, [link](url)
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex to split by inline code, links, and bold text
  const tokens = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g)

  return tokens.map((token, index) => {
    // Inline code: `code`
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      return (
        <code
          key={index}
          className="rounded-md border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[12px] text-zinc-200"
        >
          {token.slice(1, -1)}
        </code>
      )
    }

    // Bold text: **bold**
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-zinc-100">
          {token.slice(2, -2)}
        </strong>
      )
    }

    // Link: [label](href)
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const label = linkMatch[1]
      const href = linkMatch[2]
      const isExternal = href.startsWith("http://") || href.startsWith("https://")

      if (isExternal) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-white font-medium underline decoration-zinc-600 underline-offset-4 hover:decoration-white transition-colors"
          >
            {label}
          </a>
        )
      }

      return (
        <Link
          key={index}
          href={href}
          className="text-white font-medium underline decoration-zinc-600 underline-offset-4 hover:decoration-white transition-colors"
        >
          {label}
        </Link>
      )
    }

    return token
  })
}
