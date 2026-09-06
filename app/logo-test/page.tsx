"use client"

import React, { useState } from "react"
import { PlotcnMark, PlotcnLogo } from "@/components/brand"

export default function LogoTestPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const sizes = [16, 20, 24, 32, 48, 64, 128, 256]

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${
        theme === "dark" ? "bg-[#09090B] text-[#FAFAFA]" : "bg-[#FAFAFA] text-[#09090B]"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-6 border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <PlotcnLogo markClassName="size-7" />
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                Validation Lab
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Production SVG Geometry • Scalability & Silhouette Verification
            </p>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800/40 hover:bg-zinc-800 transition"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* Scalability Grid: 16, 20, 24, 32, 48, 64, 128, 256 */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-400">
            Scale Matrix (16px → 256px)
          </h2>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-wrap items-end gap-8">
            {sizes.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center border border-dashed border-zinc-800 rounded bg-black/20"
                  style={{ width: Math.max(s, 24), height: Math.max(s, 24) }}
                >
                  <PlotcnMark style={{ width: s, height: s }} />
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{s}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Background Swatches Test: black, zinc-950, zinc-900, white, zinc-50 */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-400">
            Background Contrast Tests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-black text-white p-4 rounded-xl border border-zinc-800 flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500">Black (#000000)</span>
              <PlotcnMark className="size-10" />
              <span className="text-xs font-semibold">Plotcn</span>
            </div>
            <div className="bg-[#09090B] text-[#FAFAFA] p-4 rounded-xl border border-zinc-800 flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500">Zinc 950 (#09090B)</span>
              <PlotcnMark className="size-10" />
              <span className="text-xs font-semibold">Plotcn</span>
            </div>
            <div className="bg-zinc-900 text-zinc-100 p-4 rounded-xl border border-zinc-800 flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500">Zinc 900</span>
              <PlotcnMark className="size-10" />
              <span className="text-xs font-semibold">Plotcn</span>
            </div>
            <div className="bg-white text-zinc-950 p-4 rounded-xl border border-zinc-300 flex flex-col items-center gap-3 shadow-sm">
              <span className="text-[10px] font-mono text-zinc-400">White (#FFFFFF)</span>
              <PlotcnMark className="size-10" />
              <span className="text-xs font-semibold">Plotcn</span>
            </div>
            <div className="bg-zinc-50 text-zinc-900 p-4 rounded-xl border border-zinc-300 flex flex-col items-center gap-3 shadow-sm">
              <span className="text-[10px] font-mono text-zinc-400">Zinc 50 (#FAFAFA)</span>
              <PlotcnMark className="size-10" />
              <span className="text-xs font-semibold">Plotcn</span>
            </div>
          </div>
        </section>

        {/* Opacity & Accessibility State Tests */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-400">
            State & Opacity Tests
          </h2>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-wrap items-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <PlotcnMark className="size-8 opacity-100" />
              <span className="text-[10px] font-mono text-zinc-500">Normal (100%)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PlotcnMark className="size-8 opacity-70" />
              <span className="text-[10px] font-mono text-zinc-500">Muted (70%)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PlotcnMark className="size-8 opacity-40" />
              <span className="text-[10px] font-mono text-zinc-500">Disabled (40%)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PlotcnMark className="size-8 text-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-500">Accent Tint</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

