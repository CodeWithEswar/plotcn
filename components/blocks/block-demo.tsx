"use client"
import dynamic from "next/dynamic"
import { revenueDashboardData } from "@/registry/blocks/revenue-dashboard-data"
const RevenueDashboard = dynamic(() => import("@/registry/blocks/revenue-dashboard").then(m => m.RevenueDashboard), {ssr:false,loading:()=><p className="p-6 text-sm">Loading dashboard…</p>})
export type DemoState = "ready" | "loading" | "empty" | "error" | "partial"
export function BlockDemo({ slug, state = "ready", motion = false }: { slug: string; state?: DemoState; motion?: boolean }) {
  if(slug === "revenue-dashboard") return <RevenueDashboard data={state === "empty" ? [] : revenueDashboardData} loading={state === "loading"} error={state === "error" ? "Demo: revenue data could not be loaded." : undefined} breakdownError={state === "partial" ? "Demo: channel breakdown unavailable. The trend is still available." : undefined} motion={motion}/>
  return null
}
