"use client"
import dynamic from "next/dynamic"
import { ChartBoundary } from "@/components/charts/chart-boundary"
const NetworkExplorer = dynamic(() => import("./network-explorer"), {
  ssr: false,
  loading: () => <div className="network-loading" role="status">Loading the ecosystem explorer…</div>
})
export function PlaygroundSection() {
  return <section id="playground" className="section playground-section"><div className="site-container"><div className="section-topline"><span className="eyebrow">04 / BEYOND THE AXES</span><span className="section-note">LESS CONVENTION. MORE CONNECTION.</span></div><div className="section-heading"><div><h2>Not every story fits a bar chart.</h2><p>Follow the connections. Change the layout. See where your curiosity takes you.</p></div><span className="engine-pill">POWERED BY D3</span></div><ChartBoundary><NetworkExplorer /></ChartBoundary></div></section>
}
