export function FooterFlow() {
  return (
    <svg
      viewBox="0 0 1440 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-cover select-none pointer-events-none opacity-75"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="footer-signal-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="55%" stopColor="#a1a1aa" stopOpacity="0.07" />
          <stop offset="85%" stopColor="#71717a" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="footer-signal-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.035" />
          <stop offset="75%" stopColor="#71717a" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Primary continuous data curve */}
      <path
        d="M0,160 C220,160 340,70 580,100 C820,130 920,230 1160,195 C1290,175 1370,120 1440,110"
        stroke="url(#footer-signal-grad-1)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Harmonic dashed secondary signal path */}
      <path
        d="M0,200 C280,200 420,130 700,150 C980,170 1100,75 1440,125"
        stroke="url(#footer-signal-grad-2)"
        strokeWidth="1"
        strokeDasharray="4 6"
        fill="none"
      />
      {/* Precision coordinate nodes */}
      <circle cx="580" cy="100" r="2.5" fill="#fafafa" fillOpacity="0.2" />
      <circle cx="1160" cy="195" r="2" fill="#fafafa" fillOpacity="0.15" />
      <circle cx="700" cy="150" r="1.5" fill="#fafafa" fillOpacity="0.12" />
    </svg>
  )
}
