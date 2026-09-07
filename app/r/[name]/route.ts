import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

const ALIASES: Record<string, string> = {
  line: "line-basic",
  area: "area-basic",
  bar: "bar-basic",
  donut: "donut-basic",
  geochart: "google-geochart",
  geographic: "google-geochart",
  network: "d3-force-network",
  "d3-plot": "d3-animated-line",
  heatmap: "d3-animated-line",
  candles: "d3-animated-line",
  treemap: "d3-force-network",
  scatter: "d3-animated-line",
  stream: "d3-animated-line",
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const rawCleanName = name.replace(/\.json$/, "")
  const cleanName = ALIASES[rawCleanName] || rawCleanName

  const filePath = path.join(process.cwd(), "public", "r", `${cleanName}.json`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: `Registry item "${rawCleanName}" not found` },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    )
  }

  const content = fs.readFileSync(filePath, "utf-8")
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
