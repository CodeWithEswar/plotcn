import Link from "next/link"
import { AppLogo } from "@/components/brand"
import { buttonVariants } from "@/components/ui/button"
import { site } from "@/lib/site"
import { Icon } from "./icons"
export function OpenSourceSection() {
  return <section id="open-source" className="section open-source-section site-container"><div className="open-source-mark"><AppLogo /></div><div><span className="eyebrow">OPEN BY DESIGN</span><h2>Good things happen<br />when the source is open.</h2><p>Inspect a component. Suggest a better interaction. Build a visualization we haven’t imagined. Plotcn is a place to make that work visible.</p><div className="open-source-actions"><a href={site.github} target="_blank" rel="noreferrer" className={buttonVariants({variant:"outline"})}><Icon name="github" />View GitHub<Icon name="external" /></a><Link href="/contributing" className="text-link">How to contribute<Icon name="arrow" /></Link></div></div></section>
}
export function FinalCTA() {
  return <section className="final-cta"><div className="final-grid" aria-hidden="true" /><div className="site-container"><span className="eyebrow">YOUR NEXT IDEA DESERVES A CANVAS</span><h2>Make something<br /><span>worth plotting.</span></h2><div className="hero-actions"><Link href="#registry" className={buttonVariants({size:"lg"})}>Get started<Icon name="arrow" /></Link><Link href="#charts" className={buttonVariants({variant:"outline",size:"lg"})}>Explore charts</Link></div><p>Built for React. Made to be yours.</p></div></section>
}
