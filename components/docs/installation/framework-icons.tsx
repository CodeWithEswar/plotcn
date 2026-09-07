import React from "react"

interface IconProps {
  className?: string
  size?: number
}

export function NextjsIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="90" cy="90" r="86" fill="black" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.517 160.163 149.508 157.52Z"
        fill="url(#paint0_linear_next)"
      />
      <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_next)" />
      <defs>
        <linearGradient
          id="paint0_linear_next"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_next"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ViteIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 257"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M255.153 37.938L134.897 252.976C131.678 258.736 123.322 258.736 120.103 252.976L0.847 37.938C-2.619 31.737 2.378 24.167 9.475 24.898L126.975 36.98C127.658 37.05 128.342 37.05 129.025 36.98L246.525 24.898C253.622 24.167 258.619 31.737 255.153 37.938Z"
        fill="url(#paint0_linear_vite)"
      />
      <path
        d="M185.432 0.573L96.44 17.502C93.447 18.072 91.564 21.055 92.234 24.032L112.569 114.476C113.111 116.886 111.458 119.243 109.025 119.519L62.775 124.771C59.734 125.116 57.859 128.243 58.784 131.187L116.656 235.882C118.016 238.344 121.737 237.917 122.497 235.213L144.384 157.423C145.034 155.113 147.242 153.539 149.638 153.678L197.876 156.471C200.994 156.652 203.267 153.639 202.261 150.686L187.973 108.76C187.352 106.936 187.728 104.912 188.966 103.415L221.748 63.856C223.771 61.415 222.844 57.653 219.92 56.444L185.432 0.573Z"
        fill="url(#paint1_linear_vite)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_vite"
          x1="-42.766"
          y1="6.002"
          x2="223.234"
          y2="288.002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_vite"
          x1="58.113"
          y1="0.573"
          x2="178.113"
          y2="240.573"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFEA83" />
          <stop offset="0.0833" stopColor="#FFDD35" />
          <stop offset="1" stopColor="#FFA800" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function TanStackIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <path d="M50 16L82 72H18L50 16Z" fill="url(#paint0_linear_tanstack)" />
      <path d="M50 36L70 72H30L50 36Z" fill="#09090b" />
      <path d="M50 48L62 70H38L50 48Z" fill="url(#paint1_linear_tanstack)" />
      <defs>
        <linearGradient id="paint0_linear_tanstack" x1="18" y1="16" x2="82" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E11D48" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="paint1_linear_tanstack" x1="38" y1="48" x2="62" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LaravelIcon({ className = "", size = 24 }: IconProps) {
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
        d="M20.25 6.75L12 2.25L3.75 6.75V17.25L12 21.75L20.25 17.25V6.75Z"
        fill="#FF2D20"
        fillOpacity="0.12"
        stroke="#FF2D20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2.25V21.75M3.75 6.75L12 11.25L20.25 6.75M3.75 17.25L12 11.25L20.25 17.25"
        stroke="#FF2D20"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ReactRouterIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path
        d="M8 8H17C20.3137 8 23 10.6863 23 14C23 16.7348 21.1685 19.0416 18.667 19.7424L24 25H18.5L13.8 20H12V25H8V8Z"
        fill="#E11D48"
      />
      <path d="M12 11.5V16.5H16.5C17.8807 16.5 19 15.3807 19 14C19 12.6193 17.8807 11.5 16.5 11.5H12Z" fill="#fafafa" />
    </svg>
  )
}

export function AstroIcon({ className = "", size = 24 }: IconProps) {
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
        d="M12 2C8.5 6 6 10.5 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 10.5 15.5 6 12 2Z"
        fill="url(#paint0_linear_astro)"
      />
      <path
        d="M12 11C10.5 13 9.5 15 9.5 16.5C9.5 17.8807 10.6193 19 12 19C13.3807 19 14.5 17.8807 14.5 16.5C14.5 15 13.5 13 12 11Z"
        fill="#FF5D01"
      />
      <path
        d="M12 15C11.5 15.8 11 16.5 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.5 12.5 15.8 12 15Z"
        fill="#FFE600"
      />
      <defs>
        <linearGradient id="paint0_linear_astro" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BC52EE" />
          <stop offset="1" stopColor="#3245FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ManualIcon({ className = "", size = 24 }: IconProps) {
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
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
      <path d="M6 9L9.5 12L6 15" stroke="#d4d4d8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15H17" stroke="#a1a1aa" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function FrameworkIcon({
  framework,
  size = 20,
  className = "",
}: {
  framework: string
  size?: number
  className?: string
}) {
  switch (framework) {
    case "next":
      return <NextjsIcon size={size} className={className} />
    case "vite":
      return <ViteIcon size={size} className={className} />
    case "tanstack-start":
      return <TanStackIcon size={size} className={className} />
    case "laravel":
      return <LaravelIcon size={size} className={className} />
    case "react-router":
      return <ReactRouterIcon size={size} className={className} />
    case "astro":
      return <AstroIcon size={size} className={className} />
    case "manual":
    default:
      return <ManualIcon size={size} className={className} />
  }
}

