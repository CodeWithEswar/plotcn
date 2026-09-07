"use client"
import Image from "next/image"
import { useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  GridViewIcon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import type { ChartMetadata, ChartEngine } from "@/lib/charts/metadata"
import {
  defaultFilters,
  engineLabels,
  filterCharts,
  parseChartFilters,
  serializeChartFilters,
  type ChartFilters,
} from "@/lib/charts/filters"
import { getCategoryLabel } from "@/lib/charts/categories"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ChartCard } from "./chart-card"

/* -------------------------------------------------------------------------- */
/*  Engine metadata for the selector panels                                    */
/* -------------------------------------------------------------------------- */
const enginePanels: {
  id: ChartEngine
  label: string
  tagline: string
  logoSrc: string
  logoWidth: number
  logoClass: string
}[] = [
  {
    id: "recharts",
    label: "Recharts",
    tagline: "Composable React components for everyday product charts.",
    logoSrc: "/brand/engines/recharts.svg",
    logoWidth: 84,
    logoClass: "recharts",
  },
  {
    id: "d3",
    label: "D3.js",
    tagline: "Direct scales and SVG geometry for custom visualizations.",
    logoSrc: "/brand/engines/d3.svg",
    logoWidth: 20,
    logoClass: "d3",
  },
  {
    id: "google",
    label: "Google Charts",
    tagline: "A hosted runtime for core charts and geographic data.",
    logoSrc: "/brand/engines/google.svg",
    logoWidth: 54,
    logoClass: "google",
  },
]

