export const site = {
  name: "Plotcn",
  description: "Beautiful React visualizations you own. Explore Recharts and D3 components, install the source, and make every detail yours.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/CodeWithEswar/plotcn",
}

export const navigation = [
  { label: "Docs", href: "/docs" },
  { label: "Charts", href: "/#charts" },
  { label: "Blocks", href: "/#blocks" },
  { label: "Playground", href: "/#playground" },
  { label: "Themes", href: "/#themes" },
]
