"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface DocsSidebarLinkProps {
  href: string
  title: string
  onSelect?: () => void
}

export function DocsSidebarLink({ href, title, onSelect }: DocsSidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li className="relative">
      <Link
        href={href}
        onClick={onSelect}
        prefetch={true}
        className={`block text-[14px] leading-snug transition-colors ${
          isActive
            ? "text-foreground font-medium before:absolute before:-left-[17px] before:top-0 before:bottom-0 before:w-[2px] before:rounded-full before:bg-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {title}
      </Link>
    </li>
  )
}
