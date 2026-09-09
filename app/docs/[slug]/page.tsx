import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getDocData, getAllDocSlugs } from "@/lib/docs"
import { getPagerForDoc } from "@/config/docs"
import { DocsPager } from "@/components/docs/docs-pager"
import { DocsToc } from "@/components/docs/docs-toc"
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav"
import { DocsArticleActions } from "@/components/docs/docs-article-actions"
import { MDXRenderer } from "@/components/docs/mdx-components"
import { site } from "@/lib/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = await getDocData(slug)

  if (!doc) {
    return {
      title: "Document Not Found — Plotcn",
    }
  }

  const title = `${doc.title} — Plotcn Documentation`
  const description = doc.description

  return {
    title,
    description,
    alternates: {
      canonical: doc.href,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${site.url}${doc.href}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const doc = await getDocData(slug)

  if (!doc) {
    notFound()
  }

  const pager = getPagerForDoc(doc.href)

  return (
    <div className="flex flex-col min-w-0">
      {/* Mobile Subheader (< 1024px) */}
      <DocsMobileNav currentTitle={doc.title} toc={doc.toc} />

      {/* Main Content & Right Sticky TOC */}
      <div className="flex items-start justify-center gap-8 xl:gap-14 px-0 lg:px-8 min-w-0 min-h-full">
        <main id="main" className="w-full max-w-3xl min-w-0 mx-auto px-4 sm:px-6 lg:px-0 py-8 lg:py-10 pb-20 sm:pb-32">
          {/* Article Header (Custom heroes used on introduction, installation, project-setup, shadcn, registry, usage, theming) */}
          {!["introduction", "installation", "project-setup", "shadcn", "registry", "usage", "theming", "accessibility"].includes(doc.slug) ? (
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2.5">
                {doc.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-5">
                {doc.description}
              </p>
              <DocsArticleActions rawContent={doc.rawContent} slug={doc.slug} />
            </div>
          ) : null}

          {/* MDX Body */}
          <MDXRenderer content={doc.rawContent} slug={doc.slug} rawContent={doc.rawContent} />

          {/* Previous / Next Article Navigation */}
          <DocsPager prev={pager.prev} next={pager.next} />
        </main>

        {/* Right Sticky Table of Contents (>= 1280px) */}
        <aside className="hidden xl:block w-[220px] shrink-0 self-start sticky top-[var(--site-header-height,52px)] h-[calc(100svh-var(--site-header-height,52px))] overflow-y-auto no-scrollbar py-8 lg:py-10">
          <DocsToc toc={doc.toc} />
        </aside>
      </div>
    </div>
  )
}
