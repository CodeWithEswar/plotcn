import { getChartById } from "@/config/charts"
export const playgroundIds = ["line-basic", "bar-basic", "donut-basic", "d3-animated-line"] as const
export type PlaygroundId = typeof playgroundIds[number]
export type PlaygroundRow = Record<string, string | number>
export interface PlaygroundSettings { curve: "linear" | "monotone" | "step"; showXAxis: boolean; showYAxis: boolean; grid: "off" | "horizontal" | "both"; tooltip: boolean; legend: boolean; motion: boolean; duration: number; reducedMotion: boolean; height: number; width: number; theme: "dark" | "light" | "system"; palette: "default" | "mono"; innerRadius: number }
export function isPlaygroundId(value: unknown): value is PlaygroundId { return playgroundIds.some(id => id === value) }
export function playgroundDefaults(id: PlaygroundId): PlaygroundSettings { return { curve: "monotone", showXAxis: true, showYAxis: true, grid: "horizontal", tooltip: true, legend: id === "donut-basic", motion: true, duration: id === "d3-animated-line" ? .35 : .3, reducedMotion: false, height: id === "donut-basic" ? 320 : id === "d3-animated-line" ? 300 : 280, width: 1100, theme: "dark", palette: "default", innerRadius: 62 } }
export function playgroundFixture(id: PlaygroundId): PlaygroundRow[] {
  if (id === "donut-basic") return [{label:"Direct",value:42},{label:"Search",value:31},{label:"Referral",value:18},{label:"Social",value:9}]
  if (id === "d3-animated-line") return [28,48,35,72,64,96,88].map((y,x) => ({x,y}))
  return [180,240,310,280,390,460,520].map((value,i) => ({label:["Jan","Feb","Mar","Apr","May","Jun","Jul"][i],value}))
}
export function dataKeys(id: PlaygroundId) { return id === "d3-animated-line" ? ["x", "y"] as const : ["label", "value"] as const }
export function validatePlaygroundData(text: string, id: PlaygroundId): { data: PlaygroundRow[]; error?: never } | { error: string; data?: never } {
  let value: unknown
  try { value = JSON.parse(text) } catch { return { error: "Invalid JSON. Fix the syntax to update the preview." } }
  if (!Array.isArray(value)) return { error: "Data must be a JSON array of rows." }
  if (value.length > 200) return { error: "Use at most 200 rows in this workbench." }
  const [labelKey, valueKey] = dataKeys(id)
  for (const [index, row] of value.entries()) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return { error: `Row ${index + 1} must be an object.` }
    if (id === "d3-animated-line" ? !(typeof row[labelKey] === "string" || typeof row[labelKey] === "number" && Number.isFinite(row[labelKey])) : typeof row[labelKey] !== "string") return { error: `Row ${index + 1}: ${labelKey} must be ${id === "d3-animated-line" ? "a string or finite number" : "text"}.` }
    if (typeof row[valueKey] !== "number" || !Number.isFinite(row[valueKey])) return { error: `Row ${index + 1}: ${valueKey} must be a finite number.` }
    if (id === "donut-basic" && row[valueKey] < 0) return { error: `Row ${index + 1}: proportions cannot be negative.` }
    if (Object.keys(row).some(key => key !== labelKey && key !== valueKey)) return { error: `Row ${index + 1}: supported fields are ${labelKey} and ${valueKey}.` }
  }
  return { data: value as PlaygroundRow[] }
}
export function generatePlaygroundUsage(id: PlaygroundId, settings: PlaygroundSettings, data: PlaygroundRow[]): string {
  const chart = getChartById(id)!, defaults = playgroundDefaults(id), props: string[] = ['data={data}']
  const emit = (key: keyof PlaygroundSettings) => { if(settings[key] !== defaults[key]) props.push(`${key}={${JSON.stringify(settings[key])}}`) }
  if (id === "line-basic" || id === "d3-animated-line") emit("curve")
  if (id === "line-basic" || id === "bar-basic") { emit("showXAxis"); emit("showYAxis"); emit("grid"); emit("tooltip"); emit("legend") }
  if (id === "donut-basic") { emit("innerRadius"); emit("tooltip"); emit("legend") }
  if (id === "d3-animated-line") { emit("grid"); props.push(`width={${settings.width}}`) }
  emit("height")
  if (!settings.motion || settings.reducedMotion) props.push("motion={false}")
  else if (settings.duration !== defaults.duration) props.push(`motion={{ duration: ${settings.duration} }}`)
  const palette: Record<string,string> = settings.theme === "light" ? {"--background":"#fafafa","--foreground":"#18181b","--border":"#dedee4","--chart-axis":"#62626d","--chart-grid":"#dedee4","--chart-1":"#059669","--chart-2":"#2563eb"} : {"--background":"#09090b","--foreground":"#fafafa","--border":"#29292e","--chart-axis":"#a1a1aa","--chart-grid":"#27272a","--chart-1":"#34d399","--chart-2":"#60a5fa"}
  if (settings.palette === "mono") Object.assign(palette,{"--chart-1":"var(--foreground)","--chart-2":"#a1a1aa","--chart-3":"#71717a","--chart-4":"#52525b"})
  const style = JSON.stringify({width:"100%",maxWidth:settings.width,background:"var(--background)",color:"var(--foreground)",...palette},null,2)
  const cleanPath = chart.componentPath.replace(/\\/g, "/").replace(/^registry\//, "components/charts/").replace(/\.tsx$/, "")
  return `import type { CSSProperties } from "react"\nimport { ${chart.exportName} } from "@/${cleanPath}"\n\nconst data = ${JSON.stringify(data,null,2)}\n\nconst theme = ${style} satisfies CSSProperties\n\nexport function Example() {\n  return (\n    <div style={theme}>\n      <${chart.exportName}\n        ${props.join("\n        ")}\n      />\n    </div>\n  )\n}`.replace('satisfies CSSProperties','as CSSProperties')
}
