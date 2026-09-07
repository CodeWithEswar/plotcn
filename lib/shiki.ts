import { createHighlighter, type Highlighter } from "shiki"

/**
 * Singleton Shiki highlighter instance promise.
 * Avoids recreating the highlighter or loading grammar modules repeatedly.
 */
let highlighterPromise: Promise<Highlighter> | null = null

const REQUIRED_LANGS = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "bash",
  "css",
  "html",
  "markdown",
  "yaml",
] as const

/**
 * In-memory snippet cache to avoid re-highlighting identical code blocks
 * across doc routes or duplicate examples.
 */
const snippetCache = new Map<string, string>()

export async function getHighlighterSingleton(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vesper"],
      langs: [...REQUIRED_LANGS],
    })
  }
  return highlighterPromise
}

/**
 * Server-side syntax highlighter using cached singleton Shiki.
 * Uses a restrained dark theme (vesper) fitting Plotcn's aesthetic.
 */
export async function highlightCode(
  code: string,
  lang = "typescript"
): Promise<string> {
  const normalizedLang = normalizeLanguage(lang)
  const trimmed = code.replace(/\r\n/g, "\n").trim()
  const cacheKey = `${normalizedLang}::${trimmed}`

  const cached = snippetCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const highlighter = await getHighlighterSingleton()

    // Ensure the language is loaded if dynamic, else fallback to text
    const loadedLangs = highlighter.getLoadedLanguages()
    const targetLang = loadedLangs.includes(normalizedLang as any)
      ? normalizedLang
      : "text"

    const rawHtml = highlighter.codeToHtml(trimmed, {
      lang: targetLang,
      theme: "vesper",
    })
    const html = rawHtml.replace(/<\/span>\r?\n<span class="line">/g, '</span><span class="line">')

    snippetCache.set(cacheKey, html)
    return html
  } catch {
    // Fallback to plain text if parsing fails
    const fallback = `<pre class="shiki"><code>${escapeHtml(trimmed)}</code></pre>`
    snippetCache.set(cacheKey, fallback)
    return fallback
  }
}

function normalizeLanguage(lang: string): string {
  const lower = lang.toLowerCase().trim()
  switch (lower) {
    case "ts":
    case "typescript":
      return "typescript"
    case "tsx":
      return "tsx"
    case "js":
    case "javascript":
      return "javascript"
    case "jsx":
      return "jsx"
    case "json":
      return "json"
    case "sh":
    case "bash":
    case "shell":
    case "zsh":
      return "bash"
    case "css":
      return "css"
    case "html":
      return "html"
    case "md":
    case "markdown":
      return "markdown"
    case "yaml":
    case "yml":
      return "yaml"
    default:
      return "text"
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
