"use client"
import { useState } from "react"
import { LineBasic } from "../recharts/line-basic"
import { BarBasic } from "../recharts/bar-basic"
import { DonutBasic } from "../recharts/donut-basic"
import { BlockPanel, BlockStatus, MetricRail } from "./block-frame"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export interface RevenueRecord { month: string; channel: string; revenue: number; orders: number }
export interface RevenueDashboardProps { data: RevenueRecord[]; loading?: boolean; error?: string; breakdownError?: string; motion?: boolean }
export function summarizeRevenue(data: RevenueRecord[], period: number, channel = "all") {
  const months = Array.from(new Set(data.map(row => row.month))).slice(-period)
  const selected = data.filter(row => months.includes(row.month) && (channel === "all" || row.channel === channel))
  const total = selected.reduce((sum, row) => sum + row.revenue, 0)
  const orders = selected.reduce((sum, row) => sum + row.orders, 0)
  return { selected, total, orders, trend: months.map(label => ({ label, value: selected.filter(row => row.month === label).reduce((sum, row) => sum + row.revenue, 0) })), channels: Array.from(new Set(selected.map(row => row.channel))).map(label => ({ label, value: selected.filter(row => row.channel === label).reduce((sum, row) => sum + row.revenue, 0) })) }
}
export function RevenueDashboard({ data, loading, error, breakdownError, motion = false }: RevenueDashboardProps) {
  const [period, setPeriod] = useState("6"), [channel, setChannel] = useState("all")
  const invalid = data.some(row => !row.month || !row.channel || !Number.isFinite(row.revenue) || row.revenue < 0 || !Number.isFinite(row.orders) || row.orders < 0)
  const summary = summarizeRevenue(invalid ? [] : data, Number(period), channel)
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  return <section aria-label="Revenue dashboard" className="@container w-full rounded-xl border border-border bg-background p-5 text-foreground"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-1 text-xs text-muted-foreground">BUSINESS PERFORMANCE</p><h2 className="text-xl font-semibold tracking-tight">Revenue overview</h2><p className="mt-1 text-xs text-muted-foreground">Revenue in USD · ordered monthly records</p></div><div className="flex flex-wrap gap-2"><Select value={period} onValueChange={v => v && setPeriod(v)}><SelectTrigger aria-label="Revenue period"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="3">Last 3 months</SelectItem><SelectItem value="6">Last 6 months</SelectItem></SelectContent></Select><Select value={channel} onValueChange={v => v && setChannel(v)}><SelectTrigger aria-label="Revenue channel"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All channels</SelectItem>{Array.from(new Set(data.map(row => row.channel))).map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div></div>
  <div className="mt-6">{loading || error || invalid || !summary.selected.length ? <BlockStatus loading={loading} error={error ?? (invalid ? "Revenue records require non-negative finite revenue and orders." : undefined)} empty={!summary.selected.length}/> : <><MetricRail items={[{label:"Revenue",value:money(summary.total)},{label:"Orders",value:summary.orders.toLocaleString("en-US")},{label:"Average order",value:summary.orders ? money(summary.total / summary.orders) : "—"},{label:"Channels",value:String(summary.channels.length),note:period + " month window"}]}/><div className="mt-6"><BlockPanel title="Revenue over time"><LineBasic data={summary.trend} height={260} motion={motion}/></BlockPanel></div><div className="mt-4 grid gap-4 @min-[760px]:grid-cols-[1.35fr_1fr]"><BlockPanel title="Revenue by channel" error={breakdownError}><BarBasic data={summary.channels} height={220} motion={motion}/></BlockPanel><BlockPanel title="Channel contribution" error={breakdownError}><DonutBasic data={summary.channels} height={220} motion={motion}/></BlockPanel></div><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer">View revenue values</summary><table className="mt-3 w-full text-left"><caption className="sr-only">Revenue in USD for selected months</caption><thead><tr><th scope="col">Month</th><th scope="col">Revenue</th></tr></thead><tbody>{summary.trend.map(row => <tr key={row.label}><th scope="row" className="py-1 font-normal">{row.label}</th><td>{money(row.value)}</td></tr>)}</tbody></table></details></>}</div></section>
}
