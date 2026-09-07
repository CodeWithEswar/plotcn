"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type PackageManagerId = "pnpm" | "npm" | "yarn" | "bun"

export interface PackageManagerLogoProps {
  manager: PackageManagerId | string
  size?: number
  className?: string
  variant?: "monochrome" | "colored"
}

/**
 * Pnpm Brand Logo (Authentic official colors: #F69220 orange, #F9AD00 yellow, #4E4E4E dark)
 */
export function PnpmLogo({
  size = 16,
  className = "",
  variant = "colored",
}: Omit<PackageManagerLogoProps, "manager">) {
  const isColored = variant === "colored"
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-colors", className)}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="5.5" height="5.5" fill={isColored ? "#F69220" : "currentColor"} rx="0.5" />
      <rect x="9.25" y="2" width="5.5" height="5.5" fill={isColored ? "#F69220" : "currentColor"} rx="0.5" />
      <rect x="16.5" y="2" width="5.5" height="5.5" fill={isColored ? "#F69220" : "currentColor"} rx="0.5" />
      <rect x="9.25" y="9.25" width="5.5" height="5.5" fill={isColored ? "#F9AD00" : "currentColor"} rx="0.5" />
      <rect x="16.5" y="9.25" width="5.5" height="5.5" fill={isColored ? "#6B7280" : "currentColor"} fillOpacity={isColored ? 1 : 0.6} rx="0.5" />
      <rect x="2" y="16.5" width="5.5" height="5.5" fill={isColored ? "#6B7280" : "currentColor"} fillOpacity={isColored ? 1 : 0.6} rx="0.5" />
      <rect x="9.25" y="16.5" width="5.5" height="5.5" fill={isColored ? "#F9AD00" : "currentColor"} rx="0.5" />
      <rect x="16.5" y="16.5" width="5.5" height="5.5" fill={isColored ? "#6B7280" : "currentColor"} fillOpacity={isColored ? 1 : 0.6} rx="0.5" />
    </svg>
  )
}

/**
 * Npm Brand Logo (Official npm red: #CB3837 with crisp white typography)
 */
export function NpmLogo({
  size = 16,
  className = "",
  variant = "colored",
}: Omit<PackageManagerLogoProps, "manager">) {
  const isColored = variant === "colored"
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-colors", className)}
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="3" fill={isColored ? "#CB3837" : "currentColor"} />
      <path d="M4 6H20V18H12V10H8V18H4V6Z" fill={isColored ? "#FFFFFF" : "var(--background, #09090b)"} />
    </svg>
  )
}

/**
 * Yarn Brand Logo (Official yarn blue: #2C8EBB with crisp white silhouette)
 */
export function YarnLogo({
  size = 16,
  className = "",
  variant = "colored",
}: Omit<PackageManagerLogoProps, "manager">) {
  const isColored = variant === "colored"
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-colors", className)}
      aria-hidden="true"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
        fill={isColored ? "#2C8EBB" : "currentColor"}
      />
      <path
        d="M7.5 8.5C8.88 7.12 11.12 7.12 12.5 8.5L16.5 12.5C17.88 13.88 17.88 16.12 16.5 17.5C15.12 18.88 12.88 18.88 11.5 17.5L7.5 13.5C6.12 12.12 6.12 9.88 7.5 8.5Z"
        fill={isColored ? "#FFFFFF" : "var(--background, #09090b)"}
        fillOpacity={isColored ? 0.95 : 1}
      />
      <circle cx="10" cy="11" r="1.5" fill={isColored ? "#2C8EBB" : "currentColor"} />
      <circle cx="14" cy="15" r="1.5" fill={isColored ? "#2C8EBB" : "currentColor"} />
    </svg>
  )
}

/**
 * Bun Brand Logo (Official dough cream #FDF5E6, eyes/mouth #443224, rosy cheeks #F8B4B4)
 */
export function BunLogo({
  size = 16,
  className = "",
  variant = "colored",
}: Omit<PackageManagerLogoProps, "manager">) {
  const isColored = variant === "colored"
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-colors", className)}
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="13"
        rx="9"
        ry="7"
        fill={isColored ? "#FDF5E6" : "currentColor"}
        stroke={isColored ? "#D4B996" : "none"}
        strokeWidth={isColored ? "0.75" : "0"}
        fillOpacity={isColored ? 1 : 0.85}
      />
      <path
        d="M7 11C7 8 9.238 6 12 6C14.762 6 17 8 17 11"
        stroke={isColored ? "#443224" : "var(--background, #09090b)"}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="9" cy="12.5" rx="1" ry="1.2" fill={isColored ? "#443224" : "var(--background, #09090b)"} />
      <ellipse cx="15" cy="12.5" rx="1" ry="1.2" fill={isColored ? "#443224" : "var(--background, #09090b)"} />
      <ellipse cx="7.5" cy="14" rx="1.2" ry="0.8" fill={isColored ? "#F8B4B4" : "var(--background, #09090b)"} />
      <ellipse cx="16.5" cy="14" rx="1.2" ry="0.8" fill={isColored ? "#F8B4B4" : "var(--background, #09090b)"} />
      <path
        d="M11 14.5C11.5 15.2 12.5 15.2 13 14.5"
        stroke={isColored ? "#443224" : "var(--background, #09090b)"}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Unified Package Manager Logo Dispatcher
 * Section 27, 41, 75, 76.
 */
export function PackageManagerLogo({
  manager,
  size = 16,
  className = "",
  variant = "colored",
}: PackageManagerLogoProps) {
  switch (manager) {
    case "npm":
      return <NpmLogo size={size} className={className} variant={variant} />
    case "yarn":
      return <YarnLogo size={size} className={className} variant={variant} />
    case "bun":
      return <BunLogo size={size} className={className} variant={variant} />
    case "pnpm":
    default:
      return <PnpmLogo size={size} className={className} variant={variant} />
  }
}
