import Link from "next/link"
import { FooterBrand } from "./footer-brand"
import { FooterNavigation } from "./footer-navigation"
import { FooterFlow } from "./footer-flow"
import { MetallicWordmark } from "./metallic-wordmark"
import { Icon } from "@/components/landing/icons"

export function SiteFooter() {
  return (
    <footer className="footer-root">
      {/* Layer 0: Ambient background glow */}
      <div className="footer-ambient-glow" aria-hidden="true" />

      {/* Layer 0: Faint coordinate grid */}
      <div className="footer-ambient-grid" aria-hidden="true" />

      {/* Layer 1: Data curve / signal flow behind the text */}
      <div className="footer-flow-wrap" aria-hidden="true">
        <FooterFlow />
      </div>

      {/* Layer 2: Functional footer navigation */}
      <div className="site-container relative z-10">
        <div className="footer-main-grid">
          <FooterBrand />
          <div className="footer-nav-wrapper">
            <FooterNavigation />
          </div>
        </div>

        {/* Legal & meta row */}
        <div className="footer-meta-row">
          <div className="footer-meta-left">
            <span>© 2026 Plotcn. Open source under MIT license.</span>
            <span className="footer-meta-bullet" aria-hidden="true">·</span>
            <span className="text-muted-foreground">Your code. Your canvas.</span>
          </div>
          <div className="footer-meta-right">
            <Link
              href="#main"
              className="footer-back-to-top group"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <Icon name="arrow" className="size-3.5 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Layer 3: Oversized Metallic Plotcn Wordmark */}
      <MetallicWordmark />
    </footer>
  )
}
