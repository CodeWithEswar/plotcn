"use client"

import React, { useEffect, useState, useId } from "react"
import { cn } from "@/lib/utils"

let highlighterPromise: Promise<import("shiki/core").HighlighterCore> | null = null

async function getClientHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/themes/vesper.mjs"),
    ]).then(([core, engine, tsx, ts, json, bash, theme]) =>
      core.createHighlighterCore({
        themes: [theme.default],
        langs: [tsx.default, ts.default, json.default, bash.default],
        engine: engine.createJavaScriptRegexEngine(),
      })
    )
  }
  return highlighterPromise
}

const clientHighlightCache = new Map<string, string>()

export interface CodeHighlightProps {
  code: string
  language?: "tsx" | "typescript" | "json" | "bash"
  initialHtml?: string
  className?: string
  maxHeight?: string
  showLineNumbers?: boolean
  isWrapped?: boolean
}

export function CodeHighlight({
  code,
  language = "tsx",
  initialHtml,
  className,
  maxHeight,
  showLineNumbers = false,
  isWrapped = false,
}: CodeHighlightProps) {
  const cleanHtml = (raw: string) => raw.replace(/<\/span>\r?\n<span class="line">/g, '</span><span class="line">')
  const trimmed = code.replace(/\r\n/g, "\n").trim()
  const [html, setHtml] = useState<string | null>(initialHtml ? cleanHtml(initialHtml) : null)
  const id = useId()

  useEffect(() => {
    if (initialHtml) {
      setHtml(cleanHtml(initialHtml))
      return
    }

    const cacheKey = `${language}::${trimmed}`
    const cached = clientHighlightCache.get(cacheKey)
    if (cached) {
      setHtml(cleanHtml(cached))
      return
    }

    let active = true
    getClientHighlighter()
      .then((h) => {
        const loadedLangs = h.getLoadedLanguages()
        const targetLang = loadedLangs.includes(language as any) ? language : "tsx"
        const result = h.codeToHtml(trimmed, {
          lang: targetLang,
          theme: "vesper",
        })
        const cleaned = cleanHtml(result)
        clientHighlightCache.set(cacheKey, cleaned)
        if (active) setHtml(cleaned)
      })
      .catch(() => {
        // graceful fallback to plain pre/code
      })

    return () => {
      active = false
    }
  }, [trimmed, language, initialHtml])

  return (
    <div
      id={id}
      style={maxHeight ? { maxHeight } : undefined}
      className={cn(
        "plotcn-code-content font-mono text-xs overflow-auto scrollbar-thin selection:bg-zinc-800",
        showLineNumbers && "has-line-numbers",
        isWrapped && "plotcn-code-wrapped",
        className
      )}
    >
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="shiki vesper m-0 p-3 bg-zinc-950 text-zinc-200">
          <code>{trimmed}</code>
        </pre>
      )}
    </div>
  )
}
