"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react"

const curves = [
  "M-180 630C120 640 150 260 420 340S760 720 1060 320S1380 220 1700 20",
  "M-180 670C180 600 120 300 420 390S750 620 1030 370S1450 110 1700 110",
  "M-180 730C80 720 210 380 440 470S770 520 1030 430S1430 160 1700 200",
  "M-180 800C80 770 300 430 550 550S850 470 1100 480S1410 330 1700 230",
]
export function PlotBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1200], [0, 36])
  return <div ref={ref} className="plot-background" aria-hidden="true"><div className="plot-grid" /><div className="plot-glow" />
    <motion.svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ y: reduced ? 0 : y }}>
      {curves.map((d, index) => <motion.path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.12 - index * 0.02} animate={!reduced && visible ? { pathLength: [0.8, 1, 0.8], opacity: [0.07, 0.14, 0.07] } : { pathLength: 1, opacity: 0.1 }} transition={{ duration: 22 + index * 4, repeat: Infinity, ease: "easeInOut" }} />)}
      {[[210,430],[420,340],[660,490],[1060,320],[1230,210],[900,530]].map(([cx,cy]) => <circle key={cx} cx={cx} cy={cy} r="2.5" fill="currentColor" opacity="0.2" />)}
    </motion.svg></div>
}
