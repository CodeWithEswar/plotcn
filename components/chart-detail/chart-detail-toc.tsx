"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity01Icon,
  AccessibilityIcon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  CodeIcon,
  DatabaseIcon,
  Download01Icon,
  GitBranchIcon,
  GridViewIcon,
  PlayCircle02Icon,
  SearchIcon,
  Settings01Icon,
  Shield01Icon,
  SmartPhone01Icon,
  SquareArrowRight01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { charts } from "@/config/charts"
import { chartHref } from "@/lib/charts/filters"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface TocItem {
  id: string
  label: string
  index?: string
  /** Optional explicit icon override — takes priority over id/label matching below. */
  icon?: typeof PlayCircle02Icon
}

const defaultTocItems: TocItem[] = [
  { id: "section-preview", label: "Preview Lab" },
  { id: "section-usage", label: "Usage" },
  { id: "section-data", label: "Data Format" },
  { id: "section-props", label: "Props Reference" },
  { id: "section-examples", label: "Examples & States" },
  { id: "section-responsive", label: "Responsive Lab" },
  { id: "section-accessibility", label: "Accessibility" },
  { id: "section-source", label: "Source Anatomy" },
  { id: "section-related", label: "Related Charts" },
]

// One icon per default section — acts as a wayfinding mnemonic, not decoration.
// Checked first, by the exact id of the default items above.
const ID_ICON_MAP: Record<string, typeof PlayCircle02Icon> = {
  "section-preview": PlayCircle02Icon,
  "section-usage": CodeIcon,
  "section-data": DatabaseIcon,
  "section-props": Settings01Icon,
  "section-examples": GridViewIcon,
  "section-responsive": SmartPhone01Icon,
  "section-accessibility": AccessibilityIcon,
  "section-source": GitBranchIcon,
  "section-related": SquareArrowRight01Icon,
}

// Fallback for custom `items` whose ids don't match the map above — matched
// against "<id> <label>" in order, so page-specific TOCs (different wording,
// extra sections) still get a distinct icon instead of collapsing to one.
const KEYWORD_ICON_RULES: Array<[RegExp, typeof PlayCircle02Icon]> = [
  [/responsive/, SmartPhone01Icon],
  [/accessib/, AccessibilityIcon],
  [/safety|secur/, Shield01Icon],
  [/contract|schema|data.?format/, DatabaseIcon],
  [/source|anatomy/, GitBranchIcon],
  [/related/, SquareArrowRight01Icon],
  [/explorer/, SearchIcon],
  [/props?\b/, Settings01Icon],
  [/install/, Download01Icon],
  [/best.?suited|suited.?for|use.?case/, CheckmarkCircle01Icon],
  [/preview|demo/, PlayCircle02Icon],
  [/usage|getting.?started/, CodeIcon],
  [/example|state/, GridViewIcon],
]

function resolveIcon(item: TocItem) {
  if (item.icon) return item.icon
  if (ID_ICON_MAP[item.id]) return ID_ICON_MAP[item.id]
  const haystack = `${item.id} ${item.label}`.toLowerCase()
  const rule = KEYWORD_ICON_RULES.find(([pattern]) => pattern.test(haystack))
  return rule ? rule[1] : GridViewIcon
}

const STATUS_DOT: Record<string, string> = {
  stable: "bg-emerald-500",
  beta: "bg-amber-500",
  experimental: "bg-sky-500",
  deprecated: "bg-red-500",
}

function statusDotClass(status?: string) {
  if (!status) return "bg-muted-foreground/40"
  return STATUS_DOT[status.toLowerCase()] ?? "bg-muted-foreground/40"
}

function FactRow({
  icon,
  label,
  value,
}: {
  icon: typeof PlayCircle02Icon
  label: string
  value?: string
}) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        <HugeiconsIcon icon={icon} size={13} strokeWidth={1.75} className="shrink-0" />
        {label}
      </dt>
      <dd className="truncate font-mono text-[11px] text-foreground">{value}</dd>
    </div>
  )
}

const ID_ALIASES: Record<string, string[]> = {
  "responsive-behavior": ["section-responsive", "responsive", "responsive-simulator"],
  "section-responsive": ["responsive-behavior", "responsive"],
  "accessibility-keyboard-navigation": ["section-accessibility", "accessibility", "accessibility-states"],
  "section-accessibility": ["accessibility-keyboard-navigation", "accessibility", "accessibility-states"],
  "data-safety-guarantee": ["data-safety-guarantees", "section-safety", "data-safety", "safety"],
  "data-safety-guarantees": ["data-safety-guarantee", "section-safety", "data-safety"],
  "section-safety": ["data-safety-guarantee", "data-safety-guarantees", "safety"],
  "component-props": ["props-reference", "section-props-explorer", "section-props", "props"],
  "props-reference": ["component-props", "section-props-explorer", "section-props"],
  "section-props": ["props-reference", "component-props", "section-props-explorer"],
  "section-props-explorer": ["props-reference", "component-props", "section-props"],
  "best-suited-for": ["area-family-positioning", "when-to-use", "use-cases"],
  "installation": ["section-usage", "install", "getting-started"],
  "section-usage": ["installation", "usage"],
  "data-contract": ["section-data", "data-format", "data-schema"],
  "section-data": ["data-contract", "data-format"],
  "section-source": ["source-code", "source-anatomy", "anatomy"],
  "section-related": ["related-charts", "related-components", "related"],
  "section-preview": ["preview-lab", "live-preview", "preview"],
}

