export interface DocsItem {
  title: string
  href: string
  description: string
  section: string
  badge?: string
}

export interface DocsGroup {
  title: string
  items: DocsItem[]
}

export interface DocsConfig {
  navigation: DocsGroup[]
}

export const docsConfig: DocsConfig = {
  navigation: [
    {
      title: "Guide",
      items: [
        {
          title: "Introduction",
          href: "/docs/introduction",
          description: "An overview of Plotcn, its source-ownership philosophy, and component design principles.",
          section: "Guide",
        },
        {
          title: "System Design",
          href: "/docs/architecture",
          description: "Three-engine architecture, runtime boundaries, shared visualization layer, and registry distribution.",
          section: "Guide",
        },
        {
          title: "Engine Strategy",
          href: "/docs/engine-strategy",
          description: "Three-engine collection strategy: Recharts, D3.js, and Google Charts runtime policies.",
          section: "Guide",
        },
        {
          title: "Installation",
          href: "/docs/installation",
          description: "Step-by-step installation guide for Next.js, dependencies, and Plotcn.",
          section: "Getting Started",
        },
        {
          title: "Project Setup",
          href: "/docs/project-setup",
          description: "Configure TypeScript path aliases, Tailwind CSS v4, and base styling.",
          section: "Getting Started",
        },
        {
          title: "shadcn/ui Setup",
          href: "/docs/shadcn",
          description: "Configure components.json and integrate Plotcn with the shadcn Registry.",
          section: "Getting Started",
        },
        {
          title: "Plotcn Registry",
          href: "/docs/registry",
          description: "Understand the CLI workflow, source code ownership, and component distribution.",
          section: "Getting Started",
        },
      ],
    },
    {
      title: "Fundamentals",
      items: [
        {
          title: "Usage",
          href: "/docs/usage",
          description: "General conventions, imports, props, responsive containers, and data schemas.",
          section: "Fundamentals",
        },
        {
          title: "Theming",
          href: "/docs/theming",
          description: "Customizing CSS variables, OKLCH/HSL chart tokens, dark/light modes, and palettes.",
          section: "Fundamentals",
        },
        {
          title: "Accessibility",
          href: "/docs/accessibility",
          description: "WCAG standards, keyboard interaction, screen-reader layers, and reduced motion.",
          section: "Fundamentals",
        },
      ],
    },
    {
      title: "Google Charts",
      items: [
        {
          title: "Google Charts",
          href: "/docs/google-charts",
          description: "Integration overview, loader architecture, theming, and engine comparison.",
          section: "Google Charts",
        },
        {
          title: "Google GeoChart",
          href: "/docs/google-geochart",
          description: "World choropleths, regional maps, color scales, and accessibility.",
          section: "Google Charts",
        },
      ],
    },
  ],
}

/** Flatten all items in order */
export function getAllDocsItems(): DocsItem[] {
  return docsConfig.navigation.flatMap((group) => group.items)
}

/** Find a doc item by its slug (e.g. "introduction" or "/docs/introduction") */
export function getDocBySlug(slug: string): DocsItem | undefined {
  const normalized = slug.startsWith("/docs/") ? slug : `/docs/${slug}`
  return getAllDocsItems().find((item) => item.href === normalized)
}

/** Get previous and next doc navigation links */
export function getPagerForDoc(currentHref: string): {
  prev: DocsItem | null
  next: DocsItem | null
} {
  const items = getAllDocsItems()
  const currentIndex = items.findIndex((item) => item.href === currentHref)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  return { prev, next }
}
