export interface NavItem {
  title: string
  label: string
  href: string
  badge?: string
  external?: boolean
  disabled?: boolean
}

export const navigation: readonly NavItem[] = [
  { title: "Docs", label: "Docs", href: "/docs" },
  { title: "Charts", label: "Charts", href: "/charts" },
  { title: "Blocks", label: "Blocks", href: "/blocks" },
  { title: "Playground", label: "Playground", href: "/playground" },
  { title: "Themes", label: "Themes", href: "/themes" },
  { title: "Examples", label: "Examples", href: "/examples" },
] as const
