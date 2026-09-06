import Link from "next/link"
import { site } from "@/lib/site"
import { Icon } from "@/components/landing/icons"

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const navigationGroups: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Charts", href: "/#charts" },
      { label: "Blocks", href: "/#blocks" },
      { label: "Engines", href: "/#engines" },
      { label: "Playground", href: "/#playground" },
      { label: "Themes", href: "/#themes" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Getting Started", href: "/docs/installation" },
      { label: "Component Registry", href: "/#registry" },
      { label: "Documentation", href: "/docs" },
      { label: "Contributing Guide", href: "/contributing" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub Repository", href: site.github, external: true },
      { label: "Discussions", href: `${site.github}/discussions`, external: true },
      { label: "MIT License", href: `${site.github}/blob/main/LICENSE`, external: true },
    ],
  },
]

export function FooterNavigation() {
  return (
    <nav aria-label="Footer Navigation" className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
      {navigationGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-3.5">
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-300">
            {group.title}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {group.links.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                  >
                    <span>{link.label}</span>
                    <Icon
                      name="external"
                      className="size-3 text-zinc-500 transition-colors group-hover:text-zinc-300"
                    />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
