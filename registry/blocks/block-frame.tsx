"use client"
import { Component, type ReactNode } from "react"
export class BlockPanel extends Component<{ title: string; children: ReactNode; error?: string; className?: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return <section className={"min-w-0 rounded-xl border border-border bg-background p-4 " + (this.props.className ?? "")}><h3 className="mb-4 text-sm font-medium">{this.props.title}</h3>{this.state.failed || this.props.error ? <p role="alert" className="flex min-h-48 items-center text-sm text-muted-foreground">{this.props.error ?? "This chart could not render. Check its data and reload."}</p> : this.props.children}</section> }
}
export function BlockStatus({ loading, error, empty }: { loading?: boolean; error?: string; empty?: boolean }) {
  if (!loading && !error && !empty) return null
  return <div role={error ? "alert" : "status"} className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{loading ? "Loading dashboard data…" : error ?? "No data for this selection."}</div>
}
export function MetricRail({ items }: { items: { label: string; value: string; note?: string }[] }) { return <dl className="grid grid-cols-2 gap-6 border-y border-border py-6 @min-[760px]:grid-cols-4">{items.map(item => <div key={item.label}><dt className="text-xs text-muted-foreground">{item.label}</dt><dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{item.value}</dd>{item.note && <dd className="mt-1 text-xs text-muted-foreground">{item.note}</dd>}</div>)}</dl> }
