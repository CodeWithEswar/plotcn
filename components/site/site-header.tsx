"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useMotionValueEvent, useScroll } from "motion/react"
import { AppLogo } from "@/components/brand"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BookOpen01Icon,
  ChartLineData01Icon,
  Layers01Icon,
  ComputerTerminal01Icon,
  PaintBoardIcon,
  Download01Icon,
  ChartNetworkIcon,
  CheckmarkCircle01Icon,
  SourceCodeIcon,
  GithubIcon,
  ArrowRight01Icon,
  SearchIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/landing/icons"
import { navigation, site } from "@/lib/site"

interface SearchItem {
  label: string
  description: string
  href: string
  icon: any
  badge?: string
  external?: boolean
}

const searchGroups: { group: string; items: SearchItem[] }[] = [
  {
    group: "Documentation",
    items: [
      {
        label: "Introduction",
        description: "Overview of Plotcn, source ownership, and design principles",
        href: "/docs/introduction",
        icon: BookOpen01Icon,
        badge: "Docs",
      },
      {
        label: "Installation",
        description: "Set up Plotcn in an existing React / Next.js project",
        href: "/docs/installation",
        icon: Download01Icon,
        badge: "Install",
      },
      {
        label: "Project Setup",
        description: "Configure TypeScript path aliases and Tailwind CSS v4 tokens",
        href: "/docs/project-setup",
        icon: ComputerTerminal01Icon,
        badge: "Config",
      },
      {
        label: "shadcn/ui Setup",
        description: "Configure components.json and integrate with the registry",
        href: "/docs/shadcn",
        icon: Layers01Icon,
        badge: "Registry",
      },
      {
        label: "Plotcn Registry",
        description: "CLI component installation workflow and code ownership model",
        href: "/docs/registry",
        icon: SourceCodeIcon,
        badge: "CLI",
      },
      {
        label: "Usage Guide",
        description: "Component imports, responsive containers, and data schemas",
        href: "/docs/usage",
        icon: ChartLineData01Icon,
        badge: "Usage",
      },
      {
        label: "Themes & Styling",
        description: "CSS variables, OKLCH chart tokens, dark and light modes",
        href: "/docs/theming",
        icon: PaintBoardIcon,
        badge: "Theme",
      },
      {
        label: "Accessibility Standards",
        description: "WCAG contrast, screen-reader layers, and reduced motion",
        href: "/docs/accessibility",
        icon: CheckmarkCircle01Icon,
        badge: "A11y",
      },
      {
        label: "Google Charts Overview",
        description: "Enterprise Google visualization engine, package loader, and theming",
        href: "/docs/google-charts",
        icon: ChartNetworkIcon,
        badge: "Engine",
      },
      {
        label: "Google GeoChart",
        description: "World and regional statistical geographic choropleth maps",
        href: "/docs/google-geochart",
        icon: ChartLineData01Icon,
        badge: "Geo",
      },
    ],
  },
  {
    group: "Explore Landing",
    items: [
      {
        label: "Charts Collection",
        description: "Interactive Recharts and D3 Cartesian, area, and bar charts",
        href: "/#charts",
        icon: ChartLineData01Icon,
        badge: "Charts",
      },
      {
        label: "Blocks & Dashboards",
        description: "Full-page analytics layouts with integrated visualizations",
        href: "/#blocks",
        icon: Layers01Icon,
        badge: "Blocks",
      },
      {
        label: "Engines & Architecture",
        description: "Declarative Recharts vs mathematical D3 visualization engine",
        href: "/#engines",
        icon: ChartNetworkIcon,
        badge: "Engines",
      },
      {
        label: "Interactive Playground",
        description: "Real-time physics force-directed network graph",
        href: "/#playground",
        icon: ComputerTerminal01Icon,
        badge: "Demo",
      },
      {
        label: "Contributing Guide",
        description: "Guidelines and architecture specifications for contributors",
        href: "/contributing",
        icon: SourceCodeIcon,
        badge: "Guide",
      },
      {
        label: "GitHub Repository",
        description: "Source code repository, discussions, issues, and releases",
        href: site.github,
        external: true,
        icon: GithubIcon,
        badge: "GitHub",
      },
    ],
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24))

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        setSearch((value) => !value)
      }
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  }, [])

  const handleSelect = (item: SearchItem) => {
    setSearch(false)
    if (item.external) {
      window.open(item.href, "_blank", "noreferrer")
    } else if (item.href.startsWith("/#") || item.href.startsWith("#")) {
      const hash = item.href.includes("#") ? item.href.slice(item.href.indexOf("#") + 1) : ""
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          return
        }
      }
      window.location.href = item.href
    } else {
      window.location.href = item.href
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div
          className={`${
            pathname?.startsWith("/docs")
              ? "w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
              : "site-container"
          } header-inner`}
        >
          <Link href="/" className="brand-link" aria-label="Plotcn home">
            <AppLogo className="size-8" />
            <span>Plotcn</span>
            <span className="brand-beta">beta</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive =
                item.href === "/docs"
                  ? pathname?.startsWith("/docs")
                  : pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={isActive ? "!text-white font-medium" : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="header-actions">
            <Button
              variant="ghost"
              className="search-button"
              aria-label="Search Plotcn"
              onClick={() => setSearch(true)}
            >
              <HugeiconsIcon icon={SearchIcon} size={16} strokeWidth={1.8} />
              <kbd>Ctrl K</kbd>
            </Button>

            {site.github ? (
              <a
                className="github-link"
                href={site.github}
                aria-label="Plotcn on GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.8} />
              </a>
            ) : (
              <Link className="github-link" href="#open-source" aria-label="Open source">
                <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.8} />
              </Link>
            )}

            <Link href="/docs/installation" className={buttonVariants({ className: "header-cta" })}>
              Get started <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.8} />
            </Link>

            <Sheet open={menu} onOpenChange={setMenu}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open navigation" />
                }
              >
                <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.8} />
              </SheetTrigger>
              <SheetContent className="dark mobile-sheet">
                <SheetHeader>
                  <SheetTitle>Plotcn</SheetTitle>
                  <SheetDescription>Visualizations. Your way.</SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile navigation">
                  {navigation.map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setMenu(false)}>
                      {item.label}
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.8} />
                    </Link>
                  ))}
                  <Link href="#open-source" onClick={() => setMenu(false)}>
                    Open source
                    <HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.8} />
                  </Link>
                  <Link href="/docs/installation" onClick={() => setMenu(false)} className={buttonVariants()}>
                    Get started
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Responsive Command Palette Search Dialog */}
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="dark search-dialog" showCloseButton={false}>
          <DialogTitle className="sr-only">Search Plotcn</DialogTitle>
          <DialogDescription className="sr-only">
            Search for charts, blocks, engines, themes, or guides
          </DialogDescription>
          <Command className="bg-transparent text-foreground flex flex-col w-full overflow-hidden">
            <CommandInput placeholder="Search charts, docs, themes…" />
            <CommandList className="max-h-[60vh] sm:max-h-[360px] overflow-y-auto no-scrollbar p-2">
              <CommandEmpty className="py-10 text-center text-sm text-zinc-500">
                No results found. Try "charts", "engines", or "themes".
              </CommandEmpty>

              {searchGroups.map((group) => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={`${item.label} ${item.description} ${item.badge || ""}`}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group data-[selected=true]:bg-zinc-800/80 text-zinc-300 data-[selected=true]:text-white"
                    >
                      <div className="size-8 rounded-md border border-white/[0.08] bg-zinc-900/90 flex items-center justify-center shrink-0 text-zinc-400 group-data-[selected=true]:text-white group-data-[selected=true]:border-zinc-500 transition-colors">
                        <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.8} />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-200 group-data-[selected=true]:text-white truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 border border-zinc-700/60 px-1.5 py-0.5 rounded bg-zinc-900/50">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500 truncate group-data-[selected=true]:text-zinc-400">
                          {item.description}
                        </span>
                      </div>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={14}
                        className="text-zinc-600 group-data-[selected=true]:text-zinc-300 transition-transform group-data-[selected=true]:translate-x-0.5 shrink-0"
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>

            {/* Desktop / Tablet Keyboard Legend Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.08] px-3.5 py-2.5 bg-zinc-950/60 text-[10px] font-mono text-zinc-500 select-none shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-zinc-700/60 bg-zinc-800/60 px-1 py-0.5 text-[9px] text-zinc-400">
                    ↑↓
                  </kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-zinc-700/60 bg-zinc-800/60 px-1 py-0.5 text-[9px] text-zinc-400">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-700/60 bg-zinc-800/60 px-1 py-0.5 text-[9px] text-zinc-400">
                  esc
                </kbd>
                <span>close</span>
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
