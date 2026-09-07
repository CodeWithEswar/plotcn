import { ImageResponse } from "next/og"
import { siteConfig } from "@/config/site"

export const runtime = "edge"
export const alt = "Plotcn — Modern Visualization Components for React"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)",
          padding: "80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
              color: "#000",
            }}
          >
            P
          </div>
          <span style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px" }}>
            {siteConfig.name}
          </span>
        </div>

        {/* Hero Title & Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Visualizations you own. Built for React.
          </h1>
          <p style={{ fontSize: "24px", color: "#a1a1aa", lineHeight: 1.4, margin: 0 }}>
            Recharts, D3.js, and Google Charts components distributed via shadcn CLI. Copy the
            source. Own the code.
          </p>
        </div>

        {/* Engine Tags */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              color: "#38bdf8",
              fontSize: "18px",
              fontFamily: "monospace",
            }}
          >
            RECHARTS
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              color: "#fbbf24",
              fontSize: "18px",
              fontFamily: "monospace",
            }}
          >
            D3.JS
          </div>
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              color: "#34d399",
              fontSize: "18px",
              fontFamily: "monospace",
            }}
          >
            GOOGLE CHARTS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
