import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "r", "registry.json")
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Registry index not found" },
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
