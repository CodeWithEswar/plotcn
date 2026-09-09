"use client"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartLegend } from "../shared/chart-legend"
import { ChartContainer } from "../shared/chart-container"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartTooltip } from "../shared/chart-tooltip"
import { ChartEmptyState, ChartErrorState } from "../shared/chart-state"
export interface DonutDatum { label: string; value: number }
export interface DonutBasicProps { data: DonutDatum[]; height?: number; innerRadius?: number; tooltip?: boolean; legend?: boolean; motion?: boolean | { duration?: number }; colors?: readonly string[]; className?: string }
const defaultColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
export function DonutBasic({ data, height = 320, innerRadius = 62, tooltip = true, legend = true, motion = true, colors = defaultColors, className }: DonutBasicProps) {
  const reduced = useChartReducedMotion()
  if (!data.length || data.every(d => d.value === 0)) return <div style={{height}}><ChartEmptyState title="No proportions to display" description="Provide at least one positive value." /></div>
  if (data.some(d => !Number.isFinite(d.value) || d.value < 0)) return <div style={{height}}><ChartErrorState description="Donut values must be finite and non-negative." /></div>
  return <div className={className} style={{width:"100%",height,minHeight:typeof height === "number" ? height : 320}}><ChartContainer><ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{width:320,height:typeof height === "number" ? height : 320}}><PieChart accessibilityLayer><Pie data={data} dataKey="value" nameKey="label" innerRadius={`${innerRadius}%`} outerRadius="85%" paddingAngle={2} stroke="var(--chart-background, var(--chart-background))" isAnimationActive={motion !== false && !reduced} animationDuration={typeof motion === "object" ? motion.duration! * 1000 || 300 : 300}>{data.map((d,i) => <Cell key={`${d.label}-${i}`} fill={colors[i % colors.length] || defaultColors[0]}/>)}</Pie>{tooltip && <Tooltip content={<ChartTooltip />} />}{legend && <Legend content={<ChartLegend kind="point"/>} />}</PieChart></ResponsiveContainer></ChartContainer></div>
}