export function resolveTocElement(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null

  // 1. Direct ID match
  const direct = document.getElementById(id)
  if (direct) return direct

  // 2. Direct data-toc-target attribute match
  const targetAttr = document.querySelector<HTMLElement>(`[data-toc-target="${id}"]`)
  if (targetAttr) return targetAttr

  // 3. Known aliases
  const aliases = ID_ALIASES[id] || []
  for (const alias of aliases) {
    const el = document.getElementById(alias)
    if (el) return el
    const elAttr = document.querySelector<HTMLElement>(`[data-toc-target="${alias}"]`)
    if (elAttr) return elAttr
  }

  // 4. Prefix/suffix variations
  if (id.startsWith("section-")) {
    const stripped = id.replace(/^section-/, "")
    const el = document.getElementById(stripped)
    if (el) return el
  } else {
    const prefixed = `section-${id}`
    const el = document.getElementById(prefixed)
    if (el) return el
  }

  return null
}

export interface ChartDetailTocProps {
  items?: TocItem[]
  chart?: ChartMetadata
  compact?: boolean
}

export function ChartDetailToc({
  items = defaultTocItems,
  chart,
  compact = false,
}: ChartDetailTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "")
  const isManualScrolling = React.useRef(false)
  const manualScrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Listen to hash changes in URL
  useEffect(() => {
    if (typeof window === "undefined") return
    const handleHash = () => {
      if (window.location.hash) {
        const hashId = window.location.hash.replace("#", "")
        if (items.some((item) => item.id === hashId)) {
          setActiveId(hashId)
        }
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [items])

  // Continuous, robust scroll-spy
  useEffect(() => {
    if (typeof window === "undefined" || !items.length) return

    const updateActiveSection = () => {
      if (isManualScrolling.current) return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // 1. Top of page safeguard
      if (scrollY < 120) {
        if (items[0]) {
          setActiveId(items[0].id)
        }
        return
      }

      // 2. Bottom of page safeguard: when user hits the bottom, highlight the last valid section
      if (windowHeight + scrollY >= documentHeight - 60) {
        for (let i = items.length - 1; i >= 0; i--) {
          if (resolveTocElement(items[i].id)) {
            setActiveId(items[i].id)
            return
          }
        }
      }

      // 3. Normal reading zone calculation
      // Header is ~70px sticky. A comfortable reading zone begins ~120-140px down.
      const readingOffset = 130

      interface ItemWithPos {
        id: string
        top: number
      }

      const visibleTargets: ItemWithPos[] = []

      for (const item of items) {
        const el = resolveTocElement(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          visibleTargets.push({
            id: item.id,
            top: rect.top,
          })
        }
      }

      if (!visibleTargets.length) return

      // Find the last item that has reached or passed the reading zone
      let activeItem = visibleTargets[0]
      for (const target of visibleTargets) {
        if (target.top <= readingOffset) {
          activeItem = target
        } else {
          break
        }
      }

      setActiveId(activeItem.id)
    }

    let rafId: number | null = null
    const onScroll = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection()
        rafId = null
      })
    }

    // Initial check and deferred checks (after chart canvases/fonts finish layout)
    updateActiveSection()
    const timer1 = setTimeout(updateActiveSection, 150)
    const timer2 = setTimeout(updateActiveSection, 500)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current)
    }
  }, [items])

  const handleScrollTo = (id: string) => {
    const el = resolveTocElement(id)
    if (el) {
      isManualScrolling.current = true
      if (manualScrollTimer.current) {
        clearTimeout(manualScrollTimer.current)
      }
      setActiveId(id)

      const headerOffset = 80
      const elementPosition = el.getBoundingClientRect().top + window.scrollY
      const offsetPosition = Math.max(0, elementPosition - headerOffset)

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      window.history.pushState(null, "", `#${id}`)

      // Resume auto-detection after smooth scroll settles
      manualScrollTimer.current = setTimeout(() => {
        isManualScrolling.current = false
      }, 800)
    }
  }

  const nextChart = useMemo(() => {
    if (!chart) return null
    const currentIndex = charts.findIndex(
      (c) => c.id === chart.id || c.registryName === chart.registryName
    )
    if (currentIndex === -1) return null
    return charts[(currentIndex + 1) % charts.length]
  }, [chart])

  if (compact) {
    const activeItem = items.find((item) => item.id === activeId) ?? items[0]
    const ActiveIcon = activeItem ? resolveIcon(activeItem) : PlayCircle02Icon

    return (
      <div className="chart-detail-toc chart-detail-toc-compact flex-1 min-w-0 h-9 min-h-[36px] max-h-[36px]">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="w-full h-9 min-h-[36px] max-h-[36px] rounded-lg gap-2 px-3 text-xs font-medium border-border bg-background hover:bg-muted text-foreground justify-between shrink-0 focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
              />
            }
          >
            <span className="flex items-center gap-2 min-w-0 truncate">
              <HugeiconsIcon
                icon={ActiveIcon}
                size={15}
                strokeWidth={1.75}
                className="shrink-0 text-muted-foreground"
              />
              <span className="truncate">{activeItem?.label || "On this page"}</span>
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={13}
              strokeWidth={2}
              className="pointer-events-none shrink-0 text-muted-foreground ml-1.5"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-(--anchor-width) min-w-[220px] max-h-80 overflow-y-auto bg-popover text-popover-foreground border border-border backdrop-blur-md p-1 shadow-xl rounded-lg"
          >
            <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              On this page
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border my-1" />
            {items.map((item) => {
              const isActive = activeId === item.id
              const ItemIcon = resolveIcon(item)
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={cn(
                    "flex items-center justify-between gap-2.5 px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors outline-hidden select-none",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0 truncate">
                    <HugeiconsIcon
                      icon={ItemIcon}
                      size={14}
                      strokeWidth={1.75}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.index ? (
                    <span
                      className={cn(
                        "font-mono text-[10px] shrink-0 tabular-nums",
                        isActive ? "text-foreground font-medium" : "text-muted-foreground"
                      )}
                    >
                      {item.index}
                    </span>
                  ) : isActive ? (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={12}
                      strokeWidth={2.5}
                      className="text-foreground shrink-0"
                    />
                  ) : null}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <nav aria-label="Table of contents" className="chart-detail-toc w-full max-w-[240px] text-sm">
      <p className="chart-detail-toc-heading mb-3 font-medium text-foreground">On this page</p>

      <div className="chart-detail-toc-links flex flex-col gap-0.5 border-l border-border pl-3.5">
        {items.map((item) => {
          const isActive = activeId === item.id
          const icon = resolveIcon(item)
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                handleScrollTo(item.id)
              }}
              className={cn(
                "chart-detail-toc-link group flex items-center gap-2 rounded-sm py-1.5 pl-2 pr-2 text-muted-foreground transition-colors",
                "hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isActive && "font-medium text-foreground"
              )}
              aria-current={isActive ? "location" : undefined}
            >
              <HugeiconsIcon
                icon={icon}
                size={15}
                strokeWidth={1.75}
                className={cn(
                  "shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground",
                  isActive && "text-primary"
                )}
              />
              <span className="truncate">{item.label}</span>
            </a>
          )
        })}
      </div>

      {chart && (
        <div className="chart-detail-facts mt-6 rounded-md border border-border bg-card/40 p-3">
          <h2 className="mb-2.5 text-xs font-medium text-muted-foreground">Quick facts</h2>
          <dl className="flex flex-col gap-2">
            <FactRow icon={CodeIcon} label="Engine" value={chart.engine} />
            <FactRow icon={GridViewIcon} label="Category" value={chart.category} />
            <FactRow
              icon={PlayCircle02Icon}
              label="Renderer"
              value={chart.renderer ? chart.renderer.toUpperCase() : "SVG"}
            />
            <div className="flex items-center justify-between gap-3 text-xs">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusDotClass(chart.status))} />
                Status
              </dt>
              <dd className="truncate font-mono text-[11px] text-foreground">{chart.status}</dd>
            </div>
            {chart.difficulty && (
              <FactRow icon={Activity01Icon} label="Difficulty" value={chart.difficulty} />
            )}
          </dl>
        </div>
      )}

      {nextChart && (
        <Link
          href={chartHref(nextChart)}
          className="chart-detail-next group mt-4 flex items-start justify-between gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-card/60"
        >
          <div className="min-w-0">
            <span className="block text-[11px] text-muted-foreground">Up next</span>
            <span className="mt-0.5 block truncate text-sm font-medium text-foreground">
              {nextChart.title}
            </span>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{nextChart.description}</p>
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            strokeWidth={1.75}
            className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </Link>
      )}
    </nav>
  )
}