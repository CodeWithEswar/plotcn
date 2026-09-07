import React from "react"

interface IconProps {
  className?: string
  size?: number
}

export function PnpmIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="5.5" height="5.5" fill="#F9AD00" rx="0.5" />
      <rect x="9.25" y="2" width="5.5" height="5.5" fill="#F9AD00" rx="0.5" />
      <rect x="16.5" y="2" width="5.5" height="5.5" fill="#F9AD00" rx="0.5" />
      <rect x="9.25" y="9.25" width="5.5" height="5.5" fill="#F9AD00" rx="0.5" />
      <rect x="16.5" y="9.25" width="5.5" height="5.5" fill="#4E4E4E" rx="0.5" />
      <rect x="2" y="16.5" width="5.5" height="5.5" fill="#4E4E4E" rx="0.5" />
      <rect x="9.25" y="16.5" width="5.5" height="5.5" fill="#F9AD00" rx="0.5" />
      <rect x="16.5" y="16.5" width="5.5" height="5.5" fill="#4E4E4E" rx="0.5" />
    </svg>
  )
}

export function NpmIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="3" fill="#CB3837" />
      <path
        d="M4 6H20V18H12V10H8V18H4V6Z"
        fill="white"
      />
    </svg>
  )
}

export function YarnIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
        fill="#2C8EBB"
      />
      <path
        d="M7.5 8.5C8.88 7.12 11.12 7.12 12.5 8.5L16.5 12.5C17.88 13.88 17.88 16.12 16.5 17.5C15.12 18.88 12.88 18.88 11.5 17.5L7.5 13.5C6.12 12.12 6.12 9.88 7.5 8.5Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="10" cy="11" r="1.5" fill="#2C8EBB" />
      <circle cx="14" cy="15" r="1.5" fill="#2C8EBB" />
    </svg>
  )
}

export function BunIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="13" rx="9" ry="7" fill="#FBF0DF" />
      <path
        d="M7 11C7 8 9.238 6 12 6C14.762 6 17 8 17 11"
        stroke="#443224"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="9" cy="12.5" rx="1" ry="1.2" fill="#443224" />
      <ellipse cx="15" cy="12.5" rx="1" ry="1.2" fill="#443224" />
      <ellipse cx="7.5" cy="14" rx="1" ry="0.6" fill="#F8B4B4" />
      <ellipse cx="16.5" cy="14" rx="1" ry="0.6" fill="#F8B4B4" />
      <path
        d="M11 14.5C11.5 15 12.5 15 13 14.5"
        stroke="#443224"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PackageManagerIcon({
  pkg,
  size = 16,
  className = "",
}: {
  pkg: string
  size?: number
  className?: string
}) {
  switch (pkg) {
    case "npm":
      return <NpmIcon size={size} className={className} />
    case "yarn":
      return <YarnIcon size={size} className={className} />
    case "bun":
      return <BunIcon size={size} className={className} />
    case "pnpm":
    default:
      return <PnpmIcon size={size} className={className} />
  }
}

