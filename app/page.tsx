import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PlotBackground } from "@/components/backgrounds/plot-background"
import { HeroSection, FeatureStrip } from "@/components/landing/hero"
import { FeaturedCharts } from "@/components/landing/featured-charts"
import { EngineSection } from "@/components/landing/engine-section"
import { RegistrySection } from "@/components/landing/registry-section"
import { PlaygroundSection } from "@/components/landing/playground"
import { WorkflowSection, ResponsiveSection } from "@/components/landing/workflow-section"
import { ThemeSection } from "@/components/landing/theme-section"
import { BlocksSection } from "@/components/landing/blocks-section"
import { OpenSourceSection, FinalCTA } from "@/components/landing/closing-sections"
export default function Home() {
  return <div className="landing"><SiteHeader /><main id="main"><div className="hero-stage"><PlotBackground /><HeroSection /></div><FeatureStrip /><FeaturedCharts /><EngineSection /><RegistrySection /><PlaygroundSection /><WorkflowSection /><ResponsiveSection /><ThemeSection /><BlocksSection /><OpenSourceSection /><FinalCTA /></main><SiteFooter /></div>
}