export function GalleryShell({
  initialCharts: charts,
}: {
  initialCharts: readonly ChartMetadata[]
}) {
  const params = useSearchParams()
  const filters = parseChartFilters(params, charts)
  const [density, setDensity] = useState<"gallery" | "compact">("compact")
  const [theme, setTheme] = useState("dark")
  const results = filterCharts(charts, filters)
  const gridRef = useRef<HTMLDivElement>(null)

  /* Derived data */
  const categories = [
    ...new Set(
      charts
        .filter((c) => filters.engine === "all" || c.engine === filters.engine)
        .map((c) => c.category)
    ),
  ]

  function countByEngine(engine: ChartEngine | "all") {
    return engine === "all"
      ? charts.length
      : charts.filter((c) => c.engine === engine).length
  }

  /* ── Filter mutations ─────────────────────────────────────────────────── */
  function update(patch: Partial<ChartFilters>, replace = false) {
    const query = serializeChartFilters({ ...filters, ...patch })
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      `/charts${query ? `?${query}` : ""}`
    )
  }
  const reset = () => update(defaultFilters)

  function selectEngine(engine: ChartEngine | "all") {
    update({ engine, category: "all" })
    /* Scroll to grid when picking an engine */
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }


  const active = Object.entries(filters).filter(([, v]) => v && v !== "all")

  return (
    <div className="charts-surface" data-theme={theme}>
      <main id="main" tabIndex={-1} className="lens-shell">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="lens-heading">
          <div>
            <span className="lens-eyebrow">PLOTCN / CHARTS</span>
            <h1>Find your visualization.</h1>
            <p>
              Three engines. Purpose-built components.
              <br />
              Explore the behavior. Inspect the source. Make it yours.
            </p>
          </div>
          <div className="lens-heading-side">
            <div className="lens-theme">
              <span>Workspace theme</span>
              <Select value={theme} onValueChange={(val) => { if (val) setTheme(val) }}>
                <SelectTrigger aria-label="Workspace theme" size="sm" className="h-8 w-[110px] text-xs bg-zinc-900/60 border-white/[0.12] rounded-md">
                  <SelectValue placeholder="Dark" />
                </SelectTrigger>
                <SelectContent align="end" side="bottom" sideOffset={6}>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <dl className="lens-stats">
              <div>
                <dt>Engines</dt>
                <dd>{new Set(charts.map((c) => c.engine)).size}</dd>
              </div>
              <div>
                <dt>Components</dt>
                <dd>{charts.length.toString().padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Stable</dt>
                <dd>
                  {charts
                    .filter((c) => c.status === "stable")
                    .length.toString()
                    .padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        {/* ── Engine Selector Panels ──────────────────────────────────── */}
        <section aria-label="Choose your engine">
          <div className="lens-engine-all-toggle">
            <button
              className="lens-engine-all-btn"
              aria-pressed={filters.engine === "all"}
              onClick={() => selectEngine("all")}
            >
              All engines
              <span className="lens-engine-all-count">{charts.length}</span>
            </button>
            <Popover>
              <PopoverTrigger className="lens-text-button">
                Which engine fits?
              </PopoverTrigger>
              <PopoverContent
                className="charts-surface lens-guide"
                data-theme={theme}
                align="end"
              >
                <PopoverTitle>Choose your level of control</PopoverTitle>
                <PopoverDescription>
                  Each implementation keeps its engine's own API.
                </PopoverDescription>
                <p>
                  <strong>Recharts</strong>Composable React components for
                  everyday product charts.
                </p>
                <p>
                  <strong>D3.js</strong>Direct scales and SVG geometry for
                  custom visualizations.
                </p>
                <p>
                  <strong>Google Charts</strong>A hosted runtime for core charts
                  and geographic data. Requires a network connection.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="lens-engine-selector" role="group" aria-label="Chart engine">
            {enginePanels.map((ep) => (
              <button
                key={ep.id}
                className="lens-engine-panel"
                data-engine={ep.id}
                aria-pressed={filters.engine === ep.id}
                onClick={() => selectEngine(ep.id)}
              >
                {/* Ambient background brand watermark */}
                <div className="lens-engine-watermark" aria-hidden="true">
                  <Image
                    className={`lens-watermark-img ${ep.logoClass}`}
                    src={ep.logoSrc}
                    width={ep.id === "d3" ? 88 : 130}
                    height={ep.id === "d3" ? 88 : 44}
                    alt=""
                  />
                </div>

                <div className="lens-engine-panel-head">
                  <div className="lens-engine-panel-brand">
                    <span className="lens-engine-panel-dot" />
                    <span className="lens-engine-panel-name">{ep.label}</span>
                  </div>
                  <span className="lens-engine-panel-count">
                    {countByEngine(ep.id)}
                  </span>
                </div>
                <span className="lens-engine-panel-tagline">{ep.tagline}</span>
                <div className="lens-engine-panel-logo">
                  <Image
                    className={`lens-brand ${ep.logoClass}`}
                    src={ep.logoSrc}
                    width={ep.logoWidth}
                    height={20}
                    alt=""
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Category Chips ──────────────────────────────────────────── */}
        <div
          className="lens-categories"
          role="group"
          aria-label="Chart category"
        >
          <button
            aria-pressed={filters.category === "all"}
            onClick={() => update({ category: "all" })}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={filters.category === c}
              onClick={() => update({ category: c })}
            >
              {getCategoryLabel(c)}
            </button>
          ))}
        </div>

        {/* ── Active Filter Pills ─────────────────────────────────────── */}
        {active.length > 0 && (
          <div className="lens-active" aria-label="Active filters">
            {active.map(([key, value]) => (
              <button
                key={key}
                aria-label={`Remove ${key} filter: ${value}`}
                onClick={() => update({ [key]: key === "q" ? "" : "all" })}
              >
                {key === "engine" ? engineLabels[value as ChartEngine] : value}
                <HugeiconsIcon icon={Cancel01Icon} size={13} />
              </button>
            ))}
            <button onClick={reset}>Clear all</button>
          </div>
        )}

        {/* ── Result Row + Density ────────────────────────────────────── */}
        <div className="lens-result-row" ref={gridRef}>
          <p role="status">
            <strong>{results.length}</strong>
            {results.length !== charts.length
              ? ` of ${charts.length}`
              : ""}{" "}
            charts<span className="lens-result-note"> / source included</span>
          </p>
          <div
            className="lens-density"
            role="group"
            aria-label="Gallery density"
          >
            <button
              aria-pressed={density === "gallery"}
              onClick={() => setDensity("gallery")}
            >
              <HugeiconsIcon icon={GridViewIcon} size={14} />
              Gallery
            </button>
            <button
              aria-pressed={density === "compact"}
              onClick={() => setDensity("compact")}
            >
              <HugeiconsIcon icon={Menu01Icon} size={14} />
              Compact
            </button>
          </div>
        </div>

        {/* ── Chart Grid ──────────────────────────────────────────────── */}
        {results.length ? (
          <div className="lens-grid" data-density={density}>
            {results.map((chart) => (
              <ChartCard
                key={chart.id}
                chart={chart}
                compact={density === "compact"}
              />
            ))}
          </div>
        ) : (
          <div className="lens-empty">
            <HugeiconsIcon icon={Search01Icon} size={32} />
            <h2>No charts match these filters.</h2>
            <p>Try a broader search or clear your active filters.</p>
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}

        {/* ── Endnote ─────────────────────────────────────────────────── */}
        <div className="lens-endnote">
          <span>REAL COMPONENTS. REAL SOURCE.</span>
          <span>
            Choose a chart to inspect its container behavior and installation.
          </span>
        </div>
      </main>
    </div>
  )
}
