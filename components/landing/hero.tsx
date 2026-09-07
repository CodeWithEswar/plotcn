import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Icon } from "./icons"
import { InstallCommand } from "./install-command"
import { HeroTypewriter } from "./hero-typewriter"
export function HeroSection() {
  return <section className="hero hero-centered site-container" aria-labelledby="hero-heading"><div className="hero-copy"><Badge variant="outline" className="hero-eyebrow"><span className="status-dot" />Open source · Built on the shadcn Registry</Badge><HeroTypewriter /><p>Recharts for dashboards. D3 for bespoke control. Google Charts for geo and timelines.<br className="desktop-break" /> Install the source, customize everything, and own every chart you ship.</p><div className="hero-actions"><Link href="#registry" className={buttonVariants({ size:"lg" })}>Get started<Icon name="arrow" /></Link><Link href="#charts" className={buttonVariants({ variant:"outline",size:"lg" })}>Explore charts</Link></div><InstallCommand compact /><div className="hero-footnote"><span>Recharts</span><span>D3.js</span><span>Google Charts</span><span>Source owned</span></div><Link href="#charts" className="hero-continuation" aria-label="Continue to the chart collection"><Icon name="arrow" /></Link></div></section>
}
export function FeatureStrip() {
  return <div className="feature-strip site-container">{[["layers","Three engines","The right tool for every plot."],["code","Source owned","In your repo. Under your control."],["chart","Every viewport","From a phone to a full canvas."],["check","Built to include","Keyboard, contrast, clarity."]].map(([icon,title,body]) => <div key={title}><Icon name={icon as "layers" | "code" | "chart" | "check"} /><div><strong>{title}</strong><p>{body}</p></div></div>)}</div>
}
