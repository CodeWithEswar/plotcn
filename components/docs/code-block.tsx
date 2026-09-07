import React from "react"
import { highlightCode } from "@/lib/shiki"
import { CodeBlockActions } from "./code-block-actions"
import { HugeiconsIcon } from "@hugeicons/react"
import { SourceCodeIcon, ComputerTerminal01Icon } from "@hugeicons/core-free-icons"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

let codeCounter = 0

export async function CodeBlock({
  code,
  language = "typescript",
  title,
  showLineNumbers,
}: CodeBlockProps) {
  const cleanCode = code.trim()
  const highlightedHtml = await highlightCode(cleanCode, language)

  // Default to line numbers if snippet is > 4 lines and not a short shell command
  const lineCount = cleanCode.split("\n").length
  const shouldShowLineNumbers =
    showLineNumbers !== undefined
      ? showLineNumbers
      : lineCount > 4 && !["bash", "sh", "shell"].includes(language.toLowerCase())

  const isTerminal = ["bash", "sh", "shell", "zsh"].includes(language.toLowerCase())
  const displayLabel = title || formatLanguageLabel(language)
  codeCounter++
  const elementId = `code-block-${codeCounter}`

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm min-w-0 text-left group/code">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2 bg-zinc-900/40 text-xs select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="text-zinc-500 shrink-0">
            <HugeiconsIcon
              icon={isTerminal ? ComputerTerminal01Icon : SourceCodeIcon}
              size={15}
              strokeWidth={1.8}
            />
          </span>
          <span className="font-mono text-zinc-300 truncate text-[12px]">{displayLabel}</span>
        </div>

        <CodeBlockActions rawCode={cleanCode} codeElementId={elementId} />
      </div>

      {/* Syntax-Highlighted HTML Rendered Directly on the Server */}
      <div
        id={elementId}
        className={`plotcn-code-content p-4 text-[13px] font-mono selection:bg-zinc-800 overflow-x-auto ${
          shouldShowLineNumbers ? "has-line-numbers" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}

function formatLanguageLabel(lang: string): string {
  const map: Record<string, string> = {
    ts: "TypeScript",
    typescript: "TypeScript",
    tsx: "TSX",
    js: "JavaScript",
    javascript: "JavaScript",
    jsx: "JSX",
    json: "JSON",
    bash: "Terminal",
    sh: "Terminal",
    shell: "Terminal",
    css: "CSS",
    html: "HTML",
    markdown: "Markdown",
    md: "Markdown",
    yaml: "YAML",
  }
  return map[lang.toLowerCase()] || lang.toUpperCase()
}
