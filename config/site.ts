export const siteConfig = {
  name: "Plotcn",
  title: "Plotcn — Modern Visualization Components for React",
  description:
    "Beautiful React visualizations you own. Explore Recharts, D3.js, and Google Charts components, install the source via shadcn CLI, and make every detail yours.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://plotcn.vercel.app",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/CodeWithEswar/plotcn",
  author: "CodeWithEswar",
  links: {
    github: "https://github.com/CodeWithEswar/plotcn",
    twitter: "https://x.com/codewitheswar",
    docs: "/docs",
    charts: "/charts",
    blocks: "/blocks",
    playground: "/playground",
  },
} as const

// Backward compatibility
export const site = siteConfig
