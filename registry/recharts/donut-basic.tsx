"use client"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "../shared/chart-container"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartTooltip } from "../shared/chart-tooltip"
export interface DonutDatum { label: string; value: number }
export interface DonutBasicProps { data: DonutDatum[]; height?: number; innerRadius?: number; tooltip?: boolean; legend?: boolean; motion?: boolean | { duration?: number }; colors?: readonly string[]; className?: string }
const defaultColors = ["var(--chart-1, #10b981)", "var(--chart-2, #38bdf8)", "var(--chart-3, #a78bfa)", "var(--chart-4, #f59e0b)", "var(--chart-5, #f472b6)"]
export function DonutBasic({ data, height = 320, innerRadius = 62, tooltip = true, legend = true, motion = true, colors = defaultColors, className }: DonutBasicProps) {
  const reduced = useChartReducedMotion()
  if (!data.length || data.every(d => d.value === 0)) return <div role="status" className="flex items-center justify-center text-sm text-muted-foreground" style={{height}}>No proportions to display.</div>
  if (data.some(d => !Number.isFinite(d.value) || d.value < 0)) return <div role="alert" style={{height}}>Donut values must be finite and nonnegative.</div>
  return <div className={className} style={{width:"100%",height}}><ChartContainer><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{width:320,height}}><PieChart accessibilityLayer><Pie data={data} dataKey="value" nameKey="label" innerRadius={`${innerRadius}%`} outerRadius="85%" paddingAngle={2} stroke="var(--chart-background, var(--background, #09090b))" isAnimationActive={motion !== false && !reduced} animationDuration={typeof motion === "object" ? motion.duration! * 1000 || 300 : 300}>{data.map((d,i) => <Cell key={`${d.label}-${i}`} fill={colors[i % colors.length] || defaultColors[0]}/>)}</Pie>{tooltip && <Tooltip content={<ChartTooltip />} />}{legend && <Legend wrapperStyle={{fontSize:11, color: "var(--chart-foreground, #fafafa)"}}/>}</PieChart></ResponsiveContainer></ChartContainer></div>
}

