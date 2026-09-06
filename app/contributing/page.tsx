import Link from "next/link"
import { AppLogo } from "@/components/brand"
import { buttonVariants } from "@/components/ui/button"
import { site } from "@/lib/site"
import type { Metadata } from "next"
export const metadata:Metadata={title:"Contributing — Plotcn",alternates:{canonical:"/contributing"},description:"Help improve Plotcn charts, interactions, and accessibility."}
export default function Contributing() {
  return <main id="main" className="contributing-page site-container"><Link href="/" className="brand-link"><AppLogo className="size-8" />Plotcn</Link><span className="eyebrow">BUILD IN THE OPEN</span><h1>Leave the canvas<br />a little better.</h1><p>Useful contributions start with a clear problem. A confusing interaction, an inaccessible tooltip, or a chart that doesn’t fit on a phone is a good place to begin.</p><ol><li><h2>Find a focused improvement</h2><p>Check the repository’s issues and describe what you want to change before starting larger work.</p></li><li><h2>Make the change locally</h2><p>Install dependencies with <code>npm install</code>, then start the preview with <code>npm run dev</code>. Keep components typed, portable, and accessible.</p></li><li><h2>Show your work</h2><p>Run lint, TypeScript, and the production build. Include before/after screenshots for visual changes and explain how you tested keyboard and touch behavior.</p></li><li><h2>Open a pull request</h2><p>Describe the problem, the resulting behavior, and any tradeoffs. Small, reviewable changes are easier to improve together.</p></li></ol><a href={site.github} target="_blank" rel="noreferrer" className={buttonVariants()}>Open the repository</a></main>
}
