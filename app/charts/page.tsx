import { Suspense } from "react"
import type { Metadata } from "next"
import { getAllCharts } from "@/config/charts"
import { GalleryShell } from "@/components/chart-gallery/gallery-shell"
import { constructPageMetadata } from "@/lib/seo/metadata"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
export const metadata: Metadata = constructPageMetadata({
  title: "Charts — Recharts, D3.js & Google Charts",
  description:
    "Explore source-first React charts across three engines. Filter real capabilities, preview container behavior, and install through the shadcn registry.",
  path: "/charts",
})
export default function ChartsPage() {
  return (
    <>
      <SiteHeader />
      <Suspense
        fallback={
          <main className="lens-shell">
            <h1>Charts</h1>
            <p role="status">Loading visualization lens...</p>
          </main>
        }
      >
        <GalleryShell initialCharts={getAllCharts()} />
      </Suspense>
      <SiteFooter />
    </>
  )
}
